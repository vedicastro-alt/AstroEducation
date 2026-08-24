"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getStripeClient } from "@/lib/stripe/server";
import { getReport } from "@/lib/reports/store";
import { PRICING_TIERS } from "@/lib/pricing";

async function siteOrigin(): Promise<string> {
  const hdrs = await headers();
  const host = hdrs.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export async function createCheckoutSessionAction(formData: FormData): Promise<void> {
  const reportId = formData.get("reportId")?.toString();
  const tierId = formData.get("tier")?.toString();

  if (!reportId || (tierId !== "full" && tierId !== "premium")) {
    throw new Error("Invalid checkout request.");
  }

  const report = await getReport(reportId);
  if (!report) {
    throw new Error("That reading could not be found.");
  }

  // Already own this tier (or better) -- nothing to buy, just go back.
  if (report.tier === "premium" || report.tier === tierId) {
    redirect(`/report/${reportId}`);
  }

  const tier = PRICING_TIERS[tierId];
  const origin = await siteOrigin();
  const stripe = getStripeClient();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: tier.currency,
          unit_amount: tier.priceCents,
          product_data: {
            name: tier.name,
            description: tier.tagline,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/report/${reportId}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/report/${reportId}`,
    client_reference_id: reportId,
    metadata: { reportId, tier: tierId },
  });

  if (!session.url) {
    throw new Error("Could not start checkout. Please try again.");
  }

  redirect(session.url);
}
