'use client';

import type { CartLine } from '@/data/services';
import { findOption, optionDisplayName } from '@/lib/estimate';
import { formatDuration, formatPrice } from '@/lib/format';

interface EstimateCartProps {
  lines: CartLine[];
  onChangeQty: (optionId: string, qty: number) => void;
  onRemove: (optionId: string) => void;
}

export function EstimateCart({ lines, onChangeQty, onRemove }: EstimateCartProps) {
  if (lines.length === 0) {
    return (
      <p className="text-sm text-cream/40">
        Nothing selected yet. Add a service to build your estimate.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-cream/10">
      {lines.map((line) => {
        const option = findOption(line.optionId);
        if (!option) return null;
        return (
          <li key={line.optionId} className="flex items-center gap-4 py-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg">
                {optionDisplayName(option)}
              </p>
              <p className="text-sm text-cream/50">
                from {formatPrice(option.priceFrom)} ·{' '}
                {formatDuration(option.durationMin)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={`Decrease quantity of ${optionDisplayName(option)}`}
                onClick={() => onChangeQty(line.optionId, line.qty - 1)}
                className="h-8 w-8 border border-cream/20 text-cream/70 hover:border-gold hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                −
              </button>
              <span aria-live="polite" className="w-6 text-center text-sm">
                {line.qty}
              </span>
              <button
                type="button"
                aria-label={`Increase quantity of ${optionDisplayName(option)}`}
                onClick={() => onChangeQty(line.optionId, line.qty + 1)}
                className="h-8 w-8 border border-cream/20 text-cream/70 hover:border-gold hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                +
              </button>
            </div>

            <button
              type="button"
              aria-label={`Remove ${optionDisplayName(option)}`}
              onClick={() => onRemove(line.optionId)}
              className="text-sm text-cream/40 underline-offset-4 hover:text-cream hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Remove
            </button>
          </li>
        );
      })}
    </ul>
  );
}
