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

/**
 * Maximum total length of the generated wa.me URL — the literal
 * `https://wa.me/{number}?text=` prefix plus the percent-encoded message —
 * in characters. This bounds the ENCODED size rather than the raw message
 * length: encoding expands characters unevenly (`•` becomes 9 characters,
 * `×` becomes 6, a space becomes 3), so capping the raw length does not
 * bound the final URL length, which is what browsers and the WhatsApp
 * handler actually enforce limits on. 1800 leaves headroom under the
 * conservative 2000-character figure while staying well inside what
 * browsers and the WhatsApp handler accept.
 */
const MAX_URL_LENGTH = 1800;

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
  const marker = '\n… and more';
  const prefixLength = `https://wa.me/${site.whatsappNumber}?text=`.length;

  const fullBody = items.join('\n');
  const fullMessage = `${header}\n${fullBody}${footer}`;
  if (prefixLength + encodeURIComponent(fullMessage).length <= MAX_URL_LENGTH) {
    return fullMessage;
  }

  // Doesn't fit: add item lines one at a time, stopping just before the
  // encoded URL — including the footer and the "… and more" marker, which
  // always survive — would exceed the budget.
  let body = '';
  for (const item of items) {
    const candidateBody = body ? `${body}\n${item}` : item;
    const candidateMessage = `${header}\n${candidateBody}${marker}${footer}`;
    if (prefixLength + encodeURIComponent(candidateMessage).length > MAX_URL_LENGTH) {
      break;
    }
    body = candidateBody;
  }

  return `${header}\n${body}${marker}${footer}`;
}

export function buildWhatsAppUrl(lines: CartLine[]): string {
  const text = encodeURIComponent(buildWhatsAppMessage(lines));
  return `https://wa.me/${site.whatsappNumber}?text=${text}`;
}
