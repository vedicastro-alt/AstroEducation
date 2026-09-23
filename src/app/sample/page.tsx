import type { Metadata } from "next";
import Link from "next/link";
import { SAMPLE_CHILD_DEFS, buildSampleReportData } from "@/lib/reports/sampleReadings";
import { SampleReadingTabs, type SampleChild } from "@/components/SampleReadingTabs";

export const metadata: Metadata = {
  title: "See 3 sample readings — Little Stargazers",
  description:
    "Three full example Vedic learning-pathway readings — different ages, different strength profiles — so you can see exactly what you'd get before you buy.",
};

/**
 * Fixed, realistic examples -- not live users' data. Each is computed the
 * same way any real reading is (real chart, real engine), so what a
 * visitor sees here is genuinely representative of the paid product.
 * Birth details were hand-picked (via a disposable exploration script, not
 * committed) to land in genuinely different age bands and top-4 "comes
 * naturally" subjects, per HANDOFF §55 item C1 / §53 item 1 -- previously
 * this page showed only one fixed child, which every outside persona
 * flagged as reason to distrust the $25 price ("is this just a template
 * with the name swapped in?").
 */
function buildSampleChildren(): SampleChild[] {
  return SAMPLE_CHILD_DEFS.map((def) => {
    const data = buildSampleReportData(def);
    return {
      key: def.key,
      label: def.label,
      blurb: def.blurb,
      reportId: `sample-${def.key}`,
      tier: def.tier,
      chart: data.chart,
      insights: data.insights,
      pathway: data.pathway,
      remedies: data.remedies,
      careerDeepDive: data.careerDeepDive,
      meta: data.meta,
    };
  });
}

export default function SampleReadingPage() {
  const readings = buildSampleChildren();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <div className="no-print mb-8 rounded-md border border-accent/25 bg-accent-soft px-5 py-4 text-center">
        <p className="text-sm font-medium text-accent">
          Three sample readings for three made-up children — different ages,
          different strength profiles, each computed from a real chart the
          same way yours would be — so you can see what a full reading
          actually looks like before you buy one.
        </p>
        <Link
          href="/report"
          className="mt-2 inline-block text-sm font-semibold text-primary-dark underline underline-offset-2 hover:text-primary"
        >
          Get your child&apos;s real reading →
        </Link>
      </div>
      <SampleReadingTabs readings={readings} />
      <div className="no-print mt-12 text-center">
        <Link
          href="/report"
          className="inline-block rounded-sm bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-dark"
        >
          Get your child&apos;s free reading
        </Link>
      </div>
    </div>
  );
}
