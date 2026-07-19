import type { ReactNode } from 'react';

interface SectionProps {
  id: string;
  tone?: 'paper' | 'surface';
  className?: string;
  children: ReactNode;
}

export function Section({ id, tone = 'paper', className = '', children }: SectionProps) {
  const toneClasses =
    tone === 'surface' ? 'bg-surface text-ink' : 'bg-paper text-ink';
  return (
    <section
      id={id}
      className={`scroll-mt-24 px-6 py-24 md:px-12 md:py-32 ${toneClasses} ${className}`}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}
