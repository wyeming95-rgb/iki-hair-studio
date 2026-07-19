export type SizeCode = 'ES' | 'S' | 'M' | 'L' | 'EL';

export interface ServiceOption {
  /** Stable slug. Used as the cart key — never reuse or renumber. */
  id: string;
  /** Display name. Options sharing a label form a size-variant group. */
  label: string;
  /** Present only where pricing depends on hair length. */
  size?: SizeCode;
  /** Starting price in RM. Displayed as "from RM {n}". */
  priceFrom: number;
  /** Duration in whole minutes. Never a formatted string. */
  durationMin: number;
}

export interface ServiceCategory {
  id: string;
  label: string;
  blurb: string;
  options: ServiceOption[];
}

export interface CartLine {
  optionId: string;
  qty: number;
}

export const SIZE_ORDER: SizeCode[] = ['ES', 'S', 'M', 'L', 'EL'];

export const SIZE_LABELS: Record<SizeCode, { name: string; descriptor: string }> = {
  ES: { name: 'Extra Short', descriptor: 'Cropped, above the ear' },
  S: { name: 'Short', descriptor: 'To the chin' },
  M: { name: 'Medium', descriptor: 'To the collarbone' },
  L: { name: 'Long', descriptor: 'Past the shoulders' },
  EL: { name: 'Extra Long', descriptor: 'Mid-back and beyond' },
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'haircut',
    label: 'Haircut',
    blurb: 'A cut shaped to how you actually wear your hair.',
    options: [
      { id: 'haircut-kid-junior', label: 'Kid Junior (0–12)', priceFrom: 30, durationMin: 30 },
      { id: 'haircut-male-teen', label: 'Male Kid (13–17)', priceFrom: 40, durationMin: 30 },
      { id: 'haircut-female-teen', label: 'Female (13–17)', priceFrom: 50, durationMin: 30 },
      { id: 'haircut-male', label: 'Male Haircut', priceFrom: 60, durationMin: 60 },
      { id: 'haircut-female', label: 'Female Haircut', priceFrom: 70, durationMin: 60 },
    ],
  },
  {
    id: 'styling',
    label: 'Styling',
    blurb: 'Wash and blow-dry, finished the way you would wear it out.',
    options: [
      { id: 'styling-wash-blow-s', label: 'Hairwash + Blow', size: 'S', priceFrom: 40, durationMin: 60 },
      { id: 'styling-wash-blow-l', label: 'Hairwash + Blow', size: 'L', priceFrom: 50, durationMin: 60 },
    ],
  },
  {
    id: 'coloring',
    label: 'Coloring',
    blurb: 'Tone chosen with your skin and upkeep in mind.',
    options: [
      { id: 'coloring-root-touch', label: 'Root-Touch', priceFrom: 150, durationMin: 90 },
      { id: 'coloring-single-tone-es', label: 'Single Tone Color', size: 'ES', priceFrom: 170, durationMin: 120 },
      { id: 'coloring-single-tone-s', label: 'Single Tone Color', size: 'S', priceFrom: 200, durationMin: 120 },
      { id: 'coloring-single-tone-m', label: 'Single Tone Color', size: 'M', priceFrom: 250, durationMin: 120 },
      { id: 'coloring-single-tone-l', label: 'Single Tone Color', size: 'L', priceFrom: 300, durationMin: 120 },
      { id: 'coloring-single-tone-el', label: 'Single Tone Color', size: 'EL', priceFrom: 350, durationMin: 120 },
    ],
  },
  {
    id: 'perming',
    label: 'Perming',
    blurb: 'Movement that holds without the damage.',
    options: [
      { id: 'perming-cold-es', label: 'Cold Perm', size: 'ES', priceFrom: 150, durationMin: 120 },
      { id: 'perming-cold-s', label: 'Cold Perm', size: 'S', priceFrom: 180, durationMin: 120 },
      { id: 'perming-cold-m', label: 'Cold Perm', size: 'M', priceFrom: 210, durationMin: 120 },
      { id: 'perming-cold-l', label: 'Cold Perm', size: 'L', priceFrom: 250, durationMin: 150 },
      { id: 'perming-cold-el', label: 'Cold Perm', size: 'EL', priceFrom: 280, durationMin: 120 },
      { id: 'perming-digital-s', label: 'Digital Perm', size: 'S', priceFrom: 270, durationMin: 240 },
      { id: 'perming-digital-m', label: 'Digital Perm', size: 'M', priceFrom: 300, durationMin: 240 },
      { id: 'perming-digital-l', label: 'Digital Perm', size: 'L', priceFrom: 350, durationMin: 240 },
      { id: 'perming-digital-el', label: 'Digital Perm', size: 'EL', priceFrom: 400, durationMin: 240 },
    ],
  },
  {
    id: 'straightening',
    label: 'Straightening',
    blurb: 'A clean, soft finish — not a flat one.',
    options: [
      { id: 'straightening-s', label: 'Straightening 离子烫', size: 'S', priceFrom: 260, durationMin: 240 },
      { id: 'straightening-m', label: 'Straightening 离子烫', size: 'M', priceFrom: 300, durationMin: 240 },
      { id: 'straightening-l', label: 'Straightening 离子烫', size: 'L', priceFrom: 350, durationMin: 240 },
      { id: 'straightening-el', label: 'Straightening 离子烫', size: 'EL', priceFrom: 400, durationMin: 240 },
    ],
  },
  {
    id: 'treatment',
    label: 'Treatment',
    blurb: 'Scalp and hair care that compounds over time.',
    options: [
      { id: 'treatment-intensive-scalp', label: 'Intensive Scalp Treatment', priceFrom: 160, durationMin: 60 },
      { id: 'treatment-promaster-s', label: 'PROMASTER Color Care', size: 'S', priceFrom: 180, durationMin: 90 },
      { id: 'treatment-promaster-m', label: 'PROMASTER Color Care', size: 'M', priceFrom: 210, durationMin: 90 },
      { id: 'treatment-promaster-l', label: 'PROMASTER Color Care', size: 'L', priceFrom: 240, durationMin: 90 },
      { id: 'treatment-iau-s', label: 'IAU Scalp & Hair Treatment', size: 'S', priceFrom: 200, durationMin: 120 },
      { id: 'treatment-iau-m', label: 'IAU Scalp & Hair Treatment', size: 'M', priceFrom: 230, durationMin: 120 },
      { id: 'treatment-iau-l', label: 'IAU Scalp & Hair Treatment', size: 'L', priceFrom: 260, durationMin: 120 },
    ],
  },
];

export const allOptions: ServiceOption[] = serviceCategories.flatMap((c) => c.options);
