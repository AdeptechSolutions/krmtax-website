import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CALCULATORS, CalcOutput, Values, findCalculator } from '../../core/data/calculators.data';
import { SeoService } from '../../core/services/seo.service';
import { PageHero } from '../../shared/page-hero/page-hero';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-calculator-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHero, Icon, CurrencyPipe, DecimalPipe],
  templateUrl: './calculator-page.html',
})
export default class CalculatorPage {
  readonly slug = input.required<string>();
  protected readonly calc = computed(() => findCalculator(this.slug()));
  protected readonly related = computed(() => {
    const c = this.calc();
    return c ? CALCULATORS.filter((x) => x.category === c.category && x.slug !== c.slug) : [];
  });

  /** Current input values; resets to defaults whenever the calculator changes. */
  protected readonly values = linkedSignal<Values>(() => {
    const v: Values = {};
    for (const i of this.calc()?.inputs ?? []) v[i.key] = i.value;
    return v;
  });

  protected readonly results = computed<CalcOutput[]>(
    () => this.calc()?.compute(this.values()) ?? [],
  );
  private readonly seo = inject(SeoService);

  constructor() {
    effect(() => {
      const c = this.calc();
      if (c)
        this.seo.update({
          title: c.title,
          description: c.description,
          path: `/calculators/${c.slug}`,
        });
    });
  }

  protected setValue(key: string, raw: string): void {
    const n = Number(raw.replace(/[^0-9.-]/g, ''));
    this.values.update((v) => ({ ...v, [key]: Number.isFinite(n) ? n : 0 }));
  }

  protected reset(): void {
    const v: Values = {};
    for (const i of this.calc()?.inputs ?? []) v[i.key] = i.value;
    this.values.set(v);
  }

  protected isNumber(v: number | string): v is number {
    return typeof v === 'number';
  }
}
