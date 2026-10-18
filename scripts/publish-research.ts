// Targeted catalog-only update. Default is a dry run; --apply writes reviewed changes in a transaction.
import { writeFileSync } from "node:fs";
import { Client } from "pg";
import { researchedNewPlaces, researchedPlaceUpdates } from "../src/data/researched-places";
import { eventResearchUpdates, researchedNewEvents } from "../src/data/researched-events";

async function main() {
  const raw = process.env.POSTGRES_URL_NON_POOLING ?? process.env.SUPABASE_DB_URL;
  if (!raw) throw new Error("Database is not configured");
  const url = new URL(raw); url.searchParams.delete("sslmode");
  const db = new Client({ connectionString: url.toString(), ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 15000, query_timeout: 20000 });
  await db.connect();
  try {
    const placeIds = [...Object.keys(researchedPlaceUpdates), ...researchedNewPlaces.map((p) => p.id)];
    const eventIds = [...Object.keys(eventResearchUpdates), ...researchedNewEvents.map((e) => e.id)];
    const [oldPlaces, oldEvents] = await Promise.all([
      db.query("select * from public.places where id = any($1::text[])", [placeIds]),
      db.query("select * from public.events where id = any($1::text[])", [eventIds]),
    ]);
    console.log(JSON.stringify({ mode: process.argv.includes("--apply") ? "apply" : "dry-run", placeUpdates: Object.keys(researchedPlaceUpdates).length, newPlaces: researchedNewPlaces.length, eventUpdates: Object.keys(eventResearchUpdates).length, newEvents: researchedNewEvents.length }));
    if (!process.argv.includes("--apply")) return;
    const backup = `/tmp/sidequest-catalog-before-research-${Date.now()}.json`;
    writeFileSync(backup, JSON.stringify({ places: oldPlaces.rows, events: oldEvents.rows }, null, 2), { mode: 0o600 });
    await db.query("BEGIN");
    try {
      for (const [id, patch] of Object.entries(researchedPlaceUpdates)) {
        const result = await db.query("update public.places set sources=$2::jsonb, visit=$3::jsonb, verified_at=$4, note=coalesce($5::jsonb,note) where id=$1", [id, JSON.stringify(patch.sources), JSON.stringify(patch.visit), patch.verifiedAt, patch.note ? JSON.stringify(patch.note) : null]);
        if (result.rowCount !== 1) throw new Error(`Missing existing place: ${id}`);
      }
      for (const place of researchedNewPlaces) await db.query(`insert into public.places(id,name,area,type,groups,address,note,verified_at,sources,visit) values($1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9::jsonb,$10::jsonb) on conflict(id) do update set name=excluded.name, area=excluded.area, type=excluded.type, groups=excluded.groups,address=excluded.address,note=excluded.note,verified_at=excluded.verified_at,sources=excluded.sources,visit=excluded.visit`, [place.id, place.name, place.area, place.type, place.groups, place.address, JSON.stringify(place.note), place.verifiedAt, JSON.stringify(place.sources), JSON.stringify(place.visit)]);
      for (const [id, patch] of Object.entries(eventResearchUpdates)) {
        const result = await db.query("update public.events set source_url=$2, verified_at=$3, editorial=$4::jsonb, ticketing=coalesce($5::jsonb,ticketing) where id=$1", [id, patch.sourceUrl, patch.verifiedAt, JSON.stringify(patch.editorial), patch.ticketing ? JSON.stringify(patch.ticketing) : null]);
        if (result.rowCount !== 1) throw new Error(`Missing existing event: ${id}`);
      }
      for (const event of researchedNewEvents) await db.query(`insert into public.events(id,type,title,groups,members,start_date,end_date,venue,area,ticketing,source_url,verified_at,editorial) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11,$12,$13::jsonb) on conflict(id) do update set title=excluded.title,groups=excluded.groups,members=excluded.members,start_date=excluded.start_date,end_date=excluded.end_date,venue=excluded.venue,area=excluded.area,ticketing=excluded.ticketing,source_url=excluded.source_url,verified_at=excluded.verified_at,editorial=excluded.editorial`, [event.id, event.type, event.title, event.groups, event.members ?? null, event.startDate, event.endDate, event.venue, event.area, JSON.stringify(event.ticketing), event.sourceUrl, event.verifiedAt, JSON.stringify(event.editorial)]);
      await db.query("COMMIT");
    } catch (error) { await db.query("ROLLBACK"); throw error; }
    console.log(JSON.stringify({ applied: true, backup, note: "Only reviewed catalog IDs changed; no groups, members, submissions, messages or subscribers changed." }));
  } finally { await db.end(); }
}
main().catch((error: Error) => { console.error(error.message); process.exitCode = 1; });
