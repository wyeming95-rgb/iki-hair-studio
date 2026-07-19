import { site } from '@/data/site';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';

const MAP_QUERY = encodeURIComponent('Bandar Rimbayu, Telok Panglima Garang, Selangor');

export function Location() {
  return (
    <Section id="location" tone="surface">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div>
            <div className="mb-8 h-px w-16 bg-clay" />
            <h2 className="font-display text-4xl font-light md:text-5xl">
              Find us
            </h2>

            <address className="mt-8 not-italic leading-relaxed text-muted">
              {site.address.line1}
              <br />
              {site.address.line2}
              <br />
              {site.address.region}
            </address>

            <dl className="mt-10 space-y-2">
              {site.hours.map((entry) => {
                const closed = entry.open === null;
                return (
                  <div key={entry.day} className="flex justify-between border-b border-ink/10 py-2">
                    <dt className={closed ? 'text-muted' : 'text-ink'}>
                      {entry.day}
                    </dt>
                    <dd className={closed ? 'text-muted' : 'text-ink'}>
                      {closed ? 'Closed' : `${entry.open} – ${entry.close}`}
                    </dd>
                  </div>
                );
              })}
            </dl>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href={`https://wa.me/${site.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-ink px-8 py-3 text-center text-sm uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              >
                WhatsApp {site.phoneDisplay}
              </a>
              <a
                href={site.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-ink bg-ink px-8 py-3 text-center text-sm uppercase tracking-[0.2em] text-paper transition-colors hover:bg-transparent hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              >
                Book Now
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <iframe
            title="Map showing Iki Hair Studio location"
            src={`https://maps.google.com/maps?q=${MAP_QUERY}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full min-h-[380px] w-full border border-ink/10"
          />
        </Reveal>
      </div>
    </Section>
  );
}
