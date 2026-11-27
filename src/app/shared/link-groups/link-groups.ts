import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LinkGroup } from '../../core/data/resources.data';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-link-groups',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `<section class="section">
    <div class="container">
      @for (g of groups(); track g.title) {
        <div class="calc-group">
          <h2 class="section__title">{{ g.title }}</h2>
          <div class="grid grid--3">
            @for (l of g.links; track l.url) {
              <a class="card card--link card--row" [href]="l.url" target="_blank" rel="noopener">
                <span class="card__icon"><app-icon [name]="icon()" /></span>
                <span>
                  <strong>{{ l.title }}</strong>
                  <span class="muted small d-block">{{ l.description }}</span>
                </span>
              </a>
            }
          </div>
        </div>
      }
    </div>
  </section>`,
})
export class LinkGroups {
  readonly groups = input.required<LinkGroup[]>();
  readonly icon = input('link');
}
