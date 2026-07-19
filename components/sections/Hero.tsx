import { site } from '@/data/site';
import { Placeholder } from '@/components/ui/Placeholder';

export function Hero() {
  return (
    <section
      id="hero"
      className="flex min-h-[88vh] w-full items-center bg-paper px-6 py-24 md:px-12"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="text-center lg:text-left">
          <p className="mb-6 text-xs uppercase tracking-[0.4em] text-clay">
            Bandar Rimbayu
          </p>
          <h1 className="font-display text-6xl font-light leading-none text-ink md:text-8xl">
            {site.name}
          </h1>
          <p className="mt-6 font-display text-2xl italic text-muted md:text-3xl">
            {site.tagline}
          </p>
          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href={site.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-clay bg-clay px-10 py-4 text-sm uppercase tracking-[0.2em] text-paper transition-colors hover:bg-transparent hover:text-clay focus:outline-none focus-visible:ring-2 focus-visible:ring-clay"
            >
              Book Now
            </a>
            <a
              href="#services"
              className="border border-clay px-10 py-4 text-sm uppercase tracking-[0.2em] text-clay transition-colors hover:bg-clay hover:text-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-clay"
            >
              Estimate a price
            </a>
          </div>
        </div>

        <div className="mt-4 lg:mt-0">
          <Placeholder ratio="3/4" label="Salon interior" />
        </div>
      </div>
    </section>
  );
}
