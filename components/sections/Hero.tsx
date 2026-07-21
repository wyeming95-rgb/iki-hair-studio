import { site } from '@/data/site';

export function Hero() {
  return (
    <section
      id="hero"
      className="flex min-h-[100dvh] w-full scroll-mt-24 items-center overflow-hidden bg-deep px-6 py-32 text-cream md:px-12"
    >
      <div className="mx-auto w-full max-w-6xl text-center lg:text-left">
        <p className="mb-6 text-xs uppercase tracking-[0.4em] text-clay">
          Bandar Rimbayu
        </p>
        <div className="mx-auto mb-8 h-px w-16 bg-clay lg:mx-0" />

        <h1
          aria-label="Iki"
          className="font-display font-light leading-[0.88] tracking-tight text-cream"
        >
          <span className="block text-[clamp(5rem,26vw,15rem)]">IKI</span>
        </h1>

        <p className="mt-8 font-display text-2xl italic text-cream/70 md:text-3xl">
          {site.tagline}
        </p>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
          <a
            href={site.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-clay bg-clay px-10 py-4 text-sm uppercase tracking-[0.2em] text-paper transition-colors hover:bg-transparent hover:text-clay active:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-cream"
          >
            Book Now
          </a>
          <a
            href="#services"
            className="border border-cream/40 px-10 py-4 text-sm uppercase tracking-[0.2em] text-cream transition-colors hover:border-cream hover:bg-cream hover:text-deep active:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-cream"
          >
            Estimate a price
          </a>
        </div>
      </div>
    </section>
  );
}
