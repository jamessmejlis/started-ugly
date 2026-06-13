"use client";

import { useEffect, useRef, useState } from "react";

export function ShareLinks({ url, text }: { url: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enc = encodeURIComponent;

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (http, some in-app webviews) — ugly fallback that always works.
      window.prompt("Copy this link:", url);
    }
  }

  return (
    <p className="share-links">
      Share:{" "}
      <a
        href={`https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        X
      </a>{" "}
      ·{" "}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        LinkedIn
      </a>{" "}
      ·{" "}
      <button type="button" onClick={copy}>
        {copied ? "Copied!" : "Copy link"}
      </button>
    </p>
  );
}
