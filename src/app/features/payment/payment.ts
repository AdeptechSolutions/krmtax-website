import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../../core/data/site.config';
import { SeoService } from '../../core/services/seo.service';
import { Icon } from '../../shared/icon/icon';
import { PageHero } from '../../shared/page-hero/page-hero';

@Component({
  selector: 'app-payment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, PageHero],
  template: `<app-page-hero
      eyebrow="Billing"
      heading="Make a payment"
      lead="Pay your invoice securely online. We accept PayPal and all major credit and debit cards."
    />
    <section class="section">
      <div class="container split split--wide">
        <div class="card">
          <h2>Pay your invoice</h2>
          <ol class="steps">
            <li>
              Have your <strong>invoice number</strong> and <strong>amount due</strong> ready.
            </li>
            <li>Click the button below to open our secure payment page.</li>
            <li>
              Enter your invoice number in the note or reference field so we can apply your payment.
            </li>
          </ol>
          @if (site.paymentUrl) {
            <a class="btn btn--accent" [href]="site.paymentUrl" target="_blank" rel="noopener"
              ><app-icon name="lock" [size]="18" /> Pay securely online</a
            >
          } @else {
            <p>
              Online card payments are coming soon. To pay now, please call
              <a [href]="site.phoneHref">{{ site.phone }}</a>.
            </p>
          }
          <p class="muted small">
            Payments are processed by a secure third-party provider. We never see or store your card
            number.
          </p>
        </div>
        <aside class="sidebar">
          <div class="card">
            <h3>Billing questions?</h3>
            <p>
              Call <a [href]="site.phoneHref">{{ site.phone }}</a> or email
              <a [href]="'mailto:' + site.email">{{ site.email }}</a>.
            </p>
          </div>
          <div class="card">
            <h3>Paying the IRS?</h3>
            <p>Federal tax payments go directly to the IRS, not to our office.</p>
            <a href="https://www.irs.gov/payments/direct-pay" target="_blank" rel="noopener"
              >IRS Direct Pay <app-icon name="external" [size]="14"
            /></a>
          </div>
        </aside>
      </div>
    </section>`,
})
export default class Payment {
  protected readonly site = SITE;
  constructor() {
    inject(SeoService).update({
      title: 'Make a Payment',
      description:
        'Pay your KRM Financial Services invoice securely online with PayPal or a credit or debit card.',
      path: '/payment',
    });
  }
}
