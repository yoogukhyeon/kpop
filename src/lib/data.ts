import "server-only";
import { cache } from "react";
import { activities as seedActivities } from "@/data/activities";
import { events as seedEvents } from "@/data/events";
import { groups as seedGroups } from "@/data/groups";
import { places as seedPlaces } from "@/data/places";
import { publicDb, supabaseConfigured } from "@/lib/supabase";
import type { Activity, ActivityCategory, Group, KEvent, Place } from "@/lib/types";

// Data access layer. Pages call only these functions. With Supabase configured
// the database is the source of truth; without it (local dev with no keys) the
// seed files in src/data are used. Seed files also feed `npm run db:seed`.

type Row = Record<string, unknown>;

function check<T>(res: { data: T | null; error: { message: string } | null }, what: string): T {
  if (res.error) throw new Error(`Supabase: failed to load ${what}: ${res.error.message}`);
  return res.data as T;
}

const toGroup = (r: Row): Group => ({
  slug: r.slug as string,
  name: r.name as string,
  nameKo: r.name_ko as string,
  fandom: r.fandom as string,
  agency: r.agency as string,
  debutYear: r.debut_year as number,
  kind: r.kind as Group["kind"],
  accent: r.accent as string,
  verifiedAt: (r.verified_at as string | null) ?? null,
  members: ((r.members as Row[] | null) ?? []).map((m) => ({
    slug: m.slug as string,
    stageName: m.stage_name as string,
    birthday: m.birthday as string,
  })),
});

const toPlace = (r: Row): Place => ({
  id: r.id as string,
  name: r.name as string,
  area: r.area as Place["area"],
  type: r.type as Place["type"],
  groups: r.groups as string[],
  address: (r.address as string | null) ?? undefined,
  note: r.note as Place["note"],
  verifiedAt: (r.verified_at as string | null) ?? null,
});

export const toEvent = (r: Row): KEvent => ({
  id: r.id as string,
  type: r.type as KEvent["type"],
  title: r.title as string,
  groups: r.groups as string[],
  members: (r.members as string[] | null) ?? undefined,
  startDate: r.start_date as string,
  endDate: r.end_date as string,
  venue: r.venue as string,
  area: r.area as KEvent["area"],
  ticketing: (r.ticketing as KEvent["ticketing"] | null) ?? undefined,
  sourceUrl: r.source_url as string,
  verifiedAt: (r.verified_at as string | null) ?? null,
});

export const listGroups = cache(async (): Promise<Group[]> => {
  if (!supabaseConfigured()) return seedGroups;
  const rows = check<Row[]>(
    await publicDb().from("groups").select("*, members(*)").order("sort").order("sort", { referencedTable: "members" }),
    "groups",
  );
  return rows.map(toGroup);
});

export async function getGroup(slug: string): Promise<Group | undefined> {
  return (await listGroups()).find((g) => g.slug === slug);
}

const listPlaces = cache(async (): Promise<Place[]> => {
  if (!supabaseConfigured()) return seedPlaces;
  return check<Row[]>(await publicDb().from("places").select("*").order("id"), "places").map(toPlace);
});

export async function listPlacesForGroup(slug: string | null): Promise<Place[]> {
  return (await listPlaces()).filter((p) => p.groups.length === 0 || (slug !== null && p.groups.includes(slug)));
}

// One query for all published events (a small table), filtered in memory: every
// page and filter combination shares a single cached DB read instead of its own.
const allEvents = cache(async (): Promise<KEvent[]> => {
  if (!supabaseConfigured()) return [...seedEvents].sort((a, b) => a.startDate.localeCompare(b.startDate));
  return check<Row[]>(await publicDb().from("events").select("*").order("start_date"), "events").map(toEvent);
});

/** Published events overlapping [from, to] (inclusive, YYYY-MM-DD). */
export async function listEvents(opts: { from?: string; to?: string; group?: string } = {}): Promise<KEvent[]> {
  return (await allEvents())
    .filter((e) => (!opts.from || e.endDate >= opts.from) && (!opts.to || e.startDate <= opts.to))
    .filter((e) => !opts.group || e.groups.includes(opts.group));
}

const toActivity = (r: Row): Activity => ({
  id: r.id as string,
  partner: r.partner as Activity["partner"],
  category: r.category as ActivityCategory,
  title: r.title as string,
  summary: r.summary as Activity["summary"],
  url: r.url as string,
  area: (r.area as Activity["area"] | null) ?? undefined,
  groups: r.groups as string[],
  tags: r.tags as string[],
  weekdays: (r.weekdays as number[] | null) ?? undefined,
  duration: (r.duration as Activity["duration"] | null) ?? undefined,
  checkedAt: (r.checked_at as string | null) ?? null,
});

const allActivities = cache(async (): Promise<Activity[]> => {
  if (!supabaseConfigured()) return seedActivities;
  return check<Row[]>(await publicDb().from("activities").select("*").order("sort"), "activities").map(toActivity);
});

/**
 * Published activities, optionally filtered. With `group`, products made for that
 * group come first, then general ones. `tags` matches any of the given tags.
 */
export async function listActivities(opts: { category?: ActivityCategory; group?: string; tags?: string[]; limit?: number } = {}) {
  let list = await allActivities();
  if (opts.category) list = list.filter((a) => a.category === opts.category);
  if (opts.tags?.length) list = list.filter((a) => a.tags.some((t) => opts.tags!.includes(t)));
  if (opts.group) {
    list = list
      .filter((a) => a.groups.length === 0 || a.groups.includes(opts.group!))
      .sort((a, b) => Number(b.groups.includes(opts.group!)) - Number(a.groups.includes(opts.group!)));
  }
  return opts.limit ? list.slice(0, opts.limit) : list;
}
