export type Tactic = "ugly-v1" | "dont-scale" | "sold-first" | "duct-tape-demo";

export const TACTIC_LABELS: Record<Tactic, string> = {
  "ugly-v1": "Ugly v1",
  "dont-scale": "Did things that don't scale",
  "sold-first": "Sold it before building it",
  "duct-tape-demo": "Duct-taped the demo",
};

export type Entry = {
  slug: string;
  name: string;
  kind: "famous" | "community";
  tactic: Tactic;
  thenImage: string; // path under /public, e.g. "/screenshots/craigslist-then.png"
  thenCaption?: string;
  thenYear: number;
  nowImage?: string; // absent => community card shows "Now: TBD — they just shipped"
  nowYear?: number;
  story: string; // 1–3 sentences, fact-checked
  sourceUrl?: string; // Wayback capture / interview / article backing the story
  founderName?: string; // community only
  founderLink?: string; // community only
  productUrl?: string; // community only
};

export const entries: Entry[] = [
  {
    slug: "craigslist",
    name: "Craigslist",
    kind: "famous",
    tactic: "ugly-v1",
    thenImage: "/screenshots/craigslist-then.png",
    thenYear: 1998,
    nowImage: "/screenshots/craigslist-now.png",
    nowYear: new Date().getFullYear(),
    story:
      "Craig Newmark started it in 1995 as a cc'd email list of San Francisco events. The website came later — and has barely changed since.",
    sourceUrl: "https://web.archive.org/web/19981202212015/http://www.craigslist.org/",
  },
  {
    slug: "google",
    name: "Google",
    kind: "famous",
    tactic: "ugly-v1",
    thenImage: "/screenshots/google-then.png",
    thenYear: 1998,
    nowImage: "/screenshots/google-now.png",
    nowYear: new Date().getFullYear(),
    story:
      "Began as a Stanford research project called BackRub. The famously bare 1998 homepage stayed bare partly because the founders didn't do fancy HTML.",
    sourceUrl: "https://web.archive.org/web/19981202230410/http://www.google.com/",
  },
  {
    slug: "amazon",
    name: "Amazon",
    kind: "famous",
    tactic: "ugly-v1",
    thenImage: "/screenshots/amazon-then.png",
    thenYear: 1999,
    nowImage: "/screenshots/amazon-now.png",
    nowYear: new Date().getFullYear(),
    story:
      "Launched in 1995 selling only books, run out of Jeff Bezos's garage. A bell rang for every order — within weeks it rang so often they switched it off.",
    sourceUrl: "https://web.archive.org/web/19990828014913/http://www.amazon.com/",
  },
  {
    slug: "airbnb",
    name: "Airbnb",
    kind: "famous",
    tactic: "dont-scale",
    thenImage: "/screenshots/airbnb-then.png",
    thenCaption: "AirBed & Breakfast, before the name fit on a cereal box.",
    thenYear: 2008,
    nowImage: "/screenshots/airbnb-now.png",
    nowYear: new Date().getFullYear(),
    story:
      "When listings looked bad, the founders flew to New York and photographed hosts' apartments themselves — and funded the company selling $40 election-themed cereal boxes.",
    sourceUrl: "https://web.archive.org/web/20081219124926/http://airbedandbreakfast.com/",
  },
  {
    slug: "dropbox",
    name: "Dropbox",
    kind: "famous",
    tactic: "duct-tape-demo",
    thenImage: "/screenshots/dropbox-then.png",
    thenCaption: "Before this site existed, the MVP was a narrated demo video.",
    thenYear: 2009,
    nowImage: "/screenshots/dropbox-now.png",
    nowYear: new Date().getFullYear(),
    story:
      "Before the product worked at scale, Drew Houston shipped a 3-minute screencast demo tuned for Digg readers. The waiting list jumped from 5,000 to 75,000 overnight.",
    sourceUrl: "https://web.archive.org/web/20090101231252/http://getdropbox.com/",
  },
];

export const famousEntries = entries.filter((e) => e.kind === "famous");
export const communityEntries = entries.filter((e) => e.kind === "community");
export const getEntry = (slug: string) => entries.find((e) => e.slug === slug);
