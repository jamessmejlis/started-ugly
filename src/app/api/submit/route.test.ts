import { afterEach, describe, expect, test } from "bun:test";
import { POST } from "@/app/api/submit/route";

const valid = {
  founderName: "Ada Founder",
  email: "ada@example.com",
  productName: "ShipFastly",
  productUrl: "https://shipfastly.example.com",
  founderLink: "https://x.com/adafounder",
  story: "Shipped a one-page MVP in a weekend. The checkout is a Stripe payment link.",
};

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

function stubFetch(status: number) {
  const calls: { url: string; init?: RequestInit }[] = [];
  globalThis.fetch = (async (url: any, init?: any) => {
    calls.push({ url: String(url), init });
    return new Response(JSON.stringify({ id: "email_123" }), { status });
  }) as typeof fetch;
  return calls;
}

const req = (body: unknown, ip: string) =>
  new Request("http://localhost/api/submit", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });

describe("POST /api/submit", () => {
  test("happy path sends email via Resend and returns 200", async () => {
    process.env.RESEND_API_KEY = "test-key";
    process.env.SUBMIT_TO_EMAIL = "james@example.com";
    const calls = stubFetch(200);
    const res = await POST(req(valid, "1.1.1.1"));
    expect(res.status).toBe(200);
    expect(calls.length).toBe(1);
    expect(calls[0].url).toBe("https://api.resend.com/emails");
    const sent = JSON.parse(String(calls[0].init?.body));
    expect(sent.to).toEqual(["james@example.com"]);
    expect(sent.subject).toContain("ShipFastly");
    expect(sent.reply_to).toBe("ada@example.com");
  });

  test("honeypot filled returns fake success without sending", async () => {
    const calls = stubFetch(200);
    const res = await POST(req({ ...valid, website: "http://spam.example" }, "2.2.2.2"));
    expect(res.status).toBe(200);
    expect(calls.length).toBe(0);
  });

  test("invalid body returns 400 with errors", async () => {
    stubFetch(200);
    const res = await POST(req({ ...valid, email: "nope" }, "3.3.3.3"));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.errors.length).toBeGreaterThan(0);
  });

  test("non-JSON body returns 400", async () => {
    stubFetch(200);
    const res = await POST(
      new Request("http://localhost/api/submit", {
        method: "POST",
        headers: { "x-forwarded-for": "4.4.4.4" },
        body: "not json",
      })
    );
    expect(res.status).toBe(400);
  });

  test("Resend failure returns 502 with fallback flag", async () => {
    process.env.RESEND_API_KEY = "test-key";
    process.env.SUBMIT_TO_EMAIL = "james@example.com";
    stubFetch(500);
    const res = await POST(req(valid, "5.5.5.5"));
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.fallback).toBe(true);
  });

  test("missing email config returns 502 fallback without calling Resend", async () => {
    delete process.env.RESEND_API_KEY;
    delete process.env.SUBMIT_TO_EMAIL;
    const calls = stubFetch(200);
    const res = await POST(req(valid, "7.7.7.7"));
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.fallback).toBe(true);
    expect(calls.length).toBe(0);
  });

  test("network failure returns 502 with fallback flag", async () => {
    process.env.RESEND_API_KEY = "test-key";
    process.env.SUBMIT_TO_EMAIL = "james@example.com";
    globalThis.fetch = (async () => {
      throw new Error("network down");
    }) as typeof fetch;
    const res = await POST(req(valid, "8.8.8.8"));
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.fallback).toBe(true);
  });

  test("rate limit: 4th request in a minute from same IP returns 429", async () => {
    process.env.RESEND_API_KEY = "test-key";
    process.env.SUBMIT_TO_EMAIL = "james@example.com";
    stubFetch(200);
    for (let i = 0; i < 3; i++) {
      const res = await POST(req(valid, "6.6.6.6"));
      expect(res.status).toBe(200);
    }
    const res4 = await POST(req(valid, "6.6.6.6"));
    expect(res4.status).toBe(429);
  });
});
