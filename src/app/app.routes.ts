import { Routes } from '@angular/router';

/** Every feature is lazy-loaded so each page only ships the code it needs. */
export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home') },
  { path: 'services', loadComponent: () => import('./features/services/services-list') },
  { path: 'services/:slug', loadComponent: () => import('./features/services/service-detail') },
  { path: 'about', loadComponent: () => import('./features/about/about') },
  { path: 'calculators', loadComponent: () => import('./features/calculators/calculators-list') },
  {
    path: 'calculators/:slug',
    loadComponent: () => import('./features/calculators/calculator-page'),
  },
  { path: 'tax-organizer', loadComponent: () => import('./features/tax-organizer/tax-organizer') },
  { path: 'newsletter', loadComponent: () => import('./features/newsletter/newsletter') },
  { path: 'forms', loadComponent: () => import('./features/forms/forms') },
  { path: 'resources', loadComponent: () => import('./features/resources/resources') },
  { path: 'contact', loadComponent: () => import('./features/contact/contact') },
  { path: 'book', loadComponent: () => import('./features/book/book') },
  { path: 'faq', loadComponent: () => import('./features/faq/faq') },
  { path: 'tax-deadlines', loadComponent: () => import('./features/tax-deadlines/tax-deadlines') },
  { path: 'legal', loadComponent: () => import('./features/legal/legal') },
  { path: 'themes', loadComponent: () => import('./features/themes/themes') },

  // Redirects from the old site's URLs so existing links and search results keep working.
  { path: 'our-services', redirectTo: 'services' },
  { path: 'bookkeeping', redirectTo: 'services/bookkeeping' },
  { path: 'financialstatements', redirectTo: 'services/financial-statements' },
  { path: 'individuals', redirectTo: 'services/individuals' },
  { path: 'payroll', redirectTo: 'services/payroll' },
  { path: 'smallbusiness', redirectTo: 'services/business-tax-returns' },
  { path: 'taxplanning', redirectTo: 'services/tax-planning' },
  { path: 'valuations', redirectTo: 'services/business-valuations' },
  { path: 'about-us', redirectTo: 'about' },
  { path: 'financial-calculators', redirectTo: 'calculators' },
  { path: 'contact-us', redirectTo: 'contact' },
  { path: 'online-resources', redirectTo: 'resources' },
  { path: 'make-a-payment', redirectTo: 'contact' },

  { path: '**', loadComponent: () => import('./features/not-found/not-found') },
];
