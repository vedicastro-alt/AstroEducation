-- Reports table: one row per generated reading.
--
-- There is no user/account system yet, so a report is addressed by its
-- unguessable id (used directly in the /report/[id] URL) rather than by
-- an owning user. Row Level Security is enabled with no policies, so
-- only the service_role key (used server-side only, never shipped to
-- the browser) can read or write this table -- appropriate given each
-- row holds a child's birth details.
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  child_name text not null,
  dob date not null,
  birth_time text not null,
  time_unknown boolean not null default false,
  place_label text not null,
  latitude double precision not null,
  longitude double precision not null,

  -- Full computed output, stored as-is so the report page never has to
  -- recompute the chart. Shapes match src/lib/astro/types.ts and
  -- src/lib/education/types.ts. `meta` mirrors ReportFormState["meta"]
  -- (the small header fields ReportView renders directly).
  chart jsonb not null,
  insights jsonb not null,
  pathway jsonb,
  meta jsonb not null,

  -- Groundwork for the payment phase; unused for now.
  paid boolean not null default false
);

alter table reports enable row level security;

create index if not exists reports_created_at_idx on reports (created_at desc);
