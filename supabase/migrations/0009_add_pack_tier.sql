-- Adds a tier to credit packs (HANDOFF §65): existing 3/5/7 packs stay
-- full-tier by default; a new premium-5 pack option redeems at the
-- premium tier directly instead of the full tier.
alter table credit_packs
  add column if not exists tier text not null default 'full' check (tier in ('full', 'premium'));
