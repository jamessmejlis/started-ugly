import { ImageResponse } from "next/og";
import { hoffmanQuote, siteName, siteUrl, tagline } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${siteName} — ${tagline}`;

const INK = "#111111";
const ACCENT = "#9a3328";

// The Plain-direction share card (design surface #5). System-serif look,
// hairline rules, one accent, a mini before/after token. No webfont is loaded —
// next/og's default face stands in for Georgia, in keeping with the plain ethos.
export default function OgImage() {
  const domain = (() => {
    try {
      return new URL(siteUrl).host;
    } catch {
      return "shittyfirstdrafts.directory";
    }
  })();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          color: INK,
        }}
      >
        {/* top row */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            padding: "30px 40px 0",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.4 }}>{siteName}</div>
            <div
              style={{
                display: "flex",
                fontSize: 13,
                color: ACCENT,
                border: `1px solid #d8c2bd`,
                padding: "1px 6px",
              }}
            >
              v0.1
            </div>
          </div>
        </div>

        {/* center */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            padding: "0 40px",
            gap: 40,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ display: "flex", fontSize: 13, color: ACCENT, marginBottom: 14 }}>
              A directory of embarrassing first versions
            </div>
            <div style={{ display: "flex", fontSize: 54, fontWeight: 700, lineHeight: 1.02, letterSpacing: -1.4 }}>
              You&apos;re comparing your day one to their year fifteen.
            </div>
          </div>

          {/* mini before/after token */}
          <div style={{ display: "flex", flexDirection: "column", width: 250, border: `1px solid ${INK}` }}>
            <div style={{ display: "flex", height: 120 }}>
              <div style={{ display: "flex", flex: 1, background: "#bcc1c6", position: "relative", alignItems: "flex-end" }}>
                <div
                  style={{
                    position: "absolute",
                    left: 7,
                    bottom: 7,
                    display: "flex",
                    fontSize: 11,
                    background: INK,
                    color: "#fff",
                    padding: "2px 6px",
                  }}
                >
                  2008
                </div>
              </div>
              <div style={{ display: "flex", width: 1, background: INK }} />
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  backgroundImage: "linear-gradient(135deg, #ffd9a0, #ff8a6b)",
                  position: "relative",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    right: 7,
                    bottom: 7,
                    display: "flex",
                    fontSize: 11,
                    background: ACCENT,
                    color: "#fff",
                    padding: "2px 6px",
                  }}
                >
                  2026
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: 12,
                color: "#777",
                padding: "8px 0",
                borderTop: `1px solid ${INK}`,
              }}
            >
              Drag to reveal
            </div>
          </div>
        </div>

        {/* bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            padding: "0 40px 30px",
            gap: 24,
          }}
        >
          <div style={{ display: "flex", fontSize: 18, fontStyle: "italic", color: "#333" }}>
            &ldquo;{hoffmanQuote}&rdquo;
          </div>
          <div style={{ display: "flex", fontSize: 15, color: INK }}>{domain}</div>
        </div>
      </div>
    ),
    size
  );
}
