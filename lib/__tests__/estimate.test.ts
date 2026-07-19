import { describe, expect, it } from 'vitest';
import {
  buildWhatsAppUrl,
  calculateEstimate,
  findOption,
  groupOptionsByLabel,
  optionDisplayName,
} from '@/lib/estimate';
import { serviceCategories } from '@/data/services';

const coloring = serviceCategories.find((c) => c.id === 'coloring')!;
const haircut = serviceCategories.find((c) => c.id === 'haircut')!;
const perming = serviceCategories.find((c) => c.id === 'perming')!;

describe('findOption', () => {
  it('finds a known option', () => {
    expect(findOption('coloring-single-tone-m')?.priceFrom).toBe(250);
  });

  it('returns undefined for an unknown id', () => {
    expect(findOption('does-not-exist')).toBeUndefined();
  });
});

describe('optionDisplayName', () => {
  it('appends the size name when sized', () => {
    expect(optionDisplayName(findOption('coloring-single-tone-m')!)).toBe(
      'Single Tone Color (Medium)',
    );
  });

  it('returns the bare label when unsized', () => {
    expect(optionDisplayName(findOption('haircut-female')!)).toBe('Female Haircut');
  });
});

describe('groupOptionsByLabel', () => {
  it('splits coloring into an unsized and a sized group', () => {
    const groups = groupOptionsByLabel(coloring.options);
    expect(groups).toHaveLength(2);
    expect(groups[0]).toMatchObject({ label: 'Root-Touch', isSizeAware: false });
    expect(groups[1]).toMatchObject({ label: 'Single Tone Color', isSizeAware: true });
    expect(groups[1].options).toHaveLength(5);
  });

  it('treats each distinct haircut label as its own single-option group', () => {
    const groups = groupOptionsByLabel(haircut.options);
    expect(groups).toHaveLength(5);
    expect(groups.every((g) => !g.isSizeAware)).toBe(true);
  });

  it('preserves size order within a group', () => {
    const groups = groupOptionsByLabel(coloring.options);
    expect(groups[1].options.map((o) => o.size)).toEqual(['ES', 'S', 'M', 'L', 'EL']);
  });

  it('handles partial size sets without inventing missing sizes', () => {
    const groups = groupOptionsByLabel(perming.options);
    const digital = groups.find((g) => g.label === 'Digital Perm')!;
    expect(digital.options.map((o) => o.size)).toEqual(['S', 'M', 'L', 'EL']);
  });

  it('preserves the source order of groups', () => {
    const groups = groupOptionsByLabel(perming.options);
    expect(groups.map((g) => g.label)).toEqual(['Cold Perm', 'Digital Perm']);
  });
});

describe('calculateEstimate', () => {
  it('returns zeroes for an empty cart', () => {
    expect(calculateEstimate([])).toEqual({ priceFrom: 0, durationMin: 0, itemCount: 0 });
  });

  it('totals the spec example: colour (M) plus intensive scalp', () => {
    const result = calculateEstimate([
      { optionId: 'coloring-single-tone-m', qty: 1 },
      { optionId: 'treatment-intensive-scalp', qty: 1 },
    ]);
    expect(result.priceFrom).toBe(410);
    expect(result.durationMin).toBe(180);
    expect(result.itemCount).toBe(2);
  });

  it('multiplies by quantity', () => {
    const result = calculateEstimate([{ optionId: 'haircut-kid-junior', qty: 3 }]);
    expect(result.priceFrom).toBe(90);
    expect(result.durationMin).toBe(90);
    expect(result.itemCount).toBe(3);
  });

  it('skips unknown option ids instead of throwing', () => {
    const result = calculateEstimate([
      { optionId: 'coloring-single-tone-m', qty: 1 },
      { optionId: 'ghost-option', qty: 2 },
    ]);
    expect(result.priceFrom).toBe(250);
    expect(result.itemCount).toBe(1);
  });

  it('ignores non-positive quantities', () => {
    const result = calculateEstimate([{ optionId: 'haircut-female', qty: 0 }]);
    expect(result).toEqual({ priceFrom: 0, durationMin: 0, itemCount: 0 });
  });
});

describe('buildWhatsAppUrl', () => {
  it('uses the corrected 12-digit number', () => {
    const url = buildWhatsAppUrl([{ optionId: 'haircut-female', qty: 1 }]);
    expect(url.startsWith('https://wa.me/601172267229?text=')).toBe(true);
  });

  it('encodes every selected service and the total', () => {
    const url = buildWhatsAppUrl([
      { optionId: 'coloring-single-tone-m', qty: 1 },
      { optionId: 'treatment-intensive-scalp', qty: 1 },
    ]);
    const text = decodeURIComponent(url.split('?text=')[1]);
    expect(text).toContain('Single Tone Color (Medium)');
    expect(text).toContain('Intensive Scalp Treatment');
    expect(text).toContain('RM 410');
  });

  it('shows quantity only when greater than one', () => {
    const url = buildWhatsAppUrl([{ optionId: 'haircut-kid-junior', qty: 2 }]);
    const text = decodeURIComponent(url.split('?text=')[1]);
    expect(text).toContain('× 2');
  });

  it('truncates very long carts to keep the URL valid', () => {
    const lines = Array.from({ length: 40 }, () => ({
      optionId: 'coloring-single-tone-el',
      qty: 9,
    }));
    const url = buildWhatsAppUrl(lines);
    expect(url.length).toBeLessThan(2000);
  });
});
