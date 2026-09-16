"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getStripeClient } from "@/lib/stripe/server";
import { createPendingPack } from "@/lib/creditPacks/store";
import { findCreditPackOption } from "@/lib/pricing";
import { siteOrigin } from "@/lib/site";

const formSchema = z.object({
  size: z.coerce.number().int(),
  buyerEmail: z.string().trim().toLowerCase().email("Please enter a valid email address."),
});

export interface PackFormState {
  status: "idle" | "error";
  error?: string;
}

/**
 * Starts a credit-pack purchase -- a pending `credit_packs` row is
 * created before Checkout starts (mirrors `createPendingVoucher`), and
 * the webhook grants the actual credits once Stripe confirms payment.
 * Requires an email up front (unlike a normal reading purchase, where
 * it's optional): a pack has nothing to attach to yet -- no report, no
 * child -- so the buyer's email is the only thing that can later match
 * it to whichever reading redeems a credit.
 */
export async function createPackCheckoutSessionAction(
  _prevState: PackFormState,
  formData: FormData,
): Promise<PackFormState> {
  const parsed = formSchema.safeParse({
    size: formData.get("size")?.toString(),
    buyerEmail: formData.get("buyerEmail")?.toString(),
  });

  if (!parsed.success) {
    return {
      status: "error",
      error: parsed.error.issues[0]?.message ?? "Please check the form and try again.",
    };
  }

  const option = findCreditPackOption(parsed.data.size);
  if (!option) {
    return { status: "error", error: "That pack size isn't available." };
  }

  let packId: string;
  try {
    const created = await createPendingPack(parsed.data.buyerEmail, option.size, option.priceCents);
    packId = created.packId;
  } catch {
    return {
      status: "error",
      error: "We couldn't start this pack purchase just now — please try again in a moment.",
    };
  }

  const origin = await siteOrigin();
  const stripe = getStripeClient();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    allow_promotion_codes: true,
    customer_email: parsed.data.buyerEmail,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: option.priceCents,
          product_data: {
            name: `${option.size}-Reading Credit Pack`,
            description: `${option.size} full-tier reading credits, redeemable one at a time against any child's reading`,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/packs/purchased`,
    cancel_url: `${origin}/packs`,
    metadata: {
      kind: "creditPack",
      packId,
      buyerEmail: parsed.data.buyerEmail,
      packSize: String(option.size),
    },
  });

  if (!session.url) {
    return { status: "error", error: "Could not start checkout. Please try again." };
  }

  redirect(session.url);
}
