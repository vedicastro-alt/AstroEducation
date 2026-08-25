import type { Metadata } from "next";
import Link from "next/link";
import { computeBirthChart } from "@/lib/astro/chart";
import { buildEducationInsights } from "@/lib/education/engine";
import { buildLearningPathway } from "@/lib/education/pathway";
import { buildGentleRemedies } from "@/lib/education/remedies";
import { ReportView } from "@/components/ReportView";
import type { ReportMeta } from "@/lib/reports/store";

export const metadata: Metadata = {
  title: "See a sample reading — Little Stargazers",
  description:
    "A full example Vedic learning-pathway reading, so you can see exactly what you'd get before you buy.",
};

/**
 * A fixed, realistic example -- not a live user's data. Computed the same
 * way any real reading is (real chart, real engine), so what a visitor
 * sees here is genuinely representative of the paid product.
 */
function buildSampleReport() {
  const chart = computeBirthChart({
    utcDate: new Date(Date.UTC(2017, 6, 14, 23, 10)),
    latitude: -33.8688,
    longitude: 151.2093,
    timeWasEstimated: false,
  });
  const insights = buildEducationInsights(chart, "Maya");
  const pathway = buildLearningPathway(chart, "2017-07-15", insights.childName);
  const remedies = buildGentleRemedies(chart, insights.childName);
  const moon = chart.planets.find((p) => p.key === "Moon")!;

  const meta: ReportMeta = {
    placeLabel: "Sydney, Australia",
    dob: "2017-07-15",
    birthTime: "09:10",
    timeUnknown: false,
    ascendant: `${chart.ascendant.name} (${chart.ascendant.english})`,
    moonSign: `${moon.rashi.name} (${moon.rashi.english})`,
    moonNakshatra: moon.nakshatra.name,
  };

  return { insights, pathway, remedies, meta };
}

export default function SampleReadingPage() {
  const { insights, pathway, remedies, meta } = buildSampleReport();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <div className="no-print mb-8 rounded-2xl border border-accent/25 bg-accent-soft px-5 py-4 text-center">
        <p className="text-sm font-medium text-accent">
          This is a sample reading for a made-up child, Maya, so you can see
          exactly what a full reading looks like before you buy one for your
          own.
        </p>
        <Link
          href="/report"
          className="mt-2 inline-block text-sm font-semibold text-primary-dark underline underline-offset-2 hover:text-primary"
        >
          Get your child&apos;s real reading →
        </Link>
      </div>
      <ReportView
        reportId="sample"
        insights={insights}
        pathway={pathway}
        remedies={remedies}
        tier="premium"
        meta={meta}
      />
      <div className="no-print mt-12 text-center">
        <Link
          href="/report"
          className="inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-dark"
        >
          Get your child&apos;s free reading
        </Link>
      </div>
    </div>
  );
}
