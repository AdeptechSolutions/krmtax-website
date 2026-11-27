import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { PageHero } from '../../shared/page-hero/page-hero';
import { Deadline, FILING_DEADLINES, FILING_SEASON, TAX_YEAR } from '../../core/data/tax-year';

@Component({
  selector: 'app-tax-deadlines',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, RouterLink, PageHero],
  template: `<app-page-hero
      eyebrow="Client tools"
      heading="Key tax deadlines"
      [lead]="
        'Important federal dates for the ' +
        season +
        ' filing season (tax year ' +
        taxYear +
        '). Add them to your calendar so nothing slips.'
      "
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
  protected readonly deadlines = FILING_DEADLINES;
  protected readonly taxYear = TAX_YEAR;
  protected readonly season = FILING_SEASON;
  protected readonly today = computed(() => new Date().toISOString().slice(0, 10));

  constructor() {
    inject(SeoService).update({
      title: 'Tax Deadlines',
      description: `Key ${FILING_SEASON} federal tax deadlines for individuals, businesses and employers, with add-to-calendar links.`,
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
