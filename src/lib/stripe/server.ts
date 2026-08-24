import "server-only";
import Stripe from "stripe";
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

/**
 * Best-effort, immediate confirmation path for a parent returning from
 * Stripe Checkout -- lets the report page unlock without waiting on
 * webhook delivery. Not the source of truth on its own: it re-fetches
 * the session from Stripe (never trusts the query string) and the
 * webhook remains the authoritative path if this is ever missed (e.g.
 * the tab closes before the redirect completes).
 */
export async function verifyCheckoutSession(
  sessionId: string,
): Promise<{ reportId: string; tier: ReportTier } | null> {
  const stripe = getStripeClient();

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return null;
  }

  if (session.payment_status !== "paid") return null;

  const reportId = session.metadata?.reportId;
  const tier = session.metadata?.tier;
  if (!reportId || (tier !== "full" && tier !== "premium")) return null;

  return { reportId, tier };
}
