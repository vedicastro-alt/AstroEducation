"use server";

import * as Sentry from "@sentry/nextjs";
import { z } from "zod";
import { sendEmail } from "@/lib/email/resend";

const SUPPORT_INBOX = "contact@littlestargazer.com";

export interface SupportFormState {
  status: "idle" | "done" | "error";
  error?: string;
}

const formSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email address."),
  message: z.string().trim().min(10, "Please add a few more details.").max(4000),
  // Honeypot: real visitors never see or fill this field (hidden via CSS).
  // A bot that fills every input trips it; we still show the normal
  // success message so the bot has no signal it was caught.
  website: z.string().max(0).optional().or(z.literal("")),
});

// Best-effort, in-memory throttle -- same tradeoff as the resend-reading
// flow (low-volume project, serverless, resets on cold start).
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

export async function submitSupportRequestAction(
  _prevState: SupportFormState,
  formData: FormData,
): Promise<SupportFormState> {
  const parsed = formSchema.safeParse({
    email: formData.get("email")?.toString() ?? "",
    message: formData.get("message")?.toString() ?? "",
    website: formData.get("website")?.toString() ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      error: parsed.error.issues[0]?.message ?? "Please check the form and try again.",
    };
  }

  const { email, message, website } = parsed.data;

  // Honeypot tripped -- pretend it worked, don't send anything.
  if (website) {
    return { status: "done" };
  }

  if (isThrottled(email)) {
    return { status: "done" };
  }

  try {
    await sendEmail({
      to: SUPPORT_INBOX,
      replyTo: email,
      subject: `Support request from ${email}`,
      text: message,
      html: `<p>${message.replace(/\n/g, "<br>")}</p>`,
    });
  } catch (err) {
    console.error("submitSupportRequestAction: failed to send", err);
    Sentry.captureException(err);
    return {
      status: "error",
      error: "We couldn't send that just now — please try again in a moment, or email contact@littlestargazer.com directly.",
    };
  }

  return { status: "done" };
}
