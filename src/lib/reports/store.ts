import "server-only";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/types";
import type { BirthChart } from "@/lib/astro/types";
import type { EducationInsights, LearningPathway } from "@/lib/education/types";
import type { GentleRemedy } from "@/lib/education/remedies";

export type ReportTier = "full" | "premium";

export interface ReportMeta {
  placeLabel: string;
  dob: string;
  birthTime: string;
  timeUnknown: boolean;
  ascendant: string;
  moonSign: string;
  moonNakshatra: string;
}

export interface SavedReport {
  id: string;
  createdAt: string;
  chart: BirthChart;
  insights: EducationInsights;
  pathway: LearningPathway | null;
  remedies: GentleRemedy[] | null;
  meta: ReportMeta;
  tier: ReportTier | null;
}

export interface SaveReportInput {
  childName: string;
  dob: string;
  birthTime: string;
  timeUnknown: boolean;
  placeLabel: string;
  latitude: number;
  longitude: number;
  chart: BirthChart;
  insights: EducationInsights;
  pathway: LearningPathway | null;
  remedies: GentleRemedy[] | null;
  meta: ReportMeta;
}

export async function saveReport(input: SaveReportInput): Promise<string> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("reports")
    .insert({
      child_name: input.childName,
      dob: input.dob,
      birth_time: input.birthTime,
      time_unknown: input.timeUnknown,
      place_label: input.placeLabel,
      latitude: input.latitude,
      longitude: input.longitude,
      chart: input.chart as unknown as Json,
      insights: input.insights as unknown as Json,
      pathway: input.pathway as unknown as Json | null,
      remedies: input.remedies as unknown as Json | null,
      meta: input.meta as unknown as Json,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(`Could not save this reading: ${error?.message ?? "unknown error"}`);
  }

  return data.id as string;
}

export async function getReport(id: string): Promise<SavedReport | null> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("reports")
    .select("id, created_at, chart, insights, pathway, remedies, meta, tier")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id as string,
    createdAt: data.created_at as string,
    chart: data.chart as unknown as BirthChart,
    insights: data.insights as unknown as EducationInsights,
    pathway: (data.pathway as unknown as LearningPathway | null) ?? null,
    remedies: (data.remedies as unknown as GentleRemedy[] | null) ?? null,
    meta: data.meta as unknown as ReportMeta,
    tier: data.tier,
  };
}

/**
 * Marks a report as purchased at the given tier. Idempotent -- safe to
 * call more than once for the same report (the webhook and the
 * return-from-Stripe verification path can both race to call this).
 * Never downgrades an existing tier (e.g. a premium report re-verified
 * against a full-tier session keeps premium).
 */
export async function markReportTier(
  id: string,
  tier: ReportTier,
  stripeCheckoutSessionId: string,
): Promise<void> {
  const supabase = getSupabaseServerClient();

  const existing = await getReport(id);
  if (!existing) throw new Error("Report not found");
  if (existing.tier === "premium") return;
  if (existing.tier === tier) return;

  const { error } = await supabase
    .from("reports")
    .update({ tier, stripe_checkout_session_id: stripeCheckoutSessionId })
    .eq("id", id);

  if (error) {
    throw new Error(`Could not update report tier: ${error.message}`);
  }
}
