import { ImageResponse } from "next/og";
import { getReport } from "@/lib/reports/store";
import { topSubjectHighlight } from "@/lib/education/subjects";
import { buildShareImageElement, SHARE_IMAGE_SIZE } from "@/lib/reports/shareImageElement";

/**
 * A real, shareable "results" graphic generated from an actual reading --
 * genuine virality (HANDOFF §43 item 1), not fabricated social proof. Only
 * built for reports that have actually unlocked a full pathway (paid tier),
 * matching the founder's own framing of this as an artifact from a real
 * purchase rather than something the free preview hands out.
 *
 * Uses only the same chart/insights.childName/meta fields the free preview
 * page already renders unconditionally -- gating happens on the report's
 * `tier`, not on the data itself.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const report = await getReport(id);

  if (!report || !report.tier) {
    return new Response("Not found", { status: 404 });
  }

  const { insights, meta, chart } = report;
  const topSubject = topSubjectHighlight(chart);

  return new ImageResponse(
    buildShareImageElement({
      childName: insights.childName,
      ascendant: meta.ascendant,
      moonSign: meta.moonSign,
      // Only ever a real, earned superlative -- see the doc comment on
      // ShareImageData.giftedSubject for why a "steady"/"growing" top
      // subject is left off entirely rather than dressed up.
      giftedSubject:
        topSubject.tier === "flourishing"
          ? { name: topSubject.name, title: topSubject.title }
          : undefined,
    }),
    {
      ...SHARE_IMAGE_SIZE,
      headers: {
        "Content-Disposition": `attachment; filename="${insights.childName.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "reading"}-chart-snapshot.png"`,
      },
    },
  );
}
