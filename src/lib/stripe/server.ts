import "server-only";
import Stripe from "stripe";
import * as Sentry from "@sentry/nextjs";
import type { ReportTier } from "@/lib/reports/store";

let cachedClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (cachedClient) return cachedClient;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Stripe is not configured: set STRIPE_SECRET_KEY.");
  }

  cachedClient = new Stripe(secretKey);
  return cachedClient;
}

const VERIFY_RETRY_ATTEMPTS = 3;
const VERIFY_RETRY_DELAY_MS = 700;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Best-effort, immediate confirmation path for a parent returning from
 * Stripe Checkout -- lets the report page unlock without waiting on
 * webhook delivery. Not the source of truth on its own: it re-fetches
 * the session from Stripe (never trusts the query string) and the
 * webhook remains the authoritative path if this is ever missed (e.g.
 * the tab closes before the redirect completes).
 *
 * Stripe can redirect to success_url a moment before the session's own
 * payment_status has actually flipped to "paid" -- observed in practice
 * as a parent landing back on the locked report right after paying,
 * with the reading only unlocking a little later (once the webhook, or
 * a second visit, catches up). Retrying a few times with a short delay
 * closes that window in the common case instead of always falling back
 * to "not yet paid" on the very first check.
 */
export async function verifyCheckoutSession(
  sessionId: string,
): Promise<{ reportId: string; tier: ReportTier } | null> {
  const stripe = getStripeClient();

  for (let attempt = 1; attempt <= VERIFY_RETRY_ATTEMPTS; attempt++) {
    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (err) {
      // A real API/config error (bad session id, wrong key) won't be
      // fixed by retrying -- report it and stop, don't loop on it.
      Sentry.captureException(err);
      return null;
    }

    if (session.payment_status === "paid") {
      const reportId = session.metadata?.reportId;
      const tier = session.metadata?.tier;
      if (!reportId || (tier !== "full" && tier !== "premium")) return null;
      return { reportId, tier };
    }

    if (attempt < VERIFY_RETRY_ATTEMPTS) {
      await delay(VERIFY_RETRY_DELAY_MS);
    }
  }

  // Genuinely not paid yet after retrying -- not necessarily an error
  // (the customer may have abandoned checkout), but worth visibility
  // since this is the one case that used to fail completely silently.
  Sentry.captureMessage("verifyCheckoutSession: payment not confirmed after retries", {
    level: "warning",
    extra: { sessionId },
  });
  return null;
}
