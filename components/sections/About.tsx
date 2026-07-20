import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';

export function About() {
  return (
    <Section id="about">
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-10 h-px w-16 bg-clay" />
          <h2 className="font-display text-4xl font-light leading-tight md:text-5xl">
            Hair care shaped around your life, not the other way round.
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-muted">
            Cutting, styling, colouring, perming and treatments — each tailored to
            suit your lifestyle and personality. We work slowly and deliberately,
            with time to understand your hair before we touch it.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            No rush, no upsell. Just a considered result you can maintain at home.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
