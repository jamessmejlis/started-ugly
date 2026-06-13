import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { ImageResponse } from "next/og";
import { entries, getEntry } from "@/data/entries";
import { siteName } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamicParams = false;

export function generateStaticParams() {
  return entries.map((e) => ({ slug: e.slug }));
}

export const alt = "It started ugly";

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
};

async function dataUri(publicPath: string) {
  const buf = await readFile(join(process.cwd(), "public", publicPath));
  const mime = MIME[extname(publicPath)] ?? "image/png";
  return `data:${mime};base64,${buf.toString("base64")}`;
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getEntry(slug);

  if (!entry) {
    return new ImageResponse(
      (
        <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: "#fff", fontSize: 48, fontWeight: 700 }}>
          {siteName}
        </div>
      ),
      size
    );
  }

  const then = await dataUri(entry.thenImage);
  const now = entry.nowImage ? await dataUri(entry.nowImage) : null;

  const headline = now
    ? `${entry.name.toUpperCase()}, ${entry.thenYear} → ${entry.nowYear}. It started ugly.`
    : `${entry.name.toUpperCase()}, ${entry.thenYear} → ?. They shipped ugly. Your move.`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          color: "#000",
          padding: 24,
          fontSize: 36,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flex: 1, gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={then}
            alt=""
            style={{
              width: now ? "50%" : "100%",
              height: "100%",
              objectFit: "cover",
              border: "4px solid #000",
            }}
          />
          {now && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={now}
              alt=""
              style={{
                width: "50%",
                height: "100%",
                objectFit: "cover",
                border: "4px solid #000",
              }}
            />
          )}
        </div>
        <div style={{ display: "flex", paddingTop: 16, fontWeight: 700 }}>
          {headline}
        </div>
      </div>
    ),
    size
  );
}
