import { site } from '@/data/site';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';

export function Team() {
  return (
    <Section id="team" tone="deep">
      <Reveal>
        <div className="mb-16 max-w-2xl">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-clay">Team</p>
          <h2 className="font-display text-4xl font-light text-cream md:text-5xl">
            Who you will be sitting with
          </h2>
        </div>
      </Reveal>

      <div className="border-t border-cream/15">
        {site.team.map((member, index) => (
          <Reveal key={member.name} delay={index * 90}>
            <div className="flex flex-col gap-2 border-b border-cream/15 py-8 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8 sm:py-10">
              <p className="font-display text-4xl font-light leading-none text-cream md:text-6xl">
                {member.name}
              </p>
              <p className="text-xs uppercase tracking-[0.3em] text-clay sm:text-right">
                {member.role}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <p className="mt-10 max-w-xl text-sm leading-relaxed text-cream/60">
          A small team by choice — so there is time to understand your hair before
          anyone touches it.
        </p>
      </Reveal>
    </Section>
  );
}
