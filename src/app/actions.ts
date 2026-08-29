"use server";

import { redirect } from "next/navigation";
import * as Sentry from "@sentry/nextjs";
import { z } from "zod";
import { computeBirthChart } from "@/lib/astro/chart";
import { ageBandFromAge, ageInYears } from "@/lib/education/age";
import { buildEducationInsights } from "@/lib/education/engine";
import { buildLearningPathway } from "@/lib/education/pathway";
import { buildGentleRemedies } from "@/lib/education/remedies";
import { geocodePlace, resolveBirthInstant, type GeocodeResult } from "@/lib/geo/resolve";
import { saveReport, type ReportMeta, type SaveReportInput } from "@/lib/reports/store";

export async function searchPlacesAction(query: string): Promise<GeocodeResult[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    return await geocodePlace(query);
  } catch {
    return [];
  }
}

const formSchema = z
  .object({
    childName: z.string().trim().max(60).optional().default(""),
    dob: z.string().refine((v) => !Number.isNaN(Date.parse(v)), {
      message: "Please enter a valid date of birth.",
    }),
    timeUnknown: z.string().optional(),
    isGift: z.string().optional(),
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

export interface ReportFormState {
  status: "idle" | "error";
  error?: string;
}

export async function generateReportAction(
  _prevState: ReportFormState,
  formData: FormData,
): Promise<ReportFormState> {
  const raw = {
    childName: formData.get("childName")?.toString() ?? "",
    dob: formData.get("dob")?.toString() ?? "",
    timeUnknown: formData.get("timeUnknown")?.toString(),
    isGift: formData.get("isGift")?.toString(),
    birthTime: formData.get("birthTime")?.toString() ?? "",
    decisionFocus: formData.get("decisionFocus")?.toString() ?? "",
    placeLabel: formData.get("placeLabel")?.toString() ?? "",
    placeLat: formData.get("placeLat")?.toString() ?? "",
    placeLon: formData.get("placeLon")?.toString() ?? "",
  };

  const parsed = formSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      error: parsed.error.issues[0]?.message ?? "Please check the form and try again.",
    };
  }

  const data = parsed.data;
  const timeUnknown = data.timeUnknown === "on";
  const effectiveTime = timeUnknown ? "12:00" : data.birthTime;

  // Chart computation and saving are deliberately separate try/catch
  // blocks: a computation error (e.g. an unresolvable date/time) has a
  // safe, already-user-friendly message worth showing verbatim, but a
  // save failure could be anything from the database layer -- that
  // message must never reach the parent directly, since it may contain
  // raw infrastructure detail.
  let saveInput: SaveReportInput;
  try {
    const { utcDate } = resolveBirthInstant(
      data.placeLat,
      data.placeLon,
      data.dob,
      effectiveTime,
    );

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
    const moon = chart.planets.find((p) => p.key === "Moon")!;

    const meta: ReportMeta = {
      placeLabel: data.placeLabel,
      dob: data.dob,
      birthTime: effectiveTime,
      timeUnknown,
      ascendant: `${chart.ascendant.name} (${chart.ascendant.english})`,
      moonSign: `${moon.rashi.name} (${moon.rashi.english})`,
      moonNakshatra: moon.nakshatra.name,
      isGift: data.isGift === "on",
    };

    saveInput = {
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
      meta,
    };
  } catch (err) {
    console.error("generateReportAction: failed to compute chart", err);
    Sentry.captureException(err);
    return {
      status: "error",
      error:
        err instanceof Error
          ? err.message
          : "Something went wrong while reading the chart. Please try again.",
    };
  }

  let reportId: string;
  try {
    reportId = await saveReport(saveInput);
  } catch (err) {
    console.error("generateReportAction: failed to save report", err);
    Sentry.captureException(err);
    return {
      status: "error",
      error: "We couldn't save this reading just now — please try again in a moment.",
    };
  }

  redirect(`/report/${reportId}`);
}
