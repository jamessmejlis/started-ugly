# shitty first drafts

Directory of the embarrassing first versions of successful products, plus a
community wall of founders shipping ugly right now.

## Commands
- `bun install` · `bun run dev` · `bun run build` · `bun test`

## Conventions
- All content lives in `src/data/entries.ts`; screenshots in `public/screenshots/`.
  `bun test` is the content gate — it fails the build on bad entries.
- Visual design is the shipped "Plain / Honest" direction in `globals.css` (system serif,
  white, hairline rules, one brick-red accent, square corners, no shadows/webfonts) — match
  it for new UI. Class names are the stable contract.
- Adding an entry: see CONTRIBUTING.md and `docs/content-roadmap.md` (seeding batches,
  content conventions, shortlist). Name the founder in the `lead` (cards show it); add a
  `quote: {text, cite}` pull-quote where a strong verbatim line exists.
- Screenshots (`scripts/capture.sh`): keep <500KB (re-encode with `sips`); verify Wayback
  captures actually rendered — CSS can 404 into "archive-rot" that misrepresents the site
  (see roadmap). Re-swapping an image keeps its URL → caches serve the stale copy, so rename
  the new file. A new entry needs a `bun run dev` restart (dynamicParams=false 404s new slugs).
- Spec: `docs/superpowers/specs/2026-06-12-started-ugly-design.md`
