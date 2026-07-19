import { describe, expect, it } from 'vitest';
import { formatDuration, formatPrice } from '@/lib/format';

describe('formatDuration', () => {
  it('formats minutes under an hour', () => {
    expect(formatDuration(30)).toBe('30 min');
  });

  it('formats a whole hour without a minutes part', () => {
    expect(formatDuration(60)).toBe('1 hr');
  });

  it('formats hours and minutes', () => {
    expect(formatDuration(150)).toBe('2 hr 30 min');
  });

  it('formats multiple whole hours', () => {
    expect(formatDuration(240)).toBe('4 hr');
  });

  it('formats zero as a dash rather than "0 min"', () => {
    expect(formatDuration(0)).toBe('—');
  });
});

describe('formatPrice', () => {
  it('prefixes RM with no decimals', () => {
    expect(formatPrice(410)).toBe('RM 410');
  });

  it('adds thousands separators', () => {
    expect(formatPrice(1250)).toBe('RM 1,250');
  });
});
