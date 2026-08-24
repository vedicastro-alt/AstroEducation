-- Two-tier paid pathway support.
--
-- `tier` is null until a purchase completes; 'full' unlocks the learning
-- pathway chapters (Tier 1, "The Guiding Stars Reading", $25), 'premium'
-- additionally unlocks the gentle-remedies chapter (Tier 2, "The Complete
-- Constellation Reading", $35). `remedies` is computed and stored at
-- report-creation time (same pattern as `pathway`), independent of
-- whether it has been purchased yet -- only the report's `tier` decides
-- what a given viewer is actually shown.
--
-- `stripe_checkout_session_id` records the session that unlocked the
-- report, for support lookups and as a light idempotency aid.
--
-- `paid` (the earlier boolean stub) is superseded by `tier` and dropped.
alter table reports
  add column if not exists tier text check (tier in ('full', 'premium')),
  add column if not exists remedies jsonb,
  add column if not exists stripe_checkout_session_id text;

alter table reports drop column if exists paid;
