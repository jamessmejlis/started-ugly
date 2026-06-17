import Link from "next/link";
import { FEATURED_SLUG } from "@/data/entries";
import { siteName } from "@/lib/site";

type Variant = "full" | "back";

/** Shared header: wordmark + v0.1 tag on the left, nav on the right.
 *  `full` = the four directory links; `back` = a single "‹ Back to directory".
 *  `active` italic-greys the matching link (used on About). */
export function SiteHeader({
  variant = "full",
  active,
}: {
  variant?: Variant;
  active?: "famous" | "community" | "submit" | "about";
}) {
  return (
    <header className="site-header">
      <Link href="/" className="wordmark" aria-label={`${siteName} — home`}>
        <span className="wordmark__name">{siteName}</span>
        <span className="tag">v0.1</span>
      </Link>

      {variant === "back" ? (
        <div className="nav-back">
          <Link href="/" className="link">
            ‹ Back to directory
          </Link>
        </div>
      ) : (
        <nav className="site-nav">
          <Link href={`/${FEATURED_SLUG}`} className={active === "famous" ? "is-active" : undefined}>
            Famous
          </Link>
          <Link href="/#community" className={active === "community" ? "is-active" : undefined}>
            Community
          </Link>
          <Link href="/submit" className={active === "submit" ? "is-active" : undefined}>
            Submit
          </Link>
          <Link href="/about" className={active === "about" ? "is-active" : undefined}>
            About
          </Link>
        </nav>
      )}
    </header>
  );
}
