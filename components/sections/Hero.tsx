import { site } from '@/data/site';
import { Placeholder } from '@/components/ui/Placeholder';

export function Hero() {
  return (
    <section id="hero" className="relative min-h-[88vh] w-full overflow-hidden">
      <Placeholder ratio="16/9" className="absolute inset-0 h-full" label="Salon interior" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
      <div className="relative flex min-h-[88vh] flex-col items-center justify-center px-6 text-center">
        <p className="mb-6 text-xs uppercase tracking-[0.4em] text-gold">
          Bandar Rimbayu
        </p>
        <h1 className="font-display text-6xl font-light leading-none md:text-8xl">
          {site.name}
        </h1>
        <p className="mt-6 font-display text-2xl italic text-cream/70 md:text-3xl">
          {site.tagline}
        </p>
        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <a
            href={site.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gold bg-gold px-10 py-4 text-sm uppercase tracking-[0.2em] text-ink transition-colors hover:bg-transparent hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Book Now
          </a>
          <a
            href="#services"
            className="border border-cream/30 px-10 py-4 text-sm uppercase tracking-[0.2em] text-cream transition-colors hover:border-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Estimate a price
          </a>
        </div>
      </div>
    </section>
  );
}
