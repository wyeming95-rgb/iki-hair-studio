'use client';

import { useState } from 'react';
import { serviceCategories, type CartLine } from '@/data/services';
import { CategoryTabs } from './CategoryTabs';
import { EstimateCart } from './EstimateCart';
import { EstimateSummary } from './EstimateSummary';
import { OptionPicker } from './OptionPicker';

export function Calculator() {
  const [categoryId, setCategoryId] = useState(serviceCategories[0].id);
  const [lines, setLines] = useState<CartLine[]>([]);

  const category =
    serviceCategories.find((c) => c.id === categoryId) ?? serviceCategories[0];

  function addOption(optionId: string) {
    setLines((current) => {
      const existing = current.find((l) => l.optionId === optionId);
      if (existing) {
        return current.map((l) =>
          l.optionId === optionId ? { ...l, qty: l.qty + 1 } : l,
        );
      }
      return [...current, { optionId, qty: 1 }];
    });
  }

  function changeQty(optionId: string, qty: number) {
    if (qty <= 0) {
      removeOption(optionId);
      return;
    }
    setLines((current) =>
      current.map((l) => (l.optionId === optionId ? { ...l, qty } : l)),
    );
  }

  function removeOption(optionId: string) {
    setLines((current) => current.filter((l) => l.optionId !== optionId));
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
      <div className="space-y-10">
        <CategoryTabs
          categories={serviceCategories}
          value={categoryId}
          onChange={setCategoryId}
        />
        <div
          role="tabpanel"
          id={`panel-${category.id}`}
          aria-labelledby={`tab-${category.id}`}
        >
          <OptionPicker category={category} onAdd={addOption} />
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="mb-4 font-display text-2xl">Your estimate</h3>
          <EstimateCart
            lines={lines}
            onChangeQty={changeQty}
            onRemove={removeOption}
          />
        </div>
        <EstimateSummary lines={lines} />
      </div>
    </div>
  );
}
