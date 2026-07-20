# Iki Hair Studio — Editorial Contrast Redesign

**Date:** 2026-07-21
**Status:** Approved design, ready for planning
**Scope:** UI redesign of the existing single-page site. No content, routing, or
data-model changes. No booking-system changes.

## 1. Goal

Keep the restraint, type, and warm palette that already work, but fix the two
things holding the site back:

1. **It reads as "waiting for photos."** The hero and team are placeholders and
   there is no new photography available.
2. **It is one flat beige.** Seven light sections in a row melt together — no
   contrast, no rhythm.

The chosen direction ("C — Editorial Contrast") solves both with **type and
contrast instead of imagery**: a deep-ink hero, a dark→light scroll rhythm, and
a typographic team treatment. Drama comes from the design, not from images the
salon does not have.

## 2. Hard constraint

**No new photography.** The only real images are the six existing gallery photos
in `public/gallery/`. The redesign must look intentional and premium without a
hero photo or team headshots. Photo usage is limited to the gallery section plus
one optional full-bleed band drawn from those same six.

## 3. Design tokens (`app/globals.css`)

Additive change to the existing `@theme` block. Nothing existing is renamed.

| Token | Value | Change | Role |
|---|---|---|---|
| `--color-paper` | `#f5f1ea` | unchanged | Primary light ground |
| `--color-surface` | `#e4dccd` | **deepened** (was `#e8e0d4`) | Secondary light ground — must visibly separate from paper |
| `--color-ink` | `#302b26` | unchanged | Body text on light |
| `--color-muted` | `#5c554d` | unchanged | Secondary text on light |
| `--color-clay` | `#8a5f4d` | unchanged | Accent (both grounds) |
| `--color-deep` | `#1e1a16` | **new** | Dark ground (hero, team, footer) |
| `--color-cream` | `#f5f1ea` | **new alias** | Text/ink on dark ground |

Fonts unchanged: Cormorant Garamond (display) + Inter (body).

**Contrast note:** cream `#f5f1ea` on deep `#1e1a16` ≈ 13:1 (passes AAA). Clay
`#8a5f4d` on deep is an accent/large-text color only — never body text on dark;
it must not be the sole carrier of small copy. Verify clay-on-deep and
muted-on-surface pairings during implementation.

## 4. Section rhythm

Order is unchanged; grounds change to create a heartbeat — dark bookends plus one
dark beat in the middle.

| # | Section | Ground | Notes |
|---|---|---|---|
| 1 | Hero | **deep** | Type-only, full-height |
| 2 | About | paper | The brand statement, breathing room |
| 3 | Services / Calculator | surface | Stays light for form legibility; framed as centerpiece |
| 4 | Gallery | paper | Existing masonry + one optional full-bleed band |
| 5 | Team | **deep** | Typographic, cream-on-ink |
| 6 | Location | surface | Address, hours, map |
| 7 | Footer | **deep** | Bookends the hero |

## 5. Section specifications

### 5.1 Hero (`components/sections/Hero.tsx`) — rebuild
- Ground: `deep`, full-height (`min-h-[88vh]` retained or `100vh`), generous padding.
- No image. Remove the `Placeholder` and the two-column grid; hero becomes a
  single left-aligned (or centered on mobile) type composition.
- Contents, top to bottom:
  - Eyebrow: `BANDAR RIMBAYU`, clay, tracked `0.4em`, uppercase.
  - Short clay rule (≈ 34px, 1px).
  - Wordmark: **`IKI` / `HAIR` stacked**, two lines, uppercase, cream Cormorant,
    very large (`clamp` up to ~8xl+), tight leading (~0.92), slight negative
    letter-spacing.
  - Tagline: "A reason for being." — cream/`#cfc6ba` italic Cormorant.
  - CTAs: clay-filled **Book Now** → `site.bookingUrl`; cream-ghost
    **Estimate a price** → `#services`. Preserve existing focus-visible rings.
- The full "Iki Hair Studio" name still lives in `<title>`, nav, and footer for
  SEO/clarity; the hero is the graphic treatment.

### 5.2 Nav (`components/sections/Nav.tsx`) — enhance
- New behavior: **transparent over the hero, solid on scroll.**
  - At top of page: transparent background, cream links/brand, over the dark hero.
  - After scrolling past the hero: solid `paper` background, ink/muted links,
    bottom hairline (current styling).
- Implement with an `IntersectionObserver` on the hero (or a scroll threshold);
  it already is a client component. Toggle a boolean → class swap.
- Mobile menu panel: when nav is in transparent/dark state and the menu opens,
  the panel must have a solid ground (deep or paper) so links stay legible.
- Preserve all existing a11y: `aria-expanded`, `aria-controls`, Escape-to-close,
  focus management, focus-visible rings.
- Reduced-motion / no-JS: default to the solid paper state so nothing depends on
  the scroll listener for legibility.

### 5.3 About (`components/sections/About.tsx`) — light touch
- Stays `paper`. Keep the centered statement but this is a candidate for one of
  the asymmetric layouts (e.g. heading left, body offset) to break the
  centered-text repetition. Optional; not required for approval.

### 5.4 Services / Calculator (`components/sections/Services.tsx`) — reframe
- Ground `surface` (now deeper, so it reads as its own zone).
- Give the calculator **presence as the page's one interactive centerpiece**:
  wrap it in a defined container (paper card on the surface ground, or a framed
  block with a hairline + padding) so it reads as a tool, not loose form fields.
- No logic changes to `Calculator.tsx` or `lib/estimate.ts`. Visual framing only.

### 5.5 Gallery (`components/sections/Gallery.tsx`) — light touch
- Stays `paper`, keep the masonry of the six real photos.
- Optional: one full-bleed photo band (one of the six) as a palate-cleanser
  between Gallery and Team, easing the transition into the dark Team section.
  Nice-to-have, not required.

### 5.6 Team (`components/sections/Team.tsx`) — rebuild on dark
- Ground: `deep`.
- Remove initials-in-circles. Each stylist is an editorial row:
  - Large cream Cormorant name.
  - Clay tracked-caps role beneath.
  - Hairline divider (`cream/15` or clay/30) between members.
- Reads as a masthead. Layout scales from stacked (mobile) to a spaced list or
  2-col (desktop). No avatars, no photos.
- Section eyebrow "Team" + heading "Who you will be sitting with" restyled for
  the dark ground (clay eyebrow, cream heading).

### 5.7 Location (`components/sections/Location.tsx`) — light touch
- Ground `surface`. Keep address, hours table, map iframe, CTAs. Restyle only if
  needed for the deepened surface token. The map iframe is known to be slow in
  some preview environments — keep `loading="lazy"`.

### 5.8 Footer (`components/sections/Footer.tsx`) — restyle on dark
- Ground: `deep`. Cream brand name + italic tagline, clay hover on the
  Instagram / WhatsApp / Book links. Bookends the hero visually.

## 6. Motion & accessibility

- Keep existing `Reveal` fade-up scroll reveals and the `prefers-reduced-motion`
  handling in `globals.css` (including the `scripting: none` fallback).
- One new motion moment only: the nav ground/text transition. Must be a simple
  cross-fade of background/text color, disabled under reduced-motion (instant
  swap), and defaulting to solid state without JS.
- Re-verify focus-visible rings on **both** grounds — clay rings on deep, clay/ink
  rings on light. Skip-link and `#main` focus behavior unchanged.
- Every dark section must pass WCAG AA for its text (see §3 contrast note).

## 7. Files touched

- `app/globals.css` — tokens (deepen surface, add deep + cream).
- `components/sections/Hero.tsx` — rebuild (type-only dark hero).
- `components/sections/Nav.tsx` — scroll-aware transparent→solid.
- `components/sections/Team.tsx` — rebuild (typographic, dark).
- `components/sections/Footer.tsx` — restyle on dark.
- `components/sections/Services.tsx` — calculator framing.
- `components/sections/About.tsx`, `Gallery.tsx`, `Location.tsx` — light restyle
  for token/rhythm consistency; optional asymmetric/full-bleed touches.
- `components/ui/Section.tsx` — may gain a `deep` tone option alongside
  `paper`/`surface`.
- `components/ui/Placeholder.tsx` — likely unused after hero rebuild; remove if
  no remaining references.

## 8. Out of scope

- No new photography, no team headshots, no logo redraw.
- No changes to calculator logic, pricing data (`data/services.ts`), or the
  Tunai booking flow.
- No new routes, CMS, i18n, or backend.
- No font changes.

## 9. Success criteria

1. Hero is a deep-ink, image-free, `IKI HAIR` stacked type composition.
2. Scrolling shows a clear dark→light→dark rhythm; light sections visibly
   separate from each other.
3. Nav is transparent over the hero and solid after it, with no legibility or
   a11y regressions and a sane no-JS default.
4. Team reads as an intentional typographic masthead with no placeholder feel.
5. All text passes WCAG AA on its ground; reduced-motion respected.
6. Existing tests (`lib/__tests__`, e2e) still pass; no calculator regressions.
