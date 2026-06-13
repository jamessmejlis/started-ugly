import { describe, expect, test } from "bun:test";
import { validateSubmission } from "@/lib/submission";

const valid = {
  founderName: "Ada Founder",
  email: "ada@example.com",
  productName: "ShipFastly",
  productUrl: "https://shipfastly.example.com",
  founderLink: "https://x.com/adafounder",
  story: "Shipped a one-page MVP in a weekend. The checkout is a Stripe payment link.",
};

describe("validateSubmission", () => {
  test("accepts a valid submission", () => {
    const r = validateSubmission(valid);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.productName).toBe("ShipFastly");
  });

  test("rejects non-object input", () => {
    expect(validateSubmission(null).ok).toBe(false);
    expect(validateSubmission("hi").ok).toBe(false);
  });

  test("rejects missing required fields", () => {
    const r = validateSubmission({ ...valid, founderName: "" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.join(" ")).toContain("founderName");
  });

  test("rejects malformed email", () => {
    expect(validateSubmission({ ...valid, email: "not-an-email" }).ok).toBe(false);
  });

  test("rejects malformed URLs", () => {
    expect(validateSubmission({ ...valid, productUrl: "not a url" }).ok).toBe(false);
    expect(validateSubmission({ ...valid, founderLink: "javascript:alert(1)" }).ok).toBe(false);
  });

  test("rejects too-short and too-long stories", () => {
    expect(validateSubmission({ ...valid, story: "short" }).ok).toBe(false);
    expect(validateSubmission({ ...valid, story: "x".repeat(2001) }).ok).toBe(false);
  });

  test("trims whitespace", () => {
    const r = validateSubmission({ ...valid, productName: "  ShipFastly  " });
    if (r.ok) expect(r.data.productName).toBe("ShipFastly");
    expect(r.ok).toBe(true);
  });
});
