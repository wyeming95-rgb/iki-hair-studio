import { Calculator } from '@/components/calculator/Calculator';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';

export function Services() {
  return (
    <Section id="services">
      <Reveal>
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">
            Services
          </p>
          <h2 className="font-display text-4xl font-light leading-tight md:text-5xl">
            Build your estimate
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-cream/60">
            Choose the services you are considering and see an indicative price
            before you book. Combine as many as you like.
          </p>
        </div>
      </Reveal>
      <Calculator />
    </Section>
  );
}
