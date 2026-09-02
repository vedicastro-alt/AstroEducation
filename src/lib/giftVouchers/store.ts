import "server-only";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ReportTier } from "@/lib/reports/store";

export interface GiftVoucher {
  id: string;
  code: string;
  tier: ReportTier;
  buyerEmail: string | null;
  recipientEmail: string;
  recipientName: string | null;
  giftMessage: string | null;
  status: "pending" | "paid" | "redeemed";
}

// No 0/O/1/I -- a recipient may be typing this in by hand off a phone
// screen, so ambiguous-looking characters are excluded outright.
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 8;
const CODE_INSERT_ATTEMPTS = 5;

function generateCode(): string {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
}

export interface CreatePendingVoucherInput {
  tier: ReportTier;
  recipientEmail: string;
  recipientName?: string;
  giftMessage?: string;
}

/**
 * Creates the voucher row before Stripe Checkout even starts -- mirrors
 * how a `reports` row already exists before payment (see saveReport).
 * The code is generated now but only ever revealed to anyone once the
 * webhook confirms payment (`markVoucherPaid`); a `pending` row with no
 * corresponding payment simply sits unused.
 */
export async function createPendingVoucher(input: CreatePendingVoucherInput): Promise<{ voucherId: string; code: string }> {
  const supabase = getSupabaseServerClient();

  for (let attempt = 1; attempt <= CODE_INSERT_ATTEMPTS; attempt++) {
    const code = generateCode();
    const { data, error } = await supabase
      .from("gift_vouchers")
      .insert({
        code,
        tier: input.tier,
        recipient_email: input.recipientEmail.trim().toLowerCase(),
        recipient_name: input.recipientName?.trim() || null,
        gift_message: input.giftMessage?.trim() || null,
        status: "pending",
      })
      .select("id")
      .single();

    if (!error && data) {
      return { voucherId: data.id as string, code };
    }

    // A unique-constraint violation on `code` is the only expected
    // reason to retry (astronomically unlikely at this volume, but
    // cheap to guard against); anything else is a real failure.
    if (error?.code !== "23505" || attempt === CODE_INSERT_ATTEMPTS) {
      throw new Error(`Could not start this gift purchase: ${error?.message ?? "unknown error"}`);
    }
  }

  throw new Error("Could not start this gift purchase: unable to generate a unique code.");
}

/**
 * Marks a pending voucher as paid once Stripe confirms the checkout --
 * idempotent (a webhook can be delivered more than once for the same
 * event). Returns the voucher's details for the confirmation emails, or
 * null if the voucher wasn't found.
 */
export async function markVoucherPaid(
  voucherId: string,
  stripeCheckoutSessionId: string,
  buyerEmail: string | null,
): Promise<GiftVoucher | null> {
  const supabase = getSupabaseServerClient();

  const { data: existing, error: fetchError } = await supabase
    .from("gift_vouchers")
    .select("*")
    .eq("id", voucherId)
    .maybeSingle();

  if (fetchError || !existing) return null;

  const voucher = mapRow(existing);
  if (voucher.status !== "pending") return voucher; // already processed -- don't re-send emails

  const { error } = await supabase
    .from("gift_vouchers")
    .update({ status: "paid", stripe_checkout_session_id: stripeCheckoutSessionId, buyer_email: buyerEmail })
    .eq("id", voucherId)
    .eq("status", "pending");

  if (error) {
    throw new Error(`Could not confirm this gift voucher: ${error.message}`);
  }

  return { ...voucher, status: "paid", buyerEmail };
}

export async function getVoucherByCode(code: string): Promise<GiftVoucher | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("gift_vouchers")
    .select("*")
    .eq("code", code.trim().toUpperCase())
    .maybeSingle();

  if (error || !data) return null;
  return mapRow(data);
}

/**
 * Atomically claims a paid, unredeemed voucher for a newly-created
 * report. The `.eq("status", "paid")` guard makes this safe against a
 * double-submit (e.g. a parent double-clicking "redeem," or retrying
 * after a slow response) -- a second attempt updates zero rows and this
 * returns false, rather than silently redeeming the same code twice.
 */
export async function redeemVoucher(code: string, reportId: string): Promise<boolean> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("gift_vouchers")
    .update({ status: "redeemed", redeemed_report_id: reportId, redeemed_at: new Date().toISOString() })
    .eq("code", code.trim().toUpperCase())
    .eq("status", "paid")
    .select("id");

  if (error) {
    throw new Error(`Could not redeem this gift code: ${error.message}`);
  }

  return (data?.length ?? 0) > 0;
}

function mapRow(row: Record<string, unknown>): GiftVoucher {
  return {
    id: row.id as string,
    code: row.code as string,
    tier: row.tier as ReportTier,
    buyerEmail: (row.buyer_email as string | null) ?? null,
    recipientEmail: row.recipient_email as string,
    recipientName: (row.recipient_name as string | null) ?? null,
    giftMessage: (row.gift_message as string | null) ?? null,
    status: row.status as GiftVoucher["status"],
  };
}
