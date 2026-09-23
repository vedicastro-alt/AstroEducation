-- Pre-paid reading credit packs (HANDOFF §55 follow-up, founder-requested):
-- buy N reading credits upfront at a discount, then redeem them one at a
-- time against any reading later -- your own further children, or a gift,
-- whenever you're ready, without paying full price each time.
--
-- Lifecycle mirrors gift_vouchers: a row is created as 'pending' the
-- moment checkout starts, the Stripe webhook flips it to 'paid' and sets
-- credits_remaining once payment is confirmed, and each redemption
-- decrements credits_remaining by exactly 1 -- guarded at the application
-- level by a `credits_remaining > 0` condition on the update, so a race
-- (e.g. a double-click) can never take it negative.
--
-- Tied to buyer_email rather than a single-use code: unlike a gift
-- voucher (bought once, for one named recipient), a pack is meant to be
-- redeemed repeatedly by its own buyer over time, matched the same way
-- the sibling discount already matches a family across multiple
-- readings -- against the report's own customer_email.
create table if not exists credit_packs (
  id uuid primary key default gen_random_uuid(),
  buyer_email text not null,
  pack_size integer not null check (pack_size > 0),
  credits_remaining integer not null default 0 check (credits_remaining >= 0),
  price_paid_cents integer not null,
  status text not null default 'pending' check (status in ('pending', 'paid')),
  stripe_checkout_session_id text,
  created_at timestamptz not null default now()
);

create index if not exists credit_packs_buyer_email_idx on credit_packs (buyer_email);

alter table credit_packs enable row level security;
-- No policies: only the server-role Supabase client (service_role key,
-- never sent to the browser) can read or write this table -- same
-- posture as `reports` and `gift_vouchers`.

-- Which pack credit (if any) unlocked a given report, for support/audit
-- purposes -- distinct from stripe_checkout_session_id, which for a
-- pack-redeemed report holds a synthetic "credit-pack:<id>" value instead
-- of a real Stripe session id.
alter table reports add column if not exists redeemed_from_pack_id uuid references credit_packs(id);

-- Atomic decrement, called via supabase.rpc() rather than a JS
-- read-then-write update -- two concurrent redemptions against the same
-- pack (two tabs, a double-click) would otherwise both read the same
-- `credits_remaining`, both compute the same "minus one" value, and the
-- second write could silently clobber the first's decrement instead of
-- stacking. `row_count` after the UPDATE tells the caller whether a
-- credit was actually available and consumed.
create or replace function consume_credit_pack(p_pack_id uuid)
returns boolean
language plpgsql
as $$
declare
  v_updated integer;
begin
  update credit_packs
  set credits_remaining = credits_remaining - 1
  where id = p_pack_id and status = 'paid' and credits_remaining > 0;

  get diagnostics v_updated = row_count;
  return v_updated > 0;
end;
$$;
