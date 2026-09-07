"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as Sentry from "@sentry/nextjs";
import { z } from "zod";
import { createMagicLinkToken } from "@/lib/auth/magicLink";
import { sendMyReadingsLoginEmail } from "@/lib/email/readingEmail";
import { siteOrigin } from "@/lib/site";

export interface MyReadingsLoginFormState {
  status: "idle" | "done" | "error";
  error?: string;
}

const emailSchema = z.string().trim().toLowerCase().email("Please enter a valid email address.");

// Same posture as /resend-reading's throttle -- a low-volume project on
// serverless infrastructure, so an in-memory, best-effort map is enough;
// it resets on cold start, which is an accepted trade-off, not a
// guarantee.
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

/**
 * Sends a magic-link sign-in email. Unlike /resend-reading, this doesn't
 * need to hide whether the email has any reports -- the link itself
 * reveals nothing; only clicking through shows the (possibly empty)
 * dashboard. Still throttled and best-effort, same conventions as every
 * other transactional send in this codebase.
 */
export async function requestMyReadingsLoginAction(
  _prevState: MyReadingsLoginFormState,
  formData: FormData,
): Promise<MyReadingsLoginFormState> {
  const parsed = emailSchema.safeParse(formData.get("email")?.toString() ?? "");
  if (!parsed.success) {
    return { status: "error", error: parsed.error.issues[0]?.message ?? "Please check your email address." };
  }

  const email = parsed.data;
  if (isThrottled(email)) {
    return { status: "done" };
  }

  try {
    const origin = await siteOrigin();
    const token = createMagicLinkToken(email);
    const loginUrl = `${origin}/my-readings/verify?token=${encodeURIComponent(token)}`;
    await sendMyReadingsLoginEmail({ to: email, loginUrl });
  } catch (err) {
    console.error("requestMyReadingsLoginAction: failed to send login email", err);
    Sentry.captureException(err);
  }

  return { status: "done" };
}

export async function signOutOfMyReadingsAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("stargazer_session");
  redirect("/my-readings");
}
