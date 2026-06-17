import Link from "next/link";
import { BeforeAfter } from "@/components/BeforeAfter";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TodoSeam } from "@/components/TodoSeam";
import {
  communityEntries,
  famousByTactic,
  featuredEntry,
  TACTIC_LABELS,
  TACTIC_ORDER,
} from "@/data/entries";
import { hoffmanQuote } from "@/lib/site";

export default function Home() {
  const f = featuredEntry;
  const era = f.name.toUpperCase();

  return (
    <div className="wrap">
      <SiteHeader />

      <section className="hero">
        <div className="kicker">a directory of embarrassing first versions</div>
        <h1 className="hero__h1">You&apos;re comparing your day one to their year fifteen.</h1>
        <p className="hero__quote">&ldquo;{hoffmanQuote}&rdquo;</p>
        <p className="hero__attr">— Reid Hoffman, founder of LinkedIn</p>
      </section>

      <div className="ba-frame">
        <BeforeAfter
          height={480}
          priority
          beforeSrc={f.thenImage}
          afterSrc={f.nowImage ?? f.thenImage}
          beforeAlt={`${f.name} in ${f.thenYear}`}
          afterAlt={`${f.name} in ${f.nowYear ?? "now"}`}
          beforeBadge={`${era} · ${f.thenYear}`}
          afterBadge={`${era} · ${f.nowYear ?? "now"}`}
        />
      </div>
      <p className="caption">
        Drag the handle — {f.name}, {f.thenYear} → {f.nowYear ?? "now"}.{" "}
        <Link href={`/${f.slug}`} className="link">
          See the whole story →
        </Link>
      </p>

      <Link href={`/${f.slug}`} className="featured">
        <div className="kicker featured__kicker">Featured ugly start</div>
        <div className="featured__title-row">
          <span className="featured__name">{f.name}</span>
          <span className="featured__year">{f.thenYear}</span>
        </div>
        <p className="featured__blurb">
          {f.featuredCard ? (
            <>
              <b>Before:</b> {f.featuredCard.before} <b>Now:</b> {f.featuredCard.now}{" "}
            </>
          ) : (
            <>{f.story} </>
          )}
          <span className="link">Read the file →</span>
        </p>
      </Link>

      <section className="catalog">
        <div className="catalog__label">The whole catalog — browse by tactic</div>
        {TACTIC_ORDER.map((t) => {
          const group = famousByTactic(t);
          return (
            <div className="catalog__group" key={t}>
              <h2 className="catalog__group-h">
                {TACTIC_LABELS[t]} <span className="catalog__count">({group.length})</span>
              </h2>
              {group.length > 0 ? (
                <div className="catalog__grid">
                  {group.map((e) => (
                    <Link key={e.slug} href={`/${e.slug}`} className="catalog-card">
                      <span className="catalog-card__name">{e.name}</span>
                      <span className="catalog-card__blurb">{e.lead ?? e.story}</span>
                      <span className="catalog-card__year">Est. {e.thenYear}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="catalog__empty">
                  No one&apos;s shipped here yet.{" "}
                  <Link href="/submit" className="link">
                    Be the first →
                  </Link>
                </p>
              )}
            </div>
          );
        })}
      </section>

      <section className="home-foot" id="community">
        <div>
          <div className="col-h">Shipping ugly right now</div>
          {communityEntries.length > 0 ? (
            <div className="wall">
              {communityEntries.map((e) => (
                <div key={e.slug}>
                  <Link href={`/${e.slug}`} className="link">
                    {e.founderName ?? e.name}
                  </Link>{" "}
                  — {e.name}.{" "}
                  <span className="wall__now">Now: TBD — they just shipped.</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="wall__empty">
              No one&apos;s shipped here yet — fitting, for a wall about going first.{" "}
              <Link href="/submit" className="link">
                Be the first →
              </Link>
            </p>
          )}
        </div>
        <div>
          <div className="col-h">One ugly start, every Friday</div>
          <NewsletterSignup />
        </div>
      </section>

      <TodoSeam
        className="seam--home"
        lines={[
          "// TODO: real screenshots, write better jokes, design an actual logo",
          "// shipped anyway · 2026-06-13",
        ]}
      />
      <SiteFooter />
    </div>
  );
}
