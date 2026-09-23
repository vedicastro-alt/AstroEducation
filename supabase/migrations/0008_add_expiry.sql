-- A validity period on gift vouchers and credit packs (founder request,
-- HANDOFF §63 follow-up) -- set to 3 years, not the 2 years originally
-- asked for: Australian Consumer Law s99B (Treasury Laws Amendment (Gift
-- Cards) Act 2018, in force since 1 November 2019) sets a MANDATORY
-- MINIMUM 3-year validity period on any gift card/voucher sold to a
-- consumer, with penalties of up to $30,000 for a business that supplies
-- one with a shorter expiry. A gift_vouchers row is unambiguously a
-- "gift voucher" under that law; credit_packs are treated the same way
-- here out of caution, since nothing in the law clearly exempts a
-- pre-paid, redeemable-later credit bought for one's own future use.
alter table gift_vouchers add column if not exists expires_at timestamptz;
alter table credit_packs add column if not exists expires_at timestamptz;

-- Backfill existing rows (created before this column existed) to expire
-- 3 years from their own creation date, so nothing already sold is
-- silently expired sooner than the law allows.
update gift_vouchers set expires_at = created_at + interval '3 years' where expires_at is null;
update credit_packs set expires_at = created_at + interval '3 years' where expires_at is null;

-- Replaces the 0007 version of this function to add an expiry check --
-- a credit past its expires_at can no longer be spent, same as the
-- existing status/credits_remaining guards.
create or replace function consume_credit_pack(p_pack_id uuid)
returns boolean
language plpgsql
as $$
declare
  v_updated integer;
begin
  update credit_packs
  set credits_remaining = credits_remaining - 1
  where id = p_pack_id
    and status = 'paid'
    and credits_remaining > 0
    and (expires_at is null or expires_at > now());

  get diagnostics v_updated = row_count;
  return v_updated > 0;
end;
$$;
