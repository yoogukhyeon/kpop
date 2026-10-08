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
  type        text not null check (type in ('concert', 'fanmeeting', 'music-show', 'birthday-cafe', 'birthday-event', 'popup')),
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

-- Bias alert sign-ups (email). Insert-only for the public; read by the server only.
create table if not exists subscriptions (
  id          uuid primary key default gen_random_uuid(),
  email       text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254),
  group_slug  text not null references groups (slug) on delete cascade,
  member_slug text,
  locale      text not null,
  created_at  timestamptz not null default now(),
  unsubscribed_at timestamptz,
  unique (email, group_slug)
);
alter table subscriptions enable row level security;
drop policy if exists "public subscribe" on subscriptions;
create policy "public subscribe" on subscriptions for insert to anon, authenticated with check (unsubscribed_at is null);
grant insert on subscriptions to anon, authenticated;
grant all on subscriptions to service_role;

-- Make the API pick up the new tables immediately.
-- Birthday guestbook: fans leave a message (nickname + password, no account).
-- One message per IP per member per Seoul day; the IP is stored only as a
-- salted hash and cleared after 30 days. All access goes through the server
-- (secret key) — no public policies, so password/IP hashes never leave it.
create table if not exists birthday_messages (
  id uuid primary key default gen_random_uuid(),
  group_slug text not null references groups (slug) on delete cascade,
  member_slug text not null,
  nickname text not null check (char_length(nickname) between 1 and 20),
  body text not null check (char_length(body) between 1 and 300),
  card text not null default 'pink',
  sticker text not null default 'cake',
  locale text not null,
  password_hash text not null,
  ip_hash text,
  kst_day date not null,
  reports int not null default 0,
  hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);
create unique index if not exists birthday_messages_daily on birthday_messages (group_slug, member_slug, ip_hash, kst_day);
create index if not exists birthday_messages_member on birthday_messages (group_slug, member_slug, created_at desc);
alter table birthday_messages enable row level security;
grant all on birthday_messages to service_role;

-- Widen the event type check on existing databases (birthday-event added 2026-10).
alter table events drop constraint if exists events_type_check;
alter table events add constraint events_type_check check (type in ('concert', 'fanmeeting', 'music-show', 'birthday-cafe', 'birthday-event', 'popup'));

notify pgrst, 'reload schema';
