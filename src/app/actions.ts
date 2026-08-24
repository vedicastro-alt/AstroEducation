"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { computeBirthChart } from "@/lib/astro/chart";
import { buildEducationInsights } from "@/lib/education/engine";
import { buildLearningPathway } from "@/lib/education/pathway";
import { geocodePlace, resolveBirthInstant, type GeocodeResult } from "@/lib/geo/resolve";
import { saveReport, type ReportMeta } from "@/lib/reports/store";

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
    birthTime: z.string().optional().default(""),
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
    birthTime: formData.get("birthTime")?.toString() ?? "",
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

  let reportId: string;
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

    const insights = buildEducationInsights(chart, data.childName);
    const pathway = buildLearningPathway(chart, data.dob, insights.childName);
    const moon = chart.planets.find((p) => p.key === "Moon")!;

    const meta: ReportMeta = {
      placeLabel: data.placeLabel,
      dob: data.dob,
      birthTime: effectiveTime,
      timeUnknown,
      ascendant: `${chart.ascendant.name} (${chart.ascendant.english})`,
      moonSign: `${moon.rashi.name} (${moon.rashi.english})`,
      moonNakshatra: moon.nakshatra.name,
    };

    reportId = await saveReport({
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
      meta,
    });
  } catch (err) {
    return {
      status: "error",
      error:
        err instanceof Error
          ? err.message
          : "Something went wrong while reading the chart. Please try again.",
    };
  }

  redirect(`/report/${reportId}`);
}
