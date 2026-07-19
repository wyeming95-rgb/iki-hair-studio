# Iki Hair Studio — Website Project

## 1. Overview

A single-page, minimalist-luxury marketing site for **Iki Hair Studio**, a hair salon in
Bandar Rimbayu, Kuala Langat, Malaysia. The site's core interactive feature is a
**service price calculator** that lets visitors pick a service + options, see an
estimated price instantly, and hand off to the salon's existing booking system.

This is a portfolio/brand site, not a full booking system — actual appointment
booking is handled externally via Tunai.

## 2. Business Info

- **Name:** Iki Hair Studio (亦称 IKI HAIR)
- **Location:** 1st Floor, Bandar Rimbayu, Kuala Langat / Telok Panglima Garang, Selangor, Malaysia
- **Hours:** Daily 11:00 AM – 7:00 PM, **closed Tuesdays**
- **Contact:** WhatsApp / Call — 011-7226 7229
- **Instagram:** [@ikihairstudio](https://www.instagram.com/ikihairstudio/)
- **Team:** Daniel T (Stylist), Mica Lai (Stylist) — expandable, more may be added later
- **Tagline direction:** "A reason for being." — calm, intentional, personalized hair care (not churn-and-burn salon culture)
- **Existing booking system:** [Tunai](https://booking.tunai.io/ikihairstudio) — use as the external booking link/CTA target throughout the site and at the end of the calculator flow

## 3. Goals

1. Showcase the brand — minimalist luxury visual identity, portfolio/gallery-ready
2. Let visitors self-serve a price estimate via an **interactive calculator**
   (service → sub-option/size → optional add-ons → estimated price + duration)
3. Route the visitor to the existing Tunai booking link to actually book
4. Fast to scaffold — keep the stack simple, ship a working v1 quickly

## 4. Tech Stack

- **Next.js** (App Router) + **Tailwind CSS**
- Single-page app (one route `/`), sections via anchor scroll: Hero, About, Services/Calculator, Gallery, Team, Location/Contact, Footer
- No backend/database needed for v1 — service + pricing data lives in a local
  `data/services.ts` file (typed objects), calculator logic runs client-side
- Deploy target: Vercel (or static export if preferred — flag if so)

## 5. Visual Style — Minimalist Luxury

- **Palette:** Black (#0a0a0a) / off-white cream (#f5f2ec) / warm gold accent (#c5a572) — matches the dark-themed circular "IKI HAIR" ink-stamp logo mark already in use on their booking page
  *(Assumption — no formal brand guide exists yet. Adjust once real brand assets are shared.)*
- **Typography:** Elegant serif for headings (e.g. "Cormorant" / "Playfair Display"), clean sans-serif for body (e.g. "Inter" / "Neue Montreal")
- **Layout:** Generous whitespace, large full-bleed imagery, subtle scroll-reveal animations, restrained motion — nothing flashy
- **Reference sites for tone:** high-end salon/spa sites — soft-close menus, editorial photography, understated CTAs (avoid stock "salon template" clichés — bright pinks, scissor icons, comic fonts)

## 6. Site Sections

1. **Hero** — full-bleed image/video, salon name, tagline, primary CTA ("Book Now" → Tunai link)
2. **About** — short brand story (adapt from: "professional hair services from haircut, styling, coloring, perming, and treatments — tailored to suit your lifestyle and personality")
3. **Services + Price Calculator** — see §7 below, the core feature
4. **Gallery** — grid of work photos (placeholder images for v1 until real photos are supplied)
5. **Team** — Daniel T, Mica Lai, with room to add more stylists later
6. **Location & Hours** — address, map embed, hours, closed-Tuesday note, WhatsApp CTA
7. **Footer** — Instagram link, WhatsApp, copyright

## 7. Price Calculator — Full Service & Pricing Data

Sizes: **ES** = Extra Short, **S** = Short, **M** = Medium, **L** = Long, **EL** = Extra Long
(hair length categories — calculator should ask the visitor to select their hair
length where a service has size-based pricing, shown as an illustrated/labelled picker, not just a dropdown)

All prices in **RM**, shown as "from RM__" since actual price may vary in-salon.
Durations shown alongside price as helpful context (not required for the estimate math).

### Haircut Service
| Option | Price (from) | Duration |
|---|---|---|
| Kid Junior (0–12) | 30 | 30 min |
| Male Kid (13–17) | 40 | 30 min |
| Female (13–17) | 50 | 30 min |
| Male Haircut | 60 | 1 hr |
| Female Haircut | 70 | 1 hr |

### Hair Styling Service
| Option | Price (from) | Duration |
|---|---|---|
| Hairwash + Blow (S) | 40 | 1 hr |
| Hairwash + Blow (L) | 50 | 1 hr |

### Coloring Service
| Option | Price (from) | Duration |
|---|---|---|
| Root-Touch | 150 | 1 hr 30 min |
| Single Tone Color (ES) | 170 | 2 hr |
| Single Tone Color (S) | 200 | 2 hr |
| Single Tone Color (M) | 250 | 2 hr |
| Single Tone Color (L) | 300 | 2 hr |
| Single Tone Color (EL) | 350 | 2 hr |

### Perming Service
| Option | Price (from) | Duration |
|---|---|---|
| Cold Perm (ES) | 150 | 2 hr |
| Cold Perm (S) | 180 | 2 hr |
| Cold Perm (M) | 210 | 2 hr |
| Cold Perm (L) | 250 | 2 hr 30 min |
| Cold Perm (EL) | 280 | 2 hr |
| Digital Perm (S) | 270 | 4 hr |
| Digital Perm (M) | 300 | 4 hr |
| Digital Perm (L) | 350 | 4 hr |
| Digital Perm (EL) | 400 | 4 hr |

### Straightening Service
| Option | Price (from) | Duration |
|---|---|---|
| Straightening — 离子烫 (S) | 260 | 4 hr |
| Straightening — 离子烫 (M) | 300 | 4 hr |
| Straightening — 离子烫 (L) | 350 | 4 hr |
| Straightening — 离子烫 (EL) | 400 | 4 hr |

### In-Salon Treatment
| Option | Price (from) | Duration |
|---|---|---|
| Intensive Scalp Treatment | 160 | 1 hr |
| PROMASTER Color Care (S) | 180 | 1 hr 30 min |
| PROMASTER Color Care (M) | 210 | 1 hr 30 min |
| PROMASTER Color Care (L) | 240 | 1 hr 30 min |
| IAU Scalp & Hair Treatment (S) | 200 | 2 hr |
| IAU Scalp & Hair Treatment (M) | 230 | 2 hr |
| IAU Scalp & Hair Treatment (L) | 260 | 2 hr |

### Calculator UX Flow
1. Visitor picks a **service category** (tabs: Haircut / Styling / Coloring / Perming / Straightening / Treatment)
2. Picks the specific **option** within that category (size/type as listed above)
3. Optional: **combine multiple services** in one estimate (e.g. Perm + Treatment) with a running subtotal — nice-to-have for v1.1 if time allows; v1 can be single-service estimate
4. Shows: estimated total price ("from RM__"), estimated duration, and a note: *"Final price may vary based on hair condition/length — confirmed in-salon."*
5. CTA button: **"Book This via WhatsApp/Tunai"** → opens `https://booking.tunai.io/ikihairstudio` (or WhatsApp link `https://wa.me/60117226729` as a secondary option) in a new tab

## 8. Assets Needed (Open Items)

- [ ] Real interior/work photos for hero + gallery (placeholders to be used until supplied)
- [ ] Logo file (currently only have the circular "IKI HAIR" mark seen on the Tunai booking page — confirm if that's the final logo or if a vector version exists)
- [ ] Team headshots for Daniel T and Mica Lai (currently generic avatar placeholders on Tunai)
- [ ] Confirm final Tunai booking link format (category-level deep links may exist per service — worth checking if the calculator should link to the specific service page vs. the general booking page)

## 9. Out of Scope (v1)

- No custom booking/calendar system — always hands off to Tunai
- No CMS/admin panel — pricing data is a static file for now (Claude Code can wire up a simple JSON/editable data file for easy future updates)
- No multi-language support (their Tunai page is EN/CN mixed, but v1 site is English-only)
- No payment processing
