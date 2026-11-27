import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ORGANIZER } from '../../core/data/resources.data';
import { SITE } from '../../core/data/site.config';
import { SeoService } from '../../core/services/seo.service';
import { Icon } from '../../shared/icon/icon';
import { PageHero } from '../../shared/page-hero/page-hero';

const KEY = 'krm-organizer';

@Component({
  selector: 'app-tax-organizer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, PageHero],
  template: `<app-page-hero
      eyebrow="Client tools"
      heading="Tax organizer"
      lead="Use this checklist to gather your documents before your appointment. Your progress is saved on this device."
    />
    <section class="section">
      <div class="container split split--wide">
        <div>
          <div class="organizer__bar">
            <div
              class="progress"
              role="progressbar"
              [attr.aria-valuenow]="percent()"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <span [style.width.%]="percent()"></span>
            </div>
            <span class="small">{{ done() }} of {{ total }} gathered</span>
          </div>
          @for (g of groups; track g.title) {
            <fieldset class="organizer__group card">
              <legend>{{ g.title }}</legend>
              @for (item of g.items; track item) {
                <label class="check">
                  <input type="checkbox" [checked]="checked().has(item)" (change)="toggle(item)" />
                  <span>{{ item }}</span>
                </label>
              }
            </fieldset>
          }
          <div class="btn-row no-print">
            <button type="button" class="btn btn--primary" (click)="print()">
              Print checklist
            </button>
            <button type="button" class="btn btn--ghost" (click)="clear()">Clear all</button>
          </div>
        </div>
        <aside class="sidebar no-print">
          <div class="card card--accent">
            <h3>Send documents securely</h3>
            <p>Upload your documents through our secure client portal instead of email.</p>
            <a
              class="btn btn--accent btn--sm"
              [href]="site.clientPortalUrl"
              target="_blank"
              rel="noopener"
              ><app-icon name="lock" [size]="16" /> Open client portal</a
            >
          </div>
          <div class="card">
            <h3>Not sure what you need?</h3>
            <p>
              Call <a [href]="site.phoneHref">{{ site.phone }}</a> or
              <a routerLink="/contact">send us a message</a>.
            </p>
            <p>
              <a routerLink="/tax-deadlines"
                >See key tax deadlines <app-icon name="arrow" [size]="14"
              /></a>
            </p>
          </div>
        </aside>
      </div>
    </section>`,
})
export default class TaxOrganizer {
  protected readonly groups = ORGANIZER;
  protected readonly site = SITE;
  protected readonly total = ORGANIZER.reduce((n, g) => n + g.items.length, 0);
  protected readonly checked = signal<Set<string>>(new Set());
  protected readonly done = computed(() => this.checked().size);
  protected readonly percent = computed(() => Math.round((this.done() / this.total) * 100));
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    inject(SeoService).update({
      title: 'Tax Organizer',
      description:
        'A printable checklist of documents to gather for your tax appointment with KRM Financial Services.',
      path: '/tax-organizer',
    });
    afterNextRender(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(KEY) ?? '[]') as string[];
        this.checked.set(new Set(saved));
      } catch {
        /* ignore corrupt storage */
      }
    });
  }

  protected toggle(item: string): void {
    this.checked.update((s) => {
      const next = new Set(s);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
    this.persist();
  }

  protected clear(): void {
    this.checked.set(new Set());
    this.persist();
  }

  protected print(): void {
    if (this.isBrowser) window.print();
  }

  private persist(): void {
    if (this.isBrowser) localStorage.setItem(KEY, JSON.stringify([...this.checked()]));
  }
}
