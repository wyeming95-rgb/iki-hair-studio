import type { SizeCode } from '@/data/services';

/** Hair path per length. Head sits at cx=32, cy=22, r=11 on a 64×88 canvas. */
const HAIR_PATHS: Record<SizeCode, string> = {
  ES: 'M21 22 Q21 9 32 9 Q43 9 43 22 L43 27 Q38 23 32 23 Q26 23 21 27 Z',
  S: 'M20 24 Q20 8 32 8 Q44 8 44 24 L45 40 Q38 36 32 36 Q26 36 19 40 Z',
  M: 'M19 25 Q19 7 32 7 Q45 7 45 25 L47 54 Q39 49 32 49 Q25 49 17 54 Z',
  L: 'M18 26 Q18 6 32 6 Q46 6 46 26 L49 68 Q40 62 32 62 Q24 62 15 68 Z',
  EL: 'M17 27 Q17 5 32 5 Q47 5 47 27 L51 82 Q41 75 32 75 Q23 75 13 82 Z',
};

export function LengthSilhouette({
  size,
  className = '',
}: {
  size: SizeCode;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 64 88" className={className} aria-hidden focusable="false">
      <path d={HAIR_PATHS[size]} fill="currentColor" opacity={0.35} />
      <circle cx="32" cy="22" r="11" fill="currentColor" opacity={0.9} />
      <path
        d="M25 33 Q32 37 39 33 L41 44 Q32 48 23 44 Z"
        fill="currentColor"
        opacity={0.55}
      />
    </svg>
  );
}
