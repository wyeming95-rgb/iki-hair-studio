import { describe, expect, it } from 'vitest';
import { allOptions, serviceCategories, SIZE_ORDER } from '@/data/services';
import { groupOptionsByLabel } from '@/lib/estimate';

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

  // Independently transcribed from PROJECT.md section 7 ("Price Calculator —
  // Full Service & Pricing Data"), without reading data/services.ts prices or
  // durations. Durations converted from human text to minutes (1 hr 30 min = 90, etc).
  it('matches the full price and duration table from PROJECT.md section 7', () => {
    const expected: Record<string, { priceFrom: number; durationMin: number }> = {
      // Haircut Service
      'haircut-kid-junior': { priceFrom: 30, durationMin: 30 },
      'haircut-male-teen': { priceFrom: 40, durationMin: 30 },
      'haircut-female-teen': { priceFrom: 50, durationMin: 30 },
      'haircut-male': { priceFrom: 60, durationMin: 60 },
      'haircut-female': { priceFrom: 70, durationMin: 60 },

      // Hair Styling Service
      'styling-wash-blow-s': { priceFrom: 40, durationMin: 60 },
      'styling-wash-blow-l': { priceFrom: 50, durationMin: 60 },

      // Coloring Service
      'coloring-root-touch': { priceFrom: 150, durationMin: 90 },
      'coloring-single-tone-es': { priceFrom: 170, durationMin: 120 },
      'coloring-single-tone-s': { priceFrom: 200, durationMin: 120 },
      'coloring-single-tone-m': { priceFrom: 250, durationMin: 120 },
      'coloring-single-tone-l': { priceFrom: 300, durationMin: 120 },
      'coloring-single-tone-el': { priceFrom: 350, durationMin: 120 },

      // Perming Service
      'perming-cold-es': { priceFrom: 150, durationMin: 120 },
      'perming-cold-s': { priceFrom: 180, durationMin: 120 },
      'perming-cold-m': { priceFrom: 210, durationMin: 120 },
      'perming-cold-l': { priceFrom: 250, durationMin: 150 },
      'perming-cold-el': { priceFrom: 280, durationMin: 120 },
      'perming-digital-s': { priceFrom: 270, durationMin: 240 },
      'perming-digital-m': { priceFrom: 300, durationMin: 240 },
      'perming-digital-l': { priceFrom: 350, durationMin: 240 },
      'perming-digital-el': { priceFrom: 400, durationMin: 240 },

      // Straightening Service
      'straightening-s': { priceFrom: 260, durationMin: 240 },
      'straightening-m': { priceFrom: 300, durationMin: 240 },
      'straightening-l': { priceFrom: 350, durationMin: 240 },
      'straightening-el': { priceFrom: 400, durationMin: 240 },

      // In-Salon Treatment
      'treatment-intensive-scalp': { priceFrom: 160, durationMin: 60 },
      'treatment-promaster-s': { priceFrom: 180, durationMin: 90 },
      'treatment-promaster-m': { priceFrom: 210, durationMin: 90 },
      'treatment-promaster-l': { priceFrom: 240, durationMin: 90 },
      'treatment-iau-s': { priceFrom: 200, durationMin: 120 },
      'treatment-iau-m': { priceFrom: 230, durationMin: 120 },
      'treatment-iau-l': { priceFrom: 260, durationMin: 120 },
    };

    expect(Object.keys(expected)).toHaveLength(33);

    const byId = new Map(allOptions.map((o) => [o.id, o]));
    expect(byId.size, 'no duplicate ids in allOptions').toBe(allOptions.length);

    for (const [id, exp] of Object.entries(expected)) {
      const actual = byId.get(id);
      expect(actual, `expected option "${id}" to exist`).toBeDefined();
      expect(actual!.priceFrom, `${id} priceFrom`).toBe(exp.priceFrom);
      expect(actual!.durationMin, `${id} durationMin`).toBe(exp.durationMin);
    }

    // Every actual option must be accounted for in the expected table (no extras).
    for (const o of allOptions) {
      expect(expected[o.id], `unexpected option not in PROJECT.md table: ${o.id}`).toBeDefined();
    }
  });

  it('has no non-size-aware group with more than one option', () => {
    for (const cat of serviceCategories) {
      for (const g of groupOptionsByLabel(cat.options)) {
        if (!g.isSizeAware) expect(g.options, g.label).toHaveLength(1);
      }
    }
  });
});
