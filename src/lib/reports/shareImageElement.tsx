import { ChartWheel } from "@/components/ChartWheel";
import { StarIcon } from "@/components/icons";

export interface ShareImageData {
  childName: string;
  ascendant: string;
  moonSign: string;
  strengthTitle?: string;
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
  strengthTitle,
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
          gap: 40,
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
          {childName} chart snapshot
        </span>

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

        {strengthTitle && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              borderRadius: 24,
              background: "rgba(242,234,214,0.08)",
              border: "1px solid rgba(242,234,214,0.18)",
              padding: "44px 40px",
            }}
          >
            <span
              style={{
                fontSize: 24,
                fontWeight: 600,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: "#c25f3d",
              }}
            >
              Natural strength
            </span>
            <span style={{ fontSize: 54, fontWeight: 700, lineHeight: 1.15 }}>
              {strengthTitle}
            </span>
          </div>
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
