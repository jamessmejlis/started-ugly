# Started Ugly v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the v1 "started-ugly" directory — famous embarrassing-start entries, community submission pipeline (form-to-inbox + GitHub PR), beehiiv email capture, per-entry OG share cards — statically generated, zero database.

**Architecture:** Static Next.js (App Router) on Vercel. All content lives in one typed array (`src/data/entries.ts`) with screenshots in `public/screenshots/`. The only runtime code is the submission API route (Resend via plain `fetch`) and the per-entry OG image route. Build-time tests guarantee content integrity so bad entries can never deploy — this also auto-validates community PRs via CI.

**Tech Stack:** Next.js (App Router) + TypeScript, Bun (install/test/run), Resend (submission email, plain fetch — no SDK), beehiiv (iframe embed), `next/og` for share cards, Playwright CLI for screenshot capture, GitHub Actions CI.

**Spec:** `docs/superpowers/specs/2026-06-12-started-ugly-design.md` · **Design brief:** `docs/design-brief.md`

**Scope notes:**
- Visual design is handled separately via Claude Design (see brief). This plan ships semantic, structurally-classed markup with deliberately minimal placeholder CSS. Do NOT invest in styling.
- This plan seeds 5 fully-real famous entries. Growing to 15–20 is content ops (workflow + script delivered in Task 3); not part of this plan.
- Community wall launches empty with a "be the first" CTA. No fake seed founders.
- Working name is `started-ugly` everywhere; renaming happens after James's community poll.

---

## File structure

```
started-ugly/
├── CLAUDE.md                          # project conventions
├── CONTRIBUTING.md                    # PR submission path
├── package.json / tsconfig.json / next.config.ts / .gitignore / .env.example
├── .github/
│   ├── ISSUE_TEMPLATE/submit-your-ugly-mvp.yml
│   └── workflows/ci.yml               # bun test + next build on push/PR
├── scripts/capture.sh                 # screenshot helper (wayback + live)
├── public/screenshots/                # <slug>-then.png / <slug>-now.png
└── src/
    ├── data/entries.ts                # Tactic, Entry, TACTIC_LABELS, entries, helpers
    ├── data/entries.test.ts           # content-integrity suite (build gate)
    ├── lib/site.ts                    # siteUrl, siteName, tagline, repoUrl, contactEmail
    ├── lib/submission.ts              # validateSubmission (pure, testable)
    ├── lib/submission.test.ts
    ├── components/EntryCard.tsx       # shared famous/community card
    ├── components/NewsletterEmbed.tsx # beehiiv iframe (env-driven, renders null if unset)
    ├── components/ShareLinks.tsx      # client: X / LinkedIn / copy-link
    ├── components/SubmitForm.tsx      # client: form + states + mailto fallback
    └── app/
        ├── layout.tsx / globals.css / page.tsx
        ├── [slug]/page.tsx            # entry detail (generateStaticParams)
        ├── [slug]/opengraph-image.tsx # OG composite (then-only variant for community)
        ├── submit/page.tsx
        ├── about/page.tsx
        ├── not-found.tsx
        ├── sitemap.ts / robots.ts
        └── api/submit/route.ts        # POST: honeypot, rate-limit, Resend
            └── route.test.ts
```

---

### Task 1: Scaffold the Next.js app

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `.gitignore`, `.env.example`, `CLAUDE.md`
- Create: `src/lib/site.ts`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`

- [ ] **Step 1: Create the public GitHub repo (CONFIRM WITH JAMES FIRST — outward-facing)**

Marulho checklist step 1; building in public means the repo is public from day 1. Ask James to confirm before running:

```bash
cd /Users/james/Developer/started-ugly
gh api user -q .login   # note the username for repoUrl below
gh repo create started-ugly --public --source=. --push
```

If James defers, skip and set `repoUrl` to `""` (components in later tasks hide GitHub links when empty).

- [ ] **Step 2: Write package.json**

```json
{
  "name": "started-ugly",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "bun test"
  }
}
```

- [ ] **Step 3: Install dependencies**

```bash
bun add next@latest react@latest react-dom@latest @vercel/analytics
bun add -d typescript @types/react @types/react-dom @types/node @types/bun
```

- [ ] **Step 4: Write tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: Write next.config.ts and .gitignore**

`next.config.ts`:
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

`.gitignore`:
```
node_modules/
.next/
out/
.env*
!.env.example
.DS_Store
*.tsbuildinfo
```

- [ ] **Step 6: Write .env.example**

```
# Canonical site URL (drives metadataBase, sitemap, OG absolute URLs)
NEXT_PUBLIC_SITE_URL=https://ugly.marulho.co
# beehiiv embed form URL — component renders nothing until set
NEXT_PUBLIC_BEEHIIV_EMBED_URL=
# Resend API key for the submission route
RESEND_API_KEY=
# Where submissions are delivered
SUBMIT_TO_EMAIL=james.smejlis@proton.me
```

- [ ] **Step 7: Write src/lib/site.ts**

`repoUrl`: use the username from Step 1 (or `""` if repo creation deferred).

```ts
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Working name — pending James's community naming poll.
export const siteName = "Started Ugly";
export const tagline = "Every product you admire started ugly. Ship yours.";
export const hoffmanQuote =
  "If you aren't embarrassed by the first version of your product, you've shipped too late.";

// Set from `gh api user -q .login` in Task 1 Step 1; "" hides GitHub links.
export const repoUrl = "https://github.com/<USERNAME-FROM-STEP-1>/started-ugly";

// Public fallback contact for failed submissions. Swap for an alias if James prefers.
export const contactEmail = "james.smejlis@proton.me";
```

- [ ] **Step 8: Write src/app/globals.css**

Placeholder structural CSS only — Claude Design replaces this wholesale. Keep class names; they are the design seam.

```css
/* PLACEHOLDER styling — replaced by the Claude Design pass (docs/design-brief.md).
   Class names are the contract; keep them stable. */
* { box-sizing: border-box; }
body { margin: 0 auto; max-width: 64rem; padding: 1rem; font-family: serif; }
img { max-width: 100%; height: auto; }
.entry-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
.entry-card { border: 1px solid #000; padding: 0.75rem; }
.entry-card .pair { display: flex; gap: 0.5rem; }
.entry-card .pair > div { flex: 1; }
.badge { border: 1px solid #000; padding: 0 0.4rem; font-size: 0.8rem; display: inline-block; }
.empty-state { border: 2px dashed #000; padding: 2rem; text-align: center; }
```

- [ ] **Step 9: Write src/app/layout.tsx**

```tsx
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { siteName, siteUrl, tagline } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${siteName} — ${tagline}`, template: `%s | ${siteName}` },
  description:
    "The embarrassing first versions of products you admire — ugly v1s, unscalable hacks, pre-code sales, duct-taped demos — next to what they became. Ship yours.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

- [ ] **Step 10: Write a temporary src/app/page.tsx stub (replaced in Task 4)**

```tsx
import { siteName } from "@/lib/site";

export default function Home() {
  return <h1>{siteName}</h1>;
}
```

- [ ] **Step 11: Write CLAUDE.md**

```markdown
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
```

- [ ] **Step 12: Verify the app builds and runs**

```bash
bun run build
```
Expected: build succeeds, `/` prerendered as static. (First run generates `next-env.d.ts` — commit it.)

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js app shell"
```

---

### Task 2: Entry data model + content-integrity tests + first real entry

**Files:**
- Create: `src/data/entries.ts`, `src/data/entries.test.ts`, `scripts/capture.sh`
- Create: `public/screenshots/craigslist-then.png`, `public/screenshots/craigslist-now.png`

- [ ] **Step 1: Write the failing content-integrity test**

`src/data/entries.test.ts`:
```ts
import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { entries, TACTIC_LABELS } from "@/data/entries";

const img = (p: string) => join(process.cwd(), "public", p);

describe("content integrity", () => {
  test("has at least one entry", () => {
    expect(entries.length).toBeGreaterThanOrEqual(1);
  });

  test("slugs are unique and kebab-case", () => {
    const slugs = entries.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  test("required fields are non-empty", () => {
    for (const e of entries) {
      expect(e.name.length).toBeGreaterThan(0);
      expect(e.story.length).toBeGreaterThanOrEqual(20);
      expect(e.story.length).toBeLessThanOrEqual(500);
      expect(Object.keys(TACTIC_LABELS)).toContain(e.tactic);
    }
  });

  test("years are sane", () => {
    for (const e of entries) {
      expect(e.thenYear).toBeGreaterThanOrEqual(1990);
      expect(e.thenYear).toBeLessThanOrEqual(new Date().getFullYear());
      if (e.nowYear) expect(e.nowYear).toBeGreaterThanOrEqual(e.thenYear);
    }
  });

  test("image files exist on disk", () => {
    for (const e of entries) {
      expect(existsSync(img(e.thenImage))).toBe(true);
      if (e.nowImage) expect(existsSync(img(e.nowImage))).toBe(true);
    }
  });

  test("community entries carry founder fields", () => {
    for (const e of entries.filter((x) => x.kind === "community")) {
      expect(e.founderName?.length).toBeGreaterThan(0);
      expect(e.founderLink?.length).toBeGreaterThan(0);
      expect(e.productUrl?.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
bun test src/data/entries.test.ts
```
Expected: FAIL — `Cannot find module '@/data/entries'`.

- [ ] **Step 3: Write scripts/capture.sh**

```bash
#!/usr/bin/env bash
# Capture a screenshot for an entry.
# Usage: ./scripts/capture.sh <url> <output-name>
# Wayback tip: insert `if_` after the timestamp to hide the archive toolbar,
#   e.g. https://web.archive.org/web/19981202230410if_/http://www.google.com/
# Year-form URLs (…/web/1998/http://google.com) redirect to the nearest capture;
# resolve the final URL first, then add if_.
set -euo pipefail
URL="$1"; NAME="$2"
mkdir -p public/screenshots
bunx playwright screenshot --viewport-size=1280,960 "$URL" "public/screenshots/${NAME}.png"
echo "Captured ${URL} -> public/screenshots/${NAME}.png"
```

```bash
chmod +x scripts/capture.sh
bunx playwright install chromium   # one-time, if not already installed
```

- [ ] **Step 4: Capture the Craigslist screenshots**

```bash
# Then: find a mid-/late-1990s capture. Year-form URL redirects to nearest:
#   https://web.archive.org/web/1997/http://www.craigslist.org/
# Resolve it, append if_ to the timestamp, then:
./scripts/capture.sh "https://web.archive.org/web/<TIMESTAMP>if_/http://www.craigslist.org/" craigslist-then
./scripts/capture.sh "https://www.craigslist.org/" craigslist-now
```

Open both PNGs and verify they actually rendered (archive captures are sometimes blank — pick a neighboring snapshot if so). Record the final archive URL and its capture year for the next step.

- [ ] **Step 5: Write src/data/entries.ts with the Craigslist entry**

Set `thenYear` and `sourceUrl` to the actual capture used in Step 4.

```ts
export type Tactic = "ugly-v1" | "dont-scale" | "sold-first" | "duct-tape-demo";

export const TACTIC_LABELS: Record<Tactic, string> = {
  "ugly-v1": "Ugly v1",
  "dont-scale": "Did things that don't scale",
  "sold-first": "Sold it before building it",
  "duct-tape-demo": "Duct-taped the demo",
};

export type Entry = {
  slug: string;
  name: string;
  kind: "famous" | "community";
  tactic: Tactic;
  thenImage: string; // path under /public, e.g. "/screenshots/craigslist-then.png"
  thenCaption?: string;
  thenYear: number;
  nowImage?: string; // absent => community card shows "Now: TBD — they just shipped"
  nowYear?: number;
  story: string; // 1–3 sentences, fact-checked
  sourceUrl?: string; // Wayback capture / interview / article backing the story
  founderName?: string; // community only
  founderLink?: string; // community only
  productUrl?: string; // community only
};

export const entries: Entry[] = [
  {
    slug: "craigslist",
    name: "Craigslist",
    kind: "famous",
    tactic: "ugly-v1",
    thenImage: "/screenshots/craigslist-then.png",
    thenYear: 1997, // set to actual capture year
    nowImage: "/screenshots/craigslist-now.png",
    nowYear: new Date().getFullYear(),
    story:
      "Craig Newmark started it in 1995 as a cc'd email list of San Francisco events. The website came later — and has barely changed since.",
    sourceUrl: "https://web.archive.org/web/<TIMESTAMP>/http://www.craigslist.org/", // actual capture
  },
];

export const famousEntries = entries.filter((e) => e.kind === "famous");
export const communityEntries = entries.filter((e) => e.kind === "community");
export const getEntry = (slug: string) => entries.find((e) => e.slug === slug);
```

- [ ] **Step 6: Run the tests to verify they pass**

```bash
bun test src/data/entries.test.ts
```
Expected: PASS (6 tests).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: entry model, content-integrity tests, first entry (craigslist)"
```

---

### Task 3: Seed the remaining famous entries

**Files:**
- Modify: `src/data/entries.ts` (append 4 entries)
- Create: 8 PNGs under `public/screenshots/`

- [ ] **Step 1: Capture then/now screenshots for the four entries**

Same workflow as Task 2 Step 4 — verify every PNG visually, record actual capture URLs/years:

```bash
# Google — this 1998 capture is well known:
./scripts/capture.sh "https://web.archive.org/web/19981202230410if_/http://www.google.com/" google-then
./scripts/capture.sh "https://www.google.com/" google-now

# Amazon — find earliest available capture (try year-form /web/1996/ then /web/1997/):
./scripts/capture.sh "https://web.archive.org/web/<TIMESTAMP>if_/http://www.amazon.com/" amazon-then
./scripts/capture.sh "https://www.amazon.com/" amazon-now

# Airbnb — 2008-era capture of airbedandbreakfast.com (year-form /web/2008/):
./scripts/capture.sh "https://web.archive.org/web/<TIMESTAMP>if_/http://www.airbedandbreakfast.com/" airbnb-then
./scripts/capture.sh "https://www.airbnb.com/" airbnb-now

# Dropbox — 2008-era capture of getdropbox.com:
./scripts/capture.sh "https://web.archive.org/web/<TIMESTAMP>if_/http://www.getdropbox.com/" dropbox-then
./scripts/capture.sh "https://www.dropbox.com/" dropbox-now
```

Live-site captures may hit bot walls (Amazon especially). Fallback: retry, capture a logged-out product page, or take the screenshot manually in a real browser at 1280×960.

- [ ] **Step 2: Append the four entries to `entries` in src/data/entries.ts**

Set each `thenYear`/`sourceUrl` from the actual captures. Stories below are fact-checked — keep wording unless a source contradicts it.

```ts
  {
    slug: "google",
    name: "Google",
    kind: "famous",
    tactic: "ugly-v1",
    thenImage: "/screenshots/google-then.png",
    thenYear: 1998,
    nowImage: "/screenshots/google-now.png",
    nowYear: new Date().getFullYear(),
    story:
      "Began as a Stanford research project called BackRub. The famously bare 1998 homepage stayed bare partly because the founders didn't do fancy HTML.",
    sourceUrl: "https://web.archive.org/web/19981202230410/http://www.google.com/",
  },
  {
    slug: "amazon",
    name: "Amazon",
    kind: "famous",
    tactic: "ugly-v1",
    thenImage: "/screenshots/amazon-then.png",
    thenYear: 1996, // set to actual capture year
    nowImage: "/screenshots/amazon-now.png",
    nowYear: new Date().getFullYear(),
    story:
      "Launched in 1995 selling only books, run out of Jeff Bezos's garage. A bell rang for every order — within weeks it rang so often they switched it off.",
    sourceUrl: "https://web.archive.org/web/<TIMESTAMP>/http://www.amazon.com/",
  },
  {
    slug: "airbnb",
    name: "Airbnb",
    kind: "famous",
    tactic: "dont-scale",
    thenImage: "/screenshots/airbnb-then.png",
    thenCaption: "AirBed & Breakfast, before the name fit on a cereal box.",
    thenYear: 2008,
    nowImage: "/screenshots/airbnb-now.png",
    nowYear: new Date().getFullYear(),
    story:
      "When listings looked bad, the founders flew to New York and photographed hosts' apartments themselves — and funded the company selling $40 election-themed cereal boxes.",
    sourceUrl: "https://web.archive.org/web/<TIMESTAMP>/http://www.airbedandbreakfast.com/",
  },
  {
    slug: "dropbox",
    name: "Dropbox",
    kind: "famous",
    tactic: "duct-tape-demo",
    thenImage: "/screenshots/dropbox-then.png",
    thenCaption: "The product barely existed — the MVP was a narrated demo video.",
    thenYear: 2008, // set to actual capture year
    nowImage: "/screenshots/dropbox-now.png",
    nowYear: new Date().getFullYear(),
    story:
      "Before the product worked at scale, Drew Houston shipped a 3-minute screencast demo tuned for Digg readers. The waiting list jumped from 5,000 to 75,000 overnight.",
    sourceUrl: "https://web.archive.org/web/<TIMESTAMP>/http://www.getdropbox.com/",
  },
```

- [ ] **Step 3: Run the full content suite**

```bash
bun test src/data/entries.test.ts
```
Expected: PASS — 5 entries validated.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: seed famous entries (google, amazon, airbnb, dropbox)"
```

---

### Task 4: EntryCard, NewsletterEmbed, and the home page

**Files:**
- Create: `src/components/EntryCard.tsx`, `src/components/NewsletterEmbed.tsx`
- Modify: `src/app/page.tsx` (replace stub)

- [ ] **Step 1: Write src/components/EntryCard.tsx**

```tsx
import Image from "next/image";
import Link from "next/link";
import { Entry, TACTIC_LABELS } from "@/data/entries";

export function EntryCard({ entry }: { entry: Entry }) {
  return (
    <article className="entry-card">
      <h3>
        <Link href={`/${entry.slug}`}>{entry.name}</Link>{" "}
        <span className="badge">{TACTIC_LABELS[entry.tactic]}</span>
      </h3>
      <div className="pair">
        <div>
          <Image
            src={entry.thenImage}
            alt={`${entry.name} in ${entry.thenYear}${entry.thenCaption ? ` — ${entry.thenCaption}` : ""}`}
            width={1280}
            height={960}
          />
          <p>
            <strong>{entry.thenYear}</strong>
            {entry.thenCaption ? ` — ${entry.thenCaption}` : ""}
          </p>
        </div>
        <div>
          {entry.nowImage ? (
            <>
              <Image
                src={entry.nowImage}
                alt={`${entry.name} in ${entry.nowYear}`}
                width={1280}
                height={960}
              />
              <p>
                <strong>{entry.nowYear}</strong>
              </p>
            </>
          ) : (
            <p>
              <strong>Now: TBD</strong> — they just shipped.
            </p>
          )}
        </div>
      </div>
      <p>{entry.story}</p>
      {entry.kind === "community" && entry.founderName && (
        <p>
          Shipped by <a href={entry.founderLink}>{entry.founderName}</a>
          {entry.productUrl && (
            <>
              {" — "}
              <a href={entry.productUrl}>see it live</a>
            </>
          )}
        </p>
      )}
    </article>
  );
}
```

- [ ] **Step 2: Write src/components/NewsletterEmbed.tsx**

```tsx
const embedUrl = process.env.NEXT_PUBLIC_BEEHIIV_EMBED_URL;

export function NewsletterEmbed() {
  if (!embedUrl) return null; // renders nothing until beehiiv is configured
  return (
    <section className="newsletter">
      <h2>Get the story behind the next ugly MVP</h2>
      <iframe src={embedUrl} title="Newsletter signup" width="100%" height="120" />
    </section>
  );
}
```

- [ ] **Step 3: Replace src/app/page.tsx with the directory**

```tsx
import Link from "next/link";
import { EntryCard } from "@/components/EntryCard";
import { NewsletterEmbed } from "@/components/NewsletterEmbed";
import { communityEntries, famousEntries } from "@/data/entries";
import { hoffmanQuote, repoUrl, siteName, tagline } from "@/lib/site";

export default function Home() {
  return (
    <main>
      <header>
        <h1>{siteName}</h1>
        <p>{tagline}</p>
        <blockquote>
          “{hoffmanQuote}” <cite>— Reid Hoffman</cite>
        </blockquote>
        <p>
          <Link href="/submit">Submit your ugly MVP</Link> · <Link href="/about">Why this exists</Link>
        </p>
      </header>

      <NewsletterEmbed />

      <section>
        <h2>They all started ugly</h2>
        <div className="entry-grid">
          {famousEntries.map((e) => (
            <EntryCard key={e.slug} entry={e} />
          ))}
        </div>
      </section>

      <section>
        <h2>Shipping Ugly Right Now</h2>
        {communityEntries.length === 0 ? (
          <div className="empty-state">
            <p>No one&apos;s been brave enough yet.</p>
            <p>
              <Link href="/submit">Be the first — get your ugly v1 featured next to Airbnb&apos;s.</Link>
            </p>
          </div>
        ) : (
          <div className="entry-grid">
            {communityEntries.map((e) => (
              <EntryCard key={e.slug} entry={e} />
            ))}
          </div>
        )}
      </section>

      <footer>
        {repoUrl && (
          <p>
            <a href={repoUrl}>This site is open source — PRs welcome.</a>
          </p>
        )}
      </footer>
    </main>
  );
}
```

- [ ] **Step 4: Verify in the dev server**

```bash
bun run dev
```
Visit `http://localhost:3000`: 5 famous cards render with images, community section shows the empty state, header quote present. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: home directory with famous entries and community empty state"
```

---

### Task 5: Entry detail pages, share links, sitemap, robots

**Files:**
- Create: `src/app/[slug]/page.tsx`, `src/components/ShareLinks.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`

- [ ] **Step 1: Write src/components/ShareLinks.tsx (client component)**

```tsx
"use client";

import { useState } from "react";

export function ShareLinks({ url, text }: { url: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  return (
    <p className="share-links">
      Share:{" "}
      <a
        href={`https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        X
      </a>{" "}
      ·{" "}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        LinkedIn
      </a>{" "}
      ·{" "}
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
    </p>
  );
}
```

- [ ] **Step 2: Write src/app/[slug]/page.tsx**

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareLinks } from "@/components/ShareLinks";
import { entries, getEntry, TACTIC_LABELS } from "@/data/entries";
import { siteUrl } from "@/lib/site";

export function generateStaticParams() {
  return entries.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) return {};
  return {
    title: `${entry.name} started ugly`,
    description: entry.story,
  };
}

export default async function EntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();

  const shareText = entry.nowYear
    ? `${entry.name}, ${entry.thenYear} → ${entry.nowYear}. It started ugly.`
    : `${entry.name} just shipped ugly. Your move.`;

  return (
    <main>
      <p>
        <Link href="/">← All ugly MVPs</Link>
      </p>
      <h1>
        {entry.name} <span className="badge">{TACTIC_LABELS[entry.tactic]}</span>
      </h1>
      <section className="pair">
        <div>
          <h2>{entry.thenYear}</h2>
          <Image
            src={entry.thenImage}
            alt={`${entry.name} in ${entry.thenYear}`}
            width={1280}
            height={960}
            priority
          />
          {entry.thenCaption && <p>{entry.thenCaption}</p>}
        </div>
        <div>
          {entry.nowImage ? (
            <>
              <h2>{entry.nowYear}</h2>
              <Image
                src={entry.nowImage}
                alt={`${entry.name} in ${entry.nowYear}`}
                width={1280}
                height={960}
              />
            </>
          ) : (
            <>
              <h2>Now: TBD</h2>
              <p>They just shipped. Check back.</p>
            </>
          )}
        </div>
      </section>
      <p>{entry.story}</p>
      {entry.sourceUrl && (
        <p>
          <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer">
            Source
          </a>
        </p>
      )}
      {entry.kind === "community" && entry.founderName && (
        <p>
          Shipped by <a href={entry.founderLink}>{entry.founderName}</a>
          {entry.productUrl && (
            <>
              {" — "}
              <a href={entry.productUrl}>see it live</a>
            </>
          )}
        </p>
      )}
      <ShareLinks url={`${siteUrl}/${entry.slug}`} text={shareText} />
      <p>
        <Link href="/submit">Your turn — submit your ugly MVP →</Link>
      </p>
    </main>
  );
}
```

- [ ] **Step 3: Write src/app/sitemap.ts and src/app/robots.ts**

`src/app/sitemap.ts`:
```ts
import type { MetadataRoute } from "next";
import { entries } from "@/data/entries";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl },
    { url: `${siteUrl}/about` },
    { url: `${siteUrl}/submit` },
    ...entries.map((e) => ({ url: `${siteUrl}/${e.slug}` })),
  ];
}
```

`src/app/robots.ts`:
```ts
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
```

- [ ] **Step 4: Verify**

```bash
bun run build
```
Expected: `/craigslist`, `/google`, `/amazon`, `/airbnb`, `/dropbox` all listed as prerendered static pages; `/sitemap.xml` and `/robots.txt` present. Then `bun run dev`, visit `/airbnb`, check images, badge, share links, source link.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: entry detail pages, share links, sitemap, robots"
```

---

### Task 6: Per-entry OG share cards

**Files:**
- Create: `src/app/[slug]/opengraph-image.tsx`

- [ ] **Step 1: Write src/app/[slug]/opengraph-image.tsx**

Images are read from disk and inlined as data URIs so builds never depend on the network. Community entries without a `nowImage` get the then-only variant.

```tsx
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { entries, getEntry } from "@/data/entries";
import { siteName } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return entries.map((e) => ({ slug: e.slug }));
}

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getEntry(slug);
  return [{ id: 0, alt: entry ? `${entry.name} — it started ugly` : siteName, size, contentType }];
}

async function dataUri(publicPath: string) {
  const buf = await readFile(join(process.cwd(), "public", publicPath));
  return `data:image/png;base64,${buf.toString("base64")}`;
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) return new ImageResponse(<div style={{ display: "flex" }}>{siteName}</div>, size);

  const then = await dataUri(entry.thenImage);
  const now = entry.nowImage ? await dataUri(entry.nowImage) : null;
  const headline = now
    ? `${entry.name.toUpperCase()}, ${entry.thenYear} → ${entry.nowYear}. It started ugly.`
    : `${entry.name.toUpperCase()}, ${entry.thenYear} → ?. They shipped ugly. Your move.`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          color: "#000",
          padding: 24,
          fontSize: 36,
        }}
      >
        <div style={{ display: "flex", flex: 1, gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={then} alt="" style={{ width: now ? "50%" : "100%", objectFit: "cover", border: "4px solid #000" }} />
          {now && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={now} alt="" style={{ width: "50%", objectFit: "cover", border: "4px solid #000" }} />
          )}
        </div>
        <div style={{ display: "flex", paddingTop: 16, fontWeight: 700 }}>{headline}</div>
      </div>
    ),
    size
  );
}
```

- [ ] **Step 2: Verify the card renders**

```bash
bun run dev
```
Open `http://localhost:3000/airbnb/opengraph-image` — expect a 1200×630 PNG with both screenshots and the headline. Check `view-source:http://localhost:3000/airbnb` includes an `og:image` meta tag.

- [ ] **Step 3: Verify the static build includes the OG routes**

```bash
bun run build
```
Expected: build passes; `[slug]/opengraph-image` listed per entry.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: per-entry OG share cards via next/og"
```

---

### Task 7: Submission validation library (TDD)

**Files:**
- Create: `src/lib/submission.ts`, `src/lib/submission.test.ts`

- [ ] **Step 1: Write the failing tests**

`src/lib/submission.test.ts`:
```ts
import { describe, expect, test } from "bun:test";
import { validateSubmission } from "@/lib/submission";

const valid = {
  founderName: "Ada Founder",
  email: "ada@example.com",
  productName: "ShipFastly",
  productUrl: "https://shipfastly.example.com",
  founderLink: "https://x.com/adafounder",
  story: "Shipped a one-page MVP in a weekend. The checkout is a Stripe payment link.",
};

describe("validateSubmission", () => {
  test("accepts a valid submission", () => {
    const r = validateSubmission(valid);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.productName).toBe("ShipFastly");
  });

  test("rejects non-object input", () => {
    expect(validateSubmission(null).ok).toBe(false);
    expect(validateSubmission("hi").ok).toBe(false);
  });

  test("rejects missing required fields", () => {
    const r = validateSubmission({ ...valid, founderName: "" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.join(" ")).toContain("founderName");
  });

  test("rejects malformed email", () => {
    expect(validateSubmission({ ...valid, email: "not-an-email" }).ok).toBe(false);
  });

  test("rejects malformed URLs", () => {
    expect(validateSubmission({ ...valid, productUrl: "not a url" }).ok).toBe(false);
    expect(validateSubmission({ ...valid, founderLink: "javascript:alert(1)" }).ok).toBe(false);
  });

  test("rejects too-short and too-long stories", () => {
    expect(validateSubmission({ ...valid, story: "short" }).ok).toBe(false);
    expect(validateSubmission({ ...valid, story: "x".repeat(2001) }).ok).toBe(false);
  });

  test("trims whitespace", () => {
    const r = validateSubmission({ ...valid, productName: "  ShipFastly  " });
    if (r.ok) expect(r.data.productName).toBe("ShipFastly");
    expect(r.ok).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
bun test src/lib/submission.test.ts
```
Expected: FAIL — `Cannot find module '@/lib/submission'`.

- [ ] **Step 3: Write src/lib/submission.ts**

```ts
export type Submission = {
  founderName: string;
  email: string;
  productName: string;
  productUrl: string;
  founderLink: string;
  story: string;
};

export type SubmissionResult =
  | { ok: true; data: Submission }
  | { ok: false; errors: string[] };

const isHttpUrl = (value: string) => {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

export function validateSubmission(input: unknown): SubmissionResult {
  if (typeof input !== "object" || input === null) {
    return { ok: false, errors: ["body must be a JSON object"] };
  }
  const raw = input as Record<string, unknown>;
  const errors: string[] = [];

  const str = (key: string, min: number, max: number) => {
    const v = typeof raw[key] === "string" ? (raw[key] as string).trim() : "";
    if (v.length < min || v.length > max) {
      errors.push(`${key} must be ${min}–${max} characters`);
    }
    return v;
  };

  const founderName = str("founderName", 1, 100);
  const email = str("email", 3, 200);
  const productName = str("productName", 1, 100);
  const productUrl = str("productUrl", 1, 500);
  const founderLink = str("founderLink", 1, 500);
  const story = str("story", 20, 2000);

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("email is invalid");
  if (productUrl && !isHttpUrl(productUrl)) errors.push("productUrl must be a valid http(s) URL");
  if (founderLink && !isHttpUrl(founderLink)) errors.push("founderLink must be a valid http(s) URL");

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, data: { founderName, email, productName, productUrl, founderLink, story } };
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
bun test src/lib/submission.test.ts
```
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: submission validation library"
```

---

### Task 8: Submission API route (TDD)

**Files:**
- Create: `src/app/api/submit/route.ts`, `src/app/api/submit/route.test.ts`

- [ ] **Step 1: Write the failing route tests**

`src/app/api/submit/route.test.ts` — note: rate-limit state is module-level, so each test uses a distinct IP; the honeypot field is `website`.

```ts
import { afterEach, describe, expect, test } from "bun:test";
import { POST } from "@/app/api/submit/route";

const valid = {
  founderName: "Ada Founder",
  email: "ada@example.com",
  productName: "ShipFastly",
  productUrl: "https://shipfastly.example.com",
  founderLink: "https://x.com/adafounder",
  story: "Shipped a one-page MVP in a weekend. The checkout is a Stripe payment link.",
};

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

function stubFetch(status: number) {
  const calls: { url: string; init?: RequestInit }[] = [];
  globalThis.fetch = (async (url: any, init?: any) => {
    calls.push({ url: String(url), init });
    return new Response(JSON.stringify({ id: "email_123" }), { status });
  }) as typeof fetch;
  return calls;
}

const req = (body: unknown, ip: string) =>
  new Request("http://localhost/api/submit", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });

describe("POST /api/submit", () => {
  test("happy path sends email via Resend and returns 200", async () => {
    process.env.RESEND_API_KEY = "test-key";
    process.env.SUBMIT_TO_EMAIL = "james@example.com";
    const calls = stubFetch(200);
    const res = await POST(req(valid, "1.1.1.1"));
    expect(res.status).toBe(200);
    expect(calls.length).toBe(1);
    expect(calls[0].url).toBe("https://api.resend.com/emails");
    const sent = JSON.parse(String(calls[0].init?.body));
    expect(sent.to).toEqual(["james@example.com"]);
    expect(sent.subject).toContain("ShipFastly");
  });

  test("honeypot filled returns fake success without sending", async () => {
    const calls = stubFetch(200);
    const res = await POST(req({ ...valid, website: "http://spam.example" }, "2.2.2.2"));
    expect(res.status).toBe(200);
    expect(calls.length).toBe(0);
  });

  test("invalid body returns 400 with errors", async () => {
    stubFetch(200);
    const res = await POST(req({ ...valid, email: "nope" }, "3.3.3.3"));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.errors.length).toBeGreaterThan(0);
  });

  test("non-JSON body returns 400", async () => {
    stubFetch(200);
    const res = await POST(
      new Request("http://localhost/api/submit", {
        method: "POST",
        headers: { "x-forwarded-for": "4.4.4.4" },
        body: "not json",
      })
    );
    expect(res.status).toBe(400);
  });

  test("Resend failure returns 502 with fallback flag", async () => {
    process.env.RESEND_API_KEY = "test-key";
    process.env.SUBMIT_TO_EMAIL = "james@example.com";
    stubFetch(500);
    const res = await POST(req(valid, "5.5.5.5"));
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.fallback).toBe(true);
  });

  test("rate limit: 4th request in a minute from same IP returns 429", async () => {
    process.env.RESEND_API_KEY = "test-key";
    process.env.SUBMIT_TO_EMAIL = "james@example.com";
    stubFetch(200);
    for (let i = 0; i < 3; i++) {
      const res = await POST(req(valid, "6.6.6.6"));
      expect(res.status).toBe(200);
    }
    const res4 = await POST(req(valid, "6.6.6.6"));
    expect(res4.status).toBe(429);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
bun test src/app/api/submit/route.test.ts
```
Expected: FAIL — `Cannot find module '@/app/api/submit/route'`.

- [ ] **Step 3: Write src/app/api/submit/route.ts**

```ts
import { validateSubmission } from "@/lib/submission";

// Best-effort in-memory rate limit (resets per serverless instance — the
// honeypot does the real anti-spam work; see spec).
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return Response.json({ error: "Too many submissions — try again in a minute." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ errors: ["Body must be JSON."] }, { status: 400 });
  }

  // Honeypot: real users never see this field. Fake success — don't tip off bots.
  if (typeof body === "object" && body !== null && (body as Record<string, unknown>).website) {
    return Response.json({ ok: true });
  }

  const result = validateSubmission(body);
  if (!result.ok) {
    return Response.json({ errors: result.errors }, { status: 400 });
  }
  const s = result.data;

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // onboarding@resend.dev works before a domain is verified (delivers only
      // to the account owner's email — exactly our use case). Swap to a
      // verified-domain sender post-launch.
      from: "Started Ugly <onboarding@resend.dev>",
      to: [process.env.SUBMIT_TO_EMAIL],
      reply_to: s.email,
      subject: `Ugly MVP submission: ${s.productName}`,
      text: [
        `Product: ${s.productName}`,
        `URL: ${s.productUrl}`,
        `Founder: ${s.founderName} (${s.email})`,
        `Founder link: ${s.founderLink}`,
        ``,
        `Story:`,
        s.story,
        ``,
        `Reply to this email to ask for their screenshot.`,
      ].join("\n"),
    }),
  });

  if (!resendRes.ok) {
    return Response.json(
      { error: "Could not send your submission.", fallback: true },
      { status: 502 }
    );
  }
  return Response.json({ ok: true });
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
bun test src/app/api/submit/route.test.ts
```
Expected: PASS (6 tests). Also run the full suite: `bun test` — everything green.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: submission API route with honeypot, rate limit, Resend"
```

---

### Task 9: Submit page

**Files:**
- Create: `src/components/SubmitForm.tsx`, `src/app/submit/page.tsx`

- [ ] **Step 1: Write src/components/SubmitForm.tsx (client component)**

```tsx
"use client";

import { useState } from "react";
import { contactEmail } from "@/lib/site";

type Status = { state: "idle" | "sending" | "sent" } | { state: "error"; message: string; fallback: boolean };

export function SubmitForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus({ state: "sending" });
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (res.ok) {
        form.reset();
        setStatus({ state: "sent" });
      } else {
        setStatus({
          state: "error",
          message: body.errors?.join(". ") ?? body.error ?? "Something went wrong.",
          fallback: Boolean(body.fallback),
        });
      }
    } catch {
      setStatus({ state: "error", message: "Network error.", fallback: true });
    }
  }

  if (status.state === "sent") {
    return (
      <p>
        <strong>Got it.</strong> I&apos;ll personally reply within a couple of days to get your
        screenshot. Go ship something in the meantime.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <p>
        <label>
          Your name
          <br />
          <input name="founderName" required maxLength={100} />
        </label>
      </p>
      <p>
        <label>
          Your email
          <br />
          <input name="email" type="email" required maxLength={200} />
        </label>
      </p>
      <p>
        <label>
          Product name
          <br />
          <input name="productName" required maxLength={100} />
        </label>
      </p>
      <p>
        <label>
          Product URL
          <br />
          <input name="productUrl" type="url" required maxLength={500} />
        </label>
      </p>
      <p>
        <label>
          Your X / LinkedIn
          <br />
          <input name="founderLink" type="url" required maxLength={500} />
        </label>
      </p>
      <p>
        <label>
          What did you ship, and what&apos;s embarrassing about it? Ugly screens, manual hacks,
          selling before building, duct-taped demos — all count.
          <br />
          <textarea name="story" required minLength={20} maxLength={2000} rows={6} />
        </label>
      </p>
      {/* Honeypot — hidden from humans, irresistible to bots */}
      <p style={{ display: "none" }} aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <p>
        <button type="submit" disabled={status.state === "sending"}>
          {status.state === "sending" ? "Sending…" : "Submit your ugly MVP"}
        </button>
      </p>
      {status.state === "error" && (
        <p role="alert">
          {status.message}{" "}
          {status.fallback && (
            <>
              You can also just email me: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            </>
          )}
        </p>
      )}
    </form>
  );
}
```

- [ ] **Step 2: Write src/app/submit/page.tsx**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { SubmitForm } from "@/components/SubmitForm";
import { repoUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Submit your ugly MVP",
  description:
    "Get your embarrassing first version featured next to Airbnb's. Shipping ugly is the whole point.",
};

export default function SubmitPage() {
  return (
    <main>
      <p>
        <Link href="/">← All ugly MVPs</Link>
      </p>
      <h1>Submit your ugly MVP</h1>
      <p>
        Shipped something ugly to real users? Get it featured next to Airbnb&apos;s cereal boxes.
        I&apos;ll personally reply within a couple of days to grab your screenshot.
      </p>
      <SubmitForm />
      {repoUrl && (
        <>
          <h2>Prefer GitHub?</h2>
          <p>
            Add yourself directly: open an issue with the{" "}
            <a href={`${repoUrl}/issues/new/choose`}>Submit your ugly MVP template</a>, or send a PR
            — see <a href={`${repoUrl}/blob/main/CONTRIBUTING.md`}>CONTRIBUTING.md</a>.
          </p>
        </>
      )}
    </main>
  );
}
```

- [ ] **Step 3: Manual verification**

```bash
bun run dev
```
On `http://localhost:3000/submit`: submit with a bad email → inline error; fill honeypot via devtools → fake success; valid submit without `RESEND_API_KEY` set → error message with mailto fallback link. (Real email delivery is verified in Task 12 with the live key.)

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: submit page with form and GitHub path"
```

---

### Task 10: About page and 404

**Files:**
- Create: `src/app/about/page.tsx`, `src/app/not-found.tsx`

- [ ] **Step 1: Write src/app/about/page.tsx**

James should personalize the bio paragraph before launch — flag it to him at review.

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { contactEmail, hoffmanQuote, repoUrl, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: "Why this exists",
  description: "Perfectionism kills more startups than ugly websites ever did.",
};

export default function AboutPage() {
  return (
    <main>
      <p>
        <Link href="/">← All ugly MVPs</Link>
      </p>
      <h1>Why {siteName} exists</h1>
      <blockquote>
        “{hoffmanQuote}” <cite>— Reid Hoffman</cite>
      </blockquote>
      <p>
        Every founder compares their day 1 to someone else&apos;s year 15 — then spends six more
        months polishing instead of shipping. This site is the antidote: the actual embarrassing
        first versions of products you admire, next to what they became. Ugly v1s, manual hacks,
        pre-code sales, duct-taped demos. They all shipped anyway. That&apos;s the whole lesson.
      </p>
      <p>
        This site practices what it preaches: it was shipped fast and ugly, on purpose. If
        you&apos;re reading this and your MVP is &quot;almost ready&quot; —{" "}
        <Link href="/submit">ship it and submit it</Link>.
      </p>
      <h2>Who made this</h2>
      <p>
        I&apos;m James. I work with early-stage founders and kept watching the same perfectionism
        block kill momentum. Say hi: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
      </p>
      {repoUrl && (
        <p>
          The site is <a href={repoUrl}>open source</a> — adding yourself via PR is encouraged.
        </p>
      )}
    </main>
  );
}
```

- [ ] **Step 2: Write src/app/not-found.tsx**

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <h1>404</h1>
      <p>This page doesn&apos;t exist — unlike your MVP, which should.</p>
      <p>
        <Link href="/">← All ugly MVPs</Link> · <Link href="/submit">Submit your ugly MVP</Link>
      </p>
    </main>
  );
}
```

- [ ] **Step 3: Verify**

`bun run dev` — check `/about` renders and `/nonexistent-page` shows the 404 joke.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: about page and 404"
```

---

### Task 11: GitHub submission path + CI

**Files:**
- Create: `CONTRIBUTING.md`, `.github/ISSUE_TEMPLATE/submit-your-ugly-mvp.yml`, `.github/workflows/ci.yml`

- [ ] **Step 1: Write CONTRIBUTING.md**

```markdown
# Add your ugly MVP

Two ways in:

## 1. The form (no GitHub needed)
Use [the submit page](https://ugly.marulho.co/submit). James replies personally
to collect your screenshot.

## 2. Pull request
1. Fork the repo.
2. Add your screenshot to `public/screenshots/<your-slug>-then.png`
   (1280×960-ish, PNG, under ~500KB — `scripts/capture.sh` helps).
3. Add one object to the `entries` array in `src/data/entries.ts`:

   ```ts
   {
     slug: "your-product",
     name: "Your Product",
     kind: "community",
     tactic: "ugly-v1", // or "dont-scale" | "sold-first" | "duct-tape-demo"
     thenImage: "/screenshots/your-product-then.png",
     thenYear: 2026,
     story: "1–3 sentences. What did you ship and what's embarrassing about it?",
     founderName: "Your Name",
     founderLink: "https://x.com/you",
     productUrl: "https://yourproduct.com",
   },
   ```

4. Run `bun test` — the content-integrity suite must pass (CI runs it on your PR).
5. Open the PR. Honest ugliness only; no marketing screenshots.

House rules: it must have actually shipped to real users, the story must be
true, and uglier is better.
```

- [ ] **Step 2: Write .github/ISSUE_TEMPLATE/submit-your-ugly-mvp.yml**

```yaml
name: Submit your ugly MVP
description: Get your embarrassing first version featured next to Airbnb's.
title: "Ugly MVP: <your product name>"
labels: [submission]
body:
  - type: input
    id: product
    attributes: { label: Product name + URL }
    validations: { required: true }
  - type: input
    id: founder
    attributes: { label: Your name + X/LinkedIn link }
    validations: { required: true }
  - type: textarea
    id: story
    attributes:
      label: What did you ship, and what's embarrassing about it?
      description: Ugly screens, manual hacks, selling before building, duct-taped demos — all count.
    validations: { required: true }
  - type: textarea
    id: screenshot
    attributes:
      label: Screenshot of the ugly version
      description: Drag and drop an image here.
    validations: { required: true }
```

- [ ] **Step 3: Write .github/workflows/ci.yml**

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bun test
      - run: bun run build
```

- [ ] **Step 4: Verify the suite passes locally exactly as CI will run it**

```bash
bun install --frozen-lockfile && bun test && bun run build
```
Expected: all green.

- [ ] **Step 5: Commit (and push if the repo exists — confirms CI goes green)**

```bash
git add -A
git commit -m "feat: GitHub submission path (CONTRIBUTING, issue template) and CI"
git push  # if remote exists; then check: gh run watch
```

---

### Task 12: Final verification + deploy handoff

**Files:** none created — verification and checklist.

- [ ] **Step 1: Full local verification**

```bash
bun test          # expected: all suites pass
bun run build     # expected: all routes static except /api/submit
```

- [ ] **Step 2: Manual click-through (deliberately ugly ≠ broken)**

Run `bun run dev` and verify:
- `/` — 5 famous cards, community empty state with submit CTA, quote, footer repo link
- `/airbnb` — images, badge, story, source link, share links (copy-link works)
- `/airbnb/opengraph-image` — composite card renders
- `/submit` — validation errors inline; mailto fallback appears when route fails
- `/about`, `/nonexistent` (404 joke), `/sitemap.xml`, `/robots.txt`
- Mobile width (devtools, 390px): pairs stack readably, nothing overflows

- [ ] **Step 3: Live submission test (needs James's RESEND_API_KEY)**

Put the real key in `.env.local` (`RESEND_API_KEY`, `SUBMIT_TO_EMAIL`), restart dev, submit the form, and confirm the email lands in James's inbox with reply-to set to the submitter.

- [ ] **Step 4: Deploy (with James — Marulho checklist)**

1. Repo pushed to GitHub (Task 1 / Task 11).
2. Vercel → Import Git Repository → Next.js defaults → Deploy.
3. Vercel → Settings → Domains → add `ugly.marulho.co` (placeholder until the naming poll).
4. Vercel → Settings → Env Vars (all environments): `NEXT_PUBLIC_SITE_URL=https://ugly.marulho.co`, `RESEND_API_KEY`, `SUBMIT_TO_EMAIL`, and `NEXT_PUBLIC_BEEHIIV_EMBED_URL` once James creates the beehiiv publication → redeploy.
5. Enable Vercel Analytics in the dashboard.
6. Post-deploy smoke: share an entry URL into an X/LinkedIn post composer and confirm the OG card preview renders.

- [ ] **Step 5: Hand back to James — remaining human tasks**

- Run the naming poll; buy the domain; add it in Vercel + update `NEXT_PUBLIC_SITE_URL` (301 from `ugly.marulho.co` preserved).
- Create the beehiiv publication and set the embed URL.
- Personalize the `/about` bio.
- Claude Design pass using `docs/design-brief.md` (class names in `globals.css` are the seam).
- Content ops: grow catalog to 15–20 entries using `scripts/capture.sh` + the spec's candidate pool; feature + tag modern founders at launch.

---

## Plan self-review (done at writing time)

- **Spec coverage:** pages (/, [slug], /submit, /about, 404, sitemap, robots) ✓ · content model with tactics + optional now ✓ · OG cards incl. then-only variant ✓ · share links ✓ · form-to-inbox with honeypot/rate-limit/fallback ✓ · GitHub path + CI validating community PRs ✓ · beehiiv embed (env-gated) ✓ · build-time content validation ✓ · Vercel Analytics ✓ · deploy checklist ✓ · sourcing workflow + script ✓. Catalog growth and visual design are explicitly out of plan scope per spec ("pre-launch task, not code") and the Claude Design handover.
- **Placeholder scan:** `<TIMESTAMP>`/`<USERNAME-FROM-STEP-1>` tokens are deliberate runtime-discovered values with explicit discovery steps; no undefined work remains.
- **Type consistency:** `Entry`/`Tactic`/`TACTIC_LABELS`/helpers defined once in Task 2 and imported consistently; `validateSubmission`'s `Submission` shape matches the form field names (`founderName`, `email`, `productName`, `productUrl`, `founderLink`, `story`) and the route's usage; `params` is `Promise<…>` in all dynamic routes.
