# Started Ugly (working name) — Design Spec

**Date:** 2026-06-12
**Status:** Approved by James (brainstorming session), pending final spec review
**Working name:** `started-ugly` — placeholder only; real name chosen later via community poll (see Name Shortlist)

## What this is

A deliberately ugly web directory showing the **embarrassing start** of famous products — the ugly first version, the manual hack, the pre-code sale, the duct-taped demo — next to **how they look today**. Plus a community wall where early-stage founders get their own ugly v1 featured alongside the big names.

**The problem it attacks:** new founders hide in the comfort zone of building features instead of shipping to real humans, because they compare their day-1 product to a big brand's year-15 product. The site creates visceral contrast to break that perfectionist block. Anchor quote (Reid Hoffman): *"If you aren't embarrassed by the first version of your product, you've shipped too late."*

**The bit:** the site itself is an embarrassing v1. Ugliness is a feature, enforced by design.

## Goals & success criteria

1. **Primary metric: public submissions.** Founders submitting their own ugly MVPs — each submission is also a 1:1 networking touchpoint for James in the startup ecosystem.
2. **Email list** as the secondary asset (top-of-funnel for a future newsletter, possibly podcast, telling the early-days stories behind products).
3. **Shareability** as the engine: per-entry pages and OG images designed to travel on X/LinkedIn/HN.
4. Ship fast. The project must practice what it preaches — days, not weeks.

## Audience

Startup founders, indie hackers, bootstrappers, and solo founders — especially the modern build-in-public crowd on X — plus the wider startup ecosystem (VCs, operators, startup media). Content selection, tone, and examples should skew toward this modern builder culture, with the classic big-brand stories as the anchor contrast.

## Decisions log (from brainstorming)

| Decision | Choice |
|----------|--------|
| V1 scope | Directory + email capture + community submissions displayed next to famous brands |
| Entry depth | Screenshot pair + 1–3 sentence micro-story |
| Launch catalog | 15–20 famous entries |
| Name | Deferred to community poll; `started-ugly` is the placeholder |
| Audience | Founders, indie hackers, bootstrappers, solo founders, wider startup ecosystem (VCs) |
| Aesthetic | "Deliberately ugly" as creative direction; visual design executed separately via Claude Design (see `docs/design-brief.md`) |
| Success metric | Public submissions + the founder relationships they start |
| Architecture | Static Next.js, content in repo, zero database |
| Submission channels | Form-to-inbox (Resend) AND GitHub PR/issue templates |
| Newsletter provider | beehiiv (simple embed in v1) |

## Prior art & differentiation

[Version Museum](https://versionmuseum.com) and [FirstVersions.com](https://firstversions.com) already do visual history of products. They are encyclopedic/nostalgic. This site is **founder psychology, not archaeology**: the contrast exists to make a founder ship this week. Differentiators: the micro-stories about what founders actually did at the embarrassing stage, the community wall (your ugly v1 next to Airbnb's), the submission flywheel, and the explicit call to action.

A key widening: the embarrassing start isn't always an ugly website. The directory covers four **tactic types** (see content model): ugly first versions, doing things that don't scale (Airbnb's founders photographing apartments door-to-door), selling before building (Amigo AI collected [$12K pre-code](https://www.pmf.show/blog/amigo-ai-healthcare-product-market-fit-series-a) and raised a Series A), and duct-taped demos (Dropbox's video MVP; Amigo's voice-cloned demo stitched in Sony Vegas). Version Museum can't tell those stories at all — they have no screenshots. This site can, and they're the strongest perfectionism-breakers in the set.

## Content model

No database. One typed array in `src/data/entries.ts`; screenshots committed to `public/screenshots/`.

```ts
type Tactic = 'ugly-v1' | 'dont-scale' | 'sold-first' | 'duct-tape-demo';
// Display labels: "Ugly v1" | "Did things that don't scale"
//               | "Sold it before building it" | "Duct-taped the demo"

type Entry = {
  slug: string;            // unique, kebab-case
  name: string;            // company/product name
  kind: 'famous' | 'community';
  tactic: Tactic;          // rendered as a badge on cards and entry pages
  thenImage: string;       // path under /public/screenshots/ — see "then artifact" below
  thenCaption?: string;    // explains non-obvious artifacts, e.g. "The entire MVP was this 3-minute video"
  thenYear: number;
  nowImage?: string;       // optional: community entries are shipping NOW
  nowYear?: number;        // absent => card shows "Now: TBD — they just shipped"
  story: string;           // 1–3 sentence micro-story, fact-checked
  sourceUrl?: string;      // famous: Wayback capture, interview, or article backing the story
  founderName?: string;    // community only
  founderLink?: string;    // community only: X/LinkedIn
  productUrl?: string;     // community only: live product (the backlink incentive)
};
```

**The "then" artifact is any visual of the embarrassing start**, not just a website screenshot: a Wayback capture, the Airbnb cereal box photo, a frame from Dropbox's demo video, a landing-page-with-no-product, a screenshot of the cold DM that got the first customer. `thenImage` stays required — this is a visual directory, and the curator's job includes finding or recreating a representative artifact. `thenCaption` carries the explanation when the image isn't self-evident.

Famous and community entries share one model and one rendering path; `kind` controls which section they appear in and which fields render. `tactic` is a badge only in v1 — no filtering or per-tactic sections (pointless under ~50 entries). The four tactics also seed future newsletter segments.

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

- **Per-entry OG images** generated with `next/og` (`ImageResponse`): a composite of the then/now screenshots — "AIRBNB, 2008 → 2026. It started ugly." — styled per the Claude Design direction. This composite is the screenshot-bait that travels in feeds. Entries without a `nowImage` (community) get a then-only card: "PRODUCT, 2026 → ?. They shipped ugly. Your move."
- Share links (X, LinkedIn, copy-link) on every entry page with pre-filled text.
- `src/lib/site.ts` + `NEXT_PUBLIC_SITE_URL` drive `metadataBase`, sitemap, robots, and absolute OG URLs (Marulho convention).

## Submissions

**Form path (`/submit`).** Fields: founder name, email, product name, product URL, founder X/LinkedIn link, story ("what did you ship, and what's embarrassing about it? Ugly screens, manual hacks, selling before building, duct-taped demos — all count"). **No file upload, deliberately.** The route emails James via Resend (free tier); James replies to collect the screenshot. The reply is the networking touchpoint by design, and the form says so: "I'll personally reply within a couple of days to get your screenshot." No storage, no multipart handling.

**GitHub path.** Public repo with:
- An issue template: "Submit your ugly MVP"
- `CONTRIBUTING.md`: how to add yourself by PR (one object in `entries.ts` + one image in `public/screenshots/`)

`/submit` presents both paths. PRs double as repo social proof.

**Spam:** honeypot field + best-effort in-memory per-IP rate check in the route (no external store; resets per serverless instance, which is acceptable — the honeypot does the real work). No captcha unless spam actually materializes.

**Publishing flow:** James adds the entry + screenshot, commits, pushes; Vercel deploys. Each addition is ready-made building-in-public content.

## Email capture

As simple as possible: a **beehiiv embed form** on `/` and in every entry-page footer ("Get the story behind the next ugly MVP"). No custom API integration, no double-opt-in logic of our own — beehiiv handles everything. beehiiv is the committed provider for the newsletter stage, so no provider migration is anticipated.

## Design direction

Visual design is handled separately via **Claude Design** — this spec deliberately makes no specific visual choices (fonts, colors, CSS approach, component styling). The handover brief lives at [`docs/design-brief.md`](../../design-brief.md).

Spec-level constraints that survive whatever Claude Design produces:

- The creative direction is **"deliberately ugly as a feature"** — the site's own embarrassing-v1-ness is part of the message. How literally that's executed is Claude Design's call.
- Fast, readable, accessible (real alt text, semantic HTML, sufficient contrast), works on mobile. Ugly ≠ broken.
- Lean output: no heavy UI dependencies; styling approach (plain CSS vs. Tailwind) follows whatever the Claude Design handover produces.

## Stack & deployment

- **Next.js (App Router) + TypeScript** on Vercel, **Bun** for tooling. No database, no auth.
- Project at `~/Developer/started-ugly`, own public GitHub repo, own Vercel project, own CLAUDE.md (Marulho constellation pattern).
- **Domain:** launch on placeholder subdomain `ugly.marulho.co`. After the naming poll: buy the chosen domain, point it at the Vercel project, 301 the subdomain.
- **Env vars:** `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`.
- **Analytics:** Vercel Analytics (free tier) to see which entries travel.
- Standard Marulho deploy checklist from `~/Developer/CLAUDE.md`.

## Content sourcing workflow (pre-launch task — the long pole)

1. Pick 15–20 famous entries with genuinely embarrassing starts, mixing all four tactics AND mixing eras — roughly half classic giants (the anchor contrast), half modern builder/bootstrapper/indie stories the target audience actually identifies with:
   - **ugly-v1:** *Classic:* Airbnb '08, Amazon '95, Google '98, Facebook '04, Stripe '11, Craigslist (bonus: still ugly — fun outlier), Reddit '05, eBay/AuctionWeb '95, Netflix '99, Twitter '06, Uber '10, YouTube '05, LinkedIn '03. *Modern:* Gumroad (Sahil Lavingia's weekend v1), levels.io's 12-startups-in-12-months era sites, Indie Hackers v1.
   - **dont-scale:** *Classic:* Airbnb (founders photographed listings door-to-door; sold cereal boxes), DoorDash (founders did the deliveries themselves), Zappos (founder bought shoes retail and shipped them), Stripe (Collison brothers installed it on users' laptops on the spot). *Modern:* Product Hunt (started as a Linkydink email list), Nomad List (launched as a public Google Spreadsheet people filled in).
   - **sold-first:** *Classic:* Tesla Roadster pre-orders, Buffer (pricing page before product existed). *Modern:* Amigo AI ($12K collected pre-code, now Series A — The PMF Show), pre-sale launches from the build-in-public community on X.
   - **duct-tape-demo:** *Classic:* Dropbox (MVP was a narrated demo video), Zapier (early manual "Wizard of Oz" integrations). *Modern:* Amigo AI (voice-cloned coach demo stitched in Sony Vegas), Midjourney (entire product UI was a Discord bot).
   One entry per company; pick its strongest tactic. Source library: Wayback Machine, Paul Graham's "Do Things That Don't Scale", The PMF Show (Pablo Srugo), Lenny's Podcast, Indie Hackers interviews, the build-in-public community on X, The Lean Startup canon. Modern founders are also networking targets: featuring them + tagging them on launch is part of the distribution plan.
2. Capture "then" artifacts: website screenshots from Wayback captures (`bunx playwright screenshot` against `web.archive.org` URLs), or sourced photos/video frames for non-website artifacts; record the backing source as `sourceUrl`.
3. Capture "now" screenshots from live sites.
4. Write each micro-story; **fact-check every story against at least one real source** (no embellished startup folklore).
5. Optimize images (consistent width, compressed).

Legal posture: screenshots of historical websites for commentary/education are standard fair-use practice (Version Museum operates the same way); attribute via Wayback source links. If any brand objects, remove their entry.

**Catalog growth (post-v1) lives in [`docs/content-roadmap.md`](../../content-roadmap.md)** — structured seeding batches beyond the Wayback candidate pool above: PMF Show transcript mining, the TrustMRR leaderboard (indie products + verified MRR), and Starter Story case studies.

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
