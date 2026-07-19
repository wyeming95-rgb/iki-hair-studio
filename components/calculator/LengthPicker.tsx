'use client';

import { useRef } from 'react';
import { SIZE_LABELS, type SizeCode } from '@/data/services';
import { LengthSilhouette } from './LengthSilhouette';

interface LengthPickerProps {
  sizes: SizeCode[];
  value: SizeCode | null;
  onChange: (size: SizeCode) => void;
}

export function LengthPicker({ sizes, value, onChange }: LengthPickerProps) {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Determine which button should be tabbable (roving tabindex). Clamp to 0
  // so an unmatched value (defensively unreachable today) still leaves one
  // button tabbable instead of none.
  const tabbableIndex = value !== null ? Math.max(0, sizes.indexOf(value)) : 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let newIndex: number | null = null;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      newIndex = (index + 1) % sizes.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      newIndex = (index - 1 + sizes.length) % sizes.length;
    }

    if (newIndex !== null) {
      onChange(sizes[newIndex]);
      buttonRefs.current[newIndex]?.focus();
    }
  };

  return (
    <div>
      <p className="mb-4 text-sm uppercase tracking-[0.2em] text-muted">
        Your hair length
      </p>
      <div
        role="radiogroup"
        aria-label="Hair length"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5"
      >
        {sizes.map((size, index) => {
          const selected = value === size;
          return (
            <button
              key={size}
              ref={(el) => { buttonRefs.current[index] = el; }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={index === tabbableIndex ? 0 : -1}
              onClick={() => onChange(size)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`flex flex-col items-center gap-2 border p-4 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-clay ${
                selected
                  ? 'border-clay bg-clay/10 text-ink'
                  : 'border-ink/10 text-muted hover:border-ink/30'
              }`}
            >
              <LengthSilhouette size={size} className="h-16 w-12" />
              <span className="font-display text-base leading-tight">
                {SIZE_LABELS[size].name}
              </span>
              <span className="text-xs leading-tight">
                {SIZE_LABELS[size].descriptor}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
