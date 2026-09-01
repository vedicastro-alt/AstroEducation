import "server-only";
import { z } from "zod";
import { computeBirthChart } from "@/lib/astro/chart";
import { ageBandFromAge, ageInYears } from "@/lib/education/age";
import { buildEducationInsights } from "@/lib/education/engine";
import { buildLearningPathway } from "@/lib/education/pathway";
import { buildGentleRemedies } from "@/lib/education/remedies";
import { buildCareerDeepDive } from "@/lib/education/careerDeepDive";
import { resolveBirthInstant } from "@/lib/geo/resolve";
import type { ReportMeta, SaveReportInput } from "./store";

/**
 * Shared by the free intake form (`src/app/actions.ts`) and gift-voucher
 * redemption (`src/app/redeem/[code]/actions.ts`) -- both collect the
 * same child birth details and need to build the exact same chart and
 * report content from them. Kept as one schema and one computation path
 * deliberately: this project has been bitten before by two similar
 * pieces of logic quietly drifting apart (see HANDOFF §19's
 * architectural lesson), and birth-detail validation/chart computation
 * is exactly the kind of thing that's easy to accidentally tweak in one
 * call site and not the other.
 */
export const birthDetailsSchema = z
  .object({
    childName: z.string().trim().max(60).optional().default(""),
    dob: z.string().refine((v) => !Number.isNaN(Date.parse(v)), {
      message: "Please enter a valid date of birth.",
    }),
    timeUnknown: z.string().optional(),
    birthTime: z.string().optional().default(""),
    decisionFocus: z.string().trim().max(300).optional().default(""),
    placeLabel: z.string().trim().min(1, "Please choose a birth place from the list."),
    placeLat: z.coerce.number().min(-90).max(90),
    placeLon: z.coerce.number().min(-180).max(180),
  })
  .refine(
    (data) => {
      const dob = new Date(data.dob + "T00:00:00Z");
      return dob.getTime() <= Date.now();
    },
    { message: "Date of birth can't be in the future.", path: ["dob"] },
  )
  .refine(
    (data) => {
      const dob = new Date(data.dob + "T00:00:00Z");
      const hundredYearsAgo = new Date();
      hundredYearsAgo.setFullYear(hundredYearsAgo.getFullYear() - 100);
      return dob >= hundredYearsAgo;
    },
    { message: "Please enter a date of birth within the last 100 years.", path: ["dob"] },
  )
  .refine(
    (data) => {
      if (data.timeUnknown === "on") return true;
      return /^([01]\d|2[0-3]):([0-5]\d)$/.test(data.birthTime);
    },
    { message: "Please enter a valid birth time, or check 'I'm not sure'.", path: ["birthTime"] },
  );

export type BirthDetails = z.infer<typeof birthDetailsSchema>;

/**
 * Pure(ish) computation -- chart, insights, pathway, remedies, and the
 * career deep-dive -- from validated birth details. No I/O; callers are
 * responsible for `saveReport` and their own error handling, since the
 * two call sites want different user-facing error messages and
 * different post-save steps (redirect vs. redeem-and-unlock).
 */
export function computeReportPayload(data: BirthDetails, isGift: boolean): SaveReportInput {
  const timeUnknown = data.timeUnknown === "on";
  const effectiveTime = timeUnknown ? "12:00" : data.birthTime;

  const { utcDate } = resolveBirthInstant(data.placeLat, data.placeLon, data.dob, effectiveTime);

  const chart = computeBirthChart({
    utcDate,
    latitude: data.placeLat,
    longitude: data.placeLon,
    timeWasEstimated: timeUnknown,
  });

  const ageBand = ageBandFromAge(ageInYears(data.dob));
  const insights = buildEducationInsights(chart, data.childName, ageBand);
  const pathway = buildLearningPathway(
    chart,
    data.dob,
    insights.childName,
    new Date(),
    data.decisionFocus || undefined,
  );
  const remedies = buildGentleRemedies(chart, insights.childName);
  const careerDeepDive = buildCareerDeepDive(chart, insights.childName);
  const moon = chart.planets.find((p) => p.key === "Moon")!;

  const meta: ReportMeta = {
    placeLabel: data.placeLabel,
    dob: data.dob,
    birthTime: effectiveTime,
    timeUnknown,
    ascendant: `${chart.ascendant.name} (${chart.ascendant.english})`,
    moonSign: `${moon.rashi.name} (${moon.rashi.english})`,
    moonNakshatra: moon.nakshatra.name,
    isGift,
  };

  return {
    childName: insights.childName,
    dob: data.dob,
    birthTime: effectiveTime,
    timeUnknown,
    placeLabel: data.placeLabel,
    latitude: data.placeLat,
    longitude: data.placeLon,
    chart,
    insights,
    pathway,
    remedies,
    careerDeepDive,
    meta,
  };
}
