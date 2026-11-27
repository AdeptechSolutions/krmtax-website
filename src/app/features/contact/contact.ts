import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { SITE, fullAddress } from '../../core/data/site.config';
import { SeoService } from '../../core/services/seo.service';
import { ContactForm } from '../../shared/contact-form/contact-form';
import { Icon } from '../../shared/icon/icon';
import { PageHero } from '../../shared/page-hero/page-hero';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHero, ContactForm, Icon],
  template: `<app-page-hero
      eyebrow="Contact"
      heading="Get in touch"
      lead="Feel free to contact the office anytime. We'll get back to you within one business day."
    />
    <section class="section">
      <div class="container split split--wide">
        <div class="card">
          <h2>Send us a message</h2>
          <app-contact-form />
        </div>
        <aside class="sidebar">
          <div class="card">
            <h3>Office</h3>
            <ul class="contact-list">
              <li>
                <app-icon name="pin" [size]="18" />
                <a [href]="site.mapLinkUrl" target="_blank" rel="noopener">{{ address }}</a>
              </li>
              <li>
                <app-icon name="phone" [size]="18" />
                <a [href]="site.phoneHref">{{ site.phone }}</a>
              </li>
              <li>
                <app-icon name="mail" [size]="18" />
                <a [href]="'mailto:' + site.email">{{ site.email }}</a>
              </li>
            </ul>
          </div>
          <div class="card card--accent">
            <h3>Want to meet?</h3>
            <p>Book a time online and it goes straight to our calendar.</p>
            <a class="btn btn--accent btn--sm" routerLink="/book">Book an appointment</a>
          </div>
        </aside>
      </div>
    </section>
    <section class="map">
      <iframe
        [src]="mapUrl"
        title="Map to KRM Financial Services"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </section>`,
})
export default class Contact {
  protected readonly site = SITE;
  protected readonly address = fullAddress;
  // Trusted constant from site config.
  protected readonly mapUrl = inject(DomSanitizer).bypassSecurityTrustResourceUrl(SITE.mapEmbedUrl);

  constructor() {
    inject(SeoService).update({
      title: 'Contact Us',
      description: `Contact KRM Financial Services at ${SITE.phone} or visit us at ${fullAddress}.`,
      path: '/contact',
    });
  }
}
