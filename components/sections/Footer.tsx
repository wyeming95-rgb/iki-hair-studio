import { site } from '@/data/site';

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-paper px-6 py-14 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <p className="font-display text-2xl text-ink">{site.name}</p>
          <p className="mt-1 text-sm italic text-muted">{site.tagline}</p>
        </div>

        <nav className="flex gap-8 text-sm uppercase tracking-[0.2em] text-muted">
          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-clay focus:outline-none focus-visible:ring-2 focus-visible:ring-clay"
          >
            Instagram
          </a>
          <a
            href={`https://wa.me/${site.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-clay focus:outline-none focus-visible:ring-2 focus-visible:ring-clay"
          >
            WhatsApp
          </a>
          <a
            href={site.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-clay focus:outline-none focus-visible:ring-2 focus-visible:ring-clay"
          >
            Book
          </a>
        </nav>

        <p className="text-xs text-muted">
          © {site.name}
        </p>
      </div>
    </footer>
  );
}
