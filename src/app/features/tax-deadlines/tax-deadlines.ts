import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { PageHero } from '../../shared/page-hero/page-hero';

interface Deadline {
  date: string; // ISO yyyy-mm-dd
  title: string;
  who: 'Individuals' | 'Businesses' | 'Employers' | 'Everyone';
  detail: string;
}

/**
 * Key federal deadlines for the 2027 filing season (tax year 2026).
 * Update this list each year. Dates already account for weekends.
 */
const DEADLINES: Deadline[] = [
  {
    date: '2027-01-15',
    title: '4th quarter 2026 estimated tax due',
    who: 'Individuals',
    detail: 'Final 2026 estimated payment (Form 1040-ES).',
  },
  {
    date: '2027-02-01',
    title: 'W-2 and 1099-NEC due',
    who: 'Employers',
    detail: 'Furnish to workers and file with SSA / IRS. Also Q4 Form 941.',
  },
  {
    date: '2027-03-15',
    title: 'Partnership and S corporation returns due',
    who: 'Businesses',
    detail: 'Forms 1065 and 1120-S, or file an extension (Form 7004).',
  },
  {
    date: '2027-04-15',
    title: 'Individual returns due',
    who: 'Individuals',
    detail:
      'Forms 1040 and IL-1040, or file an extension (Form 4868). Payment due even if extended.',
  },
  {
    date: '2027-04-15',
    title: 'C corporation returns due',
    who: 'Businesses',
    detail: 'Form 1120 for calendar-year corporations.',
  },
  {
    date: '2027-04-15',
    title: '1st quarter 2027 estimated tax due',
    who: 'Everyone',
    detail: 'First estimated payment for 2027.',
  },
  {
    date: '2027-04-30',
    title: 'Q1 payroll returns due',
    who: 'Employers',
    detail: 'Form 941 and Illinois IL-941.',
  },
  {
    date: '2027-06-15',
    title: '2nd quarter estimated tax due',
    who: 'Everyone',
    detail: 'Second estimated payment for 2027.',
  },
  {
    date: '2027-08-02',
    title: 'Q2 payroll returns due',
    who: 'Employers',
    detail: 'Form 941 and Illinois IL-941.',
  },
  {
    date: '2027-09-15',
    title: 'Extended partnership and S corp returns due',
    who: 'Businesses',
    detail: 'Also the 3rd quarter estimated tax payment.',
  },
  {
    date: '2027-10-15',
    title: 'Extended individual and C corp returns due',
    who: 'Individuals',
    detail: 'Final deadline for returns on extension.',
  },
  {
    date: '2027-11-01',
    title: 'Q3 payroll returns due',
    who: 'Employers',
    detail: 'Form 941 and Illinois IL-941.',
  },
];

@Component({
  selector: 'app-tax-deadlines',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, RouterLink, PageHero],
  template: `<app-page-hero
      eyebrow="Client tools"
      heading="Key tax deadlines"
      lead="Important federal dates for the 2027 filing season (tax year 2026). Add them to your calendar so nothing slips."
    />
    <section class="section">
      <div class="container narrow">
        <ol class="timeline">
          @for (d of deadlines; track d.date + d.title) {
            <li class="timeline__item" [class.is-past]="d.date < today()">
              <time class="timeline__date" [attr.datetime]="d.date"
                >{{ d.date | date: 'MMM d' : 'UTC'
                }}<small>{{ d.date | date: 'y' : 'UTC' }}</small></time
              >
              <div class="card">
                <span class="badge">{{ d.who }}</span>
                <h3>{{ d.title }}</h3>
                <p>{{ d.detail }}</p>
                <a class="small" [href]="calendarLink(d)" target="_blank" rel="noopener"
                  >+ Add to Google Calendar</a
                >
              </div>
            </li>
          }
        </ol>
        <p class="muted small">
          Dates can change because of holidays or IRS disaster relief. Illinois deadlines generally
          match federal ones.
          <a routerLink="/contact">Contact us</a> to confirm the dates that apply to you.
        </p>
      </div>
    </section>`,
})
export default class TaxDeadlines {
  protected readonly deadlines = DEADLINES;
  protected readonly today = computed(() => new Date().toISOString().slice(0, 10));

  constructor() {
    inject(SeoService).update({
      title: 'Tax Deadlines',
      description:
        'Key 2027 federal tax deadlines for individuals, businesses and employers, with add-to-calendar links.',
      path: '/tax-deadlines',
    });
  }

  protected calendarLink(d: Deadline): string {
    const start = d.date.replaceAll('-', '');
    const next = new Date(d.date + 'T00:00:00Z');
    next.setUTCDate(next.getUTCDate() + 1);
    const end = next.toISOString().slice(0, 10).replaceAll('-', '');
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: d.title,
      dates: `${start}/${end}`,
      details: d.detail,
    });
    return `https://calendar.google.com/calendar/render?${params}`;
  }
}
