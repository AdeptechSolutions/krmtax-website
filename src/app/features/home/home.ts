import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/data/site.config';
import { SERVICES } from '../../core/data/services.data';
import { SeoService } from '../../core/services/seo.service';
import { Icon } from '../../shared/icon/icon';
import { CtaBand } from '../../shared/cta-band/cta-band';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, CtaBand],
  templateUrl: './home.html',
})
export default class Home {
  protected readonly site = SITE;
  protected readonly services = SERVICES;
  protected readonly tools = [
    {
      icon: 'calculator',
      title: 'Financial Calculators',
      text: 'Plan budgets, loans, mortgages and retirement.',
      path: '/calculators',
    },
    {
      icon: 'clipboard',
      title: 'Tax Organizer',
      text: 'A checklist of everything to bring for your return.',
      path: '/tax-organizer',
    },
    {
      icon: 'news',
      title: 'Client Newsletter',
      text: 'Monthly tax and money tips for our clients.',
      path: '/newsletter',
    },
    {
      icon: 'clock',
      title: 'Tax Deadlines',
      text: 'Key filing dates you can add to your calendar.',
      path: '/tax-deadlines',
    },
  ];
  protected readonly reasons = [
    {
      icon: 'users',
      title: 'Thousands of returns',
      text: "We prepare returns for 1000's of individual clients every year.",
    },
    {
      icon: 'shield',
      title: 'Always current',
      text: 'Annual continuing education keeps us up to date on changing tax law.',
    },
    {
      icon: 'clock',
      title: 'Timely and efficient',
      text: 'Fully computerized offices mean faster, up-to-date service.',
    },
    {
      icon: 'wallet',
      title: 'Competitive pricing',
      text: 'Professional service at a price that makes sense for you.',
    },
  ];

  constructor() {
    inject(SeoService).update({
      title: SITE.name,
      description:
        'KRM Financial Services in Hoffman Estates, IL offers individual and business tax returns, tax planning, bookkeeping, payroll and financial statements.',
      path: '/',
    });
  }
}
