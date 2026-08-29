import type Stripe from "stripe";
import * as Sentry from "@sentry/nextjs";
import { getStripeClient } from "@/lib/stripe/server";
import { markReportTier, setReportCustomerEmail, type ReportTier } from "@/lib/reports/store";

/**
 * Authoritative payment confirmation path. The report page also
 * verifies a session directly on return from Stripe for immediate UX,
 * but that path is best-effort (e.g. a closed tab before redirect) --
 * this webhook is what's actually trusted long-term. Register this URL
 * (https://<domain>/api/stripe/webhook) in the Stripe Dashboard under
 * Developers -> Webhooks, subscribed to `checkout.session.completed`.
 */
export async function POST(request: Request): Promise<Response> {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return Response.json({ error: "Webhook not configured" }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripeClient();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    // A signature mismatch here (wrong/stale STRIPE_WEBHOOK_SECRET for
    // this environment, most often) previously only showed up if someone
    // went digging in the Stripe dashboard's webhook event log by hand --
    // report it so a misconfigured secret is visible in Sentry instead.
    Sentry.captureException(err);
    const message = err instanceof Error ? err.message : "Invalid signature";
    return Response.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const reportId = session.metadata?.reportId;
    const tier = session.metadata?.tier as ReportTier | undefined;

    if (reportId && (tier === "full" || tier === "premium") && session.payment_status === "paid") {
      await markReportTier(reportId, tier, session.id);

      const email = session.customer_details?.email;
      if (email) {
        await setReportCustomerEmail(reportId, email);
      }
    }
  }

  return Response.json({ received: true });
}
