import Image from 'next/image';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';

interface Tile {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const TILES: Tile[] = [
  {
    src: '/gallery/cherry-burgundy-colour.jpg',
    alt: 'Deep cherry-burgundy colour on long layered hair with curtain bangs',
    width: 960,
    height: 1280,
  },
  {
    src: '/gallery/mens-textured-quiff.jpg',
    alt: "Men's textured quiff with tapered sides",
    width: 960,
    height: 1280,
  },
  {
    src: '/gallery/mauve-balayage.jpg',
    alt: 'Dusty mauve balayage with soft waves',
    width: 960,
    height: 1280,
  },
  {
    src: '/gallery/long-layers-blue-black.jpg',
    alt: 'Long layered cut in blue-black with curled ends',
    width: 960,
    height: 1280,
  },
  {
    src: '/gallery/tapered-pixie.jpg',
    alt: 'Tapered pixie cut, back view',
    width: 960,
    height: 1280,
  },
  {
    src: '/gallery/mens-textured-perm.jpg',
    alt: "Men's textured perm with faded sides",
    width: 1280,
    height: 1280,
  },
];

export function Gallery() {
  return (
    <Section id="gallery">
      <Reveal>
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-clay">Work</p>
          <h2 className="font-display text-4xl font-light md:text-5xl">
            Recent from the chair
          </h2>
        </div>
      </Reveal>
      <div className="columns-1 gap-4 sm:columns-2 md:columns-3">
        {TILES.map((tile, index) => (
          <Reveal key={tile.src} delay={index * 60} className="mb-4 break-inside-avoid">
            <Image
              src={tile.src}
              alt={tile.alt}
              width={tile.width}
              height={tile.height}
              sizes="(min-width: 768px) 360px, (min-width: 640px) 45vw, 90vw"
              className="h-auto w-full"
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
