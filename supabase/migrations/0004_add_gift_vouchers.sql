-- Gift vouchers: a single-use, prepaid credit for a reading, bought for
-- someone whose child's birth details the buyer doesn't have on hand.
--
-- Lifecycle: a row is created as 'pending' the moment checkout starts
-- (mirroring how a `reports` row already exists before payment), the
-- Stripe webhook flips it to 'paid' once payment is confirmed and reveals
-- `code` to the recipient by email, and redemption flips it to
-- 'redeemed' exactly once -- guarded by a `status = 'paid'` condition in
-- the application-level update, the same idempotency pattern
-- `markReportTier` already uses for reports.
--
-- `code` is a short, human-typeable string (not a uuid) since a parent
-- may need to type it in by hand from an email on a phone.
create table if not exists gift_vouchers (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  tier text not null check (tier in ('full', 'premium')),
  buyer_email text,
  recipient_email text not null,
  recipient_name text,
  gift_message text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'redeemed')),
  stripe_checkout_session_id text,
  redeemed_report_id uuid references reports(id),
  redeemed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists gift_vouchers_code_idx on gift_vouchers (code);

alter table gift_vouchers enable row level security;
-- No policies: only the server-role Supabase client (service_role key,
-- never sent to the browser) can read or write this table -- same
-- posture as `reports`.
