/**
 * Central site configuration. Update firm details here and they flow
 * through every page, the footer, structured data and SEO tags.
 */
export const SITE = {
  name: 'KRM Financial Services, Ltd.',
  shortName: 'KRM Tax',
  tagline: 'Professional tax and financial services.',
  url: 'https://krmtax.com',
  email: 'pparmar@krmtax.com',
  phone: '847-519-7207',
  phoneHref: 'tel:+18475197207',
  address: {
    street: '2300 N. Barrington Road, Suite 400',
    city: 'Hoffman Estates',
    state: 'IL',
    zip: '60169',
  },
  mapEmbedUrl:
    'https://www.google.com/maps?q=2300+N+Barrington+Rd+Suite+400,+Hoffman+Estates,+IL+60169&output=embed',
  mapLinkUrl:
    'https://www.google.com/maps/search/?api=1&query=2300+N+Barrington+Rd+Suite+400+Hoffman+Estates+IL+60169',
  clientPortalUrl: 'http://pravinparmar.myfirmfiles.com',
  newsletterSubscribeUrl: 'https://www.resourcesforclients.com',
  /**
   * Form handling endpoint for the contact form (e.g. a Formspree form URL
   * such as https://formspree.io/f/xxxxxxx). Leave empty to fall back to
   * opening the visitor's email client.
   */
  contactFormEndpoint: '',
  /**
   * Hosted payment link (PayPal, Stripe Payment Link, LawPay/CPACharge...).
   * Leave empty to show "call the office" instructions instead.
   */
  paymentUrl: '',
  /**
   * Online appointment booking. Paste the booking page URL from any of:
   *  - Google Calendar appointment schedule (calendar.app.google/... or calendar.google.com/calendar/appointments/...)
   *  - Calendly (https://calendly.com/your-name/consultation)
   *  - Cal.com (https://cal.com/your-name)
   *  - Microsoft Bookings (https://outlook.office365.com/book/...)
   * Bookings land directly on the office calendar. Leave empty to show a
   * request form instead.
   */
  bookingUrl: '',
} as const;

export const fullAddress = `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.state} ${SITE.address.zip}`;

export interface NavItem {
  label: string;
  path?: string;
  href?: string;
  children?: NavItem[];
}

export const NAV: NavItem[] = [
  { label: 'Home', path: '/' },
  {
    label: 'Services',
    path: '/services',
    children: [
      { label: 'All services', path: '/services' },
      { label: 'Bookkeeping', path: '/services/bookkeeping' },
      { label: 'Financial Statements', path: '/services/financial-statements' },
      { label: 'Individuals', path: '/services/individuals' },
      { label: 'Payroll Services', path: '/services/payroll' },
      { label: 'Business Tax Returns', path: '/services/business-tax-returns' },
      { label: 'Tax Planning', path: '/services/tax-planning' },
      { label: 'Business Valuations', path: '/services/business-valuations' },
    ],
  },
  { label: 'About', path: '/about' },
  {
    label: 'Resources',
    children: [
      { label: 'Financial Calculators', path: '/calculators' },
      { label: 'Tax Organizer', path: '/tax-organizer' },
      { label: 'Tax Deadlines', path: '/tax-deadlines' },
      { label: 'Newsletter', path: '/newsletter' },
      { label: 'Forms', path: '/forms' },
      { label: 'Helpful Links', path: '/resources' },
      { label: 'Make a Payment', path: '/payment' },
    ],
  },
  { label: 'FAQ', path: '/faq' },
  { label: 'Contact', path: '/contact' },
];
