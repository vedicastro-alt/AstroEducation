import "server-only";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { computeExpiryDate } from "@/lib/pricing";

export interface CreditPack {
  id: string;
  buyerEmail: string;
  packSize: number;
  tier: "full" | "premium";
  creditsRemaining: number;
  pricePaidCents: number;
  status: "pending" | "paid";
  expiresAt: string | null;
}

function mapRow(row: Record<string, unknown>): CreditPack {
  return {
    id: row.id as string,
    buyerEmail: row.buyer_email as string,
    packSize: row.pack_size as number,
    tier: (row.tier as CreditPack["tier"] | null) ?? "full",
    creditsRemaining: row.credits_remaining as number,
    pricePaidCents: row.price_paid_cents as number,
    status: row.status as CreditPack["status"],
    expiresAt: (row.expires_at as string | null) ?? null,
  };
}

/**
 * Creates the pack row before Stripe Checkout even starts -- mirrors
 * `createPendingVoucher` (gift_vouchers): no credits are usable until the
 * webhook confirms payment. The expiry clock starts now, at purchase,
 * not at first redemption -- same convention as a real gift card.
 */
export async function createPendingPack(
  buyerEmail: string,
  packSize: number,
  pricePaidCents: number,
  tier: "full" | "premium",
): Promise<{ packId: string }> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("credit_packs")
    .insert({
      buyer_email: buyerEmail.trim().toLowerCase(),
      pack_size: packSize,
      tier,
      price_paid_cents: pricePaidCents,
      status: "pending",
      expires_at: computeExpiryDate().toISOString(),
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(`Could not start this pack purchase: ${error?.message ?? "unknown error"}`);
  }
  return { packId: data.id as string };
}

/**
 * Marks a pending pack as paid and grants its credits -- idempotent (a
 * webhook can be delivered more than once for the same event), same
 * `.eq("status", "pending")` guard as `markVoucherPaid`.
 */
export async function markPackPaid(packId: string, stripeCheckoutSessionId: string): Promise<void> {
  const supabase = getSupabaseServerClient();

  const { data: existing, error: fetchError } = await supabase
    .from("credit_packs")
    .select("*")
    .eq("id", packId)
    .maybeSingle();

  if (fetchError || !existing) return;
  const pack = mapRow(existing);
  if (pack.status !== "pending") return; // already processed

  const { error } = await supabase
    .from("credit_packs")
    .update({
      status: "paid",
      credits_remaining: pack.packSize,
      stripe_checkout_session_id: stripeCheckoutSessionId,
    })
    .eq("id", packId)
    .eq("status", "pending");

  if (error) {
    throw new Error(`Could not confirm this pack purchase: ${error.message}`);
  }
}

/**
 * The oldest paid, unexpired pack with at least one credit left for this
 * email, if any -- matched against a report's own `customer_email`, the
 * same signal the sibling discount already uses (HANDOFF §55: an
 * intake-typed email, once set, always wins over whatever email Stripe's
 * own checkout later captures, so this stays reliable across purchases).
 */
export async function findAvailablePackForEmail(email: string): Promise<CreditPack | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("credit_packs")
    .select("*")
    .eq("buyer_email", email.trim().toLowerCase())
    .eq("status", "paid")
    .gt("credits_remaining", 0)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return mapRow(data);
}

/** Total remaining, unexpired credits across every paid pack for this email -- for display (e.g. "you have 4 credits left") rather than redemption, which always claims from a single pack via `findAvailablePackForEmail`. */
export async function totalAvailableCreditsForEmail(email: string): Promise<number> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("credit_packs")
    .select("credits_remaining")
    .eq("buyer_email", email.trim().toLowerCase())
    .eq("status", "paid")
    .gt("credits_remaining", 0)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

  if (error || !data) return 0;
  return data.reduce((sum, row) => sum + (row.credits_remaining as number), 0);
}

export async function getPackById(packId: string): Promise<CreditPack | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from("credit_packs").select("*").eq("id", packId).maybeSingle();
  if (error || !data) return null;
  return mapRow(data);
}

/**
 * Atomically claims one credit via the `consume_credit_pack` Postgres
 * function (see the migration), which also checks expiry -- a plain JS
 * read-then-write decrement isn't safe here: two concurrent redemptions
 * against the same pack (two tabs, a double-click) could both read the
 * same `credits_remaining` and the second write would silently clobber
 * the first's decrement instead of stacking. The database-side atomic
 * UPDATE has no such window.
 */
export async function consumePackCredit(packId: string): Promise<boolean> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.rpc("consume_credit_pack", { p_pack_id: packId });

  if (error) {
    throw new Error(`Could not redeem this pack credit: ${error.message}`);
  }
  return data === true;
}
