import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE, fullAddress } from '../../core/data/site.config';
import { SeoService } from '../../core/services/seo.service';
import { Icon } from '../../shared/icon/icon';
import { PageHero } from '../../shared/page-hero/page-hero';
import { CtaBand } from '../../shared/cta-band/cta-band';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, PageHero, CtaBand],
  template: `<app-page-hero
      eyebrow="About us"
      heading="A local firm you can count on"
      lead="Accounting and tax preparation for individuals, families and small businesses in the Chicago northwest suburbs."
    />
    <section class="section">
      <div class="container split split--wide">
        <div class="prose">
          <p class="lead">
            KRM Financial Services, Ltd. provides accounting and tax preparation services for a wide
            range of clients.
          </p>
          <p>
            We specialize in individual tax filing and tax planning, bookkeeping and financial
            statements for small businesses, and corporate tax return filing. Each year we prepare
            returns for thousands of individual clients and a variety of small businesses.
          </p>
          <p>
            We stay current on changing tax laws and accounting methods by attending Continuing
            Professional Education courses every year, offered by local chapters of national
            accounting and tax associations.
          </p>
          <p>
            Our offices are fully computerized with secure online access, which lets us provide
            efficient, up-to-date service at a competitive price. Feel free to contact the office
            anytime.
          </p>
          <a class="btn btn--primary" routerLink="/services">See our services</a>
        </div>
        <aside class="sidebar">
          <div class="card">
            <h3>Visit or call</h3>
            <ul class="contact-list">
              <li><app-icon name="pin" [size]="18" /> {{ address }}</li>
              <li>
                <app-icon name="phone" [size]="18" />
                <a [href]="site.phoneHref">{{ site.phone }}</a>
              </li>
              <li>
                <app-icon name="mail" [size]="18" />
                <a [href]="'mailto:' + site.email">{{ site.email }}</a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
    <section class="section section--alt">
      <div class="container">
        <div class="section__head">
          <p class="eyebrow">Our values</p>
          <h2>How we work</h2>
        </div>
        <div class="grid grid--3">
          @for (v of values; track v.title) {
            <div class="card">
              <span class="card__icon"><app-icon [name]="v.icon" /></span>
              <h3>{{ v.title }}</h3>
              <p>{{ v.text }}</p>
            </div>
          }
        </div>
      </div>
    </section>
    <app-cta-band />`,
})
export default class About {
  protected readonly site = SITE;
  protected readonly address = fullAddress;
  protected readonly values = [
    {
      icon: 'shield',
      title: 'Accuracy',
      text: 'Careful, thorough work on every return and statement we prepare.',
    },
    {
      icon: 'clock',
      title: 'Timeliness',
      text: 'Deadlines met, questions answered promptly, no last-minute surprises.',
    },
    {
      icon: 'users',
      title: 'Personal service',
      text: 'You work with people who know you and your situation year after year.',
    },
  ];

  constructor() {
    inject(SeoService).update({
      title: 'About Us',
      description:
        'KRM Financial Services, Ltd. provides accounting and tax preparation for individuals and small businesses in Hoffman Estates, IL.',
      path: '/about',
    });
  }
}
