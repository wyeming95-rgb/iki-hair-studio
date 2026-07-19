import { describe, expect, it } from 'vitest';
import { allOptions, serviceCategories, SIZE_ORDER } from '@/data/services';

describe('service data', () => {
  it('has six categories', () => {
    expect(serviceCategories).toHaveLength(6);
  });

  it('has 33 options total', () => {
    expect(allOptions).toHaveLength(33);
  });

  it('has the option count per category from the spec', () => {
    const counts = Object.fromEntries(
      serviceCategories.map((c) => [c.id, c.options.length]),
    );
    expect(counts).toEqual({
      haircut: 5,
      styling: 2,
      coloring: 6,
      perming: 9,
      straightening: 4,
      treatment: 7,
    });
  });

  it('has unique option ids', () => {
    const ids = allOptions.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has positive prices and durations', () => {
    for (const o of allOptions) {
      expect(o.priceFrom, o.id).toBeGreaterThan(0);
      expect(o.durationMin, o.id).toBeGreaterThan(0);
    }
  });

  it('uses only valid size codes', () => {
    for (const o of allOptions) {
      if (o.size !== undefined) expect(SIZE_ORDER, o.id).toContain(o.size);
    }
  });

  it('prices size variants in ascending length order', () => {
    const byLabel = new Map<string, typeof allOptions>();
    for (const o of allOptions) {
      if (!o.size) continue;
      byLabel.set(o.label, [...(byLabel.get(o.label) ?? []), o]);
    }
    for (const [label, opts] of byLabel) {
      const sorted = [...opts].sort(
        (a, b) => SIZE_ORDER.indexOf(a.size!) - SIZE_ORDER.indexOf(b.size!),
      );
      const prices = sorted.map((o) => o.priceFrom);
      expect([...prices].sort((a, b) => a - b), label).toEqual(prices);
    }
  });

  it('spot-checks known prices from the spec', () => {
    const find = (id: string) => allOptions.find((o) => o.id === id);
    expect(find('haircut-female')?.priceFrom).toBe(70);
    expect(find('coloring-single-tone-m')?.priceFrom).toBe(250);
    expect(find('coloring-single-tone-m')?.durationMin).toBe(120);
    expect(find('perming-digital-el')?.priceFrom).toBe(400);
    expect(find('treatment-intensive-scalp')?.priceFrom).toBe(160);
    expect(find('treatment-intensive-scalp')?.durationMin).toBe(60);
  });
});
