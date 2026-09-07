"use server";

import { redirect } from "next/navigation";
import * as Sentry from "@sentry/nextjs";
import { z } from "zod";
import { geocodePlace, type GeocodeResult } from "@/lib/geo/resolve";
import { saveReport, setReportCustomerEmail, submitReportFeedback, type ReportTier, type SaveReportInput } from "@/lib/reports/store";
import { birthDetailsSchema, computeReportPayload } from "@/lib/reports/buildReport";
import { sendFreeGiftReadingEmail } from "@/lib/email/readingEmail";
import { siteOrigin } from "@/lib/site";

export async function searchPlacesAction(query: string): Promise<GeocodeResult[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    return await geocodePlace(query);
  } catch {
    return [];
  }
}

const formSchema = birthDetailsSchema
  .and(
    z.object({
      isGift: z.string().optional(),
      recipientEmail: z.string().trim().toLowerCase().optional().default(""),
      recipientName: z.string().trim().max(60).optional().default(""),
      giftNote: z.string().trim().max(300).optional().default(""),
      // The *filler's own* email, entirely optional -- lets this and
      // any future report they create show up together in /my-readings
      // (see src/lib/auth/magicLink.ts). Deliberately separate from
      // recipientEmail above, which is someone else's address for the
      // gift-delivery flow.
      ownerEmail: z.string().trim().toLowerCase().optional().default(""),
    }),
  )
  .refine(
    (data) => data.isGift !== "on" || z.string().email().safeParse(data.recipientEmail).success,
    {
      message: "Please enter a valid email address for the gift recipient.",
      path: ["recipientEmail"],
    },
  )
  .refine((data) => !data.ownerEmail || z.string().email().safeParse(data.ownerEmail).success, {
    message: "Please enter a valid email address, or leave it blank.",
    path: ["ownerEmail"],
  });

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
    recipientEmail: formData.get("recipientEmail")?.toString() ?? "",
    recipientName: formData.get("recipientName")?.toString() ?? "",
    giftNote: formData.get("giftNote")?.toString() ?? "",
    ownerEmail: formData.get("ownerEmail")?.toString() ?? "",
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

  // Chart computation and saving are deliberately separate try/catch
  // blocks: a computation error (e.g. an unresolvable date/time) has a
  // safe, already-user-friendly message worth showing verbatim, but a
  // save failure could be anything from the database layer -- that
  // message must never reach the parent directly, since it may contain
  // raw infrastructure detail.
  let saveInput: SaveReportInput;
  try {
    saveInput = computeReportPayload(data, data.isGift === "on");
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

  // Best-effort: ties this report to the filler's own email for
  // /my-readings, if they gave one. A failure here must never block the
  // redirect -- the reading itself is already saved and viewable either
  // way, this is purely an added convenience.
  if (data.ownerEmail) {
    try {
      await setReportCustomerEmail(reportId, data.ownerEmail);
    } catch (err) {
      console.error("generateReportAction: failed to record owner email", err);
      Sentry.captureException(err);
    }
  }

  // Best-effort, layered on top of a report that's already saved
  // successfully -- a failed send must never look like the whole
  // submission failed (same posture as the webhook's own gift-email
  // send in api/stripe/webhook/route.ts).
  const isSendingGift = data.isGift === "on" && !!data.recipientEmail;
  if (isSendingGift) {
    try {
      const origin = await siteOrigin();
      await sendFreeGiftReadingEmail({
        to: data.recipientEmail,
        recipientName: data.recipientName || undefined,
        childName: saveInput.childName,
        reportUrl: `${origin}/report/${reportId}`,
        giftNote: data.giftNote || undefined,
      });
    } catch (err) {
      console.error("generateReportAction: failed to send gift email", err);
      Sentry.captureException(err);
    }
  }

  redirect(`/report/${reportId}${isSendingGift ? "?giftSent=1" : ""}`);
}

export interface FeedbackFormState {
  status: "idle" | "success" | "error";
  error?: string;
}

export async function submitFeedbackAction(
  _prevState: FeedbackFormState,
  formData: FormData,
): Promise<FeedbackFormState> {
  const reportId = formData.get("reportId")?.toString() ?? "";
  const tier = formData.get("tier")?.toString() ?? "";
  const message = formData.get("message")?.toString().trim().slice(0, 2000) ?? "";
  const ratingRaw = formData.get("rating")?.toString();
  const rating = ratingRaw ? Number(ratingRaw) : null;
  const okToFeature = formData.get("okToFeature")?.toString() === "on";

  if (!reportId || (tier !== "full" && tier !== "premium")) {
    return { status: "error", error: "Something went wrong — please try again." };
  }
  if (!message && !rating) {
    return { status: "error", error: "Add a note or a rating before sending." };
  }
  if (rating !== null && (Number.isNaN(rating) || rating < 1 || rating > 5)) {
    return { status: "error", error: "Something went wrong — please try again." };
  }

  try {
    await submitReportFeedback({
      reportId,
      tier: tier as ReportTier,
      rating,
      message,
      okToFeature,
    });
  } catch (err) {
    console.error("submitFeedbackAction: failed to save feedback", err);
    Sentry.captureException(err);
    return {
      status: "error",
      error: "We couldn't save that just now — please try again in a moment.",
    };
  }

  return { status: "success" };
}
