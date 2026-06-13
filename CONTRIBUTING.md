# Add your ugly MVP

Two ways in:

## 1. The form (no GitHub needed)
Use [the submit page](https://ugly.marulho.co/submit). James replies personally
to collect your screenshot.

## 2. Pull request
1. Fork the repo.
2. Add your screenshot to `public/screenshots/<your-slug>-then.png`
   (1280×960-ish, PNG, under 500KB — `scripts/capture.sh` helps, and the test
   suite enforces the ceiling).
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
