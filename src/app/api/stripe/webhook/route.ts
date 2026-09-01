import type Stripe from "stripe";
import * as Sentry from "@sentry/nextjs";
import { getStripeClient } from "@/lib/stripe/server";
import { getReport, markReportTier, setReportCustomerEmail, type ReportTier } from "@/lib/reports/store";
import { markVoucherPaid } from "@/lib/giftVouchers/store";
import { sendGiftReadingEmail, sendReadingEmail } from "@/lib/email/readingEmail";
import { sendGiftVoucherEmails } from "@/lib/email/giftVoucherEmail";
import { siteOrigin } from "@/lib/site";

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

    if (session.metadata?.kind === "giftVoucher") {
      await handleGiftVoucherPaid(session);
    } else {
      await handleReportPurchase(session);
    }
  }

  return Response.json({ received: true });
}

async function handleReportPurchase(session: Stripe.Checkout.Session): Promise<void> {
  const reportId = session.metadata?.reportId;
  const tier = session.metadata?.tier as ReportTier | undefined;

  if (!reportId || (tier !== "full" && tier !== "premium") || session.payment_status !== "paid") {
    return;
  }

  await markReportTier(reportId, tier, session.id);

  const buyerEmail = session.customer_details?.email;
  if (buyerEmail) {
    await setReportCustomerEmail(reportId, buyerEmail);
  }

  // Email delivery is a nice-to-have layered on top of the purchase, not
  // the purchase itself -- a failure here must never look like a failed
  // webhook (Stripe retries a non-2xx response, which would re-run
  // markReportTier repeatedly for something that already succeeded).
  try {
    const report = await getReport(reportId);
    if (!report) return;

    const origin = await siteOrigin();
    const reportUrl = `${origin}/report/${reportId}`;
    const childName = report.insights.childName;

    const recipientEmail = session.metadata?.recipientEmail;
    if (recipientEmail) {
      await sendGiftReadingEmail({
        to: recipientEmail,
        recipientName: session.metadata?.recipientName || undefined,
        childName,
        reportUrl,
        tier,
        giftNote: session.metadata?.giftNote || undefined,
      });
      // The buyer still gets their own copy too, regardless of gift
      // delivery -- their record that the purchase went through, and a
      // fallback if the recipient's address bounces.
      if (buyerEmail) {
        await sendReadingEmail({ to: buyerEmail, childName, reportUrl, tier });
      }
    } else if (buyerEmail) {
      await sendReadingEmail({ to: buyerEmail, childName, reportUrl, tier });
    }
  } catch (err) {
    Sentry.captureException(err);
  }
}

async function handleGiftVoucherPaid(session: Stripe.Checkout.Session): Promise<void> {
  const voucherId = session.metadata?.voucherId;
  if (!voucherId || session.payment_status !== "paid") return;

  const buyerEmail = session.customer_details?.email;
  const voucher = await markVoucherPaid(voucherId, session.id, buyerEmail ?? null);
  if (!voucher) return;

  try {
    const origin = await siteOrigin();
    await sendGiftVoucherEmails({
      code: voucher.code,
      tier: voucher.tier,
      recipientEmail: voucher.recipientEmail,
      recipientName: voucher.recipientName,
      giftMessage: voucher.giftMessage,
      buyerEmail,
      redeemUrl: `${origin}/redeem/${voucher.code}`,
    });
  } catch (err) {
    Sentry.captureException(err);
  }
}
