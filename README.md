# Iki Hair Studio

A single-page marketing site for Iki Hair Studio, built with Next.js. Its
centrepiece is a client-side price calculator: visitors pick services, see a
running estimate, and hand off to the salon's Tunai booking system with a
prefilled WhatsApp message summarising their selection. There is no CMS and
no backend — all content is static data compiled into the site.

## Changing prices or business hours

Routine content changes only ever require editing two files:

- `data/services.ts` — the full service catalogue: categories, options,
  prices (`priceFrom`), and durations (`durationMin`).
- `data/site.ts` — business hours, address, phone number, WhatsApp number,
  and booking/Instagram links.

After editing prices, run `npm test`. The test suite independently
transcribes and asserts all 33 prices and durations from the source
requirements doc, so a mistyped number will fail a test rather than reach
production silently.

## Commands

```bash
npm run dev        # start the dev server (Turbopack)
npm run build      # production build
npm start          # serve the production build
npm test           # run the unit test suite (Vitest)
npm run test:e2e   # run the end-to-end suite (Playwright)
npm run lint       # run ESLint
```

## Deployment

Deploys to Vercel with a standard Next.js build (`npm run build`). No
environment variables are required.

## Before launch

- Confirm the WhatsApp number `601172267229` against the salon's real
  account — the source requirements doc contained an 11-digit typo, and this
  value has not yet been confirmed by the client.
- Replace the placeholder gallery images with real photography.
- Supply a vector logo.
- Add an `og:image` and `metadataBase` once real photography exists.
- Restore the JSON-LD `url` field in `app/layout.tsx` once the site has its
  own domain.
