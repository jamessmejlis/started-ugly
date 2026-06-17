import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TodoSeam } from "@/components/TodoSeam";
import { hoffmanQuote, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: "You only ever see the after",
  description:
    "You're putting your day one next to their year fifteen. It's a rigged comparison. Function over form — make it work before you make it pretty.",
};

const BELIEFS = [
  "Shipping ugly beats polishing in private. Every time.",
  "The embarrassing version is the one that proves it's real.",
  "Survivorship bias hides the ugly start, not the absence of one.",
  "Done and embarrassing > perfect and imaginary.",
];

export default function AboutPage() {
  return (
    <div className="wrap">
      <SiteHeader active="about" />

      <article className="about">
        <div className="kicker">a directory of embarrassing first versions</div>
        <h1 className="about__h">You only ever see the after.</h1>
        <p className="about__p">
          Every product you admire showed up in your life fully formed — polished, confident,
          obviously inevitable. So that&apos;s the bar you hold your own draft to. It&apos;s a
          rigged comparison. You&apos;re putting your day one next to their year fifteen.
        </p>
        <p className="about__p">
          {siteName}{" "}
          collects the day ones. The lesson underneath all of them is the same: make it work
          before you make it pretty. Ship the part that&apos;s useful and be embarrassed about the
          rest.
        </p>

        <blockquote className="about__quote">
          &ldquo;{hoffmanQuote}&rdquo;
          <cite>— Reid Hoffman</cite>
        </blockquote>

        <div className="about__list-label">What we believe</div>
        <ol className="about__list">
          {BELIEFS.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ol>

        <p className="about__p">
          This site was built in a weekend and it shows. Default fonts, hairline rules, no logo
          yet. No focus group approved any of it.
        </p>
        <p className="about__punch">That&apos;s the point.</p>

        <div className="about__cta">
          <Link href="/submit" className="btn">
            Add an ugly start →
          </Link>
          <Link href="/" className="link">
            Back to the directory
          </Link>
        </div>

        <TodoSeam
          className="about__seam"
          lines={["// TODO: real screenshots, write better jokes, design an actual logo"]}
        />
      </article>

      <SiteFooter variant="about" />
    </div>
  );
}
