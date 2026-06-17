import { NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Best-effort, per-instance rate limit. Resets when the serverless instance
// recycles — fine for an MVP; the honeypot does the real spam work.
const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now > rec.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_PER_WINDOW;
}

// Captures newsletter emails server-side as one GitHub issue per signup in a
// PRIVATE repo (SIGNUPS_REPO), so addresses never touch the public repo. The
// submit form stays on its own GitHub-issue path; this is emails only.
export async function POST(req: Request) {
  let body: { email?: string; website?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Honeypot: real users never fill this. Silently accept, then drop the bot.
  if (body.website && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    // Don't hand scrapers a signal; pretend it worked.
    return NextResponse.json({ ok: true });
  }

  const repo = process.env.SIGNUPS_REPO;
  const token = process.env.SIGNUPS_GH_TOKEN;

  // No store configured (e.g. local dev without secrets): keep the UX working;
  // capture no-ops until the env vars are set.
  if (!repo || !token) {
    console.warn("[subscribe] SIGNUPS_REPO/SIGNUPS_GH_TOKEN unset — email not captured");
    return NextResponse.json({ ok: true });
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/issues`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: email,
        body: `email: ${email}\nsignedup: ${new Date().toISOString()}\nsource: newsletter`,
      }),
    });
    if (!res.ok) {
      console.error(`[subscribe] GitHub issue create failed: ${res.status} ${await res.text()}`);
    }
  } catch (err) {
    console.error("[subscribe] GitHub issue create threw", err);
  }

  // Always friendly to the user, even if capture hiccuped (logged above).
  return NextResponse.json({ ok: true });
}
