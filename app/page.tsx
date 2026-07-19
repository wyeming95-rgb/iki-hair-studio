import { About } from '@/components/sections/About';
import { Footer } from '@/components/sections/Footer';
import { Gallery } from '@/components/sections/Gallery';
import { Hero } from '@/components/sections/Hero';
import { Location } from '@/components/sections/Location';
import { Nav } from '@/components/sections/Nav';
import { Services } from '@/components/sections/Services';
import { Team } from '@/components/sections/Team';

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:border focus:border-clay focus:bg-paper focus:px-6 focus:py-3 focus:text-sm focus:uppercase focus:tracking-[0.2em] focus:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-clay"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <About />
        <Services />
        <Gallery />
        <Team />
        <Location />
      </main>
      <Footer />
    </>
  );
}
