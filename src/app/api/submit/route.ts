import { siteName } from "@/lib/site";
import { validateSubmission } from "@/lib/submission";

// Best-effort in-memory rate limit (resets per serverless instance — the
// honeypot does the real anti-spam work; see spec).
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return Response.json({ error: "Too many submissions — try again in a minute." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ errors: ["Body must be JSON."] }, { status: 400 });
  }

  // Honeypot: real users never see this field. Fake success — don't tip off bots.
  if (typeof body === "object" && body !== null && (body as Record<string, unknown>).website) {
    return Response.json({ ok: true });
  }

  const result = validateSubmission(body);
  if (!result.ok) {
    return Response.json({ errors: result.errors }, { status: 400 });
  }
  const s = result.data;

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.SUBMIT_TO_EMAIL;
  if (!apiKey || !toEmail) {
    return Response.json(
      { error: "Submissions are temporarily down.", fallback: true },
      { status: 502 }
    );
  }

  let resendRes: Response;
  try {
    resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: AbortSignal.timeout(8000),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // onboarding@resend.dev works before a domain is verified (delivers only
        // to the account owner's email — exactly our use case). Swap to a
        // verified-domain sender post-launch.
        from: `${siteName} <onboarding@resend.dev>`,
        to: [toEmail],
        reply_to: s.email,
        subject: `Ugly MVP submission: ${s.productName}`,
        text: [
          `Product: ${s.productName}`,
          `URL: ${s.productUrl}`,
          `Founder: ${s.founderName} (${s.email})`,
          `Founder link: ${s.founderLink}`,
          ``,
          `Story:`,
          s.story,
          ``,
          `Reply to this email to ask for their screenshot.`,
        ].join("\n"),
      }),
    });
  } catch (err) {
    console.error("Resend request failed", err);
    return Response.json(
      { error: "Could not send your submission.", fallback: true },
      { status: 502 }
    );
  }

  if (!resendRes.ok) {
    console.error("Resend send failed", resendRes.status, await resendRes.text().catch(() => ""));
    return Response.json(
      { error: "Could not send your submission.", fallback: true },
      { status: 502 }
    );
  }
  return Response.json({ ok: true });
}
