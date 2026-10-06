-- BiasTrip schema. Run once in Supabase → SQL Editor (safe to re-run).
-- Public (publishable key) can read catalog data and published events, and can
-- only INSERT pending birthday cafe submissions. Everything else goes through
-- the secret key on the server (admin page, seed script).

create table if not exists groups (
  slug        text primary key,
  name        text not null,
  name_ko     text not null,
  fandom      text not null,
  agency      text not null,
  debut_year  int  not null,
  kind        text not null check (kind in ('boy', 'girl')),
  accent      text not null,
  sort        int  not null default 0,
  verified_at date
);

create table if not exists members (
  group_slug  text not null references groups (slug) on delete cascade,
  slug        text not null,
  stage_name  text not null,
  birthday    date not null,
  sort        int  not null default 0,
  primary key (group_slug, slug)
);

create table if not exists places (
  id          text primary key,
  name        text not null,
  area        text not null,
  type        text not null,
  groups      text[] not null default '{}',
  address     text,
  note        jsonb not null,           -- { "en": "...", "ja": "...", "es": "...", "ko": "..." }
  verified_at date
);

create table if not exists events (
  id          text primary key,
  type        text not null check (type in ('concert', 'fanmeeting', 'music-show', 'birthday-cafe', 'popup')),
  title       text not null,
  groups      text[] not null default '{}',
  members     text[],                   -- "group/member" slugs for birthday cafes
  start_date  date not null,
  end_date    date not null check (end_date >= start_date),
  venue       text not null,
  area        text not null,
  ticketing   jsonb,                    -- { "platform", "url", "foreignerAccess" }
  source_url  text not null,
  verified_at date,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);
create index if not exists events_dates on events (start_date, end_date);

create table if not exists cafe_submissions (
  id          uuid primary key default gen_random_uuid(),
  member      text not null check (member ~ '^[a-z0-9-]+/[a-z0-9-]+$'),
  cafe_name   text not null check (char_length(cafe_name) between 2 and 120),
  address     text not null check (char_length(address) between 5 and 300),
  start_date  date not null,
  end_date    date not null check (end_date >= start_date),
  contact     text not null check (char_length(contact) between 2 and 120),
  source_url  text not null check (char_length(source_url) <= 500),
  status      text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  event_id    text references events (id) on delete set null,
  created_at  timestamptz not null default now(),
  reviewed_at timestamptz
);
create index if not exists cafe_submissions_status on cafe_submissions (status, created_at);

alter table groups           enable row level security;
alter table members          enable row level security;
alter table places           enable row level security;
alter table events           enable row level security;
alter table cafe_submissions enable row level security;

drop policy if exists "public read groups" on groups;
create policy "public read groups" on groups for select to anon, authenticated using (true);

drop policy if exists "public read members" on members;
create policy "public read members" on members for select to anon, authenticated using (true);

drop policy if exists "public read places" on places;
create policy "public read places" on places for select to anon, authenticated using (true);

drop policy if exists "public read published events" on events;
create policy "public read published events" on events for select to anon, authenticated using (published);

-- Anyone may submit, but only as a fresh pending row. No public read access.
drop policy if exists "public submit cafe" on cafe_submissions;
create policy "public submit cafe" on cafe_submissions for insert to anon, authenticated
  with check (status = 'pending' and event_id is null and reviewed_at is null);

-- Explicit API privileges (needed when the project doesn't auto-expose new tables).
-- RLS above still decides which rows each role can see or write.
grant usage on schema public to anon, authenticated, service_role;
grant select on groups, members, places, events to anon, authenticated;
grant insert on cafe_submissions to anon, authenticated;
grant all on groups, members, places, events, cafe_submissions to service_role;

create table if not exists activities (
  id          text primary key,
  partner     text not null check (partner in ('klook', 'kkday')),
  category    text not null check (category in ('tour', 'experience', 'ticket')),
  title       text not null,
  summary     jsonb not null,           -- { "en": "...", "ja": "...", "es": "...", "ko": "..." }
  url         text not null,
  area        text,
  groups      text[] not null default '{}',
  tags        text[] not null default '{}',
  weekdays    int[],
  duration    jsonb,                    -- minutes (number) or "half-day" / "full-day"
  sort        int not null default 0,
  published   boolean not null default true,
  checked_at  date
);
alter table activities add column if not exists duration jsonb;
alter table activities enable row level security;
drop policy if exists "public read published activities" on activities;
create policy "public read published activities" on activities for select to anon, authenticated using (published);
grant select on activities to anon, authenticated;
grant all on activities to service_role;

-- Make the API pick up the new tables immediately.
notify pgrst, 'reload schema';
