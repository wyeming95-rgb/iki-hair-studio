# Iki Hair Studio — Go-Live & Owner Handoff Plan

**Purpose:** take the site from a Vercel preview URL to a fully live site on its
own domain, then hand ownership to the business owner cleanly.
**Audience:** you (the person doing the handoff). Written so you can execute it
step by step, and hand the Appendix to the owner.
**Last updated:** 2026-07-21

---

## The one decision that shapes everything — ownership model

Pick this first; the rest of the plan follows from it.

| | **Path A — Full handoff (recommended)** | **Path B — You keep hosting** |
|---|---|---|
| Domain owned by | The business | The business |
| GitHub repo owned by | Owner's account (you added as collaborator) | Your account |
| Vercel project under | Owner's Vercel account | Your Vercel account |
| Owner is self-sufficient? | Yes — nothing depends on your accounts | No — site depends on your accounts staying active |
| Best when | You want a clean break / reduce your liability | You'll keep maintaining it as their developer |

**Recommendation: Path A.** For a business, the website and domain are assets
they must ultimately control. Even under Path A you can stay on as the technical
contact (collaborator on the repo, member on their Vercel) — you just aren't a
single point of failure. **The domain in particular should always be registered
in the owner's name**, regardless of path.

> The rest of this plan assumes Path A and notes where Path B differs.

---

## Phase 1 — Pre-launch polish (before pointing a domain at it)

Finish these while it's still on the preview URL. All are small code changes.

- [ ] **Restore the canonical URL.** `app/layout.tsx` currently sets
  `metadataBase` to the vercel URL and *intentionally omits* `url` in the
  JSON-LD structured data until a real domain exists. Once the domain is chosen,
  set both to `https://<newdomain>`.
- [ ] **Favicon & app icons.** `app/favicon.ico` is still the default Next.js
  icon. Replace with the IKI mark (a simple monogram works). Add a 512px PNG for
  mobile home-screen icons.
- [ ] **Social preview image (Open Graph).** There's no OG image, so shared links
  look bare. Add one 1200×630 image (dark hero with the IKI mark reads well) so
  WhatsApp/Instagram/Facebook link previews look intentional.
- [ ] **Content sign-off with the owner.** Confirm: services & prices in
  `data/services.ts`, opening hours in `data/site.ts` (currently daily 11–19,
  closed Tuesday), team names, WhatsApp number (already verified correct), and
  the Tunai booking link.
- [ ] **Footer basics.** Consider adding a physical address line and, if they
  want, a short privacy note. Not legally required for a brochure site in
  Malaysia, but tidy.

---

## Phase 2 — Choose and register the domain

- [ ] **Pick the name.** Likely candidates: `ikihairstudio.com` (simplest,
  globally recognised) or a Malaysian `.my` / `.com.my`. Note: `.com.my` usually
  requires a registered business (SSM) document; `.com` has no such requirement
  and is the safe default. You can register both and redirect one to the other.
- [ ] **Pick a registrar.** Any of: **Cloudflare Registrar** (at-cost pricing, no
  markup — great value), **Namecheap**, or **Vercel Domains** (buy it straight
  from the Vercel dashboard — fewer moving parts, slightly higher price).
- [ ] **Register it in the OWNER's name/email** (registrant = the business).
  Even if you pay and set it up, put their name and email as the registrant/owner
  contact. This is the single most important ownership detail.
- [ ] Turn on **auto-renew** and **WHOIS privacy** (usually free).

Rough cost: **~USD 10–15 / year** for `.com`; `.my`/`.com.my` a little more.

---

## Phase 3 — Connect the domain to Vercel

*(Under Path A, do this after the project is in the owner's Vercel — see Phase 4.
Under Path B, do it now in your Vercel.)*

- [ ] In the Vercel project → **Settings → Domains → Add** `ikihairstudio.com`
  and `www.ikihairstudio.com`.
- [ ] Vercel shows the DNS records to set. Two options:
  - **Easiest:** if you used **Vercel Domains**, DNS is automatic — nothing to do.
  - **Otherwise:** at your registrar, add the records Vercel gives you
    (an `A` record for the apex `@` → Vercel's IP, and a `CNAME` for `www` →
    `cname.vercel-dns.com`). Or point the domain's **nameservers** to Vercel and
    let it manage DNS.
- [ ] Pick one canonical host and redirect the other (Vercel does this — e.g.
  `www` → apex, or apex → `www`). Be consistent.
- [ ] **SSL/HTTPS is automatic** on Vercel — a certificate is issued within
  minutes. Confirm the padlock shows and `http://` redirects to `https://`.
- [ ] DNS can take anywhere from minutes to a few hours to propagate. Verify from
  a phone on mobile data (different network) as a sanity check.

---

## Phase 4 — Transfer ownership (Path A)

Do this once the site is polished and the owner has accounts.

1. **Owner creates accounts** (or you create them *with the owner's email* and
   hand over the password):
   - A **GitHub** account (free) — to own the code.
   - A **Vercel** account (sign in with that GitHub) — to own the hosting.
2. **Transfer the GitHub repo** from `wyeming95-rgb/iki-hair-studio` to the
   owner's account (GitHub → repo Settings → *Transfer ownership*). Then add
   yourself back as a **collaborator** so you can still push edits.
3. **Import the repo into the owner's Vercel** (New Project → import the repo).
   Every push to `master` will auto-deploy, exactly as it does now.
4. **Add the domain** to the owner's Vercel project (Phase 3).
5. **Delete/disconnect the old project** from your Vercel once the new one serves
   the domain, to avoid two live copies.

**Path B differences:** skip the transfers. Keep repo + Vercel under your
accounts; only the *domain* is registered to the owner, pointed at your project.
Simpler today, but make sure the owner understands the dependency on you.

---

## Phase 5 — Post-launch (do these the day it goes live)

- [ ] **Google Business Profile** — for a local salon this is arguably higher
  impact than the website itself. Claim/verify the Bandar Rimbayu listing, set
  hours, add photos, and put the new domain as the website link. Free.
- [ ] **Update every external link to the new domain:** Instagram bio, Tunai
  profile, Google Business Profile, any WhatsApp broadcast/flyers, printed cards.
- [ ] **Google Search Console** — add the domain, submit the site so it gets
  indexed under the new URL. (Optional but recommended.)
- [ ] **Analytics** — turn on **Vercel Web Analytics** (one toggle, privacy-
  friendly, no cookie banner needed) so the owner can see visits. Free tier is
  plenty.
- [ ] **Test the whole flow on a real phone:** load domain → tap Book Now (opens
  Tunai) → tap WhatsApp → run the price calculator → check the map. This is how
  most customers will arrive.

---

## Phase 6 — Ongoing maintenance & content updates

**Set expectations with the owner up front — this is the most common friction
point.** Prices, hours, team, and services live in code files
(`data/services.ts`, `data/site.ts`). Editing them means a small code change and
a push, which auto-deploys. A non-technical owner **cannot** edit these directly
today. Options, cheapest first:

1. **You (or any developer) make occasional edits.** Realistic for a salon whose
   prices change rarely. Agree on a simple channel (WhatsApp/email) and rough
   turnaround. Zero added cost.
2. **Move pricing/hours to a simple editable source later** — e.g. a Google
   Sheet or a lightweight headless CMS (Sanity, Contentful — both have free
   tiers) so the owner can edit without code. This is a future enhancement, not
   needed to launch.

Also agree who handles: domain renewal (auto-renew + a calendar reminder), and
who's the emergency contact if the site ever goes down.

---

## Appendix A — Cost summary (typical)

| Item | Cost | Notes |
|---|---|---|
| Domain `.com` | ~USD 10–15 / yr | The one unavoidable cost. Register to the owner. |
| Vercel hosting | Free (Hobby) *or* ~USD 20/mo (Pro) | **Important:** Vercel's free Hobby tier is for non-commercial use. A business site technically belongs on **Pro**. Traffic-wise the free tier easily handles a salon site, but budget for Pro to stay within terms. |
| Vercel Web Analytics | Free tier | Optional. |
| Professional email (optional) | Free (Zoho) – ~USD 6/user/mo (Google Workspace) | e.g. `hello@ikihairstudio.com`. Nice-to-have, not required. |
| Google Business Profile | Free | Do this regardless. |

Bottom line: a domain (~USD 12/yr) is the only hard cost to go live; budget for
Vercel Pro if you want to be fully within terms for a commercial site.

## Appendix B — Credential handoff checklist (hand this to the owner)

Give the owner a single document (a password manager entry is ideal) containing:

- [ ] Domain registrar — login + which account holds the domain + renewal date
- [ ] GitHub account — login (Path A)
- [ ] Vercel account — login (Path A)
- [ ] Tunai booking account — login (already theirs)
- [ ] Instagram — login (already theirs)
- [ ] Google Business Profile — login
- [ ] WhatsApp Business number — confirmed: displayed as 011-7226 7229
- [ ] Who to contact for site changes, and expected turnaround

---

## Suggested sequence (fastest safe path)

1. Phase 1 polish (half a day of edits) →
2. Register domain in owner's name (Phase 2) →
3. Owner accounts created + repo/Vercel transferred (Phase 4) →
4. Domain connected, HTTPS verified (Phase 3) →
5. Go-live day: Google Business Profile + external links + analytics (Phase 5) →
6. Agree the maintenance arrangement in writing (Phase 6).
