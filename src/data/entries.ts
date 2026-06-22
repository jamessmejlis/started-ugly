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

  // Optional rich content for the entry detail page (the design's full layout).
  // When absent, the detail page degrades gracefully to the single `story`.
  lead?: string; // italic lead sentence under the title
  body?: { lead: string; text: string }[]; // labelled paragraphs ("The ugly part." …)
  fileStats?: { label: string; value: string }[]; // "The file" key/value rows
  tactics?: Tactic[]; // multiple tactics (defaults to [tactic])
  lesson?: string; // italic "The lesson:" note
  quote?: { text: string; cite: string }; // highlighted founder pull-quote on the detail page
  featuredCard?: { before: string; now: string }; // home featured-card blurb
  imageCredit?: string; // photo attribution shown under the slider (e.g. CC BY-SA credits)
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
      "Craig Newmark started Craigslist in 1995 as a cc'd email list of San Francisco events. The website came later — blue links on grey, no design — and has barely changed since, on purpose.",
    sourceUrl: "https://web.archive.org/web/19981202212015/http://www.craigslist.org/",
    lead: "Craig Newmark started it as an email to friends — and 30 years on, it still looks like one.",
    body: [
      {
        lead: "The ugly part.",
        text: "It began as Craig Newmark emailing event listings to a few dozen friends. When the list outgrew email he dropped it onto a plain HTML page — blue links on grey, no images, no design. People called it ugly. He left it that way.",
      },
      {
        lead: "Why it stuck.",
        text: "The plainness was the point: pages loaded instantly, listings were trivial to scan, and nothing sat between a buyer and a seller. Keeping all but a few categories free meant there was little reason to go anywhere else.",
      },
      {
        lead: "Now.",
        text: "One of the most-visited sites in the US, still served from the same spartan template it launched with.",
      },
    ],
    fileStats: [
      { label: "Started as", value: "a cc'd email list" },
      { label: "Design philosophy", value: "don't" },
      { label: "Redesigns since", value: "~none" },
    ],
    lesson: "Ugly that works beats pretty that doesn't. Don't fix what your users don't want fixed.",
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
      "Larry Page and Sergey Brin began it at Stanford as a research project called BackRub. The famously bare 1998 homepage stayed bare partly because the founders didn't do fancy HTML — and the speed became the selling point.",
    sourceUrl: "https://web.archive.org/web/19981202230410/http://www.google.com/",
    lead: "Larry Page and Sergey Brin's homepage stayed bare partly because they didn't do much HTML.",
    body: [
      {
        lead: "The ugly part.",
        text: "Two Stanford PhD students, Larry Page and Sergey Brin, ran their search engine off university servers under the name BackRub. The 1998 homepage was a logo, a box, and two buttons — part design choice, part the fact that they weren't web designers.",
      },
      {
        lead: "Why it worked.",
        text: "With nothing to load, the page was instant — and the results were simply better than anyone else's. Bare wasn't a phase to grow out of; it was the product telling you it was fast.",
      },
      {
        lead: "Now.",
        text: "The front door to the internet for billions of people, and still essentially a box on a white page.",
      },
    ],
    fileStats: [
      { label: "Founded", value: "1998" },
      { label: "Started as", value: "a project called BackRub" },
      { label: "Day-one homepage", value: "a logo + a box" },
    ],
    lesson: "Constraints can be features. Their lack of polish became the fastest page on the web.",
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
      "Jeff Bezos launched Amazon in 1995 selling only books, run out of his Seattle garage. A bell rang for every order — within weeks it rang so often they switched it off.",
    sourceUrl: "https://web.archive.org/web/19990828014913/http://www.amazon.com/",
    lead: "Jeff Bezos ran it out of a garage, with a bell that rang on every sale — until it wouldn't stop.",
    body: [
      {
        lead: "The ugly part.",
        text: "Amazon started as a bare online bookstore Jeff Bezos ran from a rented garage, packing orders on desks made of doors laid across sawhorses. The site was a plain, text-heavy catalog; the team celebrated each sale with a literal bell.",
      },
      {
        lead: "What they shipped anyway.",
        text: "It didn't need to be pretty — it needed every book in print and reliable shipping. Orders came in faster than they could pack them, and the novelty bell got switched off within weeks.",
      },
      {
        lead: "Now.",
        text: "A multi-trillion-dollar company selling roughly everything — but it started with books in a garage.",
      },
    ],
    fileStats: [
      { label: "Sold at first", value: "books, only" },
      { label: "Day-one HQ", value: "a rented garage" },
      { label: "Order bell", value: "off within weeks" },
    ],
    lesson: "Start narrow and unglamorous. Books in a garage was enough of a wedge.",
  },
  {
    slug: "airbnb",
    name: "Airbnb",
    kind: "famous",
    tactic: "dont-scale",
    thenImage: "/screenshots/airbnb-then.jpg",
    thenCaption: "AirBed & Breakfast, before the name fit on a cereal box.",
    thenYear: 2008,
    nowImage: "/screenshots/airbnb-now.png",
    nowYear: new Date().getFullYear(),
    story:
      "When listings looked bad, Brian Chesky and Joe Gebbia flew to New York and photographed hosts' apartments themselves — and funded the company selling $40 election-themed cereal boxes.",
    sourceUrl: "https://web.archive.org/web/20081219124926/http://airbedandbreakfast.com/",
    lead: "Brian Chesky and Joe Gebbia couldn't make rent, so they put air mattresses on their floor — and a craigslist clone online to fill them.",
    body: [
      {
        lead: "The ugly part.",
        text: "A one-page site cloned from craigslist. Grey placeholder photos, no map, no payments, no reviews. To book, you emailed the host and hoped they were real. They funded it selling novelty cereal door to door.",
      },
      {
        lead: "What they shipped anyway.",
        text: "They charged real money before any of it worked. Three guests, two weeks of rent covered — enough signal to keep building the parts they'd faked.",
      },
      {
        lead: "Now.",
        text: "A public company worth roughly $90B, hosting more than 5 million stays a night across 220+ countries.",
      },
    ],
    fileStats: [
      { label: "Founded", value: "2008" },
      { label: "Time to first $", value: "~2 weeks" },
      { label: "Day-one stack", value: "HTML + email" },
    ],
    tactics: ["ugly-v1", "dont-scale", "sold-first"],
    lesson:
      "Charge before it's ready. Three strangers on air mattresses was enough proof.",
    featuredCard: {
      before:
        "three air mattresses on a stranger's floor, breakfast included, booked over email.",
      now: "a public company worth ~$90B, 5M+ stays a night.",
    },
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
      "Before the product worked at scale, Drew Houston shipped a 3-minute screencast demo tuned for Digg and Hacker News readers. The waiting list jumped from 5,000 to 75,000 overnight.",
    sourceUrl: "https://web.archive.org/web/20090101231252/http://getdropbox.com/",
    lead: "Drew Houston's MVP wasn't an app — it was a three-minute video, packed with in-jokes for Digg.",
    body: [
      {
        lead: "The ugly part.",
        text: "Syncing files flawlessly across machines was nearly impossible to demo half-built, so Drew Houston didn't build it first. He recorded a three-minute screencast of how it would work, salted with references Digg and Hacker News users would catch.",
      },
      {
        lead: "What it proved.",
        text: "The video did the selling. The beta waiting list jumped from 5,000 to 75,000 people overnight — demand confirmed before the hardest engineering was finished.",
      },
      {
        lead: "Now.",
        text: "A public company used by hundreds of millions — but the first version that caught fire was a video.",
      },
    ],
    fileStats: [
      { label: "The MVP", value: "a 3-min demo video" },
      { label: "Waitlist overnight", value: "5k → 75k" },
      { label: "Code shipped first?", value: "no — the video" },
    ],
    lesson: "If the product is too hard to demo, demo the idea. A video can validate before code can.",
  },
  {
    slug: "amigo-ai",
    name: "Amigo AI",
    kind: "famous",
    tactic: "duct-tape-demo",
    thenImage: "/screenshots/amigo-ai-then.png",
    thenCaption: "youramigo.ai — a 'clone yourself' waitlist, before any product existed.",
    thenYear: 2024,
    nowImage: "/screenshots/amigo-ai-now.png",
    nowYear: new Date().getFullYear(),
    story:
      "To sell an AI product that didn't exist, Ali Khokhar cloned a coach's voice off YouTube with ElevenLabs and stitched a scripted demo together in Sony Vegas Pro — then collected $12,000 from real buyers before building anything.",
    sourceUrl:
      "https://pmfshow.buzzsprout.com/1889238/episodes/19285585-he-churned-100-of-his-revenue-on-purpose-then-grew-10x-to-2m-arr-in-under-12-months-ali-khokhar-founder-of-amigo-ai",
    founderName: "Ali Khokhar",
    founderLink: "https://www.linkedin.com/in/khokharali",
    productUrl: "https://www.amigo.ai",
    lead: "Ali Khokhar hadn't written a line of code — so he faked the entire product in a video editor.",
    body: [
      {
        lead: "The ugly part.",
        text: "There was no product, just a waitlist. To land buyers, Khokhar pulled a coaching organization's head coach's voice off YouTube, cloned it with ElevenLabs, had an engineer mock up a single system prompt, and stitched the snippets into a polished demo video in Sony Vegas Pro.",
      },
      {
        lead: "What they shipped anyway.",
        text: "He sent the fake demo out and closed money on it — an enterprise contract plus four solopreneurs paying $500 each. $12,000 in revenue before a single line of code existed.",
      },
      {
        lead: "Now.",
        text: "Amigo has since pivoted to AI agents for healthcare and raised venture funding to build the real thing.",
      },
    ],
    fileStats: [
      { label: "Founded", value: "2024" },
      { label: "Revenue before code", value: "$12,000" },
      { label: "Day-one stack", value: "ElevenLabs + Sony Vegas" },
    ],
    tactics: ["duct-tape-demo", "sold-first"],
    lesson: "A convincing fake is a real test. Sell the promise first, then go build it.",
    quote: {
      text: "I got $12,000 in revenue, and I have not written a single line of code.",
      cite: "Ali Khokhar, The Product Market Fit Show",
    },
  },
  {
    slug: "butcherbox",
    name: "ButcherBox",
    kind: "famous",
    tactic: "sold-first",
    thenImage: "/screenshots/butcherbox-then.jpg",
    thenCaption: "The 2015 Kickstarter — pre-sold before a single box shipped.",
    thenYear: 2015,
    nowImage: "/screenshots/butcherbox-now.jpg",
    nowYear: new Date().getFullYear(),
    story:
      "Mike Salguero pre-sold ButcherBox on Kickstarter before building any of it. He set out to raise $25,000 and pulled in more than $210,000 from 1,155 backers — funding the whole operation with customers' money instead of a VC's.",
    sourceUrl:
      "https://pmfshow.buzzsprout.com/1889238/episodes/16736014-he-raised-30m-failed-then-raised-0-grew-to-550m-in-revenue-here-s-what-he-learned-mike-salguero-founder-of-butcherbox",
    founderName: "Mike Salguero",
    founderLink: "https://www.linkedin.com/in/mikesalguero/",
    productUrl: "https://www.butcherbox.com",
    lead: "Mike Salguero sold the boxes before he had any way to ship them.",
    body: [
      {
        lead: "The ugly part.",
        text: "No inventory, no warehouse, no supply chain — just a Kickstarter page promising grass-fed meat at your door. He'd already raised $30M and failed at a previous company; this time he put up $10,000 of his own and let pre-orders fund the rest.",
      },
      {
        lead: "What they shipped anyway.",
        text: "The campaign almost doubled its $25,000 goal on day one and closed at more than $210,000 from 1,155 backers — the most-funded food project Kickstarter had seen out of Massachusetts. Only then did he build the fulfilment behind it.",
      },
      {
        lead: "Now.",
        text: "A bootstrapped meat-subscription business that's grown past $550M in revenue, with no venture capital.",
      },
    ],
    fileStats: [
      { label: "Founded", value: "2015" },
      { label: "Kickstarter goal", value: "$25,000" },
      { label: "Pre-sold", value: "$210K+ / 1,155 backers" },
    ],
    lesson: "If people pay before it exists, you've found demand — not just interest.",
    quote: {
      text: "We went out to raise $25K and in day one, we almost doubled our goal.",
      cite: "Mike Salguero, The Product Market Fit Show",
    },
  },
  {
    slug: "spot-and-tango",
    name: "Spot & Tango",
    kind: "famous",
    tactic: "dont-scale",
    thenImage: "/screenshots/spot-and-tango-then.png",
    thenCaption: "spotandtango.com, 2019 — fresh dog food, cooked and delivered by hand.",
    thenYear: 2019,
    nowImage: "/screenshots/spot-and-tango-now.jpg",
    nowYear: new Date().getFullYear(),
    story:
      "Russell Breuer left private equity to cook fresh dog food by hand in a rented kitchen, then hand-delivered the first orders himself — riding the NYC subway at dawn to drop boxes on customers' doorsteps.",
    sourceUrl:
      "https://pmfshow.buzzsprout.com/1889238/episodes/18540705-he-sold-dog-food-from-his-condo-now-he-does-100m-a-year-russell-breuer-founder-of-spot-tango",
    founderName: "Russell Breuer",
    productUrl: "https://www.spotandtango.com",
    lead: "Russell Breuer's delivery network was him — on the 5 a.m. subway, holding the boxes.",
    body: [
      {
        lead: "The ugly part.",
        text: "No factory, no logistics. Breuer cooked in a rented incubator kitchen for eight hours with a small team, packed the meals in pink butcher paper, froze them, and hand-delivered the first orders himself — riding the NYC subway at dawn to drop boxes on customers' doorsteps.",
      },
      {
        lead: "What they shipped anyway.",
        text: "It wasn't a P&L, it was proof of demand. Real people paid for fresh dog food and asked for more, which was all the signal he needed to go build the machine behind it.",
      },
      {
        lead: "Now.",
        text: "A direct-to-consumer fresh-pet-food company doing more than $100M a year.",
      },
    ],
    fileStats: [
      { label: "Early site", value: "2019" },
      { label: "Day-one ops", value: "cooked + delivered by hand" },
      { label: "Now", value: "$100M+ a year" },
    ],
    lesson: "Do it by hand until people prove they want it. Automate the proven part.",
    quote: {
      text: "I'll wake up at five o'clock in the morning. I'll take the subway. I'll drop them off on her doorstep.",
      cite: "Russell Breuer, The Product Market Fit Show",
    },
  },
  {
    slug: "boldvoice",
    name: "BoldVoice",
    kind: "famous",
    tactic: "ugly-v1",
    thenImage: "/screenshots/boldvoice-then.png",
    thenCaption: "boldvoice.com at launch, 2021 — lessons filmed on a phone, one language.",
    thenYear: 2021,
    nowImage: "/screenshots/boldvoice-now.png",
    nowYear: new Date().getFullYear(),
    story:
      "Anada Lakra launched BoldVoice as accent lessons her Hollywood coach scripted and filmed from his own apartment — one language, Hindi, with rough AI feedback. The earliest users came from a Reddit thread called \"Judge My Accent.\"",
    sourceUrl:
      "https://pmfshow.buzzsprout.com/1889238/episodes/18977152-she-bet-on-a-consumer-app-when-every-vc-wanted-b2b-then-grew-to-10m-arr-anada-lakra-founder-of-boldvoice",
    founderName: "Anada Lakra",
    productUrl: "https://www.boldvoice.com",
    lead: "Anada Lakra's first lessons were filmed on a phone, in the coach's apartment, in one language.",
    body: [
      {
        lead: "The ugly part.",
        text: "No studio, no catalog. The team shipped a camera to Ron Carlos — a Hollywood accent coach who'd trained Game of Thrones actors — and he scripted and shot the lessons from his apartment. The app launched covering a single language, Hindi, with rudimentary AI feedback.",
      },
      {
        lead: "What they shipped anyway.",
        text: "They put it where the users were: a Reddit thread called \"Judge My Accent\" turned out to be the perfect proving ground for an app that scores how you sound.",
      },
      {
        lead: "Now.",
        text: "A consumer app at $10M ARR — built on the bet that people would pay to sound more confident, back when every VC wanted B2B.",
      },
    ],
    fileStats: [
      { label: "Founded", value: "2021" },
      { label: "Day-one catalog", value: "one language (Hindi)" },
      { label: "Filmed on", value: "a phone, in an apartment" },
    ],
    lesson: "Ship the smallest real version, then go where your users already argue about the problem.",
  },
  {
    slug: "aragon-ai",
    name: "Aragon",
    kind: "famous",
    tactic: "ugly-v1",
    thenImage: "/screenshots/aragon-ai-then.png",
    thenCaption: "aragon.ai's first page, 2022 — a black screen pitching AI 'graphic design.'",
    thenYear: 2022,
    nowImage: "/screenshots/aragon-ai-now.jpg",
    nowYear: new Date().getFullYear(),
    story:
      "Wesley Tian launched Aragon as a bare black page promising AI design \"10x faster, 10x cheaper,\" then narrowed to headshots so bad most users couldn't get one usable photo out of 250 — so he hand-fixed orders himself, an hour at a time.",
    sourceUrl:
      "https://pmfshow.buzzsprout.com/1889238/episodes/16756049-1st-time-founder-grows-ai-headshot-app-from-0-to-10m-arr-in-2-years-with-no-funding-wesley-tian-founder-of-aragon",
    founderName: "Wesley Tian",
    productUrl: "https://www.aragon.ai",
    lead: "Wesley Tian shipped AI headshots so bad most users got nothing usable — then fixed them by hand.",
    body: [
      {
        lead: "The ugly part.",
        text: "The first site was a black page promising AI design that was \"10x faster, 10x cheaper.\" When it narrowed to headshots, the output was terrible — Wesley Tian says most users wouldn't get a single usable photo out of 250.",
      },
      {
        lead: "What they shipped anyway.",
        text: "He charged anyway — $30 beat a $250 photographer — and covered the gap by hand, spending up to an hour per customer fixing and re-running orders so people got something usable. Fired from his job and rejected by 30 VCs, he had little to do but care.",
      },
      {
        lead: "Now.",
        text: "A profitable AI-headshot company at $10M ARR in two years, on no outside funding.",
      },
    ],
    fileStats: [
      { label: "Founded", value: "2022" },
      { label: "First-pass quality", value: "\"atrocious\"" },
      { label: "Founder support", value: "~1 hr/customer, by hand" },
    ],
    tactics: ["ugly-v1", "dont-scale"],
    lesson: "Ship it broken, then close the gap by hand until the product can do it for you.",
    quote: {
      text: "They were atrocious. They were so bad.",
      cite: "Wesley Tian, The Product Market Fit Show",
    },
  },
  {
    slug: "strava",
    name: "Strava",
    kind: "famous",
    tactic: "dont-scale",
    thenImage: "/screenshots/strava-then.jpg",
    thenCaption: "Strava's 2009 ride dashboard — a Google map, elevation, power/HR stats, and the climb-segment leaderboard.",
    thenYear: 2009,
    nowImage: "/screenshots/strava-now-app-v2.jpg",
    nowYear: new Date().getFullYear(),
    story:
      "Mark Gainey and Michael Horvath first sketched a 'virtual locker room' for athletes back in their Harvard rowing days — then shelved it for more than a decade, until phones and GPS finally caught up. When they launched Strava in 2009 it was aimed at one narrow tribe: road cyclists who'd already spent $300 on a Garmin. The first product was a plain website that ranked their ride data on segment leaderboards — and they recruited about 20 friends to use it.",
    sourceUrl:
      "https://joinalphabytes.substack.com/p/lessons-on-how-strava-scaled-to-100m",
    founderName: "Mark Gainey & Michael Horvath",
    productUrl: "https://www.strava.com",
    lead: "Mark Gainey and Michael Horvath went inch-wide, mile-deep — building Strava for Garmin-owning cyclists, one friend at a time.",
    featuredCard: {
      before:
        "a plain website where ~20 cycling friends uploaded Garmin data to see who was fastest up a climb. No app, no running.",
      now: "100M+ athletes recording runs and rides from their phones — still chasing the same segment leaderboards.",
    },
    body: [
      {
        lead: "The ugly part.",
        text: "The idea wasn't new: Gainey and Horvath had sketched a 'virtual locker room' for athletes back in their Harvard rowing days, then shelved it for more than a decade until phones and GPS finally caught up. When they shipped in 2009, the first Strava was a plain website where cyclists uploaded Garmin data and saw it ranked on a handful of segment leaderboards — no app, no running, just road cyclists, the one tribe who already owned the $300 devices and cared who was fastest up a climb.",
      },
      {
        lead: "What they did that didn't scale.",
        text: "They hand-recruited about 20 friends — half East Coast, half West Coast — for a 30-day competitive trial during the Tour de France, dangling prizes like socks and racing wheels for the fastest segments. Early on the founders even drove to local bike races to plug riders' Garmins in and upload the data by hand. King-of-the-Mountain bragging rights did the rest; riders kept coming back to defend their times.",
      },
      {
        lead: "Now.",
        text: "The mobile app didn't even arrive until 2011 — and that's what turned a cyclists' website into a fitness network of more than 100 million runners, riders, and hikers. It's still built on the same segment leaderboards that hooked the first twenty.",
      },
    ],
    fileStats: [
      { label: "Founded", value: "2009" },
      { label: "Day-one tribe", value: "cyclists with Garmins" },
      { label: "First cohort", value: "~20 friends" },
    ],
    tactics: ["dont-scale", "ugly-v1"],
    lesson:
      "Go inch-wide and mile-deep. Win one obsessive tribe by hand before you try to win everyone.",
    quote: {
      text: "Do things that don't scale. People want to focus on scale and network effects early on. We were focused on one thing: if we had one person uploading to Strava, could we get them to come back and do it again?",
      cite: "Mark Gainey, co-founder of Strava",
    },
  },
  {
    slug: "doordash",
    name: "DoorDash",
    kind: "famous",
    tactic: "dont-scale",
    thenImage: "/screenshots/doordash-then.jpg",
    thenCaption: "PaloAltoDelivery.com, 2013 — $6 flat, order online, the founders drove every order themselves.",
    thenYear: 2013,
    nowImage: "/screenshots/doordash-now.jpg",
    nowYear: new Date().getFullYear(),
    story:
      "Tony Xu, Stanley Tang, Andy Fang and Evan Moore launched it as PaloAltoDelivery.com — a bare page offering $6 delivery from Palo Alto restaurants that had none. There was no fleet: the four Stanford students drove every order themselves, students by day and couriers by night.",
    sourceUrl: "https://www.sequoiacap.com/podcast/crucible-moments-doordash/",
    founderName: "Tony Xu, Stanley Tang, Andy Fang & Evan Moore",
    productUrl: "https://www.doordash.com",
    lead: "Tony Xu and three Stanford classmates were the entire delivery fleet — a $6-a-drop page, and them behind the wheel.",
    body: [
      {
        lead: "The ugly part.",
        text: "PaloAltoDelivery.com was a one-page site offering $6 delivery from local restaurants that didn't deliver — no minimum, pay on the doorstep. Behind it was no operation at all: orders pinged the founders' phones, and Tony Xu, Stanley Tang, Andy Fang and Evan Moore drove them around Palo Alto themselves.",
      },
      {
        lead: "What they did that didn't scale.",
        text: "Students by day, couriers by night. They took the orders, called the restaurants, picked up the food, and delivered it — learning the logistics by living them, weeks before they had a name, a fleet, or the YC check that turned it into DoorDash.",
      },
      {
        lead: "Now.",
        text: "The largest food-delivery platform in the US, a public company moving billions of orders a year — still the thing those four were hand-delivering one bag at a time.",
      },
    ],
    fileStats: [
      { label: "Founded", value: "2013" },
      { label: "Day-one fleet", value: "the 4 founders" },
      { label: "First site", value: "PaloAltoDelivery.com" },
    ],
    tactics: ["dont-scale", "ugly-v1"],
    lesson: "Run the operation by hand first — you can't design logistics you've never personally done.",
    quote: {
      text: "At the time, everyone at the company, we're the only ones doing deliveries.",
      cite: "Tony Xu, co-founder of DoorDash",
    },
  },
  {
    slug: "nomad-list",
    name: "Nomad List",
    kind: "famous",
    tactic: "ugly-v1",
    thenImage: "/screenshots/nomad-list-sheet.png",
    thenCaption: "Pieter Levels' original Google Sheet, 2014 — strangers crowdsourced cities and added their own columns: transport, monthly visa cost, best quarter to visit, A/C.",
    thenYear: 2014,
    nowImage: "/screenshots/nomad-list-now.jpg",
    nowYear: new Date().getFullYear(),
    story:
      "Pieter Levels opened a public Google Spreadsheet in 2014 asking remote workers to crowdsource the best cities to live and work in. About 100 people filled it in within a day — inventing their own columns for wifi and safety — so he turned the sheet into Nomad List, a one-person business he still runs.",
    sourceUrl: "https://levels.io/nomad-list-founder/",
    founderName: "Pieter Levels",
    founderLink: "https://levels.io",
    productUrl: "https://nomadlist.com",
    lead: "Pieter Levels' product was a public Google Spreadsheet — strangers filled it in, so he turned it into a business.",
    body: [
      {
        lead: "The ugly part.",
        text: "There was no app, no backend, not even a site — just a Google Sheet Levels tweeted out, asking remote workers to add the best cities to live and work in. Around a hundred people filled it in within a day, inventing their own columns for wifi speed, cost, and safety as they went.",
      },
      {
        lead: "What he shipped anyway.",
        text: "He turned the spreadsheet into Nomad List — a city-ranking site built, in his words, fast and rough — then posted it to Product Hunt and Hacker News. It was part of his '12 startups in 12 months,' and the one that stuck.",
      },
      {
        lead: "Now.",
        text: "A profitable membership community for digital nomads (now Nomads.com) doing millions a year — still run, famously, by one person.",
      },
    ],
    fileStats: [
      { label: "Started as", value: "a public Google Sheet" },
      { label: "Crowdsourced in", value: "~24 hours" },
      { label: "Team size", value: "one" },
    ],
    tactics: ["ugly-v1", "sold-first"],
    imageCredit: "Original spreadsheet screenshot: Pieter Levels / levels.io.",
    lesson: "Your MVP can be a spreadsheet. Ship the data, not the app — let demand tell you what to build.",
    quote: {
      text: "I do work fast and rough.",
      cite: "Pieter Levels, founder of Nomad List",
    },
  },
  {
    slug: "buffer",
    name: "Buffer",
    kind: "famous",
    tactic: "sold-first",
    thenImage: "/screenshots/buffer-then.png",
    thenCaption: "bufferapp.com, 2010 — a landing page and a fake 'Plans and Pricing' door, before any product existed.",
    thenYear: 2010,
    nowImage: "/screenshots/buffer-now.png",
    nowYear: new Date().getFullYear(),
    story:
      "Before building anything, Joel Gascoigne put up a two-page site: one page explaining Buffer, a second showing 'Plans and Pricing.' Clicking a plan just asked for your email — a fake door that tested whether people would actually pay. They did, so he built it; the first paying customer arrived within four days of launch.",
    sourceUrl: "https://buffer.com/resources/idea-to-paying-customers-in-7-weeks-how-we-did-it/",
    founderName: "Joel Gascoigne",
    productUrl: "https://buffer.com",
    lead: "Joel Gascoigne sold Buffer before it existed — a fake 'Plans and Pricing' page that checked if anyone would actually pay.",
    body: [
      {
        lead: "The ugly part.",
        text: "Buffer's first version wasn't software — it was two pages. One explained the idea: schedule your tweets to post at the right times. The other, a 'Plans and Pricing' page, let you 'pick' a plan, then admitted there was nothing to buy yet and asked for your email.",
      },
      {
        lead: "What he shipped anyway.",
        text: "He tweeted the link to see what people thought. Enough clicked through the pricing page and left their email to prove they'd pay — so Joel Gascoigne built the real thing in seven weeks of evenings and weekends. The first paying customer arrived within four days of launch.",
      },
      {
        lead: "Now.",
        text: "A profitable social-media company doing millions a year — famous for publishing its salaries and metrics in the open.",
      },
    ],
    fileStats: [
      { label: "Founded", value: "2010" },
      { label: "The MVP", value: "two pages, no product" },
      { label: "Time to first $", value: "4 days post-launch" },
    ],
    tactics: ["sold-first", "ugly-v1"],
    lesson: "Don't ask if they like it — make them try to pay. A fake pricing page validates faster than any survey.",
    quote: {
      text: "Ask them to click a 'pricing plans' button, choose a plan and then give their email and you're actually getting some validated learning.",
      cite: "Joel Gascoigne, founder of Buffer",
    },
  },
  {
    slug: "gumroad",
    name: "Gumroad",
    kind: "famous",
    tactic: "ugly-v1",
    thenImage: "/screenshots/gumroad-then.png",
    thenCaption: "gumroad.com, 2011 — built over one weekend to sell a single icon.",
    thenYear: 2011,
    nowImage: "/screenshots/gumroad-now.png",
    nowYear: new Date().getFullYear(),
    story:
      "Sahil Lavingia built the first version of Gumroad over a single weekend — a barebones file-uploader with a credit-card form — so he could sell a $1.99 icon he'd designed. He launched it Monday morning on Hacker News.",
    sourceUrl: "https://sahillavingia.com/reflecting",
    founderName: "Sahil Lavingia",
    founderLink: "https://sahillavingia.com",
    productUrl: "https://gumroad.com",
    lead: "Sahil Lavingia built Gumroad in a weekend — a file uploader bolted to a credit-card form — to sell one icon.",
    body: [
      {
        lead: "The ugly part.",
        text: "It was, in Sahil Lavingia's telling, barely a product: a way to upload a file, slap a price on it, and take a credit card. He built the whole thing over a weekend so he could sell a $1.99 icon he'd designed, then posted it to Hacker News on Monday morning.",
      },
      {
        lead: "What he shipped anyway.",
        text: "No store to set up, no dashboard to learn — just a link you could charge for. That single-link simplicity was the entire pitch, and it was enough to start taking real money for digital goods right away.",
      },
      {
        lead: "Now.",
        text: "A creator-commerce platform that's paid out billions to writers, musicians, and makers — still 'sell anything with a link.'",
      },
    ],
    fileStats: [
      { label: "Built in", value: "a weekend" },
      { label: "First sale", value: "a $1.99 icon" },
      { label: "Launched on", value: "Hacker News" },
    ],
    lesson: "The first version can be one feature. A link that takes money beat a store nobody asked for.",
    quote: {
      text: "I built Gumroad the weekend I thought up the idea, and launched it early Monday morning on Hacker News.",
      cite: "Sahil Lavingia, founder of Gumroad",
    },
  },
  {
    slug: "indie-hackers",
    name: "Indie Hackers",
    kind: "famous",
    tactic: "dont-scale",
    thenImage: "/screenshots/indie-hackers-then.png",
    thenCaption: "indiehackers.com, launch day 2016 — a handful of interviews Courtland ran himself.",
    thenYear: 2016,
    nowImage: "/screenshots/indie-hackers-now.jpg",
    nowYear: new Date().getFullYear(),
    story:
      "Courtland Allen launched Indie Hackers as a tiny blog of about ten founder interviews he'd conducted by hand — emailing and interviewing founders himself over three weeks — before there was any community or product. Stripe acquired it within a year.",
    sourceUrl: "https://podcast.creatorscience.com/courtland-allen/",
    founderName: "Courtland Allen",
    productUrl: "https://www.indiehackers.com",
    lead: "Before any community existed, Courtland Allen hand-collected ten founder interviews — and launched on those alone.",
    body: [
      {
        lead: "The ugly part.",
        text: "There was no product, no forum, no software — just a simple no-code site. Courtland Allen spent three weeks personally emailing founders and writing up about ten interviews on how they actually made money, then launched with nothing but those.",
      },
      {
        lead: "What he shipped anyway.",
        text: "Hand-curated stories were the whole product — and exactly what indie founders wanted to read. The interviews spread, a community formed around them, and Stripe acquired Indie Hackers within a year of launch.",
      },
      {
        lead: "Now.",
        text: "The home of the build-in-public movement — a community and podcast where thousands of founders share exactly how their products make money.",
      },
    ],
    fileStats: [
      { label: "Launched with", value: "~10 hand-run interviews" },
      { label: "Built in", value: "3 weeks, by hand" },
      { label: "Acquired by", value: "Stripe, within a year" },
    ],
    tactics: ["dont-scale", "ugly-v1"],
    lesson: "Do the unscalable thing — interview ten people yourself. Hand-made beats automated when you have zero audience.",
    quote: {
      text: "I spent three weeks collecting 10 or 11 interviews that everybody read and launched immediately.",
      cite: "Courtland Allen, founder of Indie Hackers",
    },
  },
  {
    slug: "plausible",
    name: "Plausible",
    kind: "famous",
    tactic: "ugly-v1",
    thenImage: "/screenshots/plausible-then.png",
    thenCaption: "plausible.io in its early days — a scrappy open-source alternative to Google Analytics, built in public.",
    thenYear: 2019,
    nowImage: "/screenshots/plausible-now.png",
    nowYear: new Date().getFullYear(),
    story:
      "Uku Täht started Plausible in 2018 as a scrappy open-source alternative to Google Analytics, building it in public on Indie Hackers from the first line of code. He and Marko Saric grew it post by post — beta, paid launch, every milestone shared — into a bootstrapped business.",
    sourceUrl: "https://plausible.io/blog/bootstrapping-saas",
    founderName: "Uku Täht & Marko Saric",
    productUrl: "https://plausible.io",
    lead: "Uku Täht built Plausible in the open on Indie Hackers — every beta, price, and milestone posted as he went.",
    body: [
      {
        lead: "The ugly part.",
        text: "No funding, no team, no launch splash — just an open-source side project Uku Täht started posting about on Indie Hackers as he wrote the first lines of code. The early beta was bare-bones, shipped mainly to recruit its first handful of users.",
      },
      {
        lead: "What they shipped anyway.",
        text: "Uku and co-founder Marko Saric grew it transparently, milestone by milestone — the beta, the first paid subscriptions, every revenue number — turning a privacy-first analytics tool into a real bootstrapped business in full public view.",
      },
      {
        lead: "Now.",
        text: "A profitable, independent alternative to Google Analytics — privacy-first, EU-hosted, and still bootstrapped.",
      },
    ],
    fileStats: [
      { label: "Started", value: "2018, open-source" },
      { label: "Built", value: "in public on Indie Hackers" },
      { label: "Funding", value: "none — bootstrapped" },
    ],
    lesson: "Build in the open from line one. Posting every scrappy step is how you find your first users.",
    quote: {
      text: "My co-founder Uku started posting on Indie Hackers as he began to develop Plausible.",
      cite: "Marko Saric, co-founder of Plausible",
    },
  },
  {
    slug: "convertkit",
    name: "ConvertKit",
    kind: "famous",
    tactic: "dont-scale",
    thenImage: "/screenshots/convertkit-then.jpg",
    thenCaption: "convertkit.com, 2014 — 'email marketing for authors,' just before the unglamorous direct-sales grind.",
    thenYear: 2014,
    nowImage: "/screenshots/convertkit-now.jpg",
    nowYear: new Date().getFullYear(),
    story:
      "Nathan Barry nearly shut ConvertKit down when revenue slid to $1,337/mo. Instead he did the unscalable thing — hand-emailing bloggers off a Trello board and migrating their email lists from other tools for free, copy-pasting subscribers himself. A year of that grind took it to roughly $98K MRR, with no funding.",
    sourceUrl: "https://nathanbarry.com/sales/",
    founderName: "Nathan Barry",
    founderLink: "https://nathanbarry.com",
    productUrl: "https://kit.com",
    lead: "Nathan Barry almost killed ConvertKit at $1,337 a month — then saved it by hand-emailing bloggers and migrating their email lists for free, one copy-paste at a time.",
    body: [
      {
        lead: "The ugly part.",
        text: "After about 18 months ConvertKit's revenue had slid to $1,337 a month, and Nathan Barry was ready to shut it down. A mentor told him to either kill it or fully commit. He committed — to the least scalable sales process imaginable.",
      },
      {
        lead: "What he did that didn't scale.",
        text: "He sent personal cold emails to authors and bloggers, tracked every lead across the columns of a Trello board, and offered to migrate them off MailChimp for free — literally copy-pasting subscribers between two browser windows, '$5-an-hour work,' to remove the one reason not to switch.",
      },
      {
        lead: "Now.",
        text: "In about a year that hand-work took ConvertKit from $1,337 to roughly $98,000 in monthly recurring revenue, and it kept compounding into a bootstrapped, multi-million-dollar business — now called Kit.",
      },
    ],
    fileStats: [
      { label: "Low point", value: "$1,337 MRR" },
      { label: "The hustle", value: "cold emails + free migrations" },
      { label: "~12 months later", value: "~$98K MRR" },
    ],
    lesson:
      "When you have $100 in MRR, five hours of unscalable work to reach $200 is worth it. Do things that don't scale until the channels that do scale kick in.",
    quote: {
      text: "If you've got $100 in MRR then spending five hours to get to $200 MRR is absolutely worth it! You should be willing to do basically anything to get that initial traction.",
      cite: "Nathan Barry, founder of ConvertKit",
    },
  },
  {
    slug: "feedbackpanda",
    name: "FeedbackPanda",
    kind: "famous",
    tactic: "dont-scale",
    thenImage: "/screenshots/feedbackpanda-then.png",
    thenCaption: "feedbackpanda.com, 2018 — a two-person SaaS for online ESL teachers, grown without a dollar of ads.",
    thenYear: 2018,
    story:
      "Arvid Kahl and Danielle Simpson built FeedbackPanda to auto-write student feedback after Danielle felt the pain teaching English online for VIPKID. They never ran an ad — they lived in teachers' Facebook groups, launched with a single helpful comment, and mailed their first 100 subscribers handwritten thank-you postcards. Two people took it to ~$55K MRR and sold it in 2019.",
    sourceUrl:
      "https://thebootstrappedfounder.com/from-founding-to-exit-in-two-years-the-feedbackpanda-story/",
    founderName: "Arvid Kahl & Danielle Simpson",
    founderLink: "https://thebootstrappedfounder.com",
    lead: "Arvid Kahl and Danielle Simpson grew FeedbackPanda to ~$55K MRR with two people and zero ad spend — launched on one helpful comment in a Facebook group, thank-you notes mailed by hand.",
    body: [
      {
        lead: "The ugly part.",
        text: "Danielle was teaching English online for VIPKID, awake from 4am, burning unpaid hours writing required student feedback. So she and Arvid built the dullest possible fix — software that wrote the feedback for her. Their first and only customer, for a while, was Danielle herself.",
      },
      {
        lead: "What they did that didn't scale.",
        text: "No ads, no funding. They lived inside the Facebook groups where online teachers swapped tips, and revealed FeedbackPanda in a single reply to someone describing exactly that pain. They mailed their first 100 subscribers handwritten thank-you postcards and answered every support message by hand.",
      },
      {
        lead: "Now.",
        text: "That word-of-mouth machine took two people to about $55K in monthly recurring revenue in roughly two years — no employees, no paid marketing — before they sold the company to SureSwift Capital in 2019.",
      },
    ],
    fileStats: [
      { label: "Team", value: "two, no employees" },
      { label: "Marketing budget", value: "$0 — word of mouth" },
      { label: "~2 years later", value: "~$55K MRR, then sold" },
    ],
    lesson:
      "Embed where your customers already gather and help before you sell. A word-of-mouth machine beat the ad budget they never bought.",
    quote: {
      text: "Through comments and posts in the communities where our customers would exchange information, we started a word-of-mouth-machine that did our marketing for us.",
      cite: "Arvid Kahl, co-founder of FeedbackPanda",
    },
  },
  {
    slug: "shipfast",
    name: "ShipFast",
    kind: "famous",
    tactic: "ugly-v1",
    thenImage: "/screenshots/shipfast-then.png",
    thenCaption: "shipfa.st on launch day, Sept 2023 — '$50 off for the first 50 customers,' 28 makers in.",
    thenYear: 2023,
    nowImage: "/screenshots/shipfast-now.png",
    nowYear: new Date().getFullYear(),
    story:
      "After four years and 16 products that topped out around $3K/mo, Marc Lou stopped inventing and bundled the boilerplate he kept rewriting — auth, Stripe, emails — into ShipFast, built in about a week. It made $6,000 in its first 48 hours and crossed $250K in five months, run by one person.",
    sourceUrl: "https://newsletter.marclou.com/p/i-made-250000-usd-selling-javascript",
    founderName: "Marc Lou",
    founderLink: "https://marclou.com",
    productUrl: "https://shipfa.st",
    lead: "Marc Lou had 16 flops behind him — so he stopped inventing and just sold the boilerplate he kept rewriting, glued together in a week.",
    body: [
      {
        lead: "The ugly part.",
        text: "Across four years Marc Lou shipped 16 products, and the best of them made about $3,000 a month. He kept rewriting the same plumbing every time — login, Stripe webhooks, email, a pricing page. So instead of a new idea, he packaged the recycled scraps into a Next.js boilerplate called ShipFast and built the whole thing in roughly a week.",
      },
      {
        lead: "What he shipped anyway.",
        text: "The launch-day site was a dark landing page, '$50 off for the first 50 customers,' and the line 'Ship your startup in days, not weeks.' He posted it to Product Hunt. It made $6,000 in the first 48 hours.",
      },
      {
        lead: "Now.",
        text: "ShipFast crossed $250,000 in about five months at near-90% margins and grew into a seven-figure business — run by one person, out of the recycled leftovers of 16 failures.",
      },
    ],
    fileStats: [
      { label: "Before this", value: "16 products, ~$3K/mo" },
      { label: "Built in", value: "~a week" },
      { label: "First 48 hours", value: "$6,000" },
    ],
    lesson:
      "Your 17th scrappy try can beat your first 16 polished ones. Ship the recycled parts — the boring plumbing was the product.",
  },
  {
    slug: "better-sheets",
    name: "Better Sheets",
    kind: "famous",
    tactic: "ugly-v1",
    thenImage: "/screenshots/bettersheets-then.png",
    thenCaption: "bettersheets.co, 2020 — a one-day Carrd page selling Loom screen-recordings for $30.",
    thenYear: 2020,
    nowImage: "/screenshots/bettersheets-now.png",
    nowYear: new Date().getFullYear(),
    story:
      "Andrew Kamphey built Better Sheets in a single day to prove he could ship fast — a Carrd one-pager and a stack of Loom screen-recordings about Google Sheets, uploaded straight to Gumroad and sold as a $30 lifetime deal. No app, no platform. It grew past $100K in two years with one contractor.",
    sourceUrl: "https://ideamensch.com/andrew-kamphey/",
    founderName: "Andrew Kamphey",
    productUrl: "https://bettersheets.co",
    lead: "Andrew Kamphey built Better Sheets in one day — a Carrd page and a stack of Loom videos — just to prove he could ship something fast.",
    body: [
      {
        lead: "The ugly part.",
        text: "Annoyed by an article claiming Google Sheets was useless, Andrew Kamphey decided to ship a product in a single day. It was as scrappy as it gets: a Carrd one-pager over a screenshot of a spreadsheet, screen-recordings made in Loom and uploaded straight to Gumroad, sold as a $30 lifetime deal. No app, no course platform, no custom anything.",
      },
      {
        lead: "What he shipped anyway.",
        text: "The whole MVP was that landing page and the line 'Buy Now: $30 Lifetime Access.' It worked well enough to keep going — he added more videos as people asked for them, and went full-time on it.",
      },
      {
        lead: "Now.",
        text: "Better Sheets grew past $100,000 in revenue in about two years, run with a single contractor — built on a Carrd page and a folder of Loom clips.",
      },
    ],
    fileStats: [
      { label: "Built in", value: "one day" },
      { label: "The stack", value: "Carrd + Loom + Gumroad" },
      { label: "~2 years later", value: "$100K+ revenue" },
    ],
    lesson:
      "Ship in a day with the tools you already have. A Carrd page and a Loom video can be a real, paying product.",
    quote: {
      text: "I launched Better Sheets in one day because another project was taking a lot longer than expected.",
      cite: "Andrew Kamphey, founder of Better Sheets",
    },
  },
  {
    slug: "starter-story",
    name: "Starter Story",
    kind: "famous",
    tactic: "dont-scale",
    thenImage: "/screenshots/starterstory-then.png",
    thenCaption: "starterstory.com, 2018 — a library of founder interviews Pat Walls wrote up one at a time.",
    thenYear: 2018,
    story:
      "After his own startup failed to get into Y Combinator, Pat Walls started Starter Story by cold-emailing founders a questionnaire and hand-writing each one into a case study — published nights and weekends from a Starbucks while employed full-time. Most early posts got under 100 views. The library compounded into 1M+ monthly visits, and HubSpot acquired it.",
    sourceUrl: "https://simonowens.substack.com/p/how-starter-story-grew-from-a-side",
    founderName: "Pat Walls",
    productUrl: "https://www.starterstory.com",
    lead: "Pat Walls hand-wrote Starter Story one founder interview at a time, from a Starbucks after work — most posts got under 100 views.",
    body: [
      {
        lead: "The ugly part.",
        text: "After his own startup failed to get into Y Combinator, Pat Walls started cold-emailing and calling founders a questionnaire about how their businesses actually worked, then writing each one up by hand into a case study. He published nights and weekends from a Starbucks while holding down a full-time job.",
      },
      {
        lead: "What he did that didn't scale.",
        text: "Two or three interviews a week, one at a time, on a slow bet — that a big enough library of real founder stories would eventually rank on Google. For the first year, most posts got fewer than 100 views.",
      },
      {
        lead: "Now.",
        text: "The library compounded past a million visits a month, and HubSpot acquired Starter Story. The whole thing started as one guy hand-writing interviews after work.",
      },
    ],
    fileStats: [
      { label: "Started as", value: "hand-written interviews" },
      { label: "Year-one traffic", value: "<100 views/post" },
      { label: "Exit", value: "acquired by HubSpot" },
    ],
    lesson:
      "Do the slow, unscalable thing long enough and it compounds. A hand-built library beat anything he could have automated on day one.",
    quote: {
      text: "I had failed with a previous startup, so I just thought, okay, maybe I can just start interviewing founders so I'll find my next idea, or I'll find a co-founder.",
      cite: "Pat Walls, founder of Starter Story",
    },
  },
  {
    slug: "dyson",
    name: "Dyson",
    kind: "famous",
    tactic: "ugly-v1",
    thenImage: "/screenshots/dyson-dc01.jpg",
    thenCaption: "The Dyson DC01, 1993 — the first machine to ship under his own name, after 5,127 cardboard-and-tape prototypes.",
    thenYear: 1993,
    nowImage: "/screenshots/dyson-gen5.png",
    nowYear: new Date().getFullYear(),
    story:
      "James Dyson built his first bagless vacuum from a cardboard-and-tape cyclone strapped over a Hoover, then rebuilt it 5,127 times across about five years — 5,126 of them failures — before the one that worked. No manufacturer would license the design, so he built it himself; the DC01 later became the UK's best-selling vacuum.",
    sourceUrl: "https://www.fastcompany.com/59549/failure-doesnt-suck",
    founderName: "James Dyson",
    founderLink: "https://www.dyson.com/james-dyson",
    productUrl: "https://www.dyson.com",
    lead: "James Dyson built 5,127 prototypes of his vacuum — the first from cardboard and tape — and 5,126 of them failed.",
    body: [
      {
        lead: "The ugly part.",
        text: "Frustrated by a vacuum that kept clogging, James Dyson noticed how a nearby sawmill used a giant cyclone to spin sawdust out of the air — so he built a miniature version out of cardboard and gaffer tape and strapped it over his Hoover in place of the bag. It worked. Then he iterated by hand, one prototype at a time, for about five years.",
      },
      {
        lead: "What he shipped anyway.",
        text: "It took 5,127 prototypes before the cyclone worked the way he wanted, and 5,126 of them failed. No established manufacturer would license a bagless vacuum — it threatened their lucrative replacement-bag sales — so Dyson sold it himself, first in Japan, where it shipped as the bright-pink 'G-Force' for around £2,000 a unit.",
      },
      {
        lead: "Now.",
        text: "He poured the royalties into his own machine: the DC01 became the UK's best-selling vacuum within about 18 months, and Dyson grew into a global engineering company — vacuums, hair dryers, fans, robots — built on 5,126 failures and the one that finally worked.",
      },
    ],
    fileStats: [
      { label: "Prototypes", value: "5,127" },
      { label: "Failures", value: "5,126" },
      { label: "Built from", value: "cardboard + tape" },
    ],
    tactics: ["ugly-v1", "duct-tape-demo"],
    imageCredit:
      "Then: DC01 photo by Lankyrider, CC BY-SA 4.0, via Wikimedia Commons. Now: dyson.com.",
    lesson:
      "The famous number is the failures, not the success. 5,126 ugly prototypes were the price of the one that worked.",
    quote: {
      text: "I made 5,127 prototypes of my vacuum before I got it right. There were 5,126 failures. But I learned from each one.",
      cite: "James Dyson, Fast Company (2007)",
    },
  },
  {
    slug: "zappos",
    name: "Zappos",
    kind: "famous",
    tactic: "duct-tape-demo",
    thenImage: "/screenshots/zappos-then.png",
    thenCaption: "zappos.com, 1999 — the early store, just after Nick Swinmurn proved the idea by selling shoes he didn't own.",
    thenYear: 1999,
    story:
      "Nick Swinmurn couldn't find shoes at the mall, so before buying any inventory he walked into local shoe stores, photographed their stock, and put the photos on a bare site. When an order came in he drove back, bought the pair at retail, and shipped it himself — a deliberate fake to test whether people would buy shoes online. They would. It became Zappos; Amazon bought it for ~$1.2B.",
    sourceUrl: "https://en.wikipedia.org/wiki/Nick_Swinmurn",
    founderName: "Nick Swinmurn",
    productUrl: "https://www.zappos.com",
    lead: "Nick Swinmurn sold shoes he didn't own — photographing them in local stores, and buying each pair at retail only after someone ordered.",
    body: [
      {
        lead: "The ugly part.",
        text: "Frustrated he couldn't find the shoes he wanted at the mall, Nick Swinmurn built the cheapest possible test in 1999. He walked into local shoe stores, asked to photograph their inventory, and posted the pictures on a bare site called ShoeSite.com. There was no warehouse and no stock.",
      },
      {
        lead: "What he faked.",
        text: "When an order came in, he drove back to the store, bought the shoes at full retail, and mailed them himself — often losing money. The point was never profit; it was to learn whether anyone would buy shoes online at all, before committing a cent to inventory. They would.",
      },
      {
        lead: "Now.",
        text: "Renamed Zappos, it grew into a billion-dollar shoe retailer famous for service, and Amazon acquired it for about $1.2 billion in 2009 — from a guy faking a shoe store one photo at a time.",
      },
    ],
    fileStats: [
      { label: "Founded", value: "1999, as ShoeSite.com" },
      { label: "Day-one inventory", value: "none — bought per order" },
      { label: "Acquired by", value: "Amazon, ~$1.2B" },
    ],
    tactics: ["duct-tape-demo", "sold-first"],
    lesson:
      "Fake the back end before you build it. A photo of someone else's shoes was enough to prove people would buy.",
  },
  {
    slug: "macrofactor",
    name: "MacroFactor",
    kind: "famous",
    tactic: "ugly-v1",
    thenImage: "/screenshots/macrofactor-then.png",
    thenCaption: "strongerbyscience.com's $10 Training Toolkit — home of the spreadsheet that became MacroFactor.",
    thenYear: 2015,
    nowImage: "/screenshots/macrofactor-now.png",
    nowYear: new Date().getFullYear(),
    story:
      "Before MacroFactor was a slick app, it was a buggy spreadsheet. In 2015 Greg Nuckols released a 'Self-Correcting Macro Plan' as a freebie in a $10 bundle — one he says 'worked about 75% of the time.' Years later a developer messaged him about the neglected sheet, they rebuilt its algorithm as an app, and MacroFactor launched in 2021.",
    sourceUrl:
      "https://web.archive.org/web/20221210085510/https://macrofactorapp.com/the-history-and-team-behind-macrofactor/",
    founderName: "Greg Nuckols",
    founderLink: "https://www.strongerbyscience.com",
    productUrl: "https://macrofactor.com",
    lead: "Before MacroFactor was a slick app, it was Greg Nuckols' buggy spreadsheet — one he admits 'worked about 75% of the time.'",
    body: [
      {
        lead: "The ugly part.",
        text: "In March 2015 Greg Nuckols released a 'Self-Correcting Macro Plan' — a single spreadsheet — as a freebie inside a $10 bundle called the Training Toolkit. By his own account it 'demonstrated the limits of my MS Excel skills': a known bug meant a few pounds of water-weight loss could swing your calorie target by 1,500 a day.",
      },
      {
        lead: "What he shipped anyway.",
        text: "It was rough, but the core idea — a plan that adjusted your macros based on your actual results — worked well enough that people used it for years. Then a developer messaged Nuckols out of the blue about the 'old, tattered, neglected spreadsheet,' and they rebuilt its algorithm into a real app.",
      },
      {
        lead: "Now.",
        text: "MacroFactor launched in 2021 and became one of the most respected nutrition apps on the market — its core logic still descended directly from that one buggy spreadsheet.",
      },
    ],
    fileStats: [
      { label: "Started as", value: "a spreadsheet (2015)" },
      { label: "Worked", value: "~75% of the time" },
      { label: "Now", value: "a top nutrition app" },
    ],
    lesson:
      "A spreadsheet that works 75% of the time is still a product. Ship the ugly version — the algorithm is what matters.",
    quote: {
      text: "The story of MacroFactor, like all great stories, starts with a spreadsheet.",
      cite: "Greg Nuckols, co-founder of MacroFactor",
    },
  },
  {
    slug: "waze",
    name: "Waze",
    kind: "famous",
    tactic: "dont-scale",
    thenImage: "/screenshots/waze-then.png",
    thenCaption: "waze.com, 2012 — 'community-based' navigation: the map was built entirely by users driving with the app on.",
    thenYear: 2012,
    nowImage: "/screenshots/waze-now.png",
    nowYear: new Date().getFullYear(),
    story:
      "Waze's first product had almost no map. Founded in 2008 by Uri Levine with Ehud Shabtai and Amir Shinar — out of Shabtai's FreeMap Israel project — it built its maps by crowdsourcing: when you drove with the app on, your GPS trace paved the roads. The users were the mapping team. Google bought it in 2013 for about $1.1 billion.",
    sourceUrl: "https://www.nfx.com/post/the-insider-story-of-waze",
    founderName: "Uri Levine",
    founderLink: "https://urilevine.com",
    productUrl: "https://www.waze.com",
    lead: "Uri Levine and his co-founders launched Waze with a near-empty map — and let the users pave the roads themselves, one drive at a time.",
    body: [
      {
        lead: "The ugly part.",
        text: "Waze grew out of Ehud Shabtai's FreeMap Israel project, and when Uri Levine, Shabtai, and Amir Shinar founded the company in 2008, the first product shipped with almost no base map. Open it somewhere new and you got a blank canvas.",
      },
      {
        lead: "What they did that didn't scale.",
        text: "There was no fleet of survey cars. The map was crowdsourced: as you drove with the app running, your GPS trace literally drew the roads, and users fixed names, junctions, and hazards by hand. The users were the mapping team — 'the more you drive, the better it gets.'",
      },
      {
        lead: "Now.",
        text: "Waze became one of the most-used navigation apps in the world, and Google acquired it in 2013 for about $1.1 billion — a map built, mile by mile, by the people using it.",
      },
    ],
    fileStats: [
      { label: "Founded", value: "2008, from FreeMap Israel" },
      { label: "The map", value: "drawn by users driving" },
      { label: "Acquired by", value: "Google, ~$1.1B (2013)" },
    ],
    tactics: ["dont-scale", "ugly-v1"],
    lesson:
      "If you can't build it, let your users build it. Waze's map was its users — the unscalable thing was the whole product.",
    quote: {
      text: "Fall in love with the problem, not the solution.",
      cite: "Uri Levine, Fall in Love with the Problem, Not the Solution",
    },
  },

  // ── Community: shipping ugly right now ──────────────────────────────
  {
    slug: "firestarters",
    name: "Firestarters",
    kind: "community",
    tactic: "ugly-v1",
    tactics: ["ugly-v1", "duct-tape-demo"],
    thenImage: "/screenshots/firestarters-then.jpg",
    thenYear: 2026,
    story:
      "Firestarters is a two-sided marketplace for the games industry — studios hiring on one side, creative talent on the other. Sam shipped it functional but rough: the onboarding doesn't yet convince people to post their projects, and with jobs and job-seekers each waiting for the other to show up, only half the platform is really in use.",
    lead: "A marketplace for the games industry — shipped working, and honest that only half of it has shown up yet.",
    founderName: "Sam P",
    founderLink: "https://firestarters.games",
    productUrl: "https://firestarters.games",
    fileStats: [
      { label: "What it is", value: "games-industry marketplace" },
      { label: "Shipped", value: "2026 — functional, not pretty" },
      { label: "Now", value: "TBD — they just shipped" },
    ],
    quote: {
      text: "We're in a chicken-and-egg situation — jobs vs job-seekers — so only half the platform is being used.",
      cite: "Sam P, Firestarters",
    },
  },
];

export const famousEntries = entries.filter((e) => e.kind === "famous");
export const communityEntries = entries.filter((e) => e.kind === "community");
export const getEntry = (slug: string) => entries.find((e) => e.slug === slug);

// The entry the home page leads with (hero before/after + featured card).
export const FEATURED_SLUG = "strava";
export const featuredEntry = getEntry(FEATURED_SLUG) ?? famousEntries[0] ?? entries[0];

// 1-based catalog position, used for the honest "no. N" labels.
export const entryNumber = (slug: string) => entries.findIndex((e) => e.slug === slug) + 1;

// Display order for the "Browse by tactic" list (matches the four house tactics).
export const TACTIC_ORDER: Tactic[] = ["ugly-v1", "dont-scale", "sold-first", "duct-tape-demo"];

export const tacticCount = (t: Tactic) => entries.filter((e) => e.tactic === t).length;

export const firstEntryWithTactic = (t: Tactic) => entries.find((e) => e.tactic === t);

// Famous entries sharing a primary tactic, in catalog order — drives the
// home-page "whole catalog" grouped grid. Grouped by primary `tactic`, so a
// multi-tactic entry appears under exactly one heading.
export const famousByTactic = (t: Tactic) => famousEntries.filter((e) => e.tactic === t);
