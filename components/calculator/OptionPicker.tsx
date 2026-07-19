'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ServiceCategory, SizeCode } from '@/data/services';
import { groupOptionsByLabel } from '@/lib/estimate';
import { formatDuration, formatPrice } from '@/lib/format';
import { LengthPicker } from './LengthPicker';

interface OptionPickerProps {
  category: ServiceCategory;
  onAdd: (optionId: string) => void;
}

export function OptionPicker({ category, onAdd }: OptionPickerProps) {
  const groups = useMemo(
    () => groupOptionsByLabel(category.options),
    [category],
  );
  const [groupLabel, setGroupLabel] = useState<string | null>(null);
  const [size, setSize] = useState<SizeCode | null>(null);

  // Reset selection whenever the category changes.
  useEffect(() => {
    setGroupLabel(null);
    setSize(null);
  }, [category.id]);

  const group = groups.find((g) => g.label === groupLabel) ?? null;
  const selectedOption = group
    ? group.isSizeAware
      ? group.options.find((o) => o.size === size) ?? null
      : group.options[0]
    : null;

  const sizes = group?.isSizeAware
    ? (group.options.map((o) => o.size).filter(Boolean) as SizeCode[])
    : [];

  return (
    <div className="space-y-8">
      <p className="max-w-xl text-cream/60">{category.blurb}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        {groups.map((g) => {
          const selected = g.label === groupLabel;
          const cheapest = Math.min(...g.options.map((o) => o.priceFrom));
          return (
            <button
              key={g.label}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                setGroupLabel(g.label);
                setSize(null);
              }}
              className={`flex items-baseline justify-between border p-5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                selected
                  ? 'border-gold bg-gold/10'
                  : 'border-cream/15 hover:border-cream/40'
              }`}
            >
              <span className="font-display text-xl">{g.label}</span>
              <span className="ml-4 shrink-0 text-sm text-gold">
                from {formatPrice(cheapest)}
              </span>
            </button>
          );
        })}
      </div>

      {group?.isSizeAware && (
        <LengthPicker sizes={sizes} value={size} onChange={setSize} />
      )}

      <div className="flex flex-wrap items-center gap-6">
        <button
          type="button"
          disabled={!selectedOption}
          onClick={() => selectedOption && onAdd(selectedOption.id)}
          className="border border-gold px-8 py-3 text-sm uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-not-allowed disabled:border-cream/20 disabled:text-cream/30 disabled:hover:bg-transparent"
        >
          Add to estimate
        </button>
        {selectedOption && (
          <p className="text-sm text-cream/60">
            from {formatPrice(selectedOption.priceFrom)} ·{' '}
            {formatDuration(selectedOption.durationMin)}
          </p>
        )}
        {group?.isSizeAware && !size && (
          <p className="text-sm text-cream/40">Select a hair length to continue.</p>
        )}
      </div>
    </div>
  );
}
