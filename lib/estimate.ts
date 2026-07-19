import {
  allOptions,
  SIZE_LABELS,
  SIZE_ORDER,
  type CartLine,
  type ServiceOption,
} from '@/data/services';
import { site } from '@/data/site';
import { formatPrice } from '@/lib/format';

export interface OptionGroup {
  label: string;
  isSizeAware: boolean;
  options: ServiceOption[];
}

export interface EstimateTotals {
  priceFrom: number;
  durationMin: number;
  itemCount: number;
}

/** Max characters for the WhatsApp message body, before encoding. */
const MAX_MESSAGE_LENGTH = 900;

export function findOption(id: string): ServiceOption | undefined {
  return allOptions.find((o) => o.id === id);
}

export function optionDisplayName(option: ServiceOption): string {
  return option.size ? `${option.label} (${SIZE_LABELS[option.size].name})` : option.label;
}

/**
 * Groups options sharing a label into size-variant groups, preserving source
 * order for groups and canonical length order within them. Groups with a
 * single unsized option come back as isSizeAware: false.
 */
export function groupOptionsByLabel(options: ServiceOption[]): OptionGroup[] {
  const groups: OptionGroup[] = [];
  const index = new Map<string, OptionGroup>();

  for (const option of options) {
    let group = index.get(option.label);
    if (!group) {
      group = { label: option.label, isSizeAware: false, options: [] };
      index.set(option.label, group);
      groups.push(group);
    }
    group.options.push(option);
  }

  for (const group of groups) {
    group.isSizeAware = group.options.some((o) => o.size !== undefined);
    if (group.isSizeAware) {
      group.options.sort(
        (a, b) => SIZE_ORDER.indexOf(a.size!) - SIZE_ORDER.indexOf(b.size!),
      );
    }
  }

  return groups;
}

/**
 * Sums a cart. Unknown ids and non-positive quantities are skipped rather than
 * throwing — a stale link should degrade, not crash the page.
 *
 * durationMin assumes services run back-to-back, which overstates a real
 * combined visit. Present it as approximate.
 */
export function calculateEstimate(lines: CartLine[]): EstimateTotals {
  return lines.reduce<EstimateTotals>(
    (totals, line) => {
      const option = findOption(line.optionId);
      if (!option || line.qty <= 0) return totals;
      return {
        priceFrom: totals.priceFrom + option.priceFrom * line.qty,
        durationMin: totals.durationMin + option.durationMin * line.qty,
        itemCount: totals.itemCount + line.qty,
      };
    },
    { priceFrom: 0, durationMin: 0, itemCount: 0 },
  );
}

function buildWhatsAppMessage(lines: CartLine[]): string {
  const items = lines
    .map((line) => {
      const option = findOption(line.optionId);
      if (!option || line.qty <= 0) return null;
      const qty = line.qty > 1 ? ` × ${line.qty}` : '';
      return `• ${optionDisplayName(option)}${qty}`;
    })
    .filter((line): line is string => line !== null);

  const { priceFrom } = calculateEstimate(lines);
  const header = `Hi ${site.name}, I'd like to book:`;
  const footer = `\nEstimated total: from ${formatPrice(priceFrom)}`;

  let body = items.join('\n');
  if (body.length > MAX_MESSAGE_LENGTH) {
    body = `${body.slice(0, MAX_MESSAGE_LENGTH)}\n… and more`;
  }

  return `${header}\n${body}${footer}`;
}

export function buildWhatsAppUrl(lines: CartLine[]): string {
  const text = encodeURIComponent(buildWhatsAppMessage(lines));
  return `https://wa.me/${site.whatsappNumber}?text=${text}`;
}
