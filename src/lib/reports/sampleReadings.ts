import { computeBirthChart } from "@/lib/astro/chart";
import { ageBandFromAge, ageInYears } from "@/lib/education/age";
import { buildEducationInsights } from "@/lib/education/engine";
import { buildLearningPathway } from "@/lib/education/pathway";
import { buildGentleRemedies, type GentleRemedy } from "@/lib/education/remedies";
import { buildCareerDeepDive, type CareerDeepDiveItem } from "@/lib/education/careerDeepDive";
import type { BirthChart } from "@/lib/astro/types";
import type { EducationInsights, LearningPathway } from "@/lib/education/types";
import type { ReportMeta, ReportTier } from "@/lib/reports/store";

/**
 * Single source of truth for the fixed, made-up children shown at
 * `/sample` -- also used directly by the share-image route (see
 * `sampleReportIdToKey` below) so the "download image" card on a sample
 * reading actually produces a real image instead of 404ing, which it did
 * before this existed: `/report/[id]/share-image` only ever looked a
 * report up in Supabase, and a sample child was never saved there.
 *
 * One of the three is deliberately kept at the `full` ($25) tier and the
 * other two at `premium` ($35) -- founder feedback from live testing:
 * showing all three at premium meant a visitor never saw what the
 * cheaper tier's paywall/upsell actually looks like before buying.
 */
export interface SampleChildDef {
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
  tier: ReportTier;
}

export const SAMPLE_CHILD_DEFS: SampleChildDef[] = [
  {
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
    tier: "full",
  },
  {
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
    tier: "premium",
  },
  {
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
    tier: "premium",
  },
];

export interface SampleReportData {
  def: SampleChildDef;
  chart: BirthChart;
  insights: EducationInsights;
  pathway: LearningPathway;
  remedies: GentleRemedy[];
  careerDeepDive: CareerDeepDiveItem[];
  meta: ReportMeta;
}

export function findSampleChildDef(key: string): SampleChildDef | undefined {
  return SAMPLE_CHILD_DEFS.find((d) => d.key === key);
}

/** `/report/[id]/share-image`'s id param -> the sample key, or null for a real (Supabase-backed) report id. */
export function sampleReportIdToKey(reportId: string): string | null {
  return reportId.startsWith("sample-") ? reportId.slice("sample-".length) : null;
}

export function buildSampleReportData(def: SampleChildDef): SampleReportData {
  const chart = computeBirthChart({
    utcDate: def.utcDate,
    latitude: def.latitude,
    longitude: def.longitude,
    timeWasEstimated: false,
  });
  const ageBand = ageBandFromAge(ageInYears(def.dob));
  const insights = buildEducationInsights(chart, def.childName, ageBand);
  const pathway = buildLearningPathway(chart, def.dob, insights.childName);
  const remedies = buildGentleRemedies(chart, insights.childName);
  const careerDeepDive = buildCareerDeepDive(chart, insights.childName);
  const moon = chart.planets.find((p) => p.key === "Moon")!;

  const meta: ReportMeta = {
    placeLabel: def.placeLabel,
    dob: def.dob,
    birthTime: def.birthTime,
    timeUnknown: false,
    ascendant: `${chart.ascendant.name} (${chart.ascendant.english})`,
    moonSign: `${moon.rashi.name} (${moon.rashi.english})`,
    moonNakshatra: moon.nakshatra.name,
  };

  return { def, chart, insights, pathway, remedies, careerDeepDive, meta };
}
