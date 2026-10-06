// Upserts the seed data in src/data into Supabase. Safe to re-run: rows are
// matched by primary key and updated; nothing is deleted.
// Usage: npm run db:seed   (reads SUPABASE_URL and SUPABASE_SECRET_KEY from .env)

import { createClient } from "@supabase/supabase-js";
import { activities } from "../src/data/activities";
import { events } from "../src/data/events";
import { groups } from "../src/data/groups";
import { places } from "../src/data/places";

const url = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL)?.replace(/\/rest\/v1\/?$/, "");
const key = process.env.SUPABASE_SECRET_KEY;
if (!url || !key) throw new Error("Set SUPABASE_URL and SUPABASE_SECRET_KEY in .env");

const db = createClient(url, key, { auth: { persistSession: false } });

async function upsert(table: string, rows: object[], onConflict: string) {
  const { error } = await db.from(table).upsert(rows, { onConflict });
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`${table}: ${rows.length} rows`);
}

async function main() {
  await upsert(
    "groups",
    groups.map((g, i) => ({
      slug: g.slug, name: g.name, name_ko: g.nameKo, fandom: g.fandom, agency: g.agency,
      debut_year: g.debutYear, kind: g.kind, accent: g.accent, sort: i, verified_at: g.verifiedAt,
    })),
    "slug",
  );
  await upsert(
    "members",
    groups.flatMap((g) => g.members.map((m, i) => ({ group_slug: g.slug, slug: m.slug, stage_name: m.stageName, birthday: m.birthday, sort: i }))),
    "group_slug,slug",
  );
  await upsert(
    "places",
    places.map((p) => ({
      id: p.id, name: p.name, area: p.area, type: p.type, groups: p.groups, address: p.address ?? null, note: p.note, verified_at: p.verifiedAt,
    })),
    "id",
  );
  await upsert(
    "events",
    events.map((e) => ({
      id: e.id, type: e.type, title: e.title, groups: e.groups, members: e.members ?? null, start_date: e.startDate, end_date: e.endDate,
      venue: e.venue, area: e.area, ticketing: e.ticketing ?? null, source_url: e.sourceUrl, verified_at: e.verifiedAt,
    })),
    "id",
  );
  await upsert(
    "activities",
    activities.map((a, i) => ({
      id: a.id, partner: a.partner, category: a.category, title: a.title, summary: a.summary, url: a.url, area: a.area ?? null,
      groups: a.groups, tags: a.tags, weekdays: a.weekdays ?? null, duration: a.duration ?? null, sort: i, checked_at: a.checkedAt,
    })),
    "id",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
