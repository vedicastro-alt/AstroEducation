-- Real, optional post-reading feedback from a paying customer -- the
-- founder's own alternative to fabricated testimonials: collect genuine
-- feedback first, decide later (with the customer's consent) whether to
-- feature any of it. Never shown back to other visitors automatically.
create table if not exists report_feedback (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references reports(id),
  tier text not null check (tier in ('full', 'premium')),
  rating smallint check (rating between 1 and 5),
  message text,
  ok_to_feature boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists report_feedback_report_id_idx on report_feedback (report_id);

alter table report_feedback enable row level security;
-- No policies: only the server-role Supabase client (service_role key,
-- never sent to the browser) can read or write this table -- same
-- posture as `reports` and `gift_vouchers`.
