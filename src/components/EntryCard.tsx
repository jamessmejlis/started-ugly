import Image from "next/image";
import Link from "next/link";
import { Entry, TACTIC_LABELS } from "@/data/entries";

export function EntryCard({ entry, priority = false }: { entry: Entry; priority?: boolean }) {
  return (
    <article className="entry-card">
      <h3>
        <Link href={`/${entry.slug}`}>{entry.name}</Link>
      </h3>
      <span className="badge">{TACTIC_LABELS[entry.tactic]}</span>
      <div className="pair">
        <div>
          <Image
            src={entry.thenImage}
            alt={`${entry.name} in ${entry.thenYear}${entry.thenCaption ? ` — ${entry.thenCaption}` : ""}`}
            width={1280}
            height={960}
            priority={priority}
            sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
          Shipped by <a href={entry.founderLink} rel="noopener noreferrer">{entry.founderName}</a>
          {entry.productUrl && (
            <>
              {" — "}
              <a href={entry.productUrl} rel="noopener noreferrer">see it live</a>
            </>
          )}
        </p>
      )}
    </article>
  );
}
