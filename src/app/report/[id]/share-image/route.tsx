import { ImageResponse } from "next/og";
import { getReport } from "@/lib/reports/store";
import { topSubjectHighlight } from "@/lib/education/subjects";
import { SUBJECT_ARCHETYPES } from "@/lib/reports/achievementArchetypes";
import { buildShareImageElement, SHARE_IMAGE_SIZE, type ShareImageHighlight } from "@/lib/reports/shareImageElement";

const MEDAL_ICON_SIZE = 56;

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

  // Only ever the real, earned superlative -- a subject that genuinely
  // reached `flourishing`. A special-combination (classical yoga) tier
  // was tried here too, but dropped deliberately: yoga names are real
  // and honest, but jargon most parents wouldn't recognize or feel
  // comfortable posting -- worse for sharing than the plain fallback
  // it would have replaced. A chart with no flourishing subject gets the
  // honest plain version (badges + individuality line), never a dressed
  // up claim.
  let highlight: ShareImageHighlight | undefined;
  if (subject.tier === "flourishing") {
    const archetype = SUBJECT_ARCHETYPES[subject.id];
    highlight = {
      certificateLabel: "Certificate of Natural Talent",
      icon: <archetype.Icon width={MEDAL_ICON_SIZE} height={MEDAL_ICON_SIZE} />,
      headline: archetype.title,
      category: subject.name,
      subtext: subject.title,
      rarityLine: `${subject.flourishingCount} of ${subject.total} core subjects shine this brightly in ${insights.childName}'s chart`,
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
