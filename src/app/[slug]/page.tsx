import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsletterEmbed } from "@/components/NewsletterEmbed";
import { ShareLinks } from "@/components/ShareLinks";
import { entries, getEntry, TACTIC_LABELS } from "@/data/entries";
import { siteUrl } from "@/lib/site";

export const dynamicParams = false;

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
      <h1>{entry.name}</h1>
      <span className="badge">{TACTIC_LABELS[entry.tactic]}</span>
      <section className="pair">
        <div>
          <h2>{entry.thenYear}</h2>
          <Image
            src={entry.thenImage}
            alt={`${entry.name} in ${entry.thenYear}`}
            width={1280}
            height={960}
            priority
            sizes="(max-width: 600px) 100vw, 50vw"
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
                sizes="(max-width: 600px) 100vw, 50vw"
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
          Shipped by{" "}
          <a href={entry.founderLink} rel="noopener noreferrer">
            {entry.founderName}
          </a>
          {entry.productUrl && (
            <>
              {" — "}
              <a href={entry.productUrl} rel="noopener noreferrer">
                see it live
              </a>
            </>
          )}
        </p>
      )}
      <ShareLinks url={`${siteUrl}/${entry.slug}`} text={shareText} />
      <p>
        <Link href="/submit">Your turn — submit your ugly MVP →</Link>
      </p>
      <NewsletterEmbed />
    </main>
  );
}
