export interface LinkItem {
  title: string;
  url: string;
  description: string;
}

export interface LinkGroup {
  title: string;
  links: LinkItem[];
}

/** Downloadable forms. Links point to official IRS / IDOR sources so they stay current. */
export const FORMS: LinkGroup[] = [
  {
    title: 'Employment',
    links: [
      {
        title: 'Form W-4',
        url: 'https://www.irs.gov/pub/irs-pdf/fw4.pdf',
        description: "Employee's Withholding Certificate",
      },
      {
        title: 'Form IL-W-4',
        url: 'https://tax.illinois.gov/content/dam/soi/en/web/tax/forms/withholding/documents/currentyear/il-w-4.pdf',
        description: "Illinois Employee's Withholding Allowance Certificate",
      },
      {
        title: 'Form W-9',
        url: 'https://www.irs.gov/pub/irs-pdf/fw9.pdf',
        description: 'Request for Taxpayer Identification Number and Certification',
      },
      {
        title: 'Form I-9',
        url: 'https://www.uscis.gov/i-9',
        description: 'Employment Eligibility Verification (USCIS)',
      },
    ],
  },
  {
    title: 'Individuals',
    links: [
      {
        title: 'Form 1040-ES',
        url: 'https://www.irs.gov/pub/irs-pdf/f1040es.pdf',
        description: 'Estimated Tax for Individuals',
      },
      {
        title: 'Form 4868',
        url: 'https://www.irs.gov/pub/irs-pdf/f4868.pdf',
        description: 'Application for Automatic Extension of Time to File',
      },
      {
        title: 'Form 8821',
        url: 'https://www.irs.gov/pub/irs-pdf/f8821.pdf',
        description: 'Tax Information Authorization',
      },
      {
        title: 'Form 2848',
        url: 'https://www.irs.gov/pub/irs-pdf/f2848.pdf',
        description: 'Power of Attorney and Declaration of Representative',
      },
    ],
  },
  {
    title: 'Businesses',
    links: [
      {
        title: 'Form SS-4',
        url: 'https://www.irs.gov/forms-pubs/about-form-ss-4',
        description: 'Apply for an Employer Identification Number (EIN)',
      },
      {
        title: 'Form 2553',
        url: 'https://www.irs.gov/pub/irs-pdf/f2553.pdf',
        description: 'Election by a Small Business Corporation (S corp)',
      },
      {
        title: 'Form 7004',
        url: 'https://www.irs.gov/pub/irs-pdf/f7004.pdf',
        description: 'Automatic Extension for Business Returns',
      },
    ],
  },
];

export const RESOURCE_LINKS: LinkGroup[] = [
  {
    title: 'Tax agencies',
    links: [
      {
        title: 'Internal Revenue Service',
        url: 'https://www.irs.gov',
        description: 'Federal tax information, forms and publications',
      },
      {
        title: "Where's My Refund?",
        url: 'https://www.irs.gov/refunds',
        description: 'Check the status of your federal refund',
      },
      {
        title: 'IRS Direct Pay',
        url: 'https://www.irs.gov/payments/direct-pay',
        description: 'Pay federal taxes from your bank account',
      },
      {
        title: 'IRS Online Account',
        url: 'https://www.irs.gov/payments/your-online-account',
        description: 'View balances, payments and transcripts',
      },
      {
        title: 'Illinois Department of Revenue',
        url: 'https://tax.illinois.gov',
        description: 'Illinois tax forms, payments and refund status',
      },
      {
        title: 'MyTax Illinois',
        url: 'https://mytax.illinois.gov',
        description: 'File and pay Illinois taxes online',
      },
    ],
  },
  {
    title: 'Government',
    links: [
      {
        title: 'Social Security Administration',
        url: 'https://www.ssa.gov',
        description: 'Benefits, statements and retirement planning',
      },
      {
        title: 'The White House',
        url: 'https://www.whitehouse.gov',
        description: 'Executive branch news and policy',
      },
      {
        title: 'US House of Representatives',
        url: 'https://www.house.gov',
        description: 'Legislation and representatives',
      },
      {
        title: 'US Senate',
        url: 'https://www.senate.gov',
        description: 'Legislation and senators',
      },
    ],
  },
  {
    title: 'Research and news',
    links: [
      { title: 'Google', url: 'https://www.google.com', description: 'Search engine' },
      {
        title: 'Wikipedia',
        url: 'https://www.wikipedia.org',
        description: 'Internet research site',
      },
      { title: 'Weather', url: 'https://weather.com', description: 'Local forecasts' },
      { title: 'YouTube', url: 'https://www.youtube.com', description: 'Popular videos' },
    ],
  },
];

/** Document checklist shown on the Tax Organizer page. */
export const ORGANIZER: { title: string; items: string[] }[] = [
  {
    title: 'Personal information',
    items: [
      'Copy of last year’s federal and state returns (new clients)',
      'Social Security numbers and birth dates for you, your spouse and dependents',
      'Driver’s license or state ID for you and your spouse',
      'Bank routing and account number for direct deposit',
      'IRS Identity Protection PIN, if you received one',
    ],
  },
  {
    title: 'Income',
    items: [
      'W-2 forms from all employers',
      '1099-NEC / 1099-MISC / 1099-K for freelance or business income',
      '1099-INT, 1099-DIV and 1099-B for interest, dividends and investment sales',
      '1099-R for pensions, IRAs and retirement distributions',
      'SSA-1099 for Social Security benefits',
      '1099-G for unemployment or state refunds',
      'K-1s from partnerships, S corporations or trusts',
      'Rental property income and expense records',
    ],
  },
  {
    title: 'Deductions and credits',
    items: [
      'Form 1098 mortgage interest statement',
      'Property tax bills and payment receipts',
      'Charitable donation receipts (cash and non-cash)',
      'Medical and dental expenses, including insurance premiums',
      'Child care provider name, address, tax ID and amounts paid',
      'Form 1098-T tuition statement and 1098-E student loan interest',
      'Form 1095-A if you had Marketplace health insurance',
      'IRA, HSA and retirement plan contributions',
    ],
  },
  {
    title: 'Business owners',
    items: [
      'Profit and loss statement or income and expense summary',
      'Vehicle mileage log for business use',
      'Home office square footage and household expenses',
      'Asset purchases (equipment, vehicles, property) with dates and costs',
      'Payroll reports and 1099s issued to contractors',
    ],
  },
  {
    title: 'Payments made',
    items: [
      'Federal and Illinois estimated tax payments with dates',
      'Any IRS or state notices received during the year',
    ],
  },
];
