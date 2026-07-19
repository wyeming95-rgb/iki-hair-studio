import { About } from '@/components/sections/About';
import { Footer } from '@/components/sections/Footer';
import { Gallery } from '@/components/sections/Gallery';
import { Hero } from '@/components/sections/Hero';
import { Location } from '@/components/sections/Location';
import { Services } from '@/components/sections/Services';
import { Team } from '@/components/sections/Team';

export default function Home() {
  return (
    <>
      <main>
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
