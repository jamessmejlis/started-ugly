# started-ugly

Directory of the embarrassing first versions of successful products, plus a
community wall of founders shipping ugly right now. Working name — final name
comes from a community poll.

## Commands
- `bun install` · `bun run dev` · `bun run build` · `bun test`

## Conventions
- All content lives in `src/data/entries.ts`; screenshots in `public/screenshots/`.
  `bun test` is the content gate — it fails the build on bad entries.
- Visual design comes from a separate Claude Design pass (`docs/design-brief.md`).
  `globals.css` is placeholder; class names are the stable contract.
- Adding an entry: see CONTRIBUTING.md. Capture screenshots with `scripts/capture.sh`.
- Spec: `docs/superpowers/specs/2026-06-12-started-ugly-design.md`
