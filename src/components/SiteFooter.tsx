import { siteName } from "@/lib/site";

/** Shared footer line. `home` carries the "built in a weekend, and it shows."
 *  tail; `about` carries the "best read with something unfinished" tail. */
export function SiteFooter({ variant = "home" }: { variant?: "home" | "about" }) {
  const tail =
    variant === "about"
      ? "best read with something unfinished open in another tab."
      : "est. 2026 · built in a weekend, and it shows.";
  return (
    <footer className={`site-footer${variant === "home" ? " site-footer--home" : ""}`}>
      {siteName} · {tail}
    </footer>
  );
}
