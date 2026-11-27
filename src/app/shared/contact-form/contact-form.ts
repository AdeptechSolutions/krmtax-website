import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  inject,
  input,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SITE } from '../../core/data/site.config';

type Status = 'idle' | 'sending' | 'sent' | 'error';

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
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    topic: ['Individual tax return'],
    preferred: [''],
    message: ['', [Validators.required, Validators.maxLength(4000)]],
    company: [''], // honeypot: real visitors never see or fill this
  });

  protected invalid(name: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty);
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
      this.mode() === 'appointment' ? `Preferred days/times: ${v.preferred || '-'}` : '',
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
