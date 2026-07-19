'use client';

import { SIZE_LABELS, type SizeCode } from '@/data/services';
import { LengthSilhouette } from './LengthSilhouette';

interface LengthPickerProps {
  sizes: SizeCode[];
  value: SizeCode | null;
  onChange: (size: SizeCode) => void;
}

export function LengthPicker({ sizes, value, onChange }: LengthPickerProps) {
  return (
    <div>
      <p className="mb-4 text-sm uppercase tracking-[0.2em] text-cream/50">
        Your hair length
      </p>
      <div
        role="radiogroup"
        aria-label="Hair length"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5"
      >
        {sizes.map((size) => {
          const selected = value === size;
          return (
            <button
              key={size}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(size)}
              className={`flex flex-col items-center gap-2 border p-4 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                selected
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-cream/15 text-cream/70 hover:border-cream/40'
              }`}
            >
              <LengthSilhouette size={size} className="h-16 w-12" />
              <span className="font-display text-base leading-tight">
                {SIZE_LABELS[size].name}
              </span>
              <span className="text-xs leading-tight opacity-60">
                {SIZE_LABELS[size].descriptor}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
