import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-page-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<section class="page-hero">
    <div class="container">
      @if (eyebrow()) {
        <p class="eyebrow">{{ eyebrow() }}</p>
      }
      <h1>{{ heading() }}</h1>
      @if (lead()) {
        <p class="lead">{{ lead() }}</p>
      }
      <ng-content />
    </div>
  </section>`,
})
export class PageHero {
  readonly heading = input.required<string>();
  readonly lead = input<string>();
  readonly eyebrow = input<string>();
}
