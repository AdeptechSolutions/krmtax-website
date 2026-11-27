import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SERVICES } from '../../core/data/services.data';
import { SeoService } from '../../core/services/seo.service';
import { Icon } from '../../shared/icon/icon';
import { PageHero } from '../../shared/page-hero/page-hero';
import { CtaBand } from '../../shared/cta-band/cta-band';

@Component({
  selector: 'app-services-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, PageHero, CtaBand],
  template: `<app-page-hero
      eyebrow="Our services"
      heading="Tax and accounting services"
      lead="Whether you need a single return prepared or a partner for your business finances all year, we can help."
    />
    @for (group of groups; track group.title) {
      <section class="section" [class.section--alt]="$odd">
        <div class="container">
          <h2 class="section__title">{{ group.title }}</h2>
          <div class="grid grid--3">
            @for (s of group.items; track s.slug) {
              <a class="card card--link" [routerLink]="['/services', s.slug]">
                <span class="card__icon"><app-icon [name]="s.icon" /></span>
                <h3>{{ s.title }}</h3>
                <p>{{ s.summary }}</p>
                <span class="card__more">Learn more <app-icon name="arrow" [size]="16" /></span>
              </a>
            }
          </div>
        </div>
      </section>
    }
    <app-cta-band />`,
})
export default class ServicesList {
  protected readonly groups = [
    { title: 'For individuals', items: SERVICES.filter((s) => s.audience === 'individual') },
    { title: 'For businesses', items: SERVICES.filter((s) => s.audience === 'business') },
  ];

  constructor() {
    inject(SeoService).update({
      title: 'Services',
      description:
        'Individual and business tax returns, tax planning, bookkeeping, payroll, financial statements and business valuations.',
      path: '/services',
    });
  }
}
