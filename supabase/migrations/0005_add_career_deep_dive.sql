-- Career Deep-Dive: a ranked list of the child's strongest-aligned
-- career fields (drawn from careerSignals.ts's 25+ scored fields, not
-- just the 4 broad streams direction.ts shows). Premium-tier exclusive,
-- same "computed and stored at creation, tier only gates what's shown"
-- pattern already used for `remedies` (see 0002_add_tiers_and_remedies.sql).
alter table reports
  add column if not exists career_deep_dive jsonb;
