import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { THEMES, ThemeService } from '../../core/services/theme.service';
import { Icon } from '../../shared/icon/icon';

/**
 * Floating theme picker so the client can compare design directions.
 * Remove <app-theme-switcher> from app.html once a theme is chosen.
 */
@Component({
  selector: 'app-theme-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `<div class="theme-switcher" [class.is-open]="open()">
    @if (open()) {
      <div class="theme-switcher__panel" role="dialog" aria-label="Choose a theme">
        <p class="theme-switcher__title">Preview a theme</p>
        @for (t of themes; track t.id) {
          <button
            type="button"
            class="theme-switcher__option"
            [class.is-active]="theme.current() === t.id"
            (click)="theme.set(t.id)"
          >
            <span class="swatches">
              @for (c of t.swatches; track c) {
                <span [style.background]="c"></span>
              }
            </span>
            {{ t.name }}
          </button>
        }
      </div>
    }
    <button
      type="button"
      class="theme-switcher__fab"
      (click)="open.set(!open())"
      [attr.aria-expanded]="open()"
    >
      <app-icon name="palette" [size]="20" /> Themes
    </button>
  </div>`,
})
export class ThemeSwitcher {
  protected readonly theme = inject(ThemeService);
  protected readonly themes = THEMES;
  protected readonly open = signal(false);
}
