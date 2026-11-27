import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { PageHero } from '../../shared/page-hero/page-hero';

@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHero],
  template: `<app-page-hero
      heading="Page not found"
      lead="Sorry, we couldn't find that page. It may have moved when we updated our website."
    />
    <section class="section">
      <div class="container btn-row">
        <a class="btn btn--primary" routerLink="/">Go to home page</a>
        <a class="btn btn--ghost" routerLink="/services">Our services</a>
        <a class="btn btn--ghost" routerLink="/contact">Contact us</a>
      </div>
    </section>`,
})
export default class NotFound {
  constructor() {
    inject(SeoService).update({
      title: 'Page not found',
      description: 'The page you requested could not be found.',
      path: '/404',
    });
  }
}
