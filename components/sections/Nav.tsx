'use client';

import { useEffect, useRef, useState } from 'react';
import { site } from '@/data/site';

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#team', label: 'Team' },
  { href: '#location', label: 'Location' },
];

const MENU_PANEL_ID = 'mobile-nav-panel';

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // Nav sits transparent over the dark hero, then turns solid once the hero
  // has scrolled up past the nav. Observing the hero (rather than a scroll
  // listener) keeps this off the main thread.
  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero || !('IntersectionObserver' in window)) {
      // No hero or no observer support: default to the always-legible solid state.
      setScrolledPastHero(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setScrolledPastHero(!entry.isIntersecting),
      // Flip when the hero's bottom passes below the ~64px nav band.
      { rootMargin: '-64px 0px 0px 0px', threshold: 0 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // The open mobile panel is paper-backed, so force the whole header solid
  // while it is open to keep the brand and toggle legible against it.
  const solid = scrolledPastHero || open;

  return (
    <header
      data-solid={solid}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 nav-shell ${
        solid ? 'border-b border-ink/10 bg-paper' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 md:px-12">
        <a
          href="#hero"
          className={`font-display text-xl font-light tracking-wide transition-colors hover:text-clay focus:outline-none focus-visible:ring-2 focus-visible:ring-clay ${
            solid ? 'text-ink' : 'text-cream'
          }`}
        >
          {site.name}
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`font-body text-xs uppercase tracking-[0.3em] transition-colors hover:text-clay focus:outline-none focus-visible:ring-2 focus-visible:ring-clay ${
                solid ? 'text-muted' : 'text-cream/80'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={site.bookingUrl}
            data-cta
            target="_blank"
            rel="noopener noreferrer"
            className="border border-clay bg-clay px-5 py-2 text-xs uppercase tracking-[0.2em] text-paper transition-colors hover:bg-transparent hover:text-clay active:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-clay"
          >
            Book
          </a>

          <button
            ref={toggleRef}
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls={MENU_PANEL_ID}
            onClick={() => setOpen((value) => !value)}
            className={`flex h-9 w-9 items-center justify-center border transition-colors hover:border-clay hover:text-clay focus:outline-none focus-visible:ring-2 focus-visible:ring-clay md:hidden ${
              solid ? 'border-ink/20 text-ink' : 'border-cream/40 text-cream'
            }`}
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            {open ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id={MENU_PANEL_ID}
          aria-label="Mobile"
          className="border-t border-ink/10 bg-paper px-6 py-6 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 font-body text-sm uppercase tracking-[0.3em] text-muted transition-colors hover:text-clay focus:outline-none focus-visible:ring-2 focus-visible:ring-clay"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
