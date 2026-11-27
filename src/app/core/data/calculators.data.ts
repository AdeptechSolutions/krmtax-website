/**
 * Config-driven financial calculators. Each calculator declares its inputs
 * and a pure `compute` function, and a single generic component renders it.
 * Add a calculator by adding an entry here; no new component needed.
 */
import {
  BRACKETS,
  RMD_START_AGE,
  STANDARD_DEDUCTION,
  TAX_YEAR,
  UNIFORM_LIFETIME_TABLE,
} from './tax-year';

export type InputKind = 'currency' | 'percent' | 'number' | 'years' | 'select';
export type OutputFormat = 'currency' | 'percent' | 'number' | 'months' | 'text';

export interface CalcInput {
  key: string;
  label: string;
  kind: InputKind;
  value: number;
  options?: { label: string; value: number }[];
  hint?: string;
}

export interface CalcOutput {
  label: string;
  value: number | string;
  format: OutputFormat;
  primary?: boolean;
}

export type Values = Record<string, number>;

export interface Calculator {
  slug: string;
  title: string;
  category: CalcCategory;
  description: string;
  inputs: CalcInput[];
  compute: (v: Values) => CalcOutput[];
  note?: string;
}

export type CalcCategory =
  'Tax' | 'Retirement' | 'Personal Finance' | 'Business' | 'Home Ownership' | 'Loans & Vehicles';

export const CALC_CATEGORIES: CalcCategory[] = [
  'Tax',
  'Retirement',
  'Personal Finance',
  'Business',
  'Home Ownership',
  'Loans & Vehicles',
];

// ---------- helpers ----------
/** Monthly payment for an amortizing loan. */
export function payment(principal: number, annualRatePct: number, months: number): number {
  if (months <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

/** Future value of a starting balance plus monthly contributions. */
export function futureValue(
  start: number,
  monthly: number,
  annualRatePct: number,
  years: number,
): number {
  const r = annualRatePct / 100 / 12;
  const n = Math.round(years * 12);
  if (r === 0) return start + monthly * n;
  const g = Math.pow(1 + r, n);
  return start * g + monthly * ((g - 1) / r);
}

/** Months to pay off a balance with a fixed monthly payment; Infinity if never. */
export function monthsToPayoff(balance: number, annualRatePct: number, monthly: number): number {
  const r = annualRatePct / 100 / 12;
  if (balance <= 0) return 0;
  if (r === 0) return Math.ceil(balance / monthly);
  if (monthly <= balance * r) return Infinity;
  return Math.ceil(-Math.log(1 - (r * balance) / monthly) / Math.log(1 + r));
}

export function federalTax(taxable: number, status: number): { tax: number; marginal: number } {
  const brackets = BRACKETS[status] ?? BRACKETS[1];
  let tax = 0;
  let lower = 0;
  let marginal = brackets[0][1];
  for (const [upper, rate] of brackets) {
    if (taxable <= lower) break;
    tax += (Math.min(taxable, upper) - lower) * rate;
    marginal = rate;
    lower = upper;
  }
  return { tax, marginal };
}

const FILING_STATUS = [
  { label: 'Single', value: 1 },
  { label: 'Married filing jointly', value: 2 },
];

// ---------- calculators ----------
export const CALCULATORS: Calculator[] = [
  // Tax
  {
    slug: 'income-tax-estimator',
    title: 'Federal Income Tax Estimator',
    category: 'Tax',
    description: `Estimate your ${TAX_YEAR} federal income tax, effective rate and marginal bracket.`,
    inputs: [
      { key: 'status', label: 'Filing status', kind: 'select', value: 1, options: FILING_STATUS },
      { key: 'income', label: 'Total income', kind: 'currency', value: 85000 },
      { key: 'adjust', label: 'Pre-tax adjustments (401k, HSA...)', kind: 'currency', value: 6000 },
      {
        key: 'itemized',
        label: 'Itemized deductions',
        kind: 'currency',
        value: 0,
        hint: 'The larger of this or the standard deduction is used.',
      },
      { key: 'credits', label: 'Tax credits', kind: 'currency', value: 0 },
    ],
    compute: (v) => {
      const agi = Math.max(0, v['income'] - v['adjust']);
      const deduction = Math.max(
        STANDARD_DEDUCTION[v['status']] ?? STANDARD_DEDUCTION[1],
        v['itemized'],
      );
      const taxable = Math.max(0, agi - deduction);
      const { tax, marginal } = federalTax(taxable, v['status']);
      const owed = Math.max(0, tax - v['credits']);
      return [
        { label: 'Estimated federal tax', value: owed, format: 'currency', primary: true },
        { label: 'Taxable income', value: taxable, format: 'currency' },
        { label: 'Deduction used', value: deduction, format: 'currency' },
        {
          label: 'Effective rate',
          value: v['income'] > 0 ? (owed / v['income']) * 100 : 0,
          format: 'percent',
        },
        { label: 'Marginal bracket', value: marginal * 100, format: 'percent' },
      ];
    },
    note: `Tax year ${TAX_YEAR}: uses ${TAX_YEAR} federal brackets and standard deductions. Excludes AMT, self-employment tax and special situations.`,
  },
  {
    slug: 'taxable-vs-tax-advantaged',
    title: 'Taxable vs. Tax-Advantaged Investments',
    category: 'Tax',
    description: 'Compare growth in a taxable account against a tax-deferred account.',
    inputs: [
      { key: 'start', label: 'Starting amount', kind: 'currency', value: 10000 },
      { key: 'monthly', label: 'Monthly contribution', kind: 'currency', value: 300 },
      { key: 'rate', label: 'Annual return', kind: 'percent', value: 7 },
      { key: 'years', label: 'Years invested', kind: 'years', value: 25 },
      { key: 'tax', label: 'Tax rate on earnings', kind: 'percent', value: 24 },
    ],
    compute: (v) => {
      const deferred = futureValue(v['start'], v['monthly'], v['rate'], v['years']);
      const taxable = futureValue(
        v['start'],
        v['monthly'],
        v['rate'] * (1 - v['tax'] / 100),
        v['years'],
      );
      return [
        { label: 'Tax-advantaged balance', value: deferred, format: 'currency', primary: true },
        { label: 'Taxable account balance', value: taxable, format: 'currency' },
        { label: 'Difference', value: deferred - taxable, format: 'currency' },
      ];
    },
    note: 'Tax-advantaged balance is before any taxes due on withdrawal.',
  },
  // Retirement
  {
    slug: 'retirement-savings',
    title: 'Retirement Savings',
    category: 'Retirement',
    description: 'See how your retirement savings could grow by the time you retire.',
    inputs: [
      { key: 'age', label: 'Current age', kind: 'number', value: 40 },
      { key: 'retire', label: 'Retirement age', kind: 'number', value: 67 },
      { key: 'balance', label: 'Current savings', kind: 'currency', value: 75000 },
      { key: 'monthly', label: 'Monthly contribution', kind: 'currency', value: 800 },
      { key: 'rate', label: 'Annual return', kind: 'percent', value: 6 },
    ],
    compute: (v) => {
      const years = Math.max(0, v['retire'] - v['age']);
      const fv = futureValue(v['balance'], v['monthly'], v['rate'], years);
      const contributed = v['balance'] + v['monthly'] * 12 * years;
      return [
        { label: 'Projected balance at retirement', value: fv, format: 'currency', primary: true },
        { label: 'Total contributed', value: contributed, format: 'currency' },
        { label: 'Investment growth', value: fv - contributed, format: 'currency' },
        { label: 'Est. annual income (4% rule)', value: fv * 0.04, format: 'currency' },
      ];
    },
  },
  {
    slug: 'required-minimum-distribution',
    title: 'Required Minimum Distribution',
    category: 'Retirement',
    description: 'Estimate the RMD from your IRA or 401(k) for this year.',
    inputs: [
      { key: 'age', label: 'Your age at year-end', kind: 'number', value: 75 },
      {
        key: 'balance',
        label: 'Account balance on Dec 31 of last year',
        kind: 'currency',
        value: 500000,
      },
    ],
    compute: (v) => {
      const age = Math.round(v['age']);
      if (age < RMD_START_AGE) {
        return [
          {
            label: 'Required distribution',
            value: `Not yet required (RMDs start at ${RMD_START_AGE})`,
            format: 'text',
            primary: true,
          },
        ];
      }
      const period = UNIFORM_LIFETIME_TABLE[Math.min(age, 100)];
      return [
        {
          label: 'Required distribution',
          value: v['balance'] / period,
          format: 'currency',
          primary: true,
        },
        { label: 'Distribution period', value: period, format: 'number' },
      ];
    },
    note: 'Uses the IRS Uniform Lifetime Table. A different table applies if your spouse is more than 10 years younger and the sole beneficiary.',
  },
  // Personal finance
  {
    slug: 'net-worth',
    title: 'Net Worth',
    category: 'Personal Finance',
    description: 'Add up what you own and what you owe to see your net worth.',
    inputs: [
      { key: 'cash', label: 'Cash and savings', kind: 'currency', value: 20000 },
      { key: 'invest', label: 'Investments and retirement', kind: 'currency', value: 150000 },
      { key: 'home', label: 'Home and real estate value', kind: 'currency', value: 400000 },
      { key: 'other', label: 'Vehicles and other assets', kind: 'currency', value: 25000 },
      { key: 'mortgage', label: 'Mortgage balance', kind: 'currency', value: 250000 },
      { key: 'loans', label: 'Auto, student and other loans', kind: 'currency', value: 20000 },
      { key: 'cards', label: 'Credit card debt', kind: 'currency', value: 3000 },
    ],
    compute: (v) => {
      const assets = v['cash'] + v['invest'] + v['home'] + v['other'];
      const debts = v['mortgage'] + v['loans'] + v['cards'];
      return [
        { label: 'Net worth', value: assets - debts, format: 'currency', primary: true },
        { label: 'Total assets', value: assets, format: 'currency' },
        { label: 'Total liabilities', value: debts, format: 'currency' },
      ];
    },
  },
  {
    slug: 'credit-card-payoff',
    title: 'Credit Card Payoff',
    category: 'Personal Finance',
    description: 'Find out how long it takes to pay off a card and how much interest you pay.',
    inputs: [
      { key: 'balance', label: 'Card balance', kind: 'currency', value: 6000 },
      { key: 'rate', label: 'Interest rate (APR)', kind: 'percent', value: 22.9 },
      { key: 'monthly', label: 'Monthly payment', kind: 'currency', value: 250 },
    ],
    compute: (v) => {
      const n = monthsToPayoff(v['balance'], v['rate'], v['monthly']);
      if (!isFinite(n)) {
        return [
          {
            label: 'Months to pay off',
            value: 'Payment does not cover the interest',
            format: 'text',
            primary: true,
          },
        ];
      }
      const totalPaid = simulatePayoff(v['balance'], v['rate'], v['monthly']);
      return [
        { label: 'Months to pay off', value: n, format: 'months', primary: true },
        { label: 'Total interest paid', value: totalPaid - v['balance'], format: 'currency' },
        { label: 'Total paid', value: totalPaid, format: 'currency' },
      ];
    },
  },
  {
    slug: 'savings-goal',
    title: 'Savings Goal',
    category: 'Personal Finance',
    description: 'How much to save each month to reach a goal by a target date.',
    inputs: [
      { key: 'goal', label: 'Savings goal', kind: 'currency', value: 30000 },
      { key: 'start', label: 'Already saved', kind: 'currency', value: 2000 },
      { key: 'years', label: 'Years to reach goal', kind: 'years', value: 5 },
      { key: 'rate', label: 'Annual return', kind: 'percent', value: 4 },
    ],
    compute: (v) => {
      const r = v['rate'] / 100 / 12;
      const n = Math.max(1, Math.round(v['years'] * 12));
      const g = Math.pow(1 + r, n);
      const remaining = v['goal'] - v['start'] * g;
      const monthly = remaining <= 0 ? 0 : r === 0 ? remaining / n : (remaining * r) / (g - 1);
      return [
        { label: 'Monthly savings needed', value: monthly, format: 'currency', primary: true },
        { label: 'Total you contribute', value: monthly * n, format: 'currency' },
      ];
    },
  },
  // Business
  {
    slug: 'breakeven-analysis',
    title: 'Breakeven Analysis',
    category: 'Business',
    description: 'Find how many units you need to sell to cover your costs.',
    inputs: [
      { key: 'fixed', label: 'Monthly fixed costs', kind: 'currency', value: 15000 },
      { key: 'price', label: 'Price per unit', kind: 'currency', value: 50 },
      { key: 'variable', label: 'Variable cost per unit', kind: 'currency', value: 30 },
    ],
    compute: (v) => {
      const margin = v['price'] - v['variable'];
      if (margin <= 0) {
        return [
          {
            label: 'Breakeven units',
            value: 'Price must exceed variable cost',
            format: 'text',
            primary: true,
          },
        ];
      }
      const units = Math.ceil(v['fixed'] / margin);
      return [
        { label: 'Breakeven units per month', value: units, format: 'number', primary: true },
        { label: 'Breakeven revenue', value: units * v['price'], format: 'currency' },
        { label: 'Contribution margin', value: (margin / v['price']) * 100, format: 'percent' },
      ];
    },
  },
  {
    slug: 'financial-ratios',
    title: 'Financial Ratios',
    category: 'Business',
    description: 'Key liquidity, leverage and profitability ratios from your financial statements.',
    inputs: [
      { key: 'ca', label: 'Current assets', kind: 'currency', value: 120000 },
      { key: 'inv', label: 'Inventory', kind: 'currency', value: 40000 },
      { key: 'cl', label: 'Current liabilities', kind: 'currency', value: 60000 },
      { key: 'tl', label: 'Total liabilities', kind: 'currency', value: 150000 },
      { key: 'eq', label: "Owner's equity", kind: 'currency', value: 200000 },
      { key: 'rev', label: 'Annual revenue', kind: 'currency', value: 600000 },
      { key: 'ni', label: 'Net income', kind: 'currency', value: 54000 },
    ],
    compute: (v) => [
      {
        label: 'Current ratio',
        value: v['cl'] ? v['ca'] / v['cl'] : 0,
        format: 'number',
        primary: true,
      },
      {
        label: 'Quick ratio',
        value: v['cl'] ? (v['ca'] - v['inv']) / v['cl'] : 0,
        format: 'number',
      },
      { label: 'Debt to equity', value: v['eq'] ? v['tl'] / v['eq'] : 0, format: 'number' },
      {
        label: 'Net profit margin',
        value: v['rev'] ? (v['ni'] / v['rev']) * 100 : 0,
        format: 'percent',
      },
      {
        label: 'Return on equity',
        value: v['eq'] ? (v['ni'] / v['eq']) * 100 : 0,
        format: 'percent',
      },
    ],
  },
  {
    slug: 'working-capital',
    title: 'Working Capital Needs',
    category: 'Business',
    description: 'Estimate the cash tied up in receivables and inventory, less payables.',
    inputs: [
      { key: 'sales', label: 'Annual sales', kind: 'currency', value: 900000 },
      { key: 'cogs', label: 'Annual cost of goods sold', kind: 'currency', value: 540000 },
      { key: 'dso', label: 'Days to collect receivables', kind: 'number', value: 45 },
      { key: 'dio', label: 'Days inventory on hand', kind: 'number', value: 60 },
      { key: 'dpo', label: 'Days to pay suppliers', kind: 'number', value: 30 },
    ],
    compute: (v) => {
      const ar = (v['sales'] / 365) * v['dso'];
      const inv = (v['cogs'] / 365) * v['dio'];
      const ap = (v['cogs'] / 365) * v['dpo'];
      return [
        {
          label: 'Working capital needed',
          value: ar + inv - ap,
          format: 'currency',
          primary: true,
        },
        {
          label: 'Cash conversion cycle (days)',
          value: v['dso'] + v['dio'] - v['dpo'],
          format: 'number',
        },
        { label: 'Receivables', value: ar, format: 'currency' },
        { label: 'Inventory', value: inv, format: 'currency' },
        { label: 'Payables', value: ap, format: 'currency' },
      ];
    },
  },
  // Home
  {
    slug: 'mortgage-payment',
    title: 'Mortgage Payment (PITI)',
    category: 'Home Ownership',
    description: 'Monthly principal, interest, taxes and insurance on a home loan.',
    inputs: [
      { key: 'price', label: 'Home price', kind: 'currency', value: 425000 },
      { key: 'down', label: 'Down payment', kind: 'currency', value: 85000 },
      { key: 'rate', label: 'Interest rate', kind: 'percent', value: 6.25 },
      {
        key: 'years',
        label: 'Loan term',
        kind: 'select',
        value: 30,
        options: [
          { label: '30 years', value: 30 },
          { label: '20 years', value: 20 },
          { label: '15 years', value: 15 },
        ],
      },
      { key: 'tax', label: 'Annual property tax', kind: 'currency', value: 9500 },
      { key: 'ins', label: 'Annual home insurance', kind: 'currency', value: 1800 },
    ],
    compute: (v) => {
      const loan = Math.max(0, v['price'] - v['down']);
      const pi = payment(loan, v['rate'], v['years'] * 12);
      const ti = (v['tax'] + v['ins']) / 12;
      return [
        { label: 'Total monthly payment', value: pi + ti, format: 'currency', primary: true },
        { label: 'Principal and interest', value: pi, format: 'currency' },
        { label: 'Taxes and insurance', value: ti, format: 'currency' },
        { label: 'Loan amount', value: loan, format: 'currency' },
        {
          label: 'Total interest over loan',
          value: pi * v['years'] * 12 - loan,
          format: 'currency',
        },
      ];
    },
  },
  {
    slug: 'mortgage-15-vs-30',
    title: 'Mortgage Comparison: 15 vs. 30 Years',
    category: 'Home Ownership',
    description: 'Compare payments and total interest on 15- and 30-year loans.',
    inputs: [
      { key: 'loan', label: 'Loan amount', kind: 'currency', value: 340000 },
      { key: 'r15', label: '15-year rate', kind: 'percent', value: 5.5 },
      { key: 'r30', label: '30-year rate', kind: 'percent', value: 6.25 },
    ],
    compute: (v) => {
      const p15 = payment(v['loan'], v['r15'], 180);
      const p30 = payment(v['loan'], v['r30'], 360);
      const i15 = p15 * 180 - v['loan'];
      const i30 = p30 * 360 - v['loan'];
      return [
        {
          label: 'Interest saved with 15 years',
          value: i30 - i15,
          format: 'currency',
          primary: true,
        },
        { label: '15-year monthly payment', value: p15, format: 'currency' },
        { label: '30-year monthly payment', value: p30, format: 'currency' },
        { label: '15-year total interest', value: i15, format: 'currency' },
        { label: '30-year total interest', value: i30, format: 'currency' },
      ];
    },
  },
  {
    slug: 'refinance-breakeven',
    title: 'Refinance Breakeven',
    category: 'Home Ownership',
    description: 'How long it takes for a refinance to pay for its closing costs.',
    inputs: [
      { key: 'balance', label: 'Current loan balance', kind: 'currency', value: 300000 },
      { key: 'current', label: 'Current monthly P&I payment', kind: 'currency', value: 2150 },
      { key: 'rate', label: 'New interest rate', kind: 'percent', value: 5.75 },
      { key: 'years', label: 'New loan term (years)', kind: 'years', value: 30 },
      { key: 'costs', label: 'Closing costs', kind: 'currency', value: 6000 },
    ],
    compute: (v) => {
      const next = payment(v['balance'], v['rate'], v['years'] * 12);
      const saving = v['current'] - next;
      return [
        {
          label: 'Months to break even',
          value: saving > 0 ? Math.ceil(v['costs'] / saving) : 'No monthly savings',
          format: saving > 0 ? 'months' : 'text',
          primary: true,
        },
        { label: 'New monthly payment', value: next, format: 'currency' },
        { label: 'Monthly savings', value: saving, format: 'currency' },
      ];
    },
  },
  {
    slug: 'rent-vs-buy',
    title: 'Rent versus Buy',
    category: 'Home Ownership',
    description: 'Compare the monthly cost of renting with owning a home.',
    inputs: [
      { key: 'rent', label: 'Monthly rent', kind: 'currency', value: 2400 },
      { key: 'price', label: 'Home price', kind: 'currency', value: 400000 },
      { key: 'down', label: 'Down payment', kind: 'currency', value: 80000 },
      { key: 'rate', label: 'Mortgage rate', kind: 'percent', value: 6.25 },
      { key: 'costs', label: 'Annual tax, insurance and upkeep', kind: 'currency', value: 14000 },
    ],
    compute: (v) => {
      const loan = Math.max(0, v['price'] - v['down']);
      const pi = payment(loan, v['rate'], 360);
      const own = pi + v['costs'] / 12;
      const firstYearInterest = loan * (v['rate'] / 100);
      const principalYear1 = pi * 12 - firstYearInterest;
      return [
        { label: 'Monthly cost of owning', value: own, format: 'currency', primary: true },
        { label: 'Monthly rent', value: v['rent'], format: 'currency' },
        { label: 'Difference per month', value: own - v['rent'], format: 'currency' },
        { label: 'Approx. equity built in year 1', value: principalYear1, format: 'currency' },
      ];
    },
    note: 'A simplified comparison. Excludes appreciation, tax benefits and the return you could earn on your down payment.',
  },
  // Loans & vehicles
  {
    slug: 'loan-payment',
    title: 'Amortizing Loan',
    category: 'Loans & Vehicles',
    description: 'Monthly payment and total interest for any fixed-rate loan.',
    inputs: [
      { key: 'amount', label: 'Loan amount', kind: 'currency', value: 25000 },
      { key: 'rate', label: 'Interest rate', kind: 'percent', value: 8 },
      { key: 'years', label: 'Term (years)', kind: 'years', value: 5 },
    ],
    compute: (v) => {
      const n = v['years'] * 12;
      const p = payment(v['amount'], v['rate'], n);
      return [
        { label: 'Monthly payment', value: p, format: 'currency', primary: true },
        { label: 'Total interest', value: p * n - v['amount'], format: 'currency' },
        { label: 'Total of payments', value: p * n, format: 'currency' },
      ];
    },
  },
  {
    slug: 'auto-loan',
    title: 'Auto Loan',
    category: 'Loans & Vehicles',
    description: 'Monthly payment on a vehicle after trade-in, down payment and sales tax.',
    inputs: [
      { key: 'price', label: 'Vehicle price', kind: 'currency', value: 38000 },
      { key: 'down', label: 'Down payment', kind: 'currency', value: 4000 },
      { key: 'trade', label: 'Trade-in value', kind: 'currency', value: 6000 },
      { key: 'tax', label: 'Sales tax rate', kind: 'percent', value: 8.25 },
      { key: 'rate', label: 'Interest rate', kind: 'percent', value: 6.9 },
      {
        key: 'months',
        label: 'Term',
        kind: 'select',
        value: 60,
        options: [
          { label: '36 months', value: 36 },
          { label: '48 months', value: 48 },
          { label: '60 months', value: 60 },
          { label: '72 months', value: 72 },
          { label: '84 months', value: 84 },
        ],
      },
    ],
    compute: (v) => {
      const taxed = (v['price'] - v['trade']) * (1 + v['tax'] / 100);
      const loan = Math.max(0, taxed - v['down']);
      const p = payment(loan, v['rate'], v['months']);
      return [
        { label: 'Monthly payment', value: p, format: 'currency', primary: true },
        { label: 'Amount financed', value: loan, format: 'currency' },
        { label: 'Total interest', value: p * v['months'] - loan, format: 'currency' },
      ];
    },
  },
  {
    slug: 'rebate-vs-low-rate',
    title: 'Auto Rebate or Low-Interest Financing',
    category: 'Loans & Vehicles',
    description: 'Should you take the cash rebate or the dealer’s low financing rate?',
    inputs: [
      { key: 'price', label: 'Vehicle price', kind: 'currency', value: 40000 },
      { key: 'rebate', label: 'Cash rebate', kind: 'currency', value: 3000 },
      { key: 'low', label: 'Dealer promo rate', kind: 'percent', value: 1.9 },
      { key: 'bank', label: 'Your bank or credit union rate', kind: 'percent', value: 6.5 },
      { key: 'months', label: 'Term (months)', kind: 'number', value: 60 },
    ],
    compute: (v) => {
      const promo = payment(v['price'], v['low'], v['months']);
      const rebate = payment(v['price'] - v['rebate'], v['bank'], v['months']);
      const diff = (rebate - promo) * v['months'];
      return [
        {
          label: 'Better choice',
          value: diff > 0 ? 'Low-interest financing' : 'Take the rebate',
          format: 'text',
          primary: true,
        },
        { label: 'Payment with promo rate', value: promo, format: 'currency' },
        { label: 'Payment with rebate', value: rebate, format: 'currency' },
        { label: 'Total savings of better option', value: Math.abs(diff), format: 'currency' },
      ];
    },
  },
];

function simulatePayoff(balance: number, ratePct: number, monthly: number): number {
  const r = ratePct / 100 / 12;
  let b = balance;
  let paid = 0;
  for (let i = 0; i < 1200 && b > 0.005; i++) {
    b += b * r;
    const pay = Math.min(monthly, b);
    b -= pay;
    paid += pay;
  }
  return paid;
}

export function findCalculator(slug: string): Calculator | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}
