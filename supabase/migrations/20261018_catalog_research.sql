-- Additive catalog research metadata. Existing submissions, contacts and catalog rows are preserved.
alter table public.places add column if not exists sources jsonb not null default '[]'::jsonb;
alter table public.places add column if not exists visit jsonb;
alter table public.events add column if not exists editorial jsonb;
