import { ChartWheel } from "@/components/ChartWheel";
import { StarIcon } from "@/components/icons";

export interface ShareImageHighlight {
  /** Small uppercase label above the headline, e.g. "Naturally gifted in" or "A special chart combination". */
  eyebrow: string;
  /** The big, bold statement -- a subject name ("Mathematics") or a named classical combination's title. */
  headline: string;
  /** A short supporting line under the headline. */
  subtext: string;
  /**
   * A real, chart-grounded rarity line (e.g. "2 of 9 core subjects shine
   * this brightly in Zara's chart") -- only ever set from real per-chart
   * data (`topSubjectHighlight`'s `flourishingCount`/`total`), never a
   * fabricated population statistic. Omitted entirely for the
   * special-combination fallback, since flourishing-count isn't the
   * relevant measure there.
   */
  rarityLine?: string;
}

export interface ShareImageData {
  childName: string;
  ascendant: string;
  moonSign: string;
  /**
   * Present only when there's a genuine, earned standout to show -- see
   * the route handler for the flourishing-subject / special-combination /
   * nothing fallback order. Left undefined renders the plain
   * badges-and-individuality version, never a dressed-up mediocre claim
   * (this project's standing no-fabrication stance, §6/§37).
   */
  highlight?: ShareImageHighlight;
}

/**
 * A compact square, sized to work equally as a standalone post (Facebook,
 * an Instagram feed post) or as a resizable overlay "sticker" a parent
 * drops on top of their own photo in Instagram/Facebook Stories -- the
 * realistic way this kind of card actually gets used, per this feature's
 * own persona analysis (HANDOFF §45/§46): brag posts are photo-led, and a
 * full-bleed poster-shaped graphic can only ever be a standalone post, not
 * a companion to one. A square with real padding and no edge-to-edge
 * background art crops cleanly either way.
 */
export const SHARE_IMAGE_SIZE = { width: 1080, height: 1080 };

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
  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px",
        background: "linear-gradient(160deg, #14201a 0%, #253b2c 65%, #14201a 100%)",
        color: "#f2ead6",
        fontFamily: "sans-serif",
      }}
    >
      <ChartWheel
        style={{
          position: "absolute",
          right: -100,
          bottom: -100,
          width: 460,
          height: 460,
          color: "#f2ead6",
          opacity: 0.07,
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: 18,
            background: "#c25f3d",
          }}
        >
          <StarIcon style={{ width: 18, height: 18, color: "#14201a" }} />
        </div>
        <span
          style={{
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: "#c25f3d",
          }}
        >
          Little Stargazers
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <span
          style={{
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            color: "#c25f3d",
          }}
        >
          {childName}&apos;s chart snapshot
        </span>

        {highlight ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              borderRadius: 26,
              background: "rgba(194,95,61,0.14)",
              border: "2px solid rgba(194,95,61,0.5)",
              padding: "36px 36px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <StarIcon style={{ width: 20, height: 20, color: "#c25f3d" }} />
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  color: "#c25f3d",
                }}
              >
                {highlight.eyebrow}
              </span>
            </div>
            <span style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.08 }}>
              {highlight.headline}
            </span>
            <span style={{ fontSize: 26, lineHeight: 1.3, color: "rgba(242,234,214,0.85)" }}>
              {highlight.subtext}
            </span>
            {highlight.rarityLine && (
              <div
                style={{
                  display: "flex",
                  marginTop: 4,
                  borderRadius: 999,
                  background: "rgba(242,234,214,0.1)",
                  padding: "10px 20px",
                  fontSize: 20,
                  color: "rgba(242,234,214,0.85)",
                }}
              >
                {highlight.rarityLine}
              </div>
            )}
          </div>
        ) : (
          <span style={{ fontSize: 26, lineHeight: 1.4, color: "rgba(242,234,214,0.8)" }}>
            A truly individual mix — the full reading unpacks what makes {childName}{" "}
            unique.
          </span>
        )}

        <div style={{ display: "flex", gap: 14 }}>
          <div
            style={{
              display: "flex",
              borderRadius: 999,
              border: "2px solid rgba(242,234,214,0.35)",
              padding: "12px 24px",
              fontSize: 22,
            }}
          >
            Rising · {ascendant}
          </div>
          <div
            style={{
              display: "flex",
              borderRadius: 999,
              border: "2px solid rgba(242,234,214,0.35)",
              padding: "12px 24px",
              fontSize: 22,
            }}
          >
            Moon · {moonSign}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 24,
          borderTop: "2px solid rgba(242,234,214,0.2)",
        }}
      >
        <span style={{ fontSize: 22, color: "rgba(242,234,214,0.75)" }}>
          Free chart. Real, honest insights.
        </span>
        <div
          style={{
            display: "flex",
            borderRadius: 999,
            background: "#c25f3d",
            color: "#14201a",
            fontSize: 22,
            fontWeight: 700,
            padding: "12px 28px",
          }}
        >
          littlestargazer.com
        </div>
      </div>
    </div>
  );
}
