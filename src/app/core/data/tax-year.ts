/**
 * ============================================================
 *  YEARLY TAX FIGURES — UPDATE EVERY NOVEMBER
 * ============================================================
 * Everything on the site that changes with the tax year lives in this one
 * file: the income tax calculator, the RMD calculator and the Tax Deadlines
 * page all read from here.
 *
 * How to update (about 10 minutes):
 *  1. When the IRS announces next year's inflation adjustments (usually
 *     late October / November, "Revenue Procedure 20XX-XX"), update
 *     TAX_YEAR, BRACKETS and STANDARD_DEDUCTION below.
 *     Source: https://www.irs.gov/newsroom (search "tax inflation adjustments")
 *  2. Replace FILING_DEADLINES with next filing season's dates.
 *     Source: https://www.irs.gov/filing/individuals/when-to-file
 *  3. Update LAST_REVIEWED, commit to main. The site redeploys automatically.
 *
 * A GitHub reminder opens a to-do for this every November 15
 * (.github/workflows/yearly-reminder.yml). See TODO.md.
 */

/** Tax year the calculators use. */
export const TAX_YEAR = 2026;

/** When a person last checked these figures against IRS sources. */
export const LAST_REVIEWED =
  '2026-11-27 (initial build, needs check against IRS Rev. Proc. 2025-32)';

/**
 * Federal income tax brackets by filing status (1 = single, 2 = married filing jointly).
 * Each entry is [upper limit of bracket, rate].
 */
export const BRACKETS: Record<number, [number, number][]> = {
  // [upper limit of bracket, rate]
  1: [
    [12400, 0.1],
    [50400, 0.12],
    [105700, 0.22],
    [201775, 0.24],
    [256225, 0.32],
    [640600, 0.35],
    [Infinity, 0.37],
  ],
  2: [
    [24800, 0.1],
    [100800, 0.12],
    [211400, 0.22],
    [403550, 0.24],
    [512450, 0.32],
    [768700, 0.35],
    [Infinity, 0.37],
  ],
};
export const STANDARD_DEDUCTION: Record<number, number> = { 1: 16100, 2: 32200 };

/** Age when required minimum distributions begin (SECURE 2.0: 73 through 2032, 75 from 2033). */
export const RMD_START_AGE = 73;

/** IRS Uniform Lifetime Table (in effect since 2022). Rarely changes. */
export const UNIFORM_LIFETIME_TABLE: Record<number, number> = {
  73: 26.5,
  74: 25.5,
  75: 24.6,
  76: 23.7,
  77: 22.9,
  78: 22.0,
  79: 21.1,
  80: 20.2,
  81: 19.4,
  82: 18.5,
  83: 17.7,
  84: 16.8,
  85: 16.0,
  86: 15.2,
  87: 14.4,
  88: 13.7,
  89: 12.9,
  90: 12.2,
  91: 11.5,
  92: 10.8,
  93: 10.1,
  94: 9.5,
  95: 8.9,
  96: 8.4,
  97: 7.8,
  98: 7.3,
  99: 6.8,
  100: 6.4,
};

export interface Deadline {
  date: string; // ISO yyyy-mm-dd
  title: string;
  who: 'Individuals' | 'Businesses' | 'Employers' | 'Everyone';
  detail: string;
}

/** Filing season for TAX_YEAR returns. Dates already account for weekends. */
export const FILING_SEASON = TAX_YEAR + 1;
export const FILING_DEADLINES: Deadline[] = [
  {
    date: '2027-01-15',
    title: '4th quarter 2026 estimated tax due',
    who: 'Individuals',
    detail: 'Final 2026 estimated payment (Form 1040-ES).',
  },
  {
    date: '2027-02-01',
    title: 'W-2 and 1099-NEC due',
    who: 'Employers',
    detail: 'Furnish to workers and file with SSA / IRS. Also Q4 Form 941.',
  },
  {
    date: '2027-03-15',
    title: 'Partnership and S corporation returns due',
    who: 'Businesses',
    detail: 'Forms 1065 and 1120-S, or file an extension (Form 7004).',
  },
  {
    date: '2027-04-15',
    title: 'Individual returns due',
    who: 'Individuals',
    detail:
      'Forms 1040 and IL-1040, or file an extension (Form 4868). Payment due even if extended.',
  },
  {
    date: '2027-04-15',
    title: 'C corporation returns due',
    who: 'Businesses',
    detail: 'Form 1120 for calendar-year corporations.',
  },
  {
    date: '2027-04-15',
    title: '1st quarter 2027 estimated tax due',
    who: 'Everyone',
    detail: 'First estimated payment for 2027.',
  },
  {
    date: '2027-04-30',
    title: 'Q1 payroll returns due',
    who: 'Employers',
    detail: 'Form 941 and Illinois IL-941.',
  },
  {
    date: '2027-06-15',
    title: '2nd quarter estimated tax due',
    who: 'Everyone',
    detail: 'Second estimated payment for 2027.',
  },
  {
    date: '2027-08-02',
    title: 'Q2 payroll returns due',
    who: 'Employers',
    detail: 'Form 941 and Illinois IL-941.',
  },
  {
    date: '2027-09-15',
    title: 'Extended partnership and S corp returns due',
    who: 'Businesses',
    detail: 'Also the 3rd quarter estimated tax payment.',
  },
  {
    date: '2027-10-15',
    title: 'Extended individual and C corp returns due',
    who: 'Individuals',
    detail: 'Final deadline for returns on extension.',
  },
  {
    date: '2027-11-01',
    title: 'Q3 payroll returns due',
    who: 'Employers',
    detail: 'Form 941 and Illinois IL-941.',
  },
];
