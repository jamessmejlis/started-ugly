"use client";

import { useState } from "react";

export function ShareLinks({ url, text }: { url: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
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
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
    </p>
  );
}
