# Design Brief — "Started Ugly" (working name)

Handover brief for Claude Design. Full product spec: `docs/superpowers/specs/2026-06-12-started-ugly-design.md`.

## The concept

A web directory of the **embarrassing starts** of successful products: the ugly first version of Airbnb next to Airbnb today, Dropbox's duct-taped demo video, the founder who collected $12K before writing a line of code. Visitors are early-stage founders paralyzed by perfectionism — they're comparing their day 1 to a big brand's year 15. The site creates visceral before/after contrast to make them ship. Anchor quote (Reid Hoffman): *"If you aren't embarrassed by the first version of your product, you've shipped too late."*

Alongside the famous entries is a community wall — "Shipping Ugly Right Now" — where early-stage founders submit their own ugly v1 and get featured next to the giants.

## Audience

Startup founders, indie hackers, bootstrappers, solo founders — especially the build-in-public crowd on X — plus VCs and the wider startup ecosystem. Internet-native people who appreciate a good bit.

## Creative direction

**The site itself is an embarrassing v1, on purpose.** Ugliness is the feature: the design should be part of the joke and make people want to screenshot and share it. Think Craigslist energy, not broken-website energy. How literal to take this is your call — but the self-referential humor must be legible, and the tone is fun, light-hearted, and shareable, never cynical.

Hard constraints beneath the joke:

- Fast, readable, accessible (semantic HTML, real contrast), great on mobile
- The before/after contrast is the hero — screenshots must read clearly
- Lean: no heavy UI dependencies

## Surfaces to design

1. **Home / directory** — hook headline + Hoffman quote, before/after entry cards (famous section + community wall), beehiiv email signup, submit CTA
2. **Entry detail page** — large then/now images, 1–3 sentence story, tactic badge, share links, email signup footer
3. **Submit page** — short form + "or open a GitHub PR" alternative path
4. **About page** — the manifesto, who built it and why
5. **404 page** — copy idea: "This page doesn't exist — unlike your MVP, which should."
6. **OG share card template** — then/now composite ("AIRBNB, 2008 → 2026. It started ugly."), plus a then-only variant for community entries with no "after" yet ("They shipped ugly. Your move."). This card is the primary share asset on X/LinkedIn.

## Key components

- **Before/after entry card** — the core unit: then-image + year, now-image + year (or "Now: TBD — they just shipped" for community entries), name, micro-story, tactic badge
- **Tactic badges** (4): "Ugly v1" / "Did things that don't scale" / "Sold it before building it" / "Duct-taped the demo"
- **beehiiv embed slot** — keep it dead simple
- **Submission form** — name, email, product name + URL, founder link, story textarea

## Tech context

Next.js (App Router) + TypeScript, statically generated, deployed on Vercel. Styling approach (plain CSS vs. Tailwind) is yours to choose, keep dependencies minimal.
