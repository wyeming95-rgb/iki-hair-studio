'use client';

import { useRef, useMemo } from 'react';
import { SIZE_LABELS, type SizeCode } from '@/data/services';
import { LengthSilhouette } from './LengthSilhouette';

interface LengthPickerProps {
  sizes: SizeCode[];
  value: SizeCode | null;
  onChange: (size: SizeCode) => void;
}

export function LengthPicker({ sizes, value, onChange }: LengthPickerProps) {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Determine which button should be tabbable (roving tabindex)
  const tabbableIndex = useMemo(() => {
    if (value !== null) {
      return sizes.indexOf(value);
    }
    // If no value selected, first button is tabbable
    return 0;
  }, [value, sizes]);

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
      // Move focus to the newly selected button
      setTimeout(() => {
        buttonRefs.current[newIndex]?.focus();
      }, 0);
    }
  };

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
