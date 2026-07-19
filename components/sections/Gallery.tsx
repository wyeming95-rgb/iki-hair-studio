import { Placeholder } from '@/components/ui/Placeholder';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';

const TILES = [
  { ratio: '3/4' },
  { ratio: '4/3' },
  { ratio: '1/1' },
  { ratio: '4/3' },
  { ratio: '3/4' },
  { ratio: '4/3' },
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
          <Reveal key={index} delay={index * 60} className="mb-4 break-inside-avoid">
            <Placeholder
              ratio={tile.ratio}
              label={`Salon work sample ${index + 1}`}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
