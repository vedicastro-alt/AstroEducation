import { ImageResponse } from "next/og";
import { getReport } from "@/lib/reports/store";
import { topSubjectHighlight } from "@/lib/education/subjects";
import { SUBJECT_ARCHETYPES } from "@/lib/reports/achievementArchetypes";
import { buildShareImageElement, SHARE_IMAGE_SIZE, type ShareImageHighlight } from "@/lib/reports/shareImageElement";
import { buildSampleReportData, findSampleChildDef, sampleReportIdToKey } from "@/lib/reports/sampleReadings";
import type { BirthChart } from "@/lib/astro/types";
import type { EducationInsights } from "@/lib/education/types";
import type { ReportMeta } from "@/lib/reports/store";

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

  // `/sample`'s made-up children are never saved to Supabase (there's no
  // real report row), so a plain `getReport` lookup 404s -- confirmed
  // live: the sample page's "download image" card didn't work even
  // though the identical card works for a real, saved reading. Build the
  // same chart/insights data `/sample` itself uses instead of querying
  // the database whenever the id names one of them.
  let chart: BirthChart;
  let insights: EducationInsights;
  let meta: ReportMeta;

  const sampleKey = sampleReportIdToKey(id);
  const sampleDef = sampleKey ? findSampleChildDef(sampleKey) : undefined;
  if (sampleDef) {
    const data = buildSampleReportData(sampleDef);
    chart = data.chart;
    insights = data.insights;
    meta = data.meta;
  } else {
    const report = await getReport(id);
    if (!report || !report.tier) {
      return new Response("Not found", { status: 404 });
    }
    chart = report.chart;
    insights = report.insights;
    meta = report.meta;
  }
  const subject = topSubjectHighlight(chart);
  const archetype = SUBJECT_ARCHETYPES[subject.id];

  // Every paid reading's top subject gets a real, personalized card --
  // never a claim it hasn't earned, but never an empty "nothing to show"
  // card either (HANDOFF §50: a paying customer whose chart simply
  // doesn't have a standout subject still has a *real* strongest-of-9
  // area, and that's worth celebrating on its own terms). `flourishing`
  // gets the full "gifted" gold framing; every other tier gets an
  // honest silver "rising talent" version of the same subject -- the
  // real-world analogy is a silver medal, not a participation ribbon.
  const highlight: ShareImageHighlight =
    subject.tier === "flourishing"
      ? {
          tone: "gold",
          certificateLabel: "Certificate of Natural Talent",
          icon: <archetype.Icon width={MEDAL_ICON_SIZE} height={MEDAL_ICON_SIZE} />,
          headline: archetype.title,
          category: subject.name,
          subtext: subject.title,
          rarityLine: `${subject.flourishingCount} of ${subject.total} core subjects shine this brightly in ${insights.childName}'s chart`,
        }
      : {
          tone: "silver",
          certificateLabel: "Certificate of Rising Talent",
          icon: <archetype.Icon width={MEDAL_ICON_SIZE} height={MEDAL_ICON_SIZE} />,
          headline: subject.name,
          subtext: subject.title,
          rarityLine: `${insights.childName}'s strongest of ${subject.total} tracked areas`,
        };

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
