import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { THEMES, ThemeService } from '../../core/services/theme.service';
import { SeoService } from '../../core/services/seo.service';
import { PageHero } from '../../shared/page-hero/page-hero';

/** Side-by-side comparison of the design directions. Each preview is a scoped mini page. */
@Component({
  selector: 'app-themes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHero],
  template: `<app-page-hero
      eyebrow="Design options"
      heading="Choose a theme"
      lead="Four design directions for the new KRM website. Click “Apply” to see the whole site in that theme, then browse any page."
    />
    <section class="section">
      <div class="container grid grid--2">
        @for (t of themes; track t.id) {
          <article
            class="theme-card"
            [attr.data-theme]="t.id"
            [class.is-active]="theme.current() === t.id"
          >
            <div class="theme-card__preview">
              <div class="tp-nav">
                <span class="tp-logo">KRM</span><span class="tp-links"><i></i><i></i><i></i></span
                ><span class="tp-btn">Book</span>
              </div>
              <div class="tp-hero">
                <small>Tax &amp; Accounting</small>
                <strong>Clear answers for your taxes.</strong>
                <span class="tp-cta">Book an appointment</span>
              </div>
              <div class="tp-cards"><span></span><span></span><span></span></div>
            </div>
            <div class="theme-card__body">
              <div class="swatches swatches--lg">
                @for (c of t.swatches; track c) {
                  <span [style.background]="c"></span>
                }
              </div>
              <h2>{{ t.name }}</h2>
              <p>{{ t.description }}</p>
              <div class="btn-row">
                <button type="button" class="btn btn--primary btn--sm" (click)="theme.set(t.id)">
                  {{ theme.current() === t.id ? 'Applied ✓' : 'Apply theme' }}
                </button>
                <a class="btn btn--ghost btn--sm" routerLink="/" (click)="theme.set(t.id)"
                  >View home page</a
                >
              </div>
            </div>
          </article>
        }
      </div>
    </section>`,
})
export default class Themes {
  protected readonly themes = THEMES;
  protected readonly theme = inject(ThemeService);
  constructor() {
    inject(SeoService).update({
      title: 'Theme preview',
      description: 'Compare design themes for the KRM website.',
      path: '/themes',
    });
  }
}
