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
        "{hoffmanQuote}" <cite>— Reid Hoffman</cite>
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
