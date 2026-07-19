import type { ReactNode } from 'react';

interface SectionProps {
  id: string;
  tone?: 'ink' | 'cream';
  className?: string;
  children: ReactNode;
}

export function Section({ id, tone = 'ink', className = '', children }: SectionProps) {
  const toneClasses =
    tone === 'cream' ? 'bg-cream text-ink' : 'bg-ink text-cream';
  return (
    <section
      id={id}
      className={`scroll-mt-16 px-6 py-24 md:px-12 md:py-32 ${toneClasses} ${className}`}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}
