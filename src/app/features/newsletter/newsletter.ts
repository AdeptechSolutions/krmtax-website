import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../../core/data/site.config';
import { SeoService } from '../../core/services/seo.service';
import { Icon } from '../../shared/icon/icon';
import { PageHero } from '../../shared/page-hero/page-hero';

@Component({
  selector: 'app-newsletter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, PageHero],
  template: `<app-page-hero
      eyebrow="Stay informed"
      heading="Client Update newsletter"
      lead="Each month we share tax law changes, money-saving tips and planning ideas for individuals and business owners."
    />
    <section class="section">
      <div class="container split split--wide">
        <div>
          <h2>Recent topics</h2>
          <div class="grid grid--2">
            @for (t of topics; track t.title) {
              <article class="card">
                <span class="card__icon"><app-icon name="news" /></span>
                <h3>{{ t.title }}</h3>
                <p>{{ t.text }}</p>
              </article>
            }
          </div>
          <p class="muted small">
            Some material may be time-sensitive. Please contact us before acting on anything you
            read.
          </p>
        </div>
        <aside class="sidebar">
          <div class="card card--accent">
            <h3>Get it in your inbox</h3>
            <p>Subscribe to receive the Client Update newsletter by email each month.</p>
            <a
              class="btn btn--accent btn--sm"
              [href]="site.newsletterSubscribeUrl"
              target="_blank"
              rel="noopener"
              >Subscribe <app-icon name="external" [size]="16"
            /></a>
          </div>
        </aside>
      </div>
    </section>`,
})
export default class Newsletter {
  protected readonly site = SITE;
  protected readonly topics = [
    {
      title: "What's new for 2026",
      text: 'Tax changes that affect charitable giving, 529 plans, dependent care, HSAs, Roth catch-up contributions and more.',
    },
    {
      title: '2027 Social Security changes',
      text: 'Cost-of-living adjustments and earnings limits announced for next year.',
    },
    {
      title: 'Bills to renegotiate every year',
      text: 'Insurance, internet, phone and subscriptions: where to look for savings and how to ask.',
    },
    {
      title: 'Year-end planning checklist',
      text: 'Moves to consider before December 31 to reduce your tax bill.',
    },
  ];

  constructor() {
    inject(SeoService).update({
      title: 'Newsletter',
      description:
        'Subscribe to the KRM Financial Services monthly Client Update newsletter for tax and money tips.',
      path: '/newsletter',
    });
  }
}
