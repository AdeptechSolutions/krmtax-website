export interface Service {
  slug: string;
  title: string;
  icon: string;
  summary: string;
  intro: string;
  highlights: string[];
  audience: 'individual' | 'business';
}

/** Content adapted from krmtax.com/our-services and expanded for clarity. */
export const SERVICES: Service[] = [
  {
    slug: 'individuals',
    title: 'Individual Tax Returns',
    icon: 'person',
    audience: 'individual',
    summary:
      "Tax returns and filing instructions prepared for 1000's of individual clients each year.",
    intro:
      'We prepare federal and state returns for individuals and families, and give you clear filing instructions so you know exactly what to sign, send and pay.',
    highlights: [
      'Federal and Illinois returns, plus multi-state filings',
      'Itemized deductions, education credits and dependent care',
      'Rental property, investment and retirement income',
      'Estimated tax payment planning for next year',
      'Help responding to IRS and state notices',
    ],
  },
  {
    slug: 'tax-planning',
    title: 'Tax Planning',
    icon: 'compass',
    audience: 'individual',
    summary: 'Long term, annual and mid-year tax planning and tax forecasting services.',
    intro:
      'Good planning happens before year-end, not at filing time. We forecast your tax position and recommend moves that reduce what you owe over the long run.',
    highlights: [
      'Mid-year and year-end tax projections',
      'Retirement contribution and Roth conversion strategy',
      'Timing of income, deductions and major purchases',
      'Planning for life events: marriage, children, home, retirement',
      'Entity selection and owner compensation for business owners',
    ],
  },
  {
    slug: 'business-tax-returns',
    title: 'Business Tax Returns',
    icon: 'briefcase',
    audience: 'business',
    summary: 'A variety of small business tax returns are prepared each year.',
    intro:
      'From sole proprietors to corporations, we prepare accurate business returns on time and help you stay compliant throughout the year.',
    highlights: [
      'Sole proprietorship (Schedule C) returns',
      'Partnership and LLC returns (Form 1065)',
      'S corporation (1120-S) and C corporation (1120) returns',
      'Illinois business and replacement tax filings',
      'Quarterly estimates and year-end planning',
    ],
  },
  {
    slug: 'bookkeeping',
    title: 'Bookkeeping',
    icon: 'book',
    audience: 'business',
    summary: 'Complete bookkeeping services for small businesses.',
    intro:
      'Accurate books are the foundation of every good business decision. We keep your records organized, reconciled and ready for tax time.',
    highlights: [
      'Monthly transaction recording and categorization',
      'Bank and credit card reconciliations',
      'Accounts payable and receivable tracking',
      'Clean-up of prior-period records',
      'Year-end close and accountant-ready ledgers',
    ],
  },
  {
    slug: 'financial-statements',
    title: 'Financial Statements',
    icon: 'chart',
    audience: 'business',
    summary:
      'Monthly, quarterly and year-end balance sheets and operating statements, prepared accurately and timely.',
    intro:
      'We prepare monthly, quarterly and year-end balance sheets and operating statements for a broad range of small business clients, so you always know where your business stands.',
    highlights: [
      'Balance sheets and profit and loss statements',
      'Monthly, quarterly or annual reporting',
      'Statements suitable for lenders and investors',
      'Comparisons against prior periods',
      'Plain-English review of the results with you',
    ],
  },
  {
    slug: 'payroll',
    title: 'Payroll Services',
    icon: 'wallet',
    audience: 'business',
    summary: 'Total payroll services for small business clients.',
    intro:
      'Pay your team correctly and on time, without the headaches. We handle payroll processing and the filings that come with it.',
    highlights: [
      'Payroll processing and pay stubs',
      'Federal and state payroll tax deposits',
      'Quarterly 941 and Illinois IL-941 filings',
      'Year-end W-2 and 1099 preparation',
      'New hire setup and W-4 guidance',
    ],
  },
  {
    slug: 'business-valuations',
    title: 'Business Valuations',
    icon: 'scale',
    audience: 'business',
    summary: 'Establishing the proper value of a small business.',
    intro:
      'Whether you are buying, selling, bringing in a partner or planning your estate, we help establish a well-supported value for your small business.',
    highlights: [
      'Valuations for purchase, sale or succession',
      'Partner buy-ins and buy-outs',
      'Estate and gift planning support',
      'Review of financial history and earning power',
      'Clear written summary of the conclusions',
    ],
  },
];

export function findService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
