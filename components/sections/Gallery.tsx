import { Placeholder } from '@/components/ui/Placeholder';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';

const TILES = [
  { ratio: '3/4', span: 'md:row-span-2' },
  { ratio: '4/3', span: '' },
  { ratio: '1/1', span: '' },
  { ratio: '4/3', span: '' },
  { ratio: '3/4', span: 'md:row-span-2' },
  { ratio: '4/3', span: '' },
];

export function Gallery() {
  return (
    <Section id="gallery">
      <Reveal>
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">Work</p>
          <h2 className="font-display text-4xl font-light md:text-5xl">
            Recent from the chair
          </h2>
        </div>
      </Reveal>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {TILES.map((tile, index) => (
          <Reveal key={index} delay={index * 60} className={tile.span}>
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
