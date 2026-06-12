# Started Ugly (working name) — Design Spec

**Date:** 2026-06-12
**Status:** Approved by James (brainstorming session), pending final spec review
**Working name:** `started-ugly` — placeholder only; real name chosen later via community poll (see Name Shortlist)

## What this is

A deliberately ugly web directory showing the **first shipped version** of famous products next to **how they look today** — plus a community wall where early-stage founders get their own ugly v1 featured alongside the big names.

**The problem it attacks:** new founders hide in the comfort zone of building features instead of shipping to real humans, because they compare their day-1 product to a big brand's year-15 product. The site creates visceral contrast to break that perfectionist block. Anchor quote (Reid Hoffman): *"If you aren't embarrassed by the first version of your product, you've shipped too late."*

**The bit:** the site itself is an embarrassing v1. Ugliness is a feature, enforced by design.

## Goals & success criteria

1. **Primary metric: public submissions.** Founders submitting their own ugly MVPs — each submission is also a 1:1 networking touchpoint for James in the startup ecosystem.
2. **Email list** as the secondary asset (top-of-funnel for a future newsletter, possibly podcast, telling the early-days stories behind products).
3. **Shareability** as the engine: per-entry pages and OG images designed to travel on X/LinkedIn/HN.
4. Ship fast. The project must practice what it preaches — days, not weeks.

## Decisions log (from brainstorming)

| Decision | Choice |
|----------|--------|
| V1 scope | Directory + email capture + community submissions displayed next to famous brands |
| Entry depth | Screenshot pair + 1–3 sentence micro-story |
| Launch catalog | 15–20 famous entries |
| Name | Deferred to community poll; `started-ugly` is the placeholder |
| Aesthetic | Deliberately ugly (the design is the joke) |
| Success metric | Public submissions + the founder relationships they start |
| Architecture | Static Next.js, content in repo, zero database |
| Submission channels | Form-to-inbox (Resend) AND GitHub PR/issue templates |

## Prior art & differentiation

[Version Museum](https://versionmuseum.com) and [FirstVersions.com](https://firstversions.com) already do visual history of products. They are encyclopedic/nostalgic. This site is **founder psychology, not archaeology**: the contrast exists to make a founder ship this week. Differentiators: the micro-stories about what founders actually did at the embarrassing stage, the community wall (your ugly v1 next to Airbnb's), the submission flywheel, and the explicit call to action.

## Content model

No database. One typed array in `src/data/entries.ts`; screenshots committed to `public/screenshots/`.

```ts
type Entry = {
  slug: string;            // unique, kebab-case
  name: string;            // company/product name
  kind: 'famous' | 'community';
  thenImage: string;       // path under /public/screenshots/
  thenYear: number;
  nowImage?: string;       // optional: community entries are shipping NOW
  nowYear?: number;        // absent => card shows "Now: TBD — they just shipped"
  story: string;           // 1–3 sentence micro-story, fact-checked
  sourceUrl?: string;      // famous: link to the actual Wayback Machine capture
  founderName?: string;    // community only
  founderLink?: string;    // community only: X/LinkedIn
  productUrl?: string;     // community only: live product (the backlink incentive)
};
```

Famous and community entries share one model and one rendering path; `kind` controls which section they appear in and which fields render.

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Directory. Hook headline + Hoffman quote, newsletter signup, famous before/afters, "Shipping Ugly Right Now" community wall, submit CTA. |
| `/[slug]` | Per-entry page: large then/now images, story, source link, share links, newsletter footer. Independently shareable; catches SEO like "airbnb first website". |
| `/submit` | Submission form + the GitHub PR/issue path, side by side. |
| `/about` | Manifesto: why this exists, the quote, who James is, how to reach him. Personal networking surface. |
| 404 | Ugly 404: "This page doesn't exist — unlike your MVP, which should." |

All pages statically generated. Only runtime code: the submission API route and the OG image route.

## Share mechanics

- **Per-entry OG images** generated with `next/og` (`ImageResponse`): an ugly-styled composite of the then/now screenshots — "AIRBNB, 2008 → 2026. It started ugly." This composite is the screenshot-bait that travels in feeds. Entries without a `nowImage` (community) get a then-only card: "PRODUCT, 2026 → ?. They shipped ugly. Your move."
- Share links (X, LinkedIn, copy-link) on every entry page with pre-filled text.
- `src/lib/site.ts` + `NEXT_PUBLIC_SITE_URL` drive `metadataBase`, sitemap, robots, and absolute OG URLs (Marulho convention).

## Submissions

**Form path (`/submit`).** Fields: founder name, email, product name, product URL, founder X/LinkedIn link, story ("what did you ship and what's ugly about it?"). **No file upload, deliberately.** The route emails James via Resend (free tier); James replies to collect the screenshot. The reply is the networking touchpoint by design, and the form says so: "I'll personally reply within a couple of days to get your screenshot." No storage, no multipart handling.

**GitHub path.** Public repo with:
- An issue template: "Submit your ugly MVP"
- `CONTRIBUTING.md`: how to add yourself by PR (one object in `entries.ts` + one image in `public/screenshots/`)

`/submit` presents both paths. PRs double as repo social proof.

**Spam:** honeypot field + best-effort in-memory per-IP rate check in the route (no external store; resets per serverless instance, which is acceptable — the honeypot does the real work). No captcha unless spam actually materializes.

**Publishing flow:** James adds the entry + screenshot, commits, pushes; Vercel deploys. Each addition is ready-made building-in-public content.

## Email capture

Embedded newsletter-provider signup on `/` (above the fold area) and in every entry-page footer ("Get the story behind the next ugly MVP").

**Pre-launch decision, does not block the build:** provider choice. Default recommendation: **Buttondown** (lean, indie-friendly); alternative: **Kit** if more growth tooling is wanted later. The layout reserves the embed slot; swapping providers is a one-snippet change.

## Aesthetic (deliberately ugly)

- Times New Roman / system fonts, default blue underlined links, visible table borders, default-looking buttons. Craigslist energy.
- One small global CSS file. **No Tailwind, no UI libraries.**
- Constraints under the joke: fast, readable, accessible (real alt text, semantic HTML, sufficient contrast), fine on mobile. Ugly ≠ broken.
- No dark mode (it's ugly in every theme).

## Stack & deployment

- **Next.js (App Router) + TypeScript** on Vercel, **Bun** for tooling. No database, no auth.
- Project at `~/Developer/started-ugly`, own public GitHub repo, own Vercel project, own CLAUDE.md (Marulho constellation pattern).
- **Domain:** launch on placeholder subdomain `ugly.marulho.co`. After the naming poll: buy the chosen domain, point it at the Vercel project, 301 the subdomain.
- **Env vars:** `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`.
- **Analytics:** Vercel Analytics (free tier) to see which entries travel.
- Standard Marulho deploy checklist from `~/Developer/CLAUDE.md`.

## Content sourcing workflow (pre-launch task — the long pole)

1. Pick 15–20 famous products with genuinely ugly/embarrassing v1s. Candidate pool: Airbnb '08, Amazon '95, Google '98, Facebook '04, Stripe '11, Craigslist (bonus: still ugly — fun outlier), Reddit '05, eBay/AuctionWeb '95, Netflix '99, Twitter '06, Dropbox (MVP was a demo video), Product Hunt (started as an email list), Instagram (Burbn), Slack, Shopify, Uber '10, YouTube '05, LinkedIn '03, Spotify '08, Notion.
2. Capture "then" screenshots from Wayback Machine captures (`bunx playwright screenshot` against `web.archive.org` URLs); record each capture URL as `sourceUrl`.
3. Capture "now" screenshots from live sites.
4. Write each micro-story; **fact-check every story against at least one real source** (no embellished startup folklore).
5. Optimize images (consistent width, compressed).

Legal posture: screenshots of historical websites for commentary/education are standard fair-use practice (Version Museum operates the same way); attribute via Wayback source links. If any brand objects, remove their entry.

## Error handling

- **Build-time content validation** (test, runs in CI/`bun test`): every entry has required fields, image files exist on disk, slugs unique, community entries have founder fields. Content bugs fail the build, never reach production.
- **Submission route:** input validation with friendly errors; honeypot rejections return fake-success (don't tip off bots); if the Resend call fails, the form surfaces a fallback `mailto:` link so no submission is lost.
- **Bad slugs:** 404 page.

## Testing

`bun test`:
- Data-integrity validation suite (above).
- Submission route: happy path (Resend mocked), field validation failures, honeypot rejection.
- Smoke: every entry slug renders metadata / OG route responds.

No e2e suite for v1 — static pages, manual click-through before launch.

## Out of scope for v1

Newsletter content itself, podcast, self-serve screenshot upload, moderation dashboard, voting/likes/comments, search/tags (pointless under ~50 entries), dark mode, topic hubs. The newsletter/podcast ambitions shape v1 only via: email capture exists, stories are collected from day one.

## Name shortlist (for community poll — building in public)

Availability checked via DNS on 2026-06-12 ("available" = no NS records; verify at registrar before buying):

| Name | Domain | Status |
|------|--------|--------|
| Started Ugly | startedugly.com | Available — works as statement + newsletter/podcast brand |
| Ugly MVPs | uglymvps.com | Available (singular uglymvp.com taken) |
| Ship Something Ugly | shipsomethingugly.com | Available — the name is the CTA |
| V1 Was Ugly | v1wasugly.com | Available — meme-flavored |
| Embarrassed Yet? | embarrassedyet.com | Available — riff on the Hoffman quote |
| Just Ship It Already | justshipitalready.com | Available |
| Embarrassing MVPs | embarrassingmvps.com | Available |
| ~~Ugly MVP~~ | uglymvp.com | Taken |
| ~~Shitty First Draft~~ | shittyfirstdraft.com | Taken (also profanity limits LinkedIn/podcast distribution) |
| ~~Just Ship It~~ | justshipit.com | Taken |
