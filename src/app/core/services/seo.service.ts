import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE } from '../data/site.config';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  update(opts: { title: string; description: string; path: string }): void {
    const fullTitle = opts.title === SITE.name ? opts.title : `${opts.title} | ${SITE.name}`;
    const url = SITE.url + (opts.path === '/' ? '' : opts.path);
    this.title.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: opts.description });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: opts.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });

    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  /** Adds or replaces a JSON-LD structured data block (rendered into prerendered HTML). */
  setJsonLd(id: string, data: object): void {
    let el = this.document.head.querySelector<HTMLScriptElement>(`script[data-ld="${id}"]`);
    if (!el) {
      el = this.document.createElement('script');
      el.type = 'application/ld+json';
      el.setAttribute('data-ld', id);
      this.document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
  }

  removeJsonLd(id: string): void {
    this.document.head.querySelector(`script[data-ld="${id}"]`)?.remove();
  }
}
