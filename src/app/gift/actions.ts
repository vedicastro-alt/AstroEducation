"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getStripeClient } from "@/lib/stripe/server";
import { createPendingVoucher } from "@/lib/giftVouchers/store";
import { PRICING_TIERS } from "@/lib/pricing";
import { siteOrigin } from "@/lib/site";

const formSchema = z.object({
  tier: z.enum(["full", "premium"]),
  recipientEmail: z.string().trim().toLowerCase().email("Please enter a valid email address."),
  recipientName: z.string().trim().max(60).optional().default(""),
  giftMessage: z.string().trim().max(200).optional().default(""),
});

export interface GiftFormState {
  status: "idle" | "error";
  error?: string;
}

/**
 * Starts a gift-voucher purchase -- deliberately not tied to any
 * `reportId`, since (unlike a normal purchase) no chart exists yet at
 * this point: the buyer doesn't have the recipient's birth details,
 * that's the whole reason this flow exists. A `gift_vouchers` row is
 * created as `pending` before Checkout starts (mirrors how a `reports`
 * row already exists pre-payment); the webhook flips it to `paid` and
 * emails the redemption code once Stripe confirms.
 */
export async function createGiftVoucherCheckoutSessionAction(
  _prevState: GiftFormState,
  formData: FormData,
): Promise<GiftFormState> {
  const parsed = formSchema.safeParse({
    tier: formData.get("tier")?.toString(),
    recipientEmail: formData.get("recipientEmail")?.toString(),
    recipientName: formData.get("recipientName")?.toString(),
    giftMessage: formData.get("giftMessage")?.toString(),
  });

  if (!parsed.success) {
    return {
      status: "error",
      error: parsed.error.issues[0]?.message ?? "Please check the form and try again.",
    };
  }

  const data = parsed.data;
  const tier = PRICING_TIERS[data.tier];

  let voucherId: string;
  try {
    const created = await createPendingVoucher({
      tier: data.tier,
      recipientEmail: data.recipientEmail,
      recipientName: data.recipientName || undefined,
      giftMessage: data.giftMessage || undefined,
    });
    voucherId = created.voucherId;
  } catch {
    return {
      status: "error",
      error: "We couldn't start this gift purchase just now — please try again in a moment.",
    };
  }

  const origin = await siteOrigin();
  const stripe = getStripeClient();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    allow_promotion_codes: true,
    line_items: [
      {
        price_data: {
          currency: tier.currency,
          unit_amount: tier.priceCents,
          product_data: {
            name: `Gift: ${tier.name}`,
            description: `A gift reading for ${data.recipientName || "someone special"} — redeemed at littlestargazer.com/redeem`,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/gift/sent`,
    cancel_url: `${origin}/gift`,
    metadata: { kind: "giftVoucher", voucherId },
  });

  if (!session.url) {
    return { status: "error", error: "Could not start checkout. Please try again." };
  }

  redirect(session.url);
}
