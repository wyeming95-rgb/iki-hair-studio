'use client';

import { useRef } from 'react';
import type { ServiceCategory } from '@/data/services';

interface CategoryTabsProps {
  categories: ServiceCategory[];
  value: string;
  onChange: (id: string) => void;
}

export function CategoryTabs({ categories, value, onChange }: CategoryTabsProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(event: React.KeyboardEvent, index: number) {
    const delta =
      event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (delta === 0) return;
    event.preventDefault();
    const next = (index + delta + categories.length) % categories.length;
    onChange(categories[next].id);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label="Service categories"
      className="flex flex-wrap gap-x-6 gap-y-3 border-b border-cream/15 pb-4"
    >
      {categories.map((category, index) => {
        const selected = category.id === value;
        return (
          <button
            key={category.id}
            ref={(el) => {
              refs.current[index] = el;
            }}
            id={`tab-${category.id}`}
            role="tab"
            type="button"
            aria-selected={selected}
            aria-controls="calculator-panel"
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(category.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`font-display text-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold md:text-2xl ${
              selected ? 'text-gold' : 'text-cream/50 hover:text-cream'
            }`}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
