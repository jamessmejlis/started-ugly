import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { siteName, siteUrl, tagline } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${siteName} — ${tagline}`, template: `%s | ${siteName}` },
  description:
    "The embarrassing first versions of products you admire — ugly v1s, unscalable hacks, pre-code sales, duct-taped demos — next to what they became. Ship yours.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
