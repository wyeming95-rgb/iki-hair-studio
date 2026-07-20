import { Calculator } from '@/components/calculator/Calculator';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';

export function Services() {
  return (
    <Section id="services" tone="surface">
      <Reveal>
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-clay">
            Services
          </p>
          <h2 className="font-display text-4xl font-light leading-tight md:text-5xl">
            Build your estimate
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Choose the services you are considering and see an indicative price
            before you book. Combine as many as you like.
          </p>
        </div>
      </Reveal>
      <Reveal delay={80}>
        <div className="bg-paper p-6 shadow-[0_20px_50px_-30px_rgba(48,43,38,0.45)] ring-1 ring-ink/10 md:p-10 lg:p-12">
          <Calculator />
        </div>
      </Reveal>
    </Section>
  );
}
