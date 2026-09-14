import { ChartWheel } from "@/components/ChartWheel";
import { StarIcon } from "@/components/icons";

export interface ShareImageData {
  childName: string;
  ascendant: string;
  moonSign: string;
  /**
   * Only pass this when the top subject genuinely reached the
   * "flourishing" tier (see `topSubjectHighlight` in
   * `lib/education/subjects.ts`) -- the headline below is written to read
   * as a real, earned superlative ("Naturally gifted"), and showing it
   * for a merely "steady"/"growing" top subject would be exactly the
   * kind of inflated claim this project has otherwise refused to make
   * (HANDOFF §6, §37). Omit it (leave undefined) for any chart whose best
   * subject doesn't clear that bar -- the two sign badges still make a
   * genuine, individual card on their own.
   */
  giftedSubject?: { name: string; title: string };
}

export const SHARE_IMAGE_SIZE = { width: 1080, height: 1920 };

/**
 * The JSX tree rendered into the shareable "results" graphic
 * (`report/[id]/share-image/route.tsx`) via `next/og`'s `ImageResponse`.
 * Pulled out into its own module (rather than left inline in the route)
 * so it can be exercised directly -- with fake sample data, per this
 * project's disposable-verification convention (HANDOFF §9) -- without
 * needing a real Supabase-backed report, since this sandbox has no DB
 * access.
 */
export function buildShareImageElement({
  childName,
  ascendant,
  moonSign,
  giftedSubject,
}: ShareImageData) {
  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "72px",
        background: "linear-gradient(160deg, #14201a 0%, #253b2c 65%, #14201a 100%)",
        color: "#f2ead6",
        fontFamily: "sans-serif",
      }}
    >
      <ChartWheel
        style={{
          position: "absolute",
          right: -120,
          bottom: -120,
          width: 620,
          height: 620,
          color: "#f2ead6",
          opacity: 0.08,
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 12, position: "absolute", top: 72, left: 72 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            borderRadius: 22,
            background: "#c25f3d",
          }}
        >
          <StarIcon style={{ width: 22, height: 22, color: "#14201a" }} />
        </div>
        <span
          style={{
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: 2,
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
          gap: 36,
        }}
      >
        <span
          style={{
            fontSize: 30,
            fontWeight: 600,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: "#c25f3d",
          }}
        >
          {childName}&apos;s chart snapshot
        </span>

        {giftedSubject && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              borderRadius: 28,
              background: "rgba(194,95,61,0.14)",
              border: "2px solid rgba(194,95,61,0.5)",
              padding: "48px 44px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <StarIcon style={{ width: 26, height: 26, color: "#c25f3d" }} />
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "#c25f3d",
                }}
              >
                Naturally gifted in
              </span>
            </div>
            <span
              style={{
                fontSize: 76,
                fontWeight: 700,
                lineHeight: 1.05,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {giftedSubject.name}
            </span>
            <span style={{ fontSize: 32, lineHeight: 1.3, color: "rgba(242,234,214,0.85)" }}>
              {giftedSubject.title}
            </span>
          </div>
        )}

        <div style={{ display: "flex", gap: 16 }}>
          <div
            style={{
              display: "flex",
              borderRadius: 999,
              border: "2px solid rgba(242,234,214,0.35)",
              padding: "14px 28px",
              fontSize: 26,
            }}
          >
            Rising · {ascendant}
          </div>
          <div
            style={{
              display: "flex",
              borderRadius: 999,
              border: "2px solid rgba(242,234,214,0.35)",
              padding: "14px 28px",
              fontSize: 26,
            }}
          >
            Moon · {moonSign}
          </div>
        </div>

        {!giftedSubject && (
          <span style={{ fontSize: 28, lineHeight: 1.4, color: "rgba(242,234,214,0.8)" }}>
            A truly individual mix — the full reading unpacks what makes{" "}
            {childName} unique.
          </span>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          position: "absolute",
          left: 72,
          right: 72,
          bottom: 72,
          paddingTop: 40,
          borderTop: "2px solid rgba(242,234,214,0.2)",
        }}
      >
        <span style={{ fontSize: 26, color: "rgba(242,234,214,0.75)", textAlign: "center" }}>
          Free chart. Real, honest insights.
        </span>
        <div
          style={{
            display: "flex",
            borderRadius: 999,
            background: "#c25f3d",
            color: "#14201a",
            fontSize: 28,
            fontWeight: 700,
            padding: "16px 40px",
          }}
        >
          littlestargazer.com
        </div>
      </div>
    </div>
  );
}
