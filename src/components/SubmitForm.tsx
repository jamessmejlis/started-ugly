"use client";

import { useState } from "react";
import { contactEmail } from "@/lib/site";

type Status = { state: "idle" | "sending" | "sent" } | { state: "error"; message: string; fallback: boolean };

export function SubmitForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus({ state: "sending" });
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        form.reset();
        setStatus({ state: "sent" });
      } else {
        setStatus({
          state: "error",
          message: body.errors?.join(". ") ?? body.error ?? "Something went wrong.",
          fallback: Boolean(body.fallback),
        });
      }
    } catch {
      setStatus({ state: "error", message: "Network error.", fallback: true });
    }
  }

  if (status.state === "sent") {
    return (
      <p>
        <strong>Got it.</strong> I&apos;ll personally reply within a couple of days to get your
        screenshot. Go ship something in the meantime.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <p>
        <label>
          Your name
          <br />
          <input name="founderName" required maxLength={100} />
        </label>
      </p>
      <p>
        <label>
          Your email
          <br />
          <input name="email" type="email" required maxLength={200} />
        </label>
      </p>
      <p>
        <label>
          Product name
          <br />
          <input name="productName" required maxLength={100} />
        </label>
      </p>
      <p>
        <label>
          Product URL
          <br />
          <input name="productUrl" type="url" required maxLength={500} />
        </label>
      </p>
      <p>
        <label>
          Your X / LinkedIn
          <br />
          <input name="founderLink" type="url" required maxLength={500} />
        </label>
      </p>
      <p>
        <label>
          What did you ship, and what&apos;s embarrassing about it? Ugly screens, manual hacks,
          selling before building, duct-taped demos — all count.
          <br />
          <textarea name="story" required minLength={20} maxLength={2000} rows={6} />
        </label>
      </p>
      {/* Honeypot — hidden from humans, irresistible to bots */}
      <p style={{ display: "none" }} aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <p>
        <button type="submit" disabled={status.state === "sending"}>
          {status.state === "sending" ? "Sending…" : "Submit your ugly MVP"}
        </button>
      </p>
      {status.state === "error" && (
        <p role="alert">
          {status.message}{" "}
          {status.fallback && (
            <>
              You can also just email me: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            </>
          )}
        </p>
      )}
    </form>
  );
}
