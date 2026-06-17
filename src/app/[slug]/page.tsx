import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BeforeAfter } from "@/components/BeforeAfter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  entries,
  firstEntryWithTactic,
  getEntry,
  TACTIC_LABELS,
} from "@/data/entries";

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
    description: entry.lead ?? entry.story,
  };
}

export default async function EntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idx = entries.findIndex((e) => e.slug === slug);
  if (idx === -1) notFound();
  const entry = entries[idx];

  const number = idx + 1;
  const prev = entries[idx - 1];
  const next = entries[idx + 1];
  const era = entry.name.toUpperCase();

  const tactics = entry.tactics ?? [entry.tactic];
  const fileStats = entry.fileStats ?? [{ label: "Founded", value: String(entry.thenYear) }];
  const lead = entry.lead ?? entry.thenCaption;

  return (
    <div className="wrap">
      <SiteHeader variant="back" />

      <article className="entry">
        <div className="kicker">Hall of fame — no. {number}</div>
        <div className="entry__title-row">
          <h1 className="entry__name">{entry.name}</h1>
          <span className="entry__est">Est. {entry.thenYear}</span>
        </div>
        {lead && <p className="entry__lead">{lead}</p>}

        <div className="ba-frame">
          <BeforeAfter
            height={470}
            priority
            beforeSrc={entry.thenImage}
            afterSrc={entry.nowImage ?? entry.thenImage}
            beforeAlt={`${entry.name} in ${entry.thenYear}`}
            afterAlt={`${entry.name} in ${entry.nowYear ?? "now"}`}
            beforeBadge={`${era} · ${entry.thenYear}`}
            afterBadge={`${era} · ${entry.nowYear ?? "now"}`}
          />
        </div>
        <p className="caption">
          Drag the handle — {entry.name}, {entry.thenYear} → {entry.nowYear ?? "now"}.
        </p>
        {entry.imageCredit && <p className="caption caption--credit">{entry.imageCredit}</p>}

        {entry.quote && (
          <blockquote className="entry__quote">
            &ldquo;{entry.quote.text}&rdquo;
            <cite>— {entry.quote.cite}</cite>
          </blockquote>
        )}

        <div className="entry__body">
          <div>
            {entry.body ? (
              entry.body.map((p, i) => (
                <p className="entry__p" key={i}>
                  <b className="entry__p-lead">{p.lead}</b> {p.text}
                </p>
              ))
            ) : (
              <p className="entry__p">{entry.story}</p>
            )}
            {entry.sourceUrl && (
              <p className="entry__source">
                <a
                  className="link"
                  href={entry.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source ↗
                </a>
              </p>
            )}
            {entry.kind === "community" && entry.founderName && (
              <p className="entry__source">
                Shipped by{" "}
                <a className="link" href={entry.founderLink} rel="noopener noreferrer">
                  {entry.founderName}
                </a>
                {entry.productUrl && (
                  <>
                    {" — "}
                    <a className="link" href={entry.productUrl} rel="noopener noreferrer">
                      see it live
                    </a>
                  </>
                )}
              </p>
            )}
          </div>

          <aside className="entry__file">
            <div className="file-label">The file</div>
            <div className="file-rows">
              {fileStats.map((s) => (
                <div className="file-row" key={s.label}>
                  <span>{s.label}</span>
                  <span>{s.value}</span>
                </div>
              ))}
            </div>

            <div className="file-label" style={{ marginTop: 16 }}>
              Tactics used
            </div>
            <div className="file-tactics">
              {tactics.map((t) => {
                const target = firstEntryWithTactic(t);
                return target ? (
                  <div key={t}>
                    <Link href={`/${target.slug}`} className="link">
                      {TACTIC_LABELS[t]}
                    </Link>
                  </div>
                ) : (
                  <div key={t}>{TACTIC_LABELS[t]}</div>
                );
              })}
            </div>

            {entry.lesson && <div className="entry__lesson">The lesson: {entry.lesson}</div>}
          </aside>
        </div>

        <nav className="prevnext">
          {prev ? (
            <Link href={`/${prev.slug}`}>
              ‹ Prev · {prev.name} (no. {idx})
            </Link>
          ) : (
            <span className="spacer" aria-hidden="true">
              ‹
            </span>
          )}
          {next ? (
            <Link href={`/${next.slug}`}>
              Next · {next.name} (no. {idx + 2}) ›
            </Link>
          ) : (
            <span className="spacer" aria-hidden="true">
              ›
            </span>
          )}
        </nav>
      </article>
    </div>
  );
}
