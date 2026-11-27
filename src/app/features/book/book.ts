import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/data/site.config';
import { SeoService } from '../../core/services/seo.service';
import { ContactForm } from '../../shared/contact-form/contact-form';
import { Icon } from '../../shared/icon/icon';
import { PageHero } from '../../shared/page-hero/page-hero';

@Component({
  selector: 'app-book',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHero, ContactForm, Icon, RouterLink],
  template: `<app-page-hero
      eyebrow="Appointments"
      heading="Book an appointment"
      lead="Pick a time that works for you. Your appointment goes straight onto our calendar and you'll get a confirmation by email."
    />
    <section class="section">
      <div class="container split split--wide">
        <div>
          @if (bookingUrl) {
            <div class="booking-frame card">
              <iframe
                [src]="bookingUrl"
                title="Book an appointment with KRM Financial Services"
                loading="lazy"
              ></iframe>
            </div>
          } @else {
            <div class="card">
              <h2>Request an appointment</h2>
              <p>
                Tell us what you need and when you're available, and we'll confirm a time with you.
              </p>
              <app-contact-form mode="appointment" />
            </div>
          }
        </div>
        <aside class="sidebar">
          <div class="card">
            <h3>Before your appointment</h3>
            <ul class="link-list">
              <li>
                <a routerLink="/tax-organizer"
                  ><app-icon name="clipboard" [size]="18" /> Use our tax organizer checklist</a
                >
              </li>
              <li>
                <a [href]="site.clientPortalUrl" target="_blank" rel="noopener"
                  ><app-icon name="lock" [size]="18" /> Upload documents securely</a
                >
              </li>
            </ul>
          </div>
          <div class="card card--accent">
            <h3>Prefer to call?</h3>
            <p>
              <a [href]="site.phoneHref">{{ site.phone }}</a>
            </p>
          </div>
        </aside>
      </div>
    </section>`,
})
export default class Book {
  protected readonly site = SITE;
  // Trusted: value comes from our own site config, never from user input.
  protected readonly bookingUrl = SITE.bookingUrl
    ? inject(DomSanitizer).bypassSecurityTrustResourceUrl(SITE.bookingUrl)
    : null;

  constructor() {
    inject(SeoService).update({
      title: 'Book an Appointment',
      description: 'Schedule a tax or accounting appointment with KRM Financial Services online.',
      path: '/book',
    });
  }
}
