import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { ImageResponse } from "next/og";
import { entries, getEntry } from "@/data/entries";
import { siteName, siteUrl } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamicParams = false;

export function generateStaticParams() {
  return entries.map((e) => ({ slug: e.slug }));
}

export const alt = "It started ugly";

const INK = "#111111";
const ACCENT = "#9a3328";

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

const domain = (() => {
  try {
    return new URL(siteUrl).host;
  } catch {
    return "drafts.marulho.co";
  }
})();

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
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff",
            color: INK,
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          {siteName}
        </div>
      ),
      size
    );
  }

  const then = await dataUri(entry.thenImage);
  const now = entry.nowImage ? await dataUri(entry.nowImage) : null;
  const era = entry.name.toUpperCase();

  const headline = now
    ? `${era}, ${entry.thenYear} → ${entry.nowYear}. It started ugly.`
    : `${era}, ${entry.thenYear} → ?. They shipped ugly. Your move.`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#fff", color: INK }}>
        {/* top row */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "28px 36px 0" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.4 }}>{siteName}</div>
            <div style={{ display: "flex", fontSize: 13, color: ACCENT, border: "1px solid #d8c2bd", padding: "1px 6px" }}>
              v0.1
            </div>
          </div>
        </div>

        {/* before / after frame */}
        <div style={{ flex: 1, display: "flex", margin: "22px 36px", border: `1px solid ${INK}`, overflow: "hidden" }}>
          <div style={{ position: "relative", display: "flex", width: now ? "50%" : "100%" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={then} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", left: 12, bottom: 12, display: "flex", fontSize: 14, fontWeight: 700, letterSpacing: 0.5, background: INK, color: "#fff", padding: "4px 10px" }}>
              {era} · {entry.thenYear}
            </div>
          </div>
          {now && (
            <>
              <div style={{ display: "flex", width: 1, background: INK }} />
              <div style={{ position: "relative", display: "flex", width: "50%" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={now} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", right: 12, top: 12, display: "flex", fontSize: 14, fontWeight: 700, letterSpacing: 0.5, background: ACCENT, color: "#fff", padding: "4px 10px" }}>
                  {era} · {entry.nowYear}
                </div>
              </div>
            </>
          )}
        </div>

        {/* bottom row */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "0 36px 28px", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>{headline}</div>
          <div style={{ display: "flex", fontSize: 15, color: INK, flexShrink: 0 }}>{domain}</div>
        </div>
      </div>
    ),
    size
  );
}
