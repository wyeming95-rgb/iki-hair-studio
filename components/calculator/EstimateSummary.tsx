'use client';

import type { CartLine } from '@/data/services';
import { site } from '@/data/site';
import { buildWhatsAppUrl, calculateEstimate } from '@/lib/estimate';
import { formatDuration, formatPrice } from '@/lib/format';

export function EstimateSummary({ lines }: { lines: CartLine[] }) {
  const { priceFrom, durationMin, itemCount } = calculateEstimate(lines);
  const empty = itemCount === 0;

  return (
    <div className="border border-gold/30 p-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-cream/50">
            Estimated total
          </p>
          <p className="font-display text-4xl text-gold md:text-5xl">
            {empty ? '—' : `from ${formatPrice(priceFrom)}`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.25em] text-cream/50">
            Estimated time in salon
          </p>
          <p className="font-display text-2xl">{formatDuration(durationMin)}</p>
        </div>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-cream/50">
        Final price may vary based on hair condition and length — confirmed
        in-salon. Where several services are combined, actual time is usually
        shorter than the total shown.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href={empty ? undefined : site.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={empty}
          onClick={(e) => empty && e.preventDefault()}
          className={`flex-1 border px-8 py-4 text-center text-sm uppercase tracking-[0.2em] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
            empty
              ? 'pointer-events-none border-cream/20 text-cream/30'
              : 'border-gold bg-gold text-ink hover:bg-transparent hover:text-gold'
          }`}
        >
          Book on Tunai
        </a>
        <a
          href={empty ? undefined : buildWhatsAppUrl(lines)}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={empty}
          onClick={(e) => empty && e.preventDefault()}
          className={`flex-1 border px-8 py-4 text-center text-sm uppercase tracking-[0.2em] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
            empty
              ? 'pointer-events-none border-cream/20 text-cream/30'
              : 'border-gold text-gold hover:bg-gold hover:text-ink'
          }`}
        >
          Send via WhatsApp
        </a>
      </div>

      {empty && (
        <p className="mt-4 text-center text-xs text-cream/40">
          Add at least one service to book.
        </p>
      )}
    </div>
  );
}
