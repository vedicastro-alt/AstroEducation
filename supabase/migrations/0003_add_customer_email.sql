-- Buyer email capture for the "resend my reading" recovery flow (see
-- HANDOFF.md §10). Captured from Stripe Checkout's own required email
-- field via the webhook's `customer_details.email`, for paid reports
-- only -- there's nothing to protect access to on an unpurchased report,
-- and one was never associated with a purchase email in the first place.
--
-- Application code always writes this lowercased (see
-- setReportCustomerEmail in src/lib/reports/store.ts) so lookups can use
-- a plain case-sensitive equality match instead of a wildcard-prone
-- ILIKE (email local-parts can contain underscores, a LIKE/ILIKE
-- single-char wildcard).
alter table reports
  add column if not exists customer_email text;

create index if not exists reports_customer_email_idx
  on reports (customer_email)
  where customer_email is not null and tier is not null;
