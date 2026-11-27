import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SERVICES, findService } from '../../core/data/services.data';
import { SITE } from '../../core/data/site.config';
import { SeoService } from '../../core/services/seo.service';
import { Icon } from '../../shared/icon/icon';
import { PageHero } from '../../shared/page-hero/page-hero';
import { CtaBand } from '../../shared/cta-band/cta-band';

@Component({
  selector: 'app-service-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, PageHero, CtaBand],
  template: `@if (service(); as s) {
      <app-page-hero eyebrow="Services" [heading]="s.title" [lead]="s.summary" />
      <section class="section">
        <div class="container split split--wide">
          <div>
            <p class="lead">{{ s.intro }}</p>
            <h2>What's included</h2>
            <ul class="checklist">
              @for (h of s.highlights; track h) {
                <li><app-icon name="check" [size]="20" /> {{ h }}</li>
              }
            </ul>
            <a class="btn btn--primary" routerLink="/contact"
              >Ask about {{ s.title.toLowerCase() }}</a
            >
          </div>
          <aside class="sidebar">
            <div class="card">
              <h3>Other services</h3>
              <ul class="link-list">
                @for (o of others(); track o.slug) {
                  <li>
                    <a [routerLink]="['/services', o.slug]"
                      ><app-icon [name]="o.icon" [size]="18" /> {{ o.title }}</a
                    >
                  </li>
                }
              </ul>
            </div>
            <div class="card card--accent">
              <h3>Have a question?</h3>
              <p>
                Call us at <a [href]="site.phoneHref">{{ site.phone }}</a> or send us a message.
              </p>
              <a class="btn btn--accent btn--sm" routerLink="/contact">Contact us</a>
            </div>
          </aside>
        </div>
      </section>
      <app-cta-band />
    } @else {
      <app-page-hero heading="Service not found" lead="That service doesn't exist." />
      <div class="container section">
        <a class="btn btn--primary" routerLink="/services">See all services</a>
      </div>
    }`,
})
export default class ServiceDetail {
  readonly slug = input.required<string>();
  protected readonly site = SITE;
  protected readonly service = computed(() => findService(this.slug()));
  protected readonly others = computed(() => SERVICES.filter((s) => s.slug !== this.slug()));
  private readonly seo = inject(SeoService);

  constructor() {
    effect(() => {
      const s = this.service();
      if (s)
        this.seo.update({
          title: s.title,
          description: `${s.summary} ${s.intro}`,
          path: `/services/${s.slug}`,
        });
    });
  }
}
