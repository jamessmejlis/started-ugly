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
          "{hoffmanQuote}" <cite>— Reid Hoffman</cite>
        </blockquote>
        <p>
          <Link href="/submit">Submit your ugly MVP</Link> · <Link href="/about">Why this exists</Link>
        </p>
      </header>

      <NewsletterEmbed />

      <section>
        <h2>They all started ugly</h2>
        <div className="entry-grid">
          {famousEntries.map((e, i) => (
            <EntryCard key={e.slug} entry={e} priority={i === 0} />
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
