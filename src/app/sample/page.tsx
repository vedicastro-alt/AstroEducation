import type { Metadata } from "next";
import Link from "next/link";
import { computeBirthChart } from "@/lib/astro/chart";
import { ageBandFromAge, ageInYears } from "@/lib/education/age";
import { buildEducationInsights } from "@/lib/education/engine";
import { buildLearningPathway } from "@/lib/education/pathway";
import { buildGentleRemedies } from "@/lib/education/remedies";
import { buildCareerDeepDive } from "@/lib/education/careerDeepDive";
import { SampleReadingTabs, type SampleChild } from "@/components/SampleReadingTabs";
import type { ReportMeta } from "@/lib/reports/store";

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
function buildSampleChild(input: {
  key: string;
  label: string;
  blurb: string;
  childName: string;
  utcDate: Date;
  latitude: number;
  longitude: number;
  dob: string;
  birthTime: string;
  placeLabel: string;
}): SampleChild {
  const chart = computeBirthChart({
    utcDate: input.utcDate,
    latitude: input.latitude,
    longitude: input.longitude,
    timeWasEstimated: false,
  });
  const ageBand = ageBandFromAge(ageInYears(input.dob));
  const insights = buildEducationInsights(chart, input.childName, ageBand);
  const pathway = buildLearningPathway(chart, input.dob, insights.childName);
  const remedies = buildGentleRemedies(chart, insights.childName);
  const careerDeepDive = buildCareerDeepDive(chart, insights.childName);
  const moon = chart.planets.find((p) => p.key === "Moon")!;

  const meta: ReportMeta = {
    placeLabel: input.placeLabel,
    dob: input.dob,
    birthTime: input.birthTime,
    timeUnknown: false,
    ascendant: `${chart.ascendant.name} (${chart.ascendant.english})`,
    moonSign: `${moon.rashi.name} (${moon.rashi.english})`,
    moonNakshatra: moon.nakshatra.name,
  };

  return {
    key: input.key,
    label: input.label,
    blurb: input.blurb,
    reportId: `sample-${input.key}`,
    chart,
    insights,
    pathway,
    remedies,
    careerDeepDive,
    meta,
  };
}

function buildSampleChildren(): SampleChild[] {
  return [
    buildSampleChild({
      key: "maya",
      label: "Maya, age 9",
      blurb: "Arts & storytelling-led",
      childName: "Maya",
      utcDate: new Date(Date.UTC(2017, 6, 14, 23, 10)),
      latitude: -33.8688,
      longitude: 151.2093,
      dob: "2017-07-15",
      birthTime: "09:10",
      placeLabel: "Sydney, Australia",
    }),
    buildSampleChild({
      key: "kai",
      label: "Kai, age 4",
      blurb: "Maths & builder-brain-led",
      childName: "Kai",
      utcDate: new Date(Date.UTC(2021, 9, 20, 12, 45)),
      latitude: -27.4698,
      longitude: 153.0251,
      dob: "2021-10-20",
      birthTime: "22:45",
      placeLabel: "Brisbane, Australia",
    }),
    buildSampleChild({
      key: "zoe",
      label: "Zoe, age 15",
      blurb: "Science & communication-led",
      childName: "Zoe",
      utcDate: new Date(Date.UTC(2011, 8, 2, 9, 30)),
      latitude: -34.9285,
      longitude: 138.6007,
      dob: "2011-09-02",
      birthTime: "19:00",
      placeLabel: "Adelaide, Australia",
    }),
  ];
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
