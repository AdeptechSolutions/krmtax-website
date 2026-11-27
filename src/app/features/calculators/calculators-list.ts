import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CALCULATORS, CALC_CATEGORIES } from '../../core/data/calculators.data';
import { TAX_YEAR } from '../../core/data/tax-year';
import { SeoService } from '../../core/services/seo.service';
import { Icon } from '../../shared/icon/icon';
import { PageHero } from '../../shared/page-hero/page-hero';

@Component({
  selector: 'app-calculators-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, PageHero],
  template: `<app-page-hero
      eyebrow="Client tools"
      heading="Financial calculators"
      lead="Budget, plan for retirement, compare loans and estimate taxes. Results update instantly as you type."
    />
    <section class="section">
      <div class="container">
        @for (g of groups; track g.category) {
          <div class="calc-group">
            <h2 class="section__title">{{ g.category }}</h2>
            <div class="grid grid--3">
              @for (c of g.items; track c.slug) {
                <a class="card card--link" [routerLink]="['/calculators', c.slug]">
                  <span class="card__icon"><app-icon name="calculator" /></span>
                  <h3>{{ c.title }}</h3>
                  <p>{{ c.description }}</p>
                </a>
              }
            </div>
          </div>
        }
        <p class="muted small">
          Tax calculators use federal figures for tax year {{ taxYear }}. Calculators are for
          illustration only and are not tax, legal or financial advice. Contact us to review your
          situation.
        </p>
      </div>
    </section>`,
})
export default class CalculatorsList {
  protected readonly taxYear = TAX_YEAR;
  protected readonly groups = CALC_CATEGORIES.map((category) => ({
    category,
    items: CALCULATORS.filter((c) => c.category === category),
  })).filter((g) => g.items.length);

  constructor() {
    inject(SeoService).update({
      title: 'Financial Calculators',
      description:
        'Free tax, retirement, mortgage, loan and business calculators from KRM Financial Services.',
      path: '/calculators',
    });
  }
}
