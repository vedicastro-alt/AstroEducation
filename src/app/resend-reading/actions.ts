"use server";

import * as Sentry from "@sentry/nextjs";
import { z } from "zod";
import { findPaidReportsByEmail } from "@/lib/reports/store";
import { sendEmail } from "@/lib/email/resend";
import { PRICING_TIERS } from "@/lib/pricing";
import { siteOrigin } from "@/lib/site";

export interface ResendReadingFormState {
  status: "idle" | "done" | "error";
  error?: string;
}

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Please enter a valid email address.");

// Best-effort, in-memory throttle against naive scripted abuse -- this is
// a low-volume project on serverless infrastructure, so a persistent
// rate-limit store would be overkill. It resets on every cold
// start/deploy; that's an accepted tradeoff, not a guarantee.
const lastRequestAt = new Map<string, number>();
const THROTTLE_WINDOW_MS = 60_000;

function isThrottled(email: string): boolean {
  const now = Date.now();
  const last = lastRequestAt.get(email);
  if (last !== undefined && now - last < THROTTLE_WINDOW_MS) return true;

  lastRequestAt.set(email, now);
  if (lastRequestAt.size > 500) {
    for (const [key, ts] of lastRequestAt) {
      if (now - ts > THROTTLE_WINDOW_MS) lastRequestAt.delete(key);
    }
  }
  return false;
}

export async function resendReadingAction(
  _prevState: ResendReadingFormState,
  formData: FormData,
): Promise<ResendReadingFormState> {
  const parsed = emailSchema.safeParse(formData.get("email")?.toString() ?? "");
  if (!parsed.success) {
    return { status: "error", error: parsed.error.issues[0]?.message ?? "Please check your email address." };
  }

  const email = parsed.data;

  // Always return the same generic message whether or not a match was
  // found, and only actually send mail on a real match -- this endpoint
  // must never be usable to confirm whether an email exists in the
  // system, or as a bulk-mailer against arbitrary addresses.
  if (isThrottled(email)) {
    return { status: "done" };
  }

  try {
    const reports = await findPaidReportsByEmail(email);
    if (reports.length > 0) {
      const origin = await siteOrigin();
      const lines = reports.map((r) => {
        const tierName = PRICING_TIERS[r.tier].name;
        const link = `${origin}/report/${r.id}`;
        return { tierName, link };
      });

      const textLines = lines.map((l) => `${l.tierName}: ${l.link}`).join("\n");
      const htmlLines = lines
        .map((l) => `<li><strong>${l.tierName}</strong> — <a href="${l.link}">${l.link}</a></li>`)
        .join("");

      await sendEmail({
        to: email,
        subject: "Your Little Stargazers reading link",
        text: `Here's the link to your reading, as requested:\n\n${textLines}\n\nIf you didn't request this, you can safely ignore this email.`,
        html: `<p>Here's the link to your reading, as requested:</p><ul>${htmlLines}</ul><p>If you didn't request this, you can safely ignore this email.</p>`,
      });
    }
  } catch (err) {
    // A send failure or lookup error must not leak into the generic
    // response -- log it for us, keep the visitor-facing message the same.
    console.error("resendReadingAction: failed to process request", err);
    Sentry.captureException(err);
  }

  return { status: "done" };
}
