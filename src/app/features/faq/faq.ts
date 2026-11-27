import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/data/site.config';
import { SeoService } from '../../core/services/seo.service';
import { PageHero } from '../../shared/page-hero/page-hero';
import { CtaBand } from '../../shared/cta-band/cta-band';

const FAQS: { q: string; a: string }[] = [
  {
    q: 'What documents should I bring for my tax appointment?',
    a: 'Bring your W-2s, 1099s, mortgage interest and property tax statements, charitable receipts, child care costs and last year’s return if you are a new client. Our Tax Organizer page has a complete printable checklist.',
  },
  {
    q: 'How do I send my documents securely?',
    a: 'Please upload documents through our secure client portal rather than email. The portal is encrypted and keeps your information private.',
  },
  {
    q: 'Do I need an appointment?',
    a: 'Appointments are recommended, especially during tax season, so we can give you our full attention. You can book online at any time.',
  },
  {
    q: 'When is the tax filing deadline?',
    a: 'For most individuals, federal and Illinois returns for tax year 2026 are due April 15, 2027. See our Tax Deadlines page for business, estimated tax and extension dates.',
  },
  {
    q: 'What if I can’t file by the deadline?',
    a: 'We can file an extension that gives you until October 15 to file your return. An extension does not extend the time to pay, so we will help you estimate and pay what you owe by April 15.',
  },
  {
    q: 'I received a letter from the IRS. What should I do?',
    a: 'Don’t panic and don’t ignore it. Send us a copy through the client portal or bring it in, and we will review it and help you respond before the deadline in the letter.',
  },
  {
    q: 'Do you work with small businesses?',
    a: 'Yes. We provide bookkeeping, payroll, financial statements and tax returns for sole proprietors, partnerships, LLCs and corporations, plus business valuations.',
  },
  {
    q: 'How can I pay my invoice?',
    a: 'You can pay online with PayPal or a major credit or debit card on our Make a Payment page, or call the office.',
  },
  {
    q: 'How do I check on my refund?',
    a: 'Use the IRS “Where’s My Refund?” tool for your federal refund and MyTax Illinois for your state refund. Links are on our Helpful Links page.',
  },
];

@Component({
  selector: 'app-faq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHero, CtaBand],
  template: `<app-page-hero
      eyebrow="Help"
      heading="Frequently asked questions"
      lead="Quick answers to the questions we hear most often."
    />
    <section class="section">
      <div class="container narrow">
        @for (f of faqs; track f.q) {
          <details class="faq">
            <summary>{{ f.q }}</summary>
            <p>{{ f.a }}</p>
          </details>
        }
        <p class="muted">
          Still have a question? Call <a [href]="site.phoneHref">{{ site.phone }}</a> or
          <a routerLink="/contact">send us a message</a>.
        </p>
      </div>
    </section>
    <app-cta-band />`,
})
export default class Faq {
  protected readonly faqs = FAQS;
  protected readonly site = SITE;

  constructor() {
    const seo = inject(SeoService);
    seo.update({
      title: 'FAQ',
      description:
        'Answers to common questions about tax appointments, documents, deadlines, extensions, IRS letters and payments.',
      path: '/faq',
    });
    seo.setJsonLd('faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
    inject(DestroyRef).onDestroy(() => seo.removeJsonLd('faq'));
  }
}
