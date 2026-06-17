"use client";

import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [queued, setQueued] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) return;
    // Optimistic: capture happens server-side, so never block the wink on the
    // network. The address lands as a private GitHub issue via /api/subscribe.
    setQueued(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
    } catch {
      // Swallow — MVP. The address is already in flight; we don't re-prompt.
    }
  }

  if (queued) {
    return (
      <p className="signup__help" role="status">
        You&apos;re on the list — {email}. The newsletter itself is still a draft. Fitting.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="signup__frame">
        <input
          className="signup__input"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@startup.com"
          aria-label="Email address"
          required
        />
        <button className="signup__btn" type="submit">
          Subscribe
        </button>
      </div>
      {/* honeypot — hidden from humans, catnip for bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />
      <div className="signup__help">
        No spam. Unsubscribe anytime — once there&apos;s something to unsubscribe from.
      </div>
    </form>
  );
}
