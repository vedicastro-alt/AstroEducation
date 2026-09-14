import { ImageResponse } from "next/og";
import { getReport } from "@/lib/reports/store";
import { topSubjectHighlight } from "@/lib/education/subjects";
import { buildShareImageElement, SHARE_IMAGE_SIZE, type ShareImageHighlight } from "@/lib/reports/shareImageElement";

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
  const subject = topSubjectHighlight(chart);

  // Three-tier fallback, most-earned first -- never dress up a weaker
  // signal as the headline just to always have "something." A subject
  // that genuinely reached `flourishing` is the strongest, most nameable
  // claim; a classical special combination (already surfaced honestly in
  // the free preview's own "special chart combination" chapter, §41) is
  // the next-best real, rare thing about this specific chart; absent
  // both, the card stays honest with just the two sign badges.
  let highlight: ShareImageHighlight | undefined;
  if (subject.tier === "flourishing") {
    highlight = {
      eyebrow: "Naturally gifted in",
      headline: subject.name,
      subtext: subject.title,
      rarityLine: `${subject.flourishingCount} of ${subject.total} core subjects shine this brightly in ${insights.childName}'s chart`,
    };
  } else if (insights.specialCombinations.length > 0) {
    const combo = insights.specialCombinations[0];
    highlight = {
      eyebrow: "A special chart combination",
      headline: combo.title,
      subtext: "A classical, named alignment — rare enough that most charts don't have one.",
    };
  }

  return new ImageResponse(
    buildShareImageElement({
      childName: insights.childName,
      ascendant: meta.ascendant,
      moonSign: meta.moonSign,
      highlight,
    }),
    {
      ...SHARE_IMAGE_SIZE,
      headers: {
        "Content-Disposition": `attachment; filename="${insights.childName.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "reading"}-chart-snapshot.png"`,
      },
    },
  );
}
