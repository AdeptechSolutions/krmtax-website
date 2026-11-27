import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { SITE } from '../../core/data/site.config';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/** Office hours used for appointment time slots (30-minute steps). */
const OPEN_HOUR = 9;
const CLOSE_HOUR = 17;

function buildSlots(): string[] {
  const slots: string[] = [];
  for (let h = OPEN_HOUR; h < CLOSE_HOUR; h++) {
    for (const m of [0, 30]) {
      const hour12 = ((h + 11) % 12) + 1;
      slots.push(`${hour12}:${m === 0 ? '00' : '30'} ${h < 12 ? 'AM' : 'PM'}`);
    }
  }
  return slots;
}

/** Only allow weekdays for appointment dates. */
function weekdayValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const day = new Date(control.value + 'T12:00:00').getDay();
  return day === 0 || day === 6 ? { weekend: true } : null;
}

function localIsoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Contact / appointment request form.
 * Posts to SITE.contactFormEndpoint (e.g. Formspree) when configured,
 * otherwise opens the visitor's email client with the message filled in.
 */
@Component({
  selector: 'app-contact-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.html',
})
export class ContactForm {
  /** 'contact' for general messages, 'appointment' to ask for preferred times. */
  readonly mode = input<'contact' | 'appointment'>('contact');
  protected readonly status = signal<Status>('idle');
  protected readonly topics = [
    'Individual tax return',
    'Tax planning',
    'Business tax return',
    'Bookkeeping',
    'Payroll',
    'Financial statements',
    'Business valuation',
    'IRS or state notice',
    'Other',
  ];
  protected readonly timeSlots = buildSlots();
  /** Earliest bookable date: tomorrow. */
  protected readonly minDate = localIsoDate(new Date(Date.now() + 86_400_000));
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    topic: ['Individual tax return'],
    date: ['', weekdayValidator],
    time: [''],
    message: ['', Validators.maxLength(4000)],
    company: [''], // honeypot: real visitors never see or fill this
  });

  protected invalid(name: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty);
  }

  constructor() {
    effect(() => {
      // Date and time are required only for appointment requests.
      const required = this.mode() === 'appointment';
      for (const name of ['date', 'time'] as const) {
        const c = this.form.controls[name];
        if (required) c.addValidators(Validators.required);
        else c.removeValidators(Validators.required);
        c.updateValueAndValidity({ emitEvent: false });
      }
      // The message is optional when booking; the date and time say what we need.
      const msg = this.form.controls.message;
      if (required) msg.removeValidators(Validators.required);
      else msg.addValidators(Validators.required);
      msg.updateValueAndValidity({ emitEvent: false });
    });
  }

  private formatDate(iso: string): string {
    if (!iso) return '-';
    return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    if (v.company) return; // bot
    const subject = `${this.mode() === 'appointment' ? 'Appointment request' : 'Website inquiry'}: ${v.topic}`;
    const body = [
      `Name: ${v.name}`,
      `Email: ${v.email}`,
      `Phone: ${v.phone || '-'}`,
      `Topic: ${v.topic}`,
      this.mode() === 'appointment'
        ? `Requested appointment: ${this.formatDate(v.date)} at ${v.time}`
        : '',
      '',
      v.message,
    ]
      .filter((l) => l !== '')
      .join('\n');

    if (!SITE.contactFormEndpoint) {
      if (this.isBrowser) {
        window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }
      this.status.set('sent');
      return;
    }

    this.status.set('sending');
    try {
      const res = await fetch(SITE.contactFormEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ _subject: subject, ...v, company: undefined }),
      });
      this.status.set(res.ok ? 'sent' : 'error');
      if (res.ok) this.form.reset();
    } catch {
      this.status.set('error');
    }
  }
}
