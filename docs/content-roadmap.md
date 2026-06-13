# Content Roadmap — Catalog Growth (Seeding)

Living roadmap for growing the directory beyond the v1 seed set. v1 shipped with
5 curated entries (craigslist, google, amazon, airbnb, dropbox); the goal is
15–20+ entries mixing **classic giants** (the anchor contrast) with **modern
indie / bootstrapper / build-in-public stories** the target audience identifies
with. The v1 build plan deliberately left catalog growth as content-ops — this
doc is where those batches live.

Each batch below is a self-contained seeding task. They're independent and can
run in any order (or in parallel as a fan-out workflow). Batch 0 is the baseline
approach already described in the spec; Batches 1–3 are new structured sources.

---

## Shared conventions (apply to every batch)

Read once before running any batch.

- **Entry shape & gate.** Every new entry is one object appended to the `entries`
  array in `src/data/entries.ts`, and MUST pass `bun test` (the content-integrity
  gate): unique kebab slug; `story` 20–500 chars; `tactic` ∈ `ugly-v1` |
  `dont-scale` | `sold-first` | `duct-tape-demo`; `thenImage` present, matching
  `/screenshots/<slug>-then.(png|jpg|webp)`, the file existing on disk and under
  500KB; all links `https://`; famous entries carry a `sourceUrl`; community
  entries carry `founderName`/`founderLink`/`productUrl`.
- **`kind` for curated indie entries.** Entries sourced from the batches below are
  **curated** (with a `sourceUrl`), not founder-submitted — so use
  `kind: "famous"`. They MAY also include `founderName`/`founderLink`/`productUrl`
  to credit and tag the founder (the type allows these on any kind; only
  `community` *requires* them). They render in the main "They all started ugly"
  grid, not the community wall. *(Open question: once there are many curated-indie
  entries, we may want a distinct grouping/label rather than lumping indies with
  megabrands — revisit when the mix justifies it. No schema change needed now.)*
- **The "then" artifact for non-website sources.** Podcasts and interviews have no
  website screenshot. `thenImage` is still required (this is a visual directory),
  so the seeder must produce a representative visual: a Wayback capture of the
  product's early site if one exists (preferred — use `scripts/capture.sh`), a
  sourced early screenshot/photo/video frame from the article, or a designed
  quote-card artifact carrying the founder's own words. Use `thenCaption` to
  explain non-obvious artifacts.
- **Quotes & copyright.** Real guest/founder quotes are powerful — use them, but
  keep them short, in quotation marks, attributed to the person + episode/article,
  with `sourceUrl` pointing at the transcript/episode/profile. Never paste whole
  transcripts or article bodies; the micro-story is paraphrased, the quote is a
  brief excerpt.
- **Fact-check.** Every story is checked against the cited source before it ships
  — no embellished folklore. If a claim can't be backed, cut it.
- **Could run as a workflow.** Each batch is a fan-out: enumerate candidates
  (episodes / leaderboard rows / case studies) → extract embarrassing-start
  signal + tactic + quote → produce + verify the entry. Fine to run manually too.

---

## Batch 0 — Wayback candidate pool (baseline, already specced)

The classic/modern candidate list and the Wayback capture workflow already live
in the spec: `docs/superpowers/specs/2026-06-12-started-ugly-design.md` →
"Content sourcing workflow". That's the default path for well-known products with
an archived early website. Batches 1–3 extend it with structured, story-rich
sources that surface entries Wayback alone won't.

---

## Batch 1 — The PMF Show transcript mining (Pablo Srugo)

- [ ] **Source.** The Product Market Fit Show (pmf.show) — Pablo Srugo's founder
  interviews. Episodes have transcript/blog pages (e.g. the Amigo AI episode
  already used as a `sold-first` candidate: `https://www.pmf.show/blog/...`).
- [ ] **Method.** Pull episode transcripts and run a structured search for
  embarrassing-start signals: "before I wrote any line of code", "didn't scale",
  "first version", "embarrassed", "manual", "concierge", "Wizard of Oz",
  "pre-sold / pre-orders", "demo video", "I faked", "dollars exchanging hands",
  "$X before building". Each hit is an entry candidate.
- [ ] **Extract per candidate.** Founder name, company, the specific early tactic
  → map to one of the four `tactic` values; one short verbatim guest quote
  (attributed to guest + episode) woven into or appended to the `story`;
  `sourceUrl` = the episode/transcript page.
- [ ] **"Then" artifact.** Wayback capture of the product's early site if it
  existed; otherwise a quote-card artifact or a sourced screenshot — see shared
  conventions.
- [ ] **Tactic fit.** Strong on `sold-first`, `dont-scale`, `duct-tape-demo`.
- [ ] **Known starter.** Amigo AI (Ollie) — $12K collected pre-code, voice-cloned
  demo stitched in Sony Vegas, now Series A. Two candidate angles (`sold-first`
  and `duct-tape-demo`); pick the strongest, one entry.
- [ ] **Networking note.** Featured founders are also outreach targets — tag them
  on launch.

---

## Batch 2 — TrustMRR leaderboard (Marc Lou)

- [ ] **Source.** TrustMRR (`trustmrr.com`) — Marc Lou's leaderboard of indie
  products with verified MRR. Uniquely lets us pair an ugly/scrappy start with a
  concrete revenue payoff — the most motivating contrast for the bootstrapper
  audience.
- [ ] **Method.** Scan the leaderboard for indie/bootstrapped products that had a
  genuinely scrappy or ugly start. For each promising one, find an early artifact
  (Wayback capture of the early site; many of these products are recent enough to
  have a usable archived v1) and confirm the founder's story.
- [ ] **Extract per candidate.** Founder, product, early tactic → `tactic`;
  micro-story; `sourceUrl` = the product's TrustMRR profile (so the verified MRR
  figure is cited, not asserted); optional `founderName`/`founderLink`/`productUrl`
  to credit + tag.
- [ ] **Data dimension — MRR.** This is the one source that adds a "now doing $X
  MRR" stat. **Open decision (resolve when this batch runs, not before):** add an
  optional generic field to `Entry`, e.g. `nowStat?: string` (values like
  `"$45k MRR"`, `"2M users"`) rendered as a small line on the card/detail page,
  backed by `sourceUrl`. Keep it generic rather than MRR-specific so it serves
  other batches too. YAGNI until Batch 2 actually runs; if added, extend the
  content gate to validate it and update `EntryCard`/detail page.
- [ ] **Tactic fit.** Mostly `ugly-v1`, some `sold-first`.
- [ ] **Care.** Only use the publicly-displayed verified numbers; link the profile.

---

## Batch 3 — Starter Story (Pat Walls)

- [ ] **Source.** Starter Story (`starterstory.com`) — Pat Walls' founder case
  studies and podcast: a large library of "how I started X" stories, many with
  early screenshots and revenue figures.
- [ ] **Method.** Search case studies / podcast episodes for scrappy-MVP origins.
  Many articles already include an early screenshot and the founder's revenue —
  high signal per candidate.
- [ ] **Extract per candidate.** Founder, product, early tactic → `tactic`;
  paraphrased micro-story + one short attributed quote; `sourceUrl` = the specific
  Starter Story page; reuse the article's early screenshot only if licensing
  allows, otherwise capture the early site from Wayback; optional founder fields.
- [ ] **Tactic fit.** All four; strong on `dont-scale` and `ugly-v1`.
- [ ] **Care.** Attribute and link the specific story; don't reproduce article
  text — paraphrase. If MRR/revenue is shown and the `nowStat` field exists by
  then (see Batch 2), populate it with the cited figure.

---

## Open decisions

- **`nowStat?` field** (MRR / user counts). See Batch 2. Decide when the first
  revenue-bearing batch runs.
- **Curated-indie grouping.** Whether to visually separate curated indie stories
  from megabrands once there's a critical mass. See shared conventions.
