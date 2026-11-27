import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { ThemeSwitcher } from './layout/theme-switcher/theme-switcher';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Header, Footer, ThemeSwitcher],
  template: `<a class="skip-link" href="#main">Skip to content</a>
    <app-header />
    <main id="main"><router-outlet /></main>
    <app-footer />
    <app-theme-switcher />`,
})
export class App {
  constructor() {
    const theme = inject(ThemeService);
    afterNextRender(() => theme.init());
  }
}
