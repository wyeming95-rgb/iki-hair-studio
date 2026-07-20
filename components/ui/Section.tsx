import type { ReactNode } from 'react';

interface SectionProps {
  id: string;
  tone?: 'paper' | 'surface' | 'deep';
  className?: string;
  children: ReactNode;
}

const TONE_CLASSES: Record<NonNullable<SectionProps['tone']>, string> = {
  paper: 'bg-paper text-ink',
  surface: 'bg-surface text-ink',
  deep: 'bg-deep text-cream',
};

export function Section({ id, tone = 'paper', className = '', children }: SectionProps) {
  const toneClasses = TONE_CLASSES[tone];
  return (
    <section
      id={id}
      className={`scroll-mt-24 px-6 py-24 md:px-12 md:py-32 ${toneClasses} ${className}`}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}
