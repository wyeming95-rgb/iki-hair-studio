# Iki Hair Studio — Website Design Spec

**Date:** 2026-07-19
**Status:** Approved
**Source requirements:** `PROJECT.md`

## 1. Scope

A single-page marketing site for Iki Hair Studio (Bandar Rimbayu, Selangor), whose
core feature is a client-side price calculator. Booking is handed off to the
salon's existing Tunai system; this site never takes an appointment itself.

Decisions made during brainstorming that resolve open questions in `PROJECT.md`:

| Question | Resolution |
|---|---|
| §7.3 single vs. multi-service estimate | **Multi-service cart** in v1, with per-line quantity defaulting to 1 |
| §7 length picker treatment | **Inline SVG silhouettes**, hand-drawn, no image assets |
| §4 deploy target | **Vercel, standard Next.js build** (keeps `next/image`) |
| §8 missing photography | **Designed placeholders** at final aspect ratios |

## 2. Architecture

Next.js App Router, one route (`/`). Server components by default; only the
calculator subtree is `'use client'`.

```
app/          layout.tsx (fonts, metadata, JSON-LD) · page.tsx · globals.css
components/
  sections/   Hero About Services Gallery Team Location Footer
  calculator/ Calculator CategoryTabs OptionPicker LengthPicker
              LengthSilhouette EstimateCart EstimateSummary
  ui/         Section Placeholder Reveal
data/         services.ts (pricing) · site.ts (hours, phone, address, links)
lib/          estimate.ts (pure math) · format.ts
```

All totalling and formatting lives in `lib/estimate.ts` as pure functions over
plain data, with no React dependency. This is the only logic that can be
numerically wrong, so it is the only logic that is unit tested. Components
render state; they do not compute it.

`data/services.ts` and `data/site.ts` are the sole files requiring edits to
change prices or business hours. Typed, commented, no JSX.

## 3. Data model

```ts
type SizeCode = 'ES' | 'S' | 'M' | 'L' | 'EL';

interface ServiceOption {
  id: string;          // stable slug — cart key, never reused
  label: string;       // "Single Tone Color"
  size?: SizeCode;     // present only where pricing is length-based
  priceFrom: number;   // RM
  durationMin: number; // minutes
}

interface ServiceCategory {
  id: string;
  label: string;
  blurb: string;
  options: ServiceOption[];
}

interface CartLine {
  optionId: string;
  qty: number;         // defaults to 1
}
```

Two deliberate choices:

**Duration is stored in minutes, not as a display string.** `"2 hr 30 min"`
cannot be summed for a cart total. Formatting happens at render.

**No explicit variant-group type.** Options sharing a `label` and differing by
`size` are grouped at runtime. Coloring therefore yields Root-Touch (no picker)
and Single Tone Color (five lengths) with no parallel data structure to keep in
sync.

Pricing data is transcribed verbatim from `PROJECT.md` §7 — six categories,
33 options (5 haircut, 2 styling, 6 coloring, 9 perming, 4 straightening,
7 treatment).

## 4. Calculator

Flow: category tab → option → length picker (only if that option group is
size-priced) → *Add to estimate* → cart line with quantity and remove control.

The summary displays `from RM {total}`, an estimated salon time, and the §7.4
disclaimer that final pricing is confirmed in-salon.

Summed durations assume services run back-to-back, which overstates a real
combined visit. The figure is therefore labelled "estimated time in salon" and
presented as approximate rather than as a booking duration.

Two calls to action:

- **Book on Tunai** (primary) — `https://booking.tunai.io/ikihairstudio`, new tab
- **Send via WhatsApp** (secondary) — prefills a message listing the selected
  services and the estimate, so the cart survives the handoff

### Known defect in source requirements

`PROJECT.md` §2 gives the number as `011-7226 7229`, which in international
form is `601172267229` (12 digits). §7.5's link reads `wa.me/60117226729` —
one digit short, and would fail. This spec uses the 12-digit form.
**The number must be confirmed against the salon's actual WhatsApp account
before launch.**

## 5. Visual system

Tailwind theme tokens: `ink` `#0a0a0a`, `cream` `#f5f2ec`, `gold` `#c5a572`.
Dark-dominant, with About and Location rendered in cream to break the page
rhythm.

Fonts via `next/font/google` — **Cormorant Garamond** for headings, **Inter**
for body. Self-hosted at build time: no external request, no layout shift.

Motion is a single `<Reveal>` component using IntersectionObserver — fade plus
a 12px rise, staggered by index. Under `prefers-reduced-motion` it renders
content immediately rather than merely skipping the transition, so no content
can become permanently invisible.

**Contrast constraint.** Gold on ink is ~8:1 and passes. Gold on cream is
~1.9:1 and fails WCAG. Gold is therefore never used for body text on cream —
only for rules, borders, and large display type. This constrains the cream
sections by design.

## 6. Placeholder imagery

A single `<Placeholder ratio="16/9">` component: brand gradient, subtle grain,
centred logo mark. Applied at fixed aspect ratios for the hero (full-bleed),
gallery (six tiles, mixed portrait and landscape) and team (gold monograms,
"DT" and "ML").

Ratios are fixed now so that dropping in real photography later means replacing
the component with `next/image` at the same ratio — no reflow, no redesign.

Gallery is a plain CSS grid. No lightbox in v1.

## 7. Testing

TDD against `lib/estimate.ts` using Vitest, written before implementation:

- cart totals, including quantity multiplication
- duration formatting — `30 → "30 min"`, `150 → "2 hr 30 min"`
- runtime grouping of size variants by label
- unknown `optionId` skipped rather than thrown

One Playwright happy path: Coloring → Single Tone Color → M → add →
add Intensive Scalp Treatment → assert `from RM 410` → assert the WhatsApp
href encodes both lines.

Manual verification at 375px width and with reduced motion enabled.

## 8. Error handling

Four cases, and the surface is intentionally small:

- Empty cart disables both CTAs and shows a hint line
- Unknown option ids are skipped silently by the estimate functions
- Cart state initialises empty on both server and client, so hydration cannot mismatch
- Long carts truncate the WhatsApp message to keep the URL valid

## 9. Accessibility and SEO

Category tabs are a real ARIA tablist with arrow-key navigation. The length
picker is a radiogroup; silhouettes are `aria-hidden` and the text labels carry
the meaning. Focus rings remain visible throughout.

`HairSalon` JSON-LD in the layout: address, telephone, Instagram via `sameAs`,
and opening hours encoding the Tuesday closure. This is the highest-value SEO
item available for a local business at near-zero cost.

## 10. Out of scope (v1)

Per `PROJECT.md` §9: no booking system, no CMS, no multi-language, no payments.
Additionally deferred: gallery lightbox, and any URL-encoded shareable cart
state.

## 11. Open items carried forward

These block polish, not implementation:

- Real interior, work, and team photography (§8)
- Vector logo file — currently only the circular mark on the Tunai page
- Confirmation of the WhatsApp number (see §4 above)
- Whether Tunai supports per-service deep links, which would let the calculator
  link to a specific service rather than the general booking page
