import {
  CALCULATORS,
  federalTax,
  findCalculator,
  monthsToPayoff,
  payment,
} from './calculators.data';

describe('calculator math', () => {
  it('computes a standard amortized payment', () => {
    // $200k, 6%, 30 years => $1,199.10
    expect(payment(200000, 6, 360)).toBeCloseTo(1199.1, 1);
  });

  it('handles zero interest', () => {
    expect(payment(12000, 0, 12)).toBe(1000);
  });

  it('reports never paying off when payment <= interest', () => {
    expect(monthsToPayoff(10000, 24, 100)).toBe(Infinity);
  });

  it('applies progressive brackets', () => {
    const { tax, marginal } = federalTax(50000, 1);
    expect(tax).toBeCloseTo(12400 * 0.1 + (50000 - 12400) * 0.12, 2);
    expect(marginal).toBe(0.12);
  });

  it('every calculator computes with its default inputs', () => {
    for (const c of CALCULATORS) {
      const values = Object.fromEntries(c.inputs.map((i) => [i.key, i.value]));
      const out = c.compute(values);
      expect(out.length, c.slug).toBeGreaterThan(0);
      expect(
        out.some((o) => o.primary),
        c.slug,
      ).toBe(true);
      for (const o of out) {
        if (typeof o.value === 'number')
          expect(Number.isFinite(o.value), `${c.slug}: ${o.label}`).toBe(true);
      }
    }
  });

  it('has unique slugs', () => {
    const slugs = CALCULATORS.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(findCalculator('mortgage-payment')).toBeDefined();
  });
});
