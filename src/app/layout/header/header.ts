import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NAV, SITE } from '../../core/data/site.config';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './header.html',
  host: {
    '(document:keydown.escape)': 'close()',
    '(window:resize)': 'onResize()',
  },
})
export class Header {
  protected readonly nav = NAV;
  protected readonly site = SITE;
  protected readonly menuOpen = signal(false);
  protected readonly openDropdown = signal<string | null>(null);
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.close());

    // Lock page scroll and position the menu just below the header while open.
    effect(() => {
      const open = this.menuOpen();
      const html = this.document.documentElement;
      html.classList.toggle('nav-open', open);
      if (open) this.positionMenu();
    });
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  close(): void {
    this.menuOpen.set(false);
    this.openDropdown.set(null);
  }

  toggleDropdown(label: string): void {
    this.openDropdown.update((cur) => (cur === label ? null : label));
  }

  protected onResize(): void {
    if (this.menuOpen()) {
      if (window.innerWidth > 1080) this.close();
      else this.positionMenu();
    }
  }

  private positionMenu(): void {
    const header = this.host.nativeElement.querySelector('.site-header');
    if (!header) return;
    const bottom = Math.max(0, header.getBoundingClientRect().bottom);
    this.document.documentElement.style.setProperty('--nav-top', `${bottom}px`);
  }
}
