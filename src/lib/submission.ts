export type Submission = {
  founderName: string;
  email: string;
  productName: string;
  productUrl: string;
  founderLink: string;
  story: string;
};

export type SubmissionResult =
  | { ok: true; data: Submission }
  | { ok: false; errors: string[] };

const isHttpUrl = (value: string) => {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

export function validateSubmission(input: unknown): SubmissionResult {
  if (typeof input !== "object" || input === null) {
    return { ok: false, errors: ["body must be a JSON object"] };
  }
  const raw = input as Record<string, unknown>;
  const errors: string[] = [];

  const str = (key: string, min: number, max: number, singleLine = false) => {
    const v = typeof raw[key] === "string" ? (raw[key] as string).trim() : "";
    if (v.length < min || v.length > max) {
      errors.push(`${key} must be ${min}–${max} characters`);
    } else if (singleLine && /[\r\n]/.test(v)) {
      errors.push(`${key} must be a single line`);
    }
    return v;
  };

  const founderName = str("founderName", 1, 100, true);
  const email = str("email", 3, 200, true);
  const productName = str("productName", 1, 100, true);
  const productUrl = str("productUrl", 1, 500, true);
  const founderLink = str("founderLink", 1, 500, true);
  const story = str("story", 20, 2000);

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("email is invalid");
  if (productUrl && !isHttpUrl(productUrl)) errors.push("productUrl must be a valid http(s) URL");
  if (founderLink && !isHttpUrl(founderLink)) errors.push("founderLink must be a valid http(s) URL");

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, data: { founderName, email, productName, productUrl, founderLink, story } };
}
