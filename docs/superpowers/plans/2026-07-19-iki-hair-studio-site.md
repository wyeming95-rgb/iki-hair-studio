# Iki Hair Studio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page minimalist-luxury marketing site for Iki Hair Studio whose centrepiece is a client-side multi-service price calculator that hands off to the salon's existing Tunai booking system.

**Architecture:** Next.js App Router with one route. All pricing arithmetic lives in pure, React-free functions in `lib/`, unit-tested first; components render state rather than computing it. Pricing and business data live in two typed files under `data/` so a non-developer can update prices without touching JSX.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Vitest (unit), Playwright (E2E), deployed to Vercel.

**Spec:** `docs/superpowers/specs/2026-07-19-iki-hair-studio-design.md`

## Global Constraints

Every task's requirements implicitly include this section.

- **Palette, exact values:** ink `#0a0a0a`, cream `#f5f2ec`, gold `#c5a572`. No other brand colours.
- **Contrast rule:** gold is NEVER body text on cream (~1.9:1, fails WCAG). Gold on cream is permitted only for rules, borders, and large display type ≥24px. Gold on ink (~8:1) is unrestricted.
- **Fonts:** Cormorant Garamond (headings), Inter (body), both via `next/font/google`. No `<link>` tags to Google Fonts.
- **Prices display as `from RM {n}`**, never a bare number. Currency prefix is `RM `, no decimals.
- **Duration is stored as integer minutes everywhere.** Never store a formatted duration string.
- **WhatsApp number is `601172267229`** (12 digits). `PROJECT.md` §7.5 contains an 11-digit typo — do not copy it.
- **Tunai booking URL:** `https://booking.tunai.io/ikihairstudio`
- **Reduced motion:** every animation must render final content immediately under `prefers-reduced-motion: reduce`. Never leave content at `opacity: 0`.
- **Commit after every task.** Conventional Commits (`feat:`, `test:`, `chore:`).

---

### Task 1: Project scaffold, theme tokens, and test harness

**Files:**
- Create: whole Next.js scaffold at repo root
- Create: `vitest.config.ts`
- Modify: `app/globals.css`, `app/layout.tsx`
- Test: `lib/__tests__/smoke.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `@/` path alias resolving to repo root; Tailwind tokens `bg-ink` `text-cream` `text-gold` (and all colour utilities for those three names); font CSS variables `--font-cormorant` and `--font-inter`; `npm test` running Vitest

- [ ] **Step 1: Scaffold Next.js into the existing repo**

The repo already contains `PROJECT.md` and `docs/`, so scaffold into a temp dir and move files in. Run from repo root:

```bash
npx create-next-app@15 .tmp-scaffold --typescript --tailwind --app --eslint --src-dir=false --import-alias "@/*" --use-npm --turbopack
```

Then move everything except git metadata:

```bash
cp -r .tmp-scaffold/. . && rm -rf .tmp-scaffold
```

- [ ] **Step 2: Verify the dev server boots**

Run: `npm run dev`
Expected: server starts, `http://localhost:3000` renders the Next.js starter page. Stop the server with Ctrl-C before continuing.

- [ ] **Step 3: Install test dependencies**

```bash
npm install -D vitest vite-tsconfig-paths @playwright/test
```

- [ ] **Step 4: Create the Vitest config**

Create `vitest.config.ts`. Node environment — the tested code is pure and has no DOM dependency, so jsdom is unnecessary weight.

```ts
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    include: ['**/__tests__/**/*.test.ts'],
  },
});
```

- [ ] **Step 5: Add the test script**

In `package.json`, add to `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 6: Write a smoke test that proves the harness and alias work**

Create `lib/__tests__/smoke.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

describe('test harness', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 7: Run the smoke test**

Run: `npm test`
Expected: PASS, 1 test.

- [ ] **Step 8: Define theme tokens and fonts in globals.css**

Replace the contents of `app/globals.css`. This is Tailwind v4 CSS-first config — `@theme` generates the utility classes.

```css
@import "tailwindcss";

@theme {
  --color-ink: #0a0a0a;
  --color-cream: #f5f2ec;
  --color-gold: #c5a572;

  --font-display: var(--font-cormorant), Georgia, serif;
  --font-body: var(--font-inter), system-ui, sans-serif;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-ink);
  color: var(--color-cream);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**If the scaffold produced Tailwind v3 instead** (i.e. a `tailwind.config.ts` file exists at root), the `@theme` block will not work. In that case keep `@tailwind base/components/utilities` directives in the CSS and put the tokens in `tailwind.config.ts` under `theme.extend.colors` (`ink`, `cream`, `gold`) and `theme.extend.fontFamily` (`display`, `body`) instead. Everything downstream in this plan uses the same utility class names either way.

- [ ] **Step 9: Wire the fonts in the layout**

Replace `app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Iki Hair Studio',
  description: 'A reason for being.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 10: Verify tokens render**

Replace `app/page.tsx` with a temporary probe:

```tsx
export default function Home() {
  return (
    <main className="min-h-screen bg-ink p-12">
      <h1 className="font-display text-6xl text-gold">Iki Hair Studio</h1>
      <p className="font-body text-cream">Theme tokens are live.</p>
    </main>
  );
}
```

Run: `npm run dev`
Expected: black page, gold serif heading, cream sans body. If the heading is not serif or not gold, the token wiring in Step 8 is wrong — fix before proceeding. Stop the server.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js with brand tokens and Vitest harness"
```

---

### Task 2: Service and site data

**Files:**
- Create: `data/services.ts`, `data/site.ts`
- Test: `data/__tests__/services.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `type SizeCode = 'ES' | 'S' | 'M' | 'L' | 'EL'`
  - `interface ServiceOption { id: string; label: string; size?: SizeCode; priceFrom: number; durationMin: number }`
  - `interface ServiceCategory { id: string; label: string; blurb: string; options: ServiceOption[] }`
  - `interface CartLine { optionId: string; qty: number }`
  - `serviceCategories: ServiceCategory[]` (6 categories, 33 options)
  - `allOptions: ServiceOption[]` (flattened)
  - `SIZE_ORDER: SizeCode[]`, `SIZE_LABELS: Record<SizeCode, { name: string; descriptor: string }>`
  - `site` object with `phoneDisplay`, `whatsappNumber`, `bookingUrl`, `instagramUrl`, `address`, `hours`

- [ ] **Step 1: Write the failing data-integrity test**

These tests guard transcription errors — the highest-risk part of this task, since 33 rows were copied by hand from `PROJECT.md` §7.

Create `data/__tests__/services.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { allOptions, serviceCategories, SIZE_ORDER } from '@/data/services';

describe('service data', () => {
  it('has six categories', () => {
    expect(serviceCategories).toHaveLength(6);
  });

  it('has 33 options total', () => {
    expect(allOptions).toHaveLength(33);
  });

  it('has the option count per category from the spec', () => {
    const counts = Object.fromEntries(
      serviceCategories.map((c) => [c.id, c.options.length]),
    );
    expect(counts).toEqual({
      haircut: 5,
      styling: 2,
      coloring: 6,
      perming: 9,
      straightening: 4,
      treatment: 7,
    });
  });

  it('has unique option ids', () => {
    const ids = allOptions.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has positive prices and durations', () => {
    for (const o of allOptions) {
      expect(o.priceFrom, o.id).toBeGreaterThan(0);
      expect(o.durationMin, o.id).toBeGreaterThan(0);
    }
  });

  it('uses only valid size codes', () => {
    for (const o of allOptions) {
      if (o.size !== undefined) expect(SIZE_ORDER, o.id).toContain(o.size);
    }
  });

  it('prices size variants in ascending length order', () => {
    const byLabel = new Map<string, typeof allOptions>();
    for (const o of allOptions) {
      if (!o.size) continue;
      byLabel.set(o.label, [...(byLabel.get(o.label) ?? []), o]);
    }
    for (const [label, opts] of byLabel) {
      const sorted = [...opts].sort(
        (a, b) => SIZE_ORDER.indexOf(a.size!) - SIZE_ORDER.indexOf(b.size!),
      );
      const prices = sorted.map((o) => o.priceFrom);
      expect([...prices].sort((a, b) => a - b), label).toEqual(prices);
    }
  });

  it('spot-checks known prices from the spec', () => {
    const find = (id: string) => allOptions.find((o) => o.id === id);
    expect(find('haircut-female')?.priceFrom).toBe(70);
    expect(find('coloring-single-tone-m')?.priceFrom).toBe(250);
    expect(find('coloring-single-tone-m')?.durationMin).toBe(120);
    expect(find('perming-digital-el')?.priceFrom).toBe(400);
    expect(find('treatment-intensive-scalp')?.priceFrom).toBe(160);
    expect(find('treatment-intensive-scalp')?.durationMin).toBe(60);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `@/data/services`.

- [ ] **Step 3: Write the services data**

Create `data/services.ts`. Every price and duration is transcribed from `PROJECT.md` §7. Durations are converted to integer minutes.

```ts
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
```

**Note on partial size sets:** Digital Perm has no ES, Styling has only S and L, PROMASTER and IAU have no ES or EL. The length picker in Task 5 must render only the sizes a group actually offers. Do not assume all five.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS, 9 tests (1 smoke + 8 data).

- [ ] **Step 5: Write the site data**

Create `data/site.ts`:

```ts
export const site = {
  name: 'Iki Hair Studio',
  tagline: 'A reason for being.',
  /** Human-readable, for display only. */
  phoneDisplay: '011-7226 7229',
  /**
   * International format, digits only, for wa.me links.
   * PROJECT.md §7.5 contains an 11-digit typo (60117226729); this is the
   * correct 12-digit form. Confirm against the salon's account before launch.
   */
  whatsappNumber: '601172267229',
  bookingUrl: 'https://booking.tunai.io/ikihairstudio',
  instagramUrl: 'https://www.instagram.com/ikihairstudio/',
  address: {
    line1: '1st Floor, Bandar Rimbayu',
    line2: 'Telok Panglima Garang',
    region: 'Kuala Langat, Selangor',
    country: 'Malaysia',
  },
  /** null means closed that day. */
  hours: [
    { day: 'Monday', open: '11:00', close: '19:00' },
    { day: 'Tuesday', open: null, close: null },
    { day: 'Wednesday', open: '11:00', close: '19:00' },
    { day: 'Thursday', open: '11:00', close: '19:00' },
    { day: 'Friday', open: '11:00', close: '19:00' },
    { day: 'Saturday', open: '11:00', close: '19:00' },
    { day: 'Sunday', open: '11:00', close: '19:00' },
  ] as const,
  team: [
    { name: 'Daniel T', role: 'Stylist', initials: 'DT' },
    { name: 'Mica Lai', role: 'Stylist', initials: 'ML' },
  ],
} as const;
```

- [ ] **Step 6: Commit**

```bash
git add data vitest.config.ts
git commit -m "feat: add service pricing and site data with integrity tests"
```

---

### Task 3: Estimate and formatting logic

This is the only code in the project that can be numerically wrong. Test it hard.

**Files:**
- Create: `lib/format.ts`, `lib/estimate.ts`
- Delete: `lib/__tests__/smoke.test.ts`
- Test: `lib/__tests__/format.test.ts`, `lib/__tests__/estimate.test.ts`

**Interfaces:**
- Consumes: `CartLine`, `ServiceOption`, `SizeCode`, `allOptions`, `SIZE_ORDER` from `@/data/services`; `site` from `@/data/site`
- Produces:
  - `formatDuration(minutes: number): string`
  - `formatPrice(rm: number): string`
  - `interface OptionGroup { label: string; isSizeAware: boolean; options: ServiceOption[] }`
  - `interface EstimateTotals { priceFrom: number; durationMin: number; itemCount: number }`
  - `findOption(id: string): ServiceOption | undefined`
  - `optionDisplayName(option: ServiceOption): string`
  - `groupOptionsByLabel(options: ServiceOption[]): OptionGroup[]`
  - `calculateEstimate(lines: CartLine[]): EstimateTotals`
  - `buildWhatsAppUrl(lines: CartLine[]): string`

- [ ] **Step 1: Write the failing formatter tests**

Create `lib/__tests__/format.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { formatDuration, formatPrice } from '@/lib/format';

describe('formatDuration', () => {
  it('formats minutes under an hour', () => {
    expect(formatDuration(30)).toBe('30 min');
  });

  it('formats a whole hour without a minutes part', () => {
    expect(formatDuration(60)).toBe('1 hr');
  });

  it('formats hours and minutes', () => {
    expect(formatDuration(150)).toBe('2 hr 30 min');
  });

  it('formats multiple whole hours', () => {
    expect(formatDuration(240)).toBe('4 hr');
  });

  it('formats zero as a dash rather than "0 min"', () => {
    expect(formatDuration(0)).toBe('—');
  });
});

describe('formatPrice', () => {
  it('prefixes RM with no decimals', () => {
    expect(formatPrice(410)).toBe('RM 410');
  });

  it('adds thousands separators', () => {
    expect(formatPrice(1250)).toBe('RM 1,250');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `@/lib/format`.

- [ ] **Step 3: Implement the formatters**

Create `lib/format.ts`:

```ts
/** Formats whole minutes as "30 min", "1 hr", "2 hr 30 min". */
export function formatDuration(minutes: number): string {
  if (minutes <= 0) return '—';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins} min`;
  if (mins === 0) return `${hrs} hr`;
  return `${hrs} hr ${mins} min`;
}

/** Formats a ringgit amount as "RM 1,250". No decimals — these are estimates. */
export function formatPrice(rm: number): string {
  return `RM ${rm.toLocaleString('en-MY')}`;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test`
Expected: PASS, all format tests green.

- [ ] **Step 5: Write the failing estimate tests**

Create `lib/__tests__/estimate.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  buildWhatsAppUrl,
  calculateEstimate,
  findOption,
  groupOptionsByLabel,
  optionDisplayName,
} from '@/lib/estimate';
import { serviceCategories } from '@/data/services';

const coloring = serviceCategories.find((c) => c.id === 'coloring')!;
const haircut = serviceCategories.find((c) => c.id === 'haircut')!;
const perming = serviceCategories.find((c) => c.id === 'perming')!;

describe('findOption', () => {
  it('finds a known option', () => {
    expect(findOption('coloring-single-tone-m')?.priceFrom).toBe(250);
  });

  it('returns undefined for an unknown id', () => {
    expect(findOption('does-not-exist')).toBeUndefined();
  });
});

describe('optionDisplayName', () => {
  it('appends the size name when sized', () => {
    expect(optionDisplayName(findOption('coloring-single-tone-m')!)).toBe(
      'Single Tone Color (Medium)',
    );
  });

  it('returns the bare label when unsized', () => {
    expect(optionDisplayName(findOption('haircut-female')!)).toBe('Female Haircut');
  });
});

describe('groupOptionsByLabel', () => {
  it('splits coloring into an unsized and a sized group', () => {
    const groups = groupOptionsByLabel(coloring.options);
    expect(groups).toHaveLength(2);
    expect(groups[0]).toMatchObject({ label: 'Root-Touch', isSizeAware: false });
    expect(groups[1]).toMatchObject({ label: 'Single Tone Color', isSizeAware: true });
    expect(groups[1].options).toHaveLength(5);
  });

  it('treats each distinct haircut label as its own single-option group', () => {
    const groups = groupOptionsByLabel(haircut.options);
    expect(groups).toHaveLength(5);
    expect(groups.every((g) => !g.isSizeAware)).toBe(true);
  });

  it('preserves size order within a group', () => {
    const groups = groupOptionsByLabel(coloring.options);
    expect(groups[1].options.map((o) => o.size)).toEqual(['ES', 'S', 'M', 'L', 'EL']);
  });

  it('handles partial size sets without inventing missing sizes', () => {
    const groups = groupOptionsByLabel(perming.options);
    const digital = groups.find((g) => g.label === 'Digital Perm')!;
    expect(digital.options.map((o) => o.size)).toEqual(['S', 'M', 'L', 'EL']);
  });

  it('preserves the source order of groups', () => {
    const groups = groupOptionsByLabel(perming.options);
    expect(groups.map((g) => g.label)).toEqual(['Cold Perm', 'Digital Perm']);
  });
});

describe('calculateEstimate', () => {
  it('returns zeroes for an empty cart', () => {
    expect(calculateEstimate([])).toEqual({ priceFrom: 0, durationMin: 0, itemCount: 0 });
  });

  it('totals the spec example: colour (M) plus intensive scalp', () => {
    const result = calculateEstimate([
      { optionId: 'coloring-single-tone-m', qty: 1 },
      { optionId: 'treatment-intensive-scalp', qty: 1 },
    ]);
    expect(result.priceFrom).toBe(410);
    expect(result.durationMin).toBe(180);
    expect(result.itemCount).toBe(2);
  });

  it('multiplies by quantity', () => {
    const result = calculateEstimate([{ optionId: 'haircut-kid-junior', qty: 3 }]);
    expect(result.priceFrom).toBe(90);
    expect(result.durationMin).toBe(90);
    expect(result.itemCount).toBe(3);
  });

  it('skips unknown option ids instead of throwing', () => {
    const result = calculateEstimate([
      { optionId: 'coloring-single-tone-m', qty: 1 },
      { optionId: 'ghost-option', qty: 2 },
    ]);
    expect(result.priceFrom).toBe(250);
    expect(result.itemCount).toBe(1);
  });

  it('ignores non-positive quantities', () => {
    const result = calculateEstimate([{ optionId: 'haircut-female', qty: 0 }]);
    expect(result).toEqual({ priceFrom: 0, durationMin: 0, itemCount: 0 });
  });
});

describe('buildWhatsAppUrl', () => {
  it('uses the corrected 12-digit number', () => {
    const url = buildWhatsAppUrl([{ optionId: 'haircut-female', qty: 1 }]);
    expect(url.startsWith('https://wa.me/601172267229?text=')).toBe(true);
  });

  it('encodes every selected service and the total', () => {
    const url = buildWhatsAppUrl([
      { optionId: 'coloring-single-tone-m', qty: 1 },
      { optionId: 'treatment-intensive-scalp', qty: 1 },
    ]);
    const text = decodeURIComponent(url.split('?text=')[1]);
    expect(text).toContain('Single Tone Color (Medium)');
    expect(text).toContain('Intensive Scalp Treatment');
    expect(text).toContain('RM 410');
  });

  it('shows quantity only when greater than one', () => {
    const url = buildWhatsAppUrl([{ optionId: 'haircut-kid-junior', qty: 2 }]);
    const text = decodeURIComponent(url.split('?text=')[1]);
    expect(text).toContain('× 2');
  });

  it('truncates very long carts to keep the URL valid', () => {
    const lines = Array.from({ length: 40 }, () => ({
      optionId: 'coloring-single-tone-el',
      qty: 9,
    }));
    const url = buildWhatsAppUrl(lines);
    expect(url.length).toBeLessThan(2000);
  });
});
```

- [ ] **Step 6: Run to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `@/lib/estimate`.

- [ ] **Step 7: Implement the estimate logic**

Create `lib/estimate.ts`. Pure functions only — no React import belongs in this file.

```ts
import {
  allOptions,
  SIZE_LABELS,
  SIZE_ORDER,
  type CartLine,
  type ServiceOption,
} from '@/data/services';
import { site } from '@/data/site';
import { formatPrice } from '@/lib/format';

export interface OptionGroup {
  label: string;
  isSizeAware: boolean;
  options: ServiceOption[];
}

export interface EstimateTotals {
  priceFrom: number;
  durationMin: number;
  itemCount: number;
}

/** Max characters for the WhatsApp message body, before encoding. */
const MAX_MESSAGE_LENGTH = 900;

export function findOption(id: string): ServiceOption | undefined {
  return allOptions.find((o) => o.id === id);
}

export function optionDisplayName(option: ServiceOption): string {
  return option.size ? `${option.label} (${SIZE_LABELS[option.size].name})` : option.label;
}

/**
 * Groups options sharing a label into size-variant groups, preserving source
 * order for groups and canonical length order within them. Groups with a
 * single unsized option come back as isSizeAware: false.
 */
export function groupOptionsByLabel(options: ServiceOption[]): OptionGroup[] {
  const groups: OptionGroup[] = [];
  const index = new Map<string, OptionGroup>();

  for (const option of options) {
    let group = index.get(option.label);
    if (!group) {
      group = { label: option.label, isSizeAware: false, options: [] };
      index.set(option.label, group);
      groups.push(group);
    }
    group.options.push(option);
  }

  for (const group of groups) {
    group.isSizeAware = group.options.some((o) => o.size !== undefined);
    if (group.isSizeAware) {
      group.options.sort(
        (a, b) => SIZE_ORDER.indexOf(a.size!) - SIZE_ORDER.indexOf(b.size!),
      );
    }
  }

  return groups;
}

/**
 * Sums a cart. Unknown ids and non-positive quantities are skipped rather than
 * throwing — a stale link should degrade, not crash the page.
 *
 * durationMin assumes services run back-to-back, which overstates a real
 * combined visit. Present it as approximate.
 */
export function calculateEstimate(lines: CartLine[]): EstimateTotals {
  return lines.reduce<EstimateTotals>(
    (totals, line) => {
      const option = findOption(line.optionId);
      if (!option || line.qty <= 0) return totals;
      return {
        priceFrom: totals.priceFrom + option.priceFrom * line.qty,
        durationMin: totals.durationMin + option.durationMin * line.qty,
        itemCount: totals.itemCount + line.qty,
      };
    },
    { priceFrom: 0, durationMin: 0, itemCount: 0 },
  );
}

function buildWhatsAppMessage(lines: CartLine[]): string {
  const items = lines
    .map((line) => {
      const option = findOption(line.optionId);
      if (!option || line.qty <= 0) return null;
      const qty = line.qty > 1 ? ` × ${line.qty}` : '';
      return `• ${optionDisplayName(option)}${qty}`;
    })
    .filter((line): line is string => line !== null);

  const { priceFrom } = calculateEstimate(lines);
  const header = `Hi ${site.name}, I'd like to book:`;
  const footer = `\nEstimated total: from ${formatPrice(priceFrom)}`;

  let body = items.join('\n');
  if (body.length > MAX_MESSAGE_LENGTH) {
    body = `${body.slice(0, MAX_MESSAGE_LENGTH)}\n… and more`;
  }

  return `${header}\n${body}${footer}`;
}

export function buildWhatsAppUrl(lines: CartLine[]): string {
  const text = encodeURIComponent(buildWhatsAppMessage(lines));
  return `https://wa.me/${site.whatsappNumber}?text=${text}`;
}
```

- [ ] **Step 8: Run to verify it passes**

Run: `npm test`
Expected: PASS, all estimate tests green.

- [ ] **Step 9: Remove the smoke test**

It has served its purpose — the real suites now prove the harness works.

```bash
rm lib/__tests__/smoke.test.ts
```

Run: `npm test`
Expected: PASS, still green without it.

- [ ] **Step 10: Commit**

```bash
git add lib
git commit -m "feat: add estimate and formatting logic with unit tests"
```

---

### Task 4: UI primitives

**Files:**
- Create: `components/ui/Section.tsx`, `components/ui/Reveal.tsx`, `components/ui/Placeholder.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks
- Produces:
  - `<Section id tone="ink"|"cream" className children />`
  - `<Reveal delay?: number children />` (client component)
  - `<Placeholder ratio label? className />`

- [ ] **Step 1: Create the Section wrapper**

Create `components/ui/Section.tsx`. Single source of truth for vertical rhythm and the ink/cream alternation.

```tsx
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
```

- [ ] **Step 2: Create the Reveal animation wrapper**

Create `components/ui/Reveal.tsx`. Note the reduced-motion branch renders visible immediately — it does not merely skip the transition, which would strand content at `opacity: 0`.

```tsx
'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface RevealProps {
  delay?: number;
  children: ReactNode;
}

export function Reveal({ delay = 0, children }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      }`}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Create the Placeholder**

Create `components/ui/Placeholder.tsx`. Fixed aspect ratios now mean real photography drops in later with no reflow.

```tsx
interface PlaceholderProps {
  /** CSS aspect-ratio value, e.g. "16/9", "3/4", "1/1". */
  ratio: string;
  label?: string;
  className?: string;
}

export function Placeholder({ ratio, label, className = '' }: PlaceholderProps) {
  return (
    <div
      style={{ aspectRatio: ratio }}
      className={`relative w-full overflow-hidden bg-gradient-to-br from-[#141414] via-[#1c1a17] to-[#0a0a0a] ${className}`}
      role="img"
      aria-label={label ?? 'Photography coming soon'}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #f5f2ec 1px, transparent 0)',
          backgroundSize: '4px 4px',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-lg tracking-[0.35em] text-gold/40">IKI</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add components/ui
git commit -m "feat: add Section, Reveal, and Placeholder UI primitives"
```

---

### Task 5: Hair length picker

**Files:**
- Create: `components/calculator/LengthSilhouette.tsx`, `components/calculator/LengthPicker.tsx`

**Interfaces:**
- Consumes: `SizeCode`, `SIZE_LABELS` from `@/data/services`
- Produces:
  - `<LengthSilhouette size: SizeCode className? />`
  - `<LengthPicker sizes: SizeCode[] value: SizeCode|null onChange: (s: SizeCode) => void />`

- [ ] **Step 1: Create the silhouettes**

Create `components/calculator/LengthSilhouette.tsx`. One shared head, five hair paths of increasing length. `aria-hidden` throughout — the text labels in the picker carry all meaning.

```tsx
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
```

- [ ] **Step 2: Create the picker**

Create `components/calculator/LengthPicker.tsx`. A real radiogroup, and it renders only the sizes passed in — Digital Perm has no ES, Styling has only S and L.

```tsx
'use client';

import { SIZE_LABELS, type SizeCode } from '@/data/services';
import { LengthSilhouette } from './LengthSilhouette';

interface LengthPickerProps {
  sizes: SizeCode[];
  value: SizeCode | null;
  onChange: (size: SizeCode) => void;
}

export function LengthPicker({ sizes, value, onChange }: LengthPickerProps) {
  return (
    <div>
      <p className="mb-4 text-sm uppercase tracking-[0.2em] text-cream/50">
        Your hair length
      </p>
      <div
        role="radiogroup"
        aria-label="Hair length"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5"
      >
        {sizes.map((size) => {
          const selected = value === size;
          return (
            <button
              key={size}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(size)}
              className={`flex flex-col items-center gap-2 border p-4 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                selected
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-cream/15 text-cream/70 hover:border-cream/40'
              }`}
            >
              <LengthSilhouette size={size} className="h-16 w-12" />
              <span className="font-display text-base leading-tight">
                {SIZE_LABELS[size].name}
              </span>
              <span className="text-xs leading-tight opacity-60">
                {SIZE_LABELS[size].descriptor}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/calculator
git commit -m "feat: add SVG hair length picker"
```

---

### Task 6: Category tabs and option picker

**Files:**
- Create: `components/calculator/CategoryTabs.tsx`, `components/calculator/OptionPicker.tsx`

**Interfaces:**
- Consumes: `ServiceCategory`, `SizeCode` from `@/data/services`; `OptionGroup`, `groupOptionsByLabel`, `optionDisplayName` from `@/lib/estimate`; `formatDuration`, `formatPrice` from `@/lib/format`; `<LengthPicker>` from Task 5
- Produces:
  - `<CategoryTabs categories value onChange />`
  - `<OptionPicker category onAdd: (optionId: string) => void />`

- [ ] **Step 1: Create the tabs**

Create `components/calculator/CategoryTabs.tsx`. Real ARIA tablist with arrow-key navigation.

```tsx
'use client';

import { useRef } from 'react';
import type { ServiceCategory } from '@/data/services';

interface CategoryTabsProps {
  categories: ServiceCategory[];
  value: string;
  onChange: (id: string) => void;
}

export function CategoryTabs({ categories, value, onChange }: CategoryTabsProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(event: React.KeyboardEvent, index: number) {
    const delta =
      event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (delta === 0) return;
    event.preventDefault();
    const next = (index + delta + categories.length) % categories.length;
    onChange(categories[next].id);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label="Service categories"
      className="flex flex-wrap gap-x-6 gap-y-3 border-b border-cream/15 pb-4"
    >
      {categories.map((category, index) => {
        const selected = category.id === value;
        return (
          <button
            key={category.id}
            ref={(el) => {
              refs.current[index] = el;
            }}
            role="tab"
            type="button"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(category.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`font-display text-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold md:text-2xl ${
              selected ? 'text-gold' : 'text-cream/50 hover:text-cream'
            }`}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Create the option picker**

Create `components/calculator/OptionPicker.tsx`. Selecting a size-aware group reveals the length picker; the Add button stays disabled until a length is chosen.

```tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ServiceCategory, SizeCode } from '@/data/services';
import { groupOptionsByLabel } from '@/lib/estimate';
import { formatDuration, formatPrice } from '@/lib/format';
import { LengthPicker } from './LengthPicker';

interface OptionPickerProps {
  category: ServiceCategory;
  onAdd: (optionId: string) => void;
}

export function OptionPicker({ category, onAdd }: OptionPickerProps) {
  const groups = useMemo(
    () => groupOptionsByLabel(category.options),
    [category],
  );
  const [groupLabel, setGroupLabel] = useState<string | null>(null);
  const [size, setSize] = useState<SizeCode | null>(null);

  // Reset selection whenever the category changes.
  useEffect(() => {
    setGroupLabel(null);
    setSize(null);
  }, [category.id]);

  const group = groups.find((g) => g.label === groupLabel) ?? null;
  const selectedOption = group
    ? group.isSizeAware
      ? group.options.find((o) => o.size === size) ?? null
      : group.options[0]
    : null;

  const sizes = group?.isSizeAware
    ? (group.options.map((o) => o.size).filter(Boolean) as SizeCode[])
    : [];

  return (
    <div className="space-y-8">
      <p className="max-w-xl text-cream/60">{category.blurb}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        {groups.map((g) => {
          const selected = g.label === groupLabel;
          const cheapest = Math.min(...g.options.map((o) => o.priceFrom));
          return (
            <button
              key={g.label}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                setGroupLabel(g.label);
                setSize(null);
              }}
              className={`flex items-baseline justify-between border p-5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                selected
                  ? 'border-gold bg-gold/10'
                  : 'border-cream/15 hover:border-cream/40'
              }`}
            >
              <span className="font-display text-xl">{g.label}</span>
              <span className="ml-4 shrink-0 text-sm text-gold">
                from {formatPrice(cheapest)}
              </span>
            </button>
          );
        })}
      </div>

      {group?.isSizeAware && (
        <LengthPicker sizes={sizes} value={size} onChange={setSize} />
      )}

      <div className="flex flex-wrap items-center gap-6">
        <button
          type="button"
          disabled={!selectedOption}
          onClick={() => selectedOption && onAdd(selectedOption.id)}
          className="border border-gold px-8 py-3 text-sm uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-not-allowed disabled:border-cream/20 disabled:text-cream/30 disabled:hover:bg-transparent"
        >
          Add to estimate
        </button>
        {selectedOption && (
          <p className="text-sm text-cream/60">
            from {formatPrice(selectedOption.priceFrom)} ·{' '}
            {formatDuration(selectedOption.durationMin)}
          </p>
        )}
        {group?.isSizeAware && !size && (
          <p className="text-sm text-cream/40">Select a hair length to continue.</p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify in the browser**

Temporarily render the picker by replacing `app/page.tsx`:

```tsx
'use client';

import { OptionPicker } from '@/components/calculator/OptionPicker';
import { serviceCategories } from '@/data/services';

export default function Home() {
  const coloring = serviceCategories.find((c) => c.id === 'coloring')!;
  return (
    <main className="min-h-screen bg-ink p-12">
      <OptionPicker category={coloring} onAdd={(id) => console.log('add', id)} />
    </main>
  );
}
```

Run: `npm run dev`
Expected: two option cards. Clicking "Single Tone Color" reveals five silhouettes; "Root-Touch" does not. Add is disabled until a length is picked. Arrow keys are not testable here yet — tabs come in Task 7. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add components/calculator
git commit -m "feat: add category tabs and option picker"
```

---

### Task 7: Calculator container, cart, and summary

**Files:**
- Create: `components/calculator/EstimateCart.tsx`, `components/calculator/EstimateSummary.tsx`, `components/calculator/Calculator.tsx`

**Interfaces:**
- Consumes: everything from Tasks 2, 3, 5, 6
- Produces: `<Calculator />` — the complete self-contained feature, ready for Task 8 to drop into the Services section

- [ ] **Step 1: Create the cart**

Create `components/calculator/EstimateCart.tsx`:

```tsx
'use client';

import type { CartLine } from '@/data/services';
import { findOption, optionDisplayName } from '@/lib/estimate';
import { formatDuration, formatPrice } from '@/lib/format';

interface EstimateCartProps {
  lines: CartLine[];
  onChangeQty: (optionId: string, qty: number) => void;
  onRemove: (optionId: string) => void;
}

export function EstimateCart({ lines, onChangeQty, onRemove }: EstimateCartProps) {
  if (lines.length === 0) {
    return (
      <p className="text-sm text-cream/40">
        Nothing selected yet. Add a service to build your estimate.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-cream/10">
      {lines.map((line) => {
        const option = findOption(line.optionId);
        if (!option) return null;
        return (
          <li key={line.optionId} className="flex items-center gap-4 py-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg">
                {optionDisplayName(option)}
              </p>
              <p className="text-sm text-cream/50">
                from {formatPrice(option.priceFrom)} ·{' '}
                {formatDuration(option.durationMin)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={`Decrease quantity of ${optionDisplayName(option)}`}
                onClick={() => onChangeQty(line.optionId, line.qty - 1)}
                className="h-8 w-8 border border-cream/20 text-cream/70 hover:border-gold hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                −
              </button>
              <span aria-live="polite" className="w-6 text-center text-sm">
                {line.qty}
              </span>
              <button
                type="button"
                aria-label={`Increase quantity of ${optionDisplayName(option)}`}
                onClick={() => onChangeQty(line.optionId, line.qty + 1)}
                className="h-8 w-8 border border-cream/20 text-cream/70 hover:border-gold hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                +
              </button>
            </div>

            <button
              type="button"
              aria-label={`Remove ${optionDisplayName(option)}`}
              onClick={() => onRemove(line.optionId)}
              className="text-sm text-cream/40 underline-offset-4 hover:text-cream hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Remove
            </button>
          </li>
        );
      })}
    </ul>
  );
}
```

- [ ] **Step 2: Create the summary**

Create `components/calculator/EstimateSummary.tsx`. Both CTAs disable on an empty cart. The duration caveat is spelled out rather than implied.

```tsx
'use client';

import type { CartLine } from '@/data/services';
import { site } from '@/data/site';
import { buildWhatsAppUrl, calculateEstimate } from '@/lib/estimate';
import { formatDuration, formatPrice } from '@/lib/format';

export function EstimateSummary({ lines }: { lines: CartLine[] }) {
  const { priceFrom, durationMin, itemCount } = calculateEstimate(lines);
  const empty = itemCount === 0;

  return (
    <div className="border border-gold/30 p-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-cream/50">
            Estimated total
          </p>
          <p className="font-display text-4xl text-gold md:text-5xl">
            {empty ? '—' : `from ${formatPrice(priceFrom)}`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.25em] text-cream/50">
            Estimated time in salon
          </p>
          <p className="font-display text-2xl">{formatDuration(durationMin)}</p>
        </div>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-cream/50">
        Final price may vary based on hair condition and length — confirmed
        in-salon. Where several services are combined, actual time is usually
        shorter than the total shown.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href={site.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={empty}
          onClick={(e) => empty && e.preventDefault()}
          className={`flex-1 border px-8 py-4 text-center text-sm uppercase tracking-[0.2em] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
            empty
              ? 'pointer-events-none border-cream/20 text-cream/30'
              : 'border-gold bg-gold text-ink hover:bg-transparent hover:text-gold'
          }`}
        >
          Book on Tunai
        </a>
        <a
          href={empty ? undefined : buildWhatsAppUrl(lines)}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={empty}
          onClick={(e) => empty && e.preventDefault()}
          className={`flex-1 border px-8 py-4 text-center text-sm uppercase tracking-[0.2em] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
            empty
              ? 'pointer-events-none border-cream/20 text-cream/30'
              : 'border-gold text-gold hover:bg-gold hover:text-ink'
          }`}
        >
          Send via WhatsApp
        </a>
      </div>

      {empty && (
        <p className="mt-4 text-center text-xs text-cream/40">
          Add at least one service to book.
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create the container**

Create `components/calculator/Calculator.tsx`. Cart state initialises empty on both server and client, so hydration cannot mismatch.

```tsx
'use client';

import { useState } from 'react';
import { serviceCategories, type CartLine } from '@/data/services';
import { CategoryTabs } from './CategoryTabs';
import { EstimateCart } from './EstimateCart';
import { EstimateSummary } from './EstimateSummary';
import { OptionPicker } from './OptionPicker';

export function Calculator() {
  const [categoryId, setCategoryId] = useState(serviceCategories[0].id);
  const [lines, setLines] = useState<CartLine[]>([]);

  const category =
    serviceCategories.find((c) => c.id === categoryId) ?? serviceCategories[0];

  function addOption(optionId: string) {
    setLines((current) => {
      const existing = current.find((l) => l.optionId === optionId);
      if (existing) {
        return current.map((l) =>
          l.optionId === optionId ? { ...l, qty: l.qty + 1 } : l,
        );
      }
      return [...current, { optionId, qty: 1 }];
    });
  }

  function changeQty(optionId: string, qty: number) {
    if (qty <= 0) {
      removeOption(optionId);
      return;
    }
    setLines((current) =>
      current.map((l) => (l.optionId === optionId ? { ...l, qty } : l)),
    );
  }

  function removeOption(optionId: string) {
    setLines((current) => current.filter((l) => l.optionId !== optionId));
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
      <div className="space-y-10">
        <CategoryTabs
          categories={serviceCategories}
          value={categoryId}
          onChange={setCategoryId}
        />
        <OptionPicker category={category} onAdd={addOption} />
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="mb-4 font-display text-2xl">Your estimate</h3>
          <EstimateCart
            lines={lines}
            onChangeQty={changeQty}
            onRemove={removeOption}
          />
        </div>
        <EstimateSummary lines={lines} />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify the whole flow in the browser**

Replace `app/page.tsx`:

```tsx
import { Calculator } from '@/components/calculator/Calculator';

export default function Home() {
  return (
    <main className="min-h-screen bg-ink p-6 md:p-12">
      <Calculator />
    </main>
  );
}
```

Run: `npm run dev`

Expected, checked in order:
1. Coloring → Single Tone Color → Medium → Add. Cart shows "Single Tone Color (Medium)", total `from RM 250`, time `2 hr`.
2. Treatment tab → Intensive Scalp Treatment → Add. Total `from RM 410`, time `3 hr`.
3. Press `+` on a line. Total rises by that line's price.
4. Press `−` down to zero. The line disappears.
5. Empty the cart. Both CTAs grey out and the hint appears.
6. Focus a tab, press ArrowRight. The next category selects and takes focus.

Stop the server.

- [ ] **Step 5: Commit**

```bash
git add components/calculator app/page.tsx
git commit -m "feat: add calculator container with cart and estimate summary"
```

---

### Task 8: Hero, About, and Services sections

**Files:**
- Create: `components/sections/Hero.tsx`, `components/sections/About.tsx`, `components/sections/Services.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `<Section>`, `<Reveal>`, `<Placeholder>` from Task 4; `<Calculator>` from Task 7; `site` from Task 2
- Produces: `<Hero>`, `<About>`, `<Services>`

- [ ] **Step 1: Create the Hero**

Create `components/sections/Hero.tsx`:

```tsx
import { site } from '@/data/site';
import { Placeholder } from '@/components/ui/Placeholder';

export function Hero() {
  return (
    <section id="hero" className="relative min-h-[88vh] w-full overflow-hidden">
      <Placeholder ratio="16/9" className="absolute inset-0 h-full" label="Salon interior" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
      <div className="relative flex min-h-[88vh] flex-col items-center justify-center px-6 text-center">
        <p className="mb-6 text-xs uppercase tracking-[0.4em] text-gold">
          Bandar Rimbayu
        </p>
        <h1 className="font-display text-6xl font-light leading-none md:text-8xl">
          {site.name}
        </h1>
        <p className="mt-6 font-display text-2xl italic text-cream/70 md:text-3xl">
          {site.tagline}
        </p>
        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <a
            href={site.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gold bg-gold px-10 py-4 text-sm uppercase tracking-[0.2em] text-ink transition-colors hover:bg-transparent hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Book Now
          </a>
          <a
            href="#services"
            className="border border-cream/30 px-10 py-4 text-sm uppercase tracking-[0.2em] text-cream transition-colors hover:border-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Estimate a price
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create About**

Create `components/sections/About.tsx`. Cream section — per the global contrast rule, gold appears here only as a rule and as large display type, never as body copy.

```tsx
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';

export function About() {
  return (
    <Section id="about" tone="cream">
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-10 h-px w-16 bg-gold" />
          <h2 className="font-display text-4xl font-light leading-tight md:text-5xl">
            Hair care shaped around your life, not the other way round.
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-ink/70">
            Cutting, styling, colouring, perming and treatments — each tailored to
            suit your lifestyle and personality. We work slowly and deliberately,
            with time to understand your hair before we touch it.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-ink/70">
            No rush, no upsell. Just a considered result you can maintain at home.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
```

- [ ] **Step 3: Create Services**

Create `components/sections/Services.tsx`:

```tsx
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
```

- [ ] **Step 4: Compose the page**

Replace `app/page.tsx`:

```tsx
import { About } from '@/components/sections/About';
import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Services />
    </main>
  );
}
```

- [ ] **Step 5: Verify**

Run: `npm run dev`
Expected: full-bleed hero with gold CTA, "Estimate a price" scrolls smoothly to the calculator, cream About section between them, calculator still fully functional. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add components/sections app/page.tsx
git commit -m "feat: add hero, about, and services sections"
```

---

### Task 9: Gallery and Team sections

**Files:**
- Create: `components/sections/Gallery.tsx`, `components/sections/Team.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `<Section>`, `<Reveal>`, `<Placeholder>`; `site.team`
- Produces: `<Gallery>`, `<Team>`

- [ ] **Step 1: Create the Gallery**

Create `components/sections/Gallery.tsx`. Fixed, varied ratios so real photos drop in without reflow. No lightbox — out of scope for v1.

```tsx
import { Placeholder } from '@/components/ui/Placeholder';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';

const TILES = [
  { ratio: '3/4', span: 'md:row-span-2' },
  { ratio: '4/3', span: '' },
  { ratio: '1/1', span: '' },
  { ratio: '4/3', span: '' },
  { ratio: '3/4', span: 'md:row-span-2' },
  { ratio: '4/3', span: '' },
];

export function Gallery() {
  return (
    <Section id="gallery">
      <Reveal>
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">Work</p>
          <h2 className="font-display text-4xl font-light md:text-5xl">
            Recent from the chair
          </h2>
        </div>
      </Reveal>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {TILES.map((tile, index) => (
          <Reveal key={index} delay={index * 60}>
            <Placeholder
              ratio={tile.ratio}
              className={tile.span}
              label={`Salon work sample ${index + 1}`}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Create the Team**

Create `components/sections/Team.tsx`. Gold monograms rather than grey avatars.

```tsx
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
```

- [ ] **Step 3: Add to the page**

In `app/page.tsx`, add the imports and render `<Gallery />` and `<Team />` after `<Services />`:

```tsx
import { About } from '@/components/sections/About';
import { Gallery } from '@/components/sections/Gallery';
import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { Team } from '@/components/sections/Team';

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Services />
      <Gallery />
      <Team />
    </main>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npm run dev`
Expected: gallery tiles fade in staggered as you scroll; team shows two gold monogram circles. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add components/sections app/page.tsx
git commit -m "feat: add gallery and team sections"
```

---

### Task 10: Location, Footer, metadata, and JSON-LD

**Files:**
- Create: `components/sections/Location.tsx`, `components/sections/Footer.tsx`
- Modify: `app/page.tsx`, `app/layout.tsx`

**Interfaces:**
- Consumes: `site` from Task 2; `<Section>`, `<Reveal>`
- Produces: `<Location>`, `<Footer>`; full page metadata and `HairSalon` structured data

- [ ] **Step 1: Create the Location section**

Create `components/sections/Location.tsx`. Cream section — gold used only for the rule and large type. The closed Tuesday is marked explicitly rather than merely omitted.

```tsx
import { site } from '@/data/site';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';

const MAP_QUERY = encodeURIComponent('Bandar Rimbayu, Telok Panglima Garang, Selangor');

export function Location() {
  return (
    <Section id="location" tone="cream">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div>
            <div className="mb-8 h-px w-16 bg-gold" />
            <h2 className="font-display text-4xl font-light md:text-5xl">
              Find us
            </h2>

            <address className="mt-8 not-italic leading-relaxed text-ink/70">
              {site.address.line1}
              <br />
              {site.address.line2}
              <br />
              {site.address.region}
            </address>

            <dl className="mt-10 space-y-2">
              {site.hours.map((entry) => {
                const closed = entry.open === null;
                return (
                  <div key={entry.day} className="flex justify-between border-b border-ink/10 py-2">
                    <dt className={closed ? 'text-ink/40' : 'text-ink/80'}>
                      {entry.day}
                    </dt>
                    <dd className={closed ? 'text-ink/40' : 'text-ink/80'}>
                      {closed ? 'Closed' : `${entry.open} – ${entry.close}`}
                    </dd>
                  </div>
                );
              })}
            </dl>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href={`https://wa.me/${site.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-ink px-8 py-3 text-center text-sm uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              >
                WhatsApp {site.phoneDisplay}
              </a>
              <a
                href={site.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-ink bg-ink px-8 py-3 text-center text-sm uppercase tracking-[0.2em] text-cream transition-colors hover:bg-transparent hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              >
                Book Now
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <iframe
            title="Map showing Iki Hair Studio location"
            src={`https://maps.google.com/maps?q=${MAP_QUERY}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full min-h-[380px] w-full border border-ink/10"
          />
        </Reveal>
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Create the Footer**

Create `components/sections/Footer.tsx`:

```tsx
import { site } from '@/data/site';

export function Footer() {
  return (
    <footer className="border-t border-cream/10 bg-ink px-6 py-14 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <p className="font-display text-2xl">{site.name}</p>
          <p className="mt-1 text-sm italic text-cream/40">{site.tagline}</p>
        </div>

        <nav className="flex gap-8 text-sm uppercase tracking-[0.2em] text-cream/60">
          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Instagram
          </a>
          <a
            href={`https://wa.me/${site.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            WhatsApp
          </a>
          <a
            href={site.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Book
          </a>
        </nav>

        <p className="text-xs text-cream/30">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Complete the page**

Replace `app/page.tsx`:

```tsx
import { About } from '@/components/sections/About';
import { Footer } from '@/components/sections/Footer';
import { Gallery } from '@/components/sections/Gallery';
import { Hero } from '@/components/sections/Hero';
import { Location } from '@/components/sections/Location';
import { Services } from '@/components/sections/Services';
import { Team } from '@/components/sections/Team';

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <About />
        <Services />
        <Gallery />
        <Team />
        <Location />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Add metadata and structured data**

In `app/layout.tsx`, replace the `metadata` export and add JSON-LD to the body. Keep the existing font setup untouched.

```tsx
export const metadata: Metadata = {
  title: 'Iki Hair Studio — Bandar Rimbayu',
  description:
    'A calm, considered hair studio in Bandar Rimbayu. Cutting, colouring, perming and treatments — estimate your price and book online.',
  openGraph: {
    title: 'Iki Hair Studio',
    description: 'A reason for being. Hair care shaped around your life.',
    type: 'website',
    locale: 'en_MY',
  },
};
```

Add above the closing `</body>`, importing `site` from `@/data/site`:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'HairSalon',
      name: site.name,
      slogan: site.tagline,
      telephone: `+${site.whatsappNumber}`,
      url: site.bookingUrl,
      sameAs: [site.instagramUrl],
      address: {
        '@type': 'PostalAddress',
        streetAddress: `${site.address.line1}, ${site.address.line2}`,
        addressRegion: 'Selangor',
        addressCountry: 'MY',
      },
      openingHoursSpecification: site.hours
        .filter((h) => h.open !== null)
        .map((h) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: h.day,
          opens: h.open,
          closes: h.close,
        })),
    }),
  }}
/>
```

- [ ] **Step 5: Verify**

Run: `npm run dev`
Expected: all seven sections render in order; hours list shows Tuesday greyed and marked "Closed"; map iframe loads. View source and confirm the `application/ld+json` block is present and contains six opening-hours entries (not seven). Stop the server.

- [ ] **Step 6: Commit**

```bash
git add components/sections app/page.tsx app/layout.tsx
git commit -m "feat: add location, footer, metadata, and HairSalon structured data"
```

---

### Task 11: End-to-end test and release verification

**Files:**
- Create: `playwright.config.ts`, `e2e/calculator.spec.ts`
- Modify: `package.json`, `.gitignore`

**Interfaces:**
- Consumes: the complete running app
- Produces: `npm run test:e2e`

- [ ] **Step 1: Install the browser binary**

```bash
npx playwright install chromium
```

- [ ] **Step 2: Create the Playwright config**

Create `playwright.config.ts`. It boots the dev server itself, so the test is a single command.

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:3000' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- [ ] **Step 3: Write the end-to-end happy path**

Create `e2e/calculator.spec.ts`. This is the spec's §7 acceptance path.

```ts
import { expect, test } from '@playwright/test';

test('builds a two-service estimate and hands off to WhatsApp', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('tab', { name: 'Coloring' }).click();
  await page.getByRole('button', { name: 'Single Tone Color' }).click();

  const lengths = page.getByRole('radiogroup', { name: 'Hair length' });
  await expect(lengths).toBeVisible();
  await lengths.getByRole('radio', { name: /Medium/ }).click();

  await page.getByRole('button', { name: 'Add to estimate' }).click();
  await expect(page.getByText('from RM 250')).toBeVisible();

  await page.getByRole('tab', { name: 'Treatment' }).click();
  await page.getByRole('button', { name: 'Intensive Scalp Treatment' }).click();
  await page.getByRole('button', { name: 'Add to estimate' }).click();

  await expect(page.getByText('from RM 410')).toBeVisible();
  await expect(page.getByText('3 hr')).toBeVisible();

  const whatsapp = page.getByRole('link', { name: 'Send via WhatsApp' });
  const href = await whatsapp.getAttribute('href');
  expect(href).toContain('wa.me/601172267229');

  const text = decodeURIComponent(href!.split('?text=')[1]);
  expect(text).toContain('Single Tone Color (Medium)');
  expect(text).toContain('Intensive Scalp Treatment');
  expect(text).toContain('RM 410');
});

test('disables booking on an empty estimate', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Add at least one service to book.')).toBeVisible();
});
```

- [ ] **Step 4: Add the script and ignore artifacts**

In `package.json` scripts:

```json
"test:e2e": "playwright test"
```

Append to `.gitignore`:

```
/test-results
/playwright-report
/.playwright
```

- [ ] **Step 5: Run the E2E suite**

Run: `npm run test:e2e`
Expected: 2 passed.

If a selector fails, fix the *test's* selector to match the accessible name the component actually exposes — do not weaken a component's accessibility to satisfy the test.

- [ ] **Step 6: Run the full verification sweep**

```bash
npm test && npm run lint && npm run build
```

Expected: unit tests pass, lint clean, production build succeeds with no type errors.

- [ ] **Step 7: Manual checks the automated suite cannot cover**

Run `npm run dev` and confirm each:

1. **375px width** — DevTools device toolbar at iPhone SE. No horizontal scroll anywhere; the calculator stacks to one column; tabs wrap rather than overflow.
2. **Reduced motion** — DevTools → Rendering → "Emulate prefers-reduced-motion: reduce". Reload. All section content is visible immediately; nothing is stuck faded out.
3. **Keyboard only** — Tab from the top of the page to the booking CTA. Every interactive element shows a visible gold focus ring; arrow keys move between category tabs.
4. **Contrast spot-check** — In the cream About and Location sections, confirm no gold text is used for body copy (rules and headings only).

- [ ] **Step 8: Commit**

```bash
git add playwright.config.ts e2e package.json .gitignore
git commit -m "test: add end-to-end calculator flow"
```

---

## Deployment note

Vercel, standard Next.js build, zero config: import the repo and deploy. No environment variables are required — the site has no backend, no API keys, and no server-side data fetching.

## Carried-forward items

These do not block launch but should be resolved before the site is promoted:

1. **Confirm the WhatsApp number.** `data/site.ts` uses `601172267229`, derived from the displayed `011-7226 7229`. `PROJECT.md` §7.5's 11-digit link is a typo. Verify against the salon's real account.
2. **Real photography** replaces `<Placeholder>` with `next/image` at the identical ratios — no layout changes required.
3. **Vector logo** would replace the "IKI" wordmark inside `Placeholder` and the team monograms.
4. **Tunai deep links:** if per-service booking URLs exist, `EstimateSummary` could link to the specific service instead of the general booking page.
