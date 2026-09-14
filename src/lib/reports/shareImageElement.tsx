import type { ReactNode } from "react";

export interface ShareImageHighlight {
  /** The certificate's own top label -- e.g. "Certificate of Natural Talent" or "Certificate of Rising Talent". */
  certificateLabel: string;
  /** The medallion's icon content, already sized/colored by the caller. Omitted renders no medallion. */
  icon?: ReactNode;
  /** The bold "certificate" statement -- an archetype title, e.g. "The Born Leader", or a plain subject name for the "rising" tone. */
  headline: string;
  /** The subject's full name, shown under the headline. */
  category?: string;
  /** A short, honest, chart-grounded supporting line -- never a new claim invented for this card. */
  subtext: string;
  /**
   * A real, chart-grounded line under the subtext -- e.g. "2 of 9 core
   * subjects shine this brightly" (gold tone) or "Zara's strongest of 9
   * tracked areas" (silver tone, always true since it's the top-ranked
   * one regardless of tier). Only ever set from real per-chart data,
   * never a fabricated population statistic.
   */
  rarityLine?: string;
  /**
   * "gold" for a subject that genuinely reached the top standardized
   * tier; "silver" for the honest runner-up version -- a real, top-of-9
   * strength that doesn't clear that bar. Never a "bronze"/lesser tone:
   * every paid reading's top subject is either gold or silver, so nobody
   * ends up with an empty card (HANDOFF §50).
   */
  tone: "gold" | "silver";
}

export interface ShareImageData {
  childName: string;
  ascendant: string;
  moonSign: string;
  highlight: ShareImageHighlight;
}

const FOREST = "#14201a";
const FOREST_2 = "#253b2c";
const CREAM = "#f2ead6";
const GOLD = "#d9a441";
const SILVER = "#b9c2c4";

const TONE = {
  gold: {
    accent: GOLD,
    medallion: "linear-gradient(155deg, #e9c374 0%, #c9932f 55%, #9c6f1f 100%)",
    ring: "rgba(217,164,65,0.6)",
    pillBg: "rgba(217,164,65,0.16)",
    pillBorder: GOLD,
    badgeBorder: "rgba(217,164,65,0.5)",
    frameBorder: GOLD,
  },
  silver: {
    accent: SILVER,
    medallion: "linear-gradient(155deg, #eef1f2 0%, #c3cdd0 55%, #8f9a9d 100%)",
    ring: "rgba(185,194,196,0.6)",
    pillBg: "rgba(185,194,196,0.14)",
    pillBorder: SILVER,
    badgeBorder: "rgba(185,194,196,0.5)",
    frameBorder: SILVER,
  },
} as const;

/**
 * A compact square, sized to work equally as a standalone post (Facebook,
 * an Instagram feed post) or as a resizable overlay "sticker" a parent
 * drops on top of their own photo in Instagram/Facebook Stories -- the
 * realistic way this kind of card actually gets used, per this feature's
 * own persona analysis (HANDOFF §45/§46).
 */
export const SHARE_IMAGE_SIZE = { width: 1080, height: 1080 };

function Medallion({ icon, gradient, ring, size = 148 }: { icon: ReactNode; gradient: string; ring: string; size?: number }) {
  return (
    <div
      style={{
        display: "flex",
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: "center",
        justifyContent: "center",
        background: gradient,
        border: "6px solid rgba(20,32,26,0.35)",
      }}
    >
      <div
        style={{
          display: "flex",
          width: size - 26,
          height: size - 26,
          borderRadius: (size - 26) / 2,
          alignItems: "center",
          justifyContent: "center",
          background: FOREST,
          border: `2px solid ${ring}`,
          color: ring,
        }}
      >
        {icon}
      </div>
    </div>
  );
}

/**
 * The JSX tree rendered into the shareable "results" graphic
 * (`report/[id]/share-image/route.tsx`) via `next/og`'s `ImageResponse`.
 * Pulled out into its own module (rather than left inline in the route)
 * so it can be exercised directly -- with fake sample data, per this
 * project's disposable-verification convention (HANDOFF §9) -- without
 * needing a real Supabase-backed report, since this sandbox has no DB
 * access.
 */
export function buildShareImageElement({ childName, ascendant, moonSign, highlight }: ShareImageData) {
  const t = TONE[highlight.tone];

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px",
        background: `linear-gradient(160deg, ${FOREST} 0%, ${FOREST_2} 60%, ${FOREST} 100%)`,
        color: CREAM,
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flex: 1,
          width: "100%",
          border: `3px solid ${t.frameBorder}`,
          borderRadius: 20,
          padding: "36px 44px",
        }}
      >
        <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 18, letterSpacing: 2, textTransform: "uppercase", color: t.accent }}>
            Little Stargazers
          </span>
          <span style={{ fontSize: 18, letterSpacing: 2, textTransform: "uppercase", color: t.accent }}>
            Chart Snapshot
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flexGrow: 1,
            justifyContent: "center",
            gap: 16,
          }}
        >
          <span style={{ fontSize: 20, letterSpacing: 3, textTransform: "uppercase", color: t.accent }}>
            {highlight.certificateLabel}
          </span>

          {highlight.icon && (
            <div style={{ display: "flex", marginTop: 8 }}>
              <Medallion icon={highlight.icon} gradient={t.medallion} ring={t.ring} />
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <span
              style={{
                marginTop: 8,
                fontSize: 58,
                fontWeight: 700,
                textAlign: "center",
                lineHeight: 1.05,
              }}
            >
              {highlight.headline}
            </span>
            {highlight.category && (
              <span style={{ fontSize: 24, color: "rgba(242,234,214,0.75)", textAlign: "center" }}>
                {highlight.category}
              </span>
            )}
            <span
              style={{
                fontSize: 24,
                textAlign: "center",
                color: "rgba(242,234,214,0.85)",
                maxWidth: 780,
                lineHeight: 1.4,
              }}
            >
              {highlight.subtext}
            </span>
            {highlight.rarityLine && (
              <div
                style={{
                  display: "flex",
                  marginTop: 6,
                  borderRadius: 999,
                  background: t.pillBg,
                  border: `1.5px solid ${t.pillBorder}`,
                  padding: "10px 22px",
                  fontSize: 20,
                  color: t.accent,
                }}
              >
                {highlight.rarityLine}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", gap: 14 }}>
            <div
              style={{
                display: "flex",
                borderRadius: 999,
                border: `1.5px solid ${t.badgeBorder}`,
                padding: "8px 20px",
                fontSize: 20,
              }}
            >
              Rising · {ascendant}
            </div>
            <div
              style={{
                display: "flex",
                borderRadius: 999,
                border: `1.5px solid ${t.badgeBorder}`,
                padding: "8px 20px",
                fontSize: 20,
              }}
            >
              Moon · {moonSign}
            </div>
          </div>
          <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: 1 }}>Presented to {childName}</span>
          <span style={{ fontSize: 16, color: "rgba(242,234,214,0.6)" }}>littlestargazer.com</span>
        </div>
      </div>
    </div>
  );
}
