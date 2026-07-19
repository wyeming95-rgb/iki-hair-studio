import { site } from '@/data/site';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';

export function Team() {
  return (
    <Section id="team">
      <Reveal>
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">Team</p>
          <h2 className="font-display text-4xl font-light md:text-5xl">
            Who you will be sitting with
          </h2>
        </div>
      </Reveal>
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {site.team.map((member, index) => (
          <Reveal key={member.name} delay={index * 80}>
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-gold/40">
                <span className="font-display text-xl tracking-widest text-gold">
                  {member.initials}
                </span>
              </div>
              <div>
                <p className="font-display text-2xl">{member.name}</p>
                <p className="text-sm uppercase tracking-[0.2em] text-cream/50">
                  {member.role}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
