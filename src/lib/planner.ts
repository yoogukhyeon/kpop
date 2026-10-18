import type { Area, Group, KEvent, Member, Place } from "@/lib/types";

export const MAX_TRIP_DAYS = 14;
/** Birthday cafes usually run a few days around the birthday. */
const BIRTHDAY_WINDOW_DAYS = 3;
const SIGHTSEEING_TYPES = new Set<Place["type"]>(["agency", "landmark", "store", "experience"]);

export interface PlanInput {
  group: Group;
  memberSlugs: string[];
  from: string;
  to: string;
  events: KEvent[];
  places: Place[];
}

export interface PlanDay {
  date: string;
  events: KEvent[];
  birthdays: Member[];
  areas: { area: Area; places: Place[] }[];
}

export interface Plan {
  days: PlanDay[];
  /** Birthdays near (not on) the trip, worth knowing about. */
  nearbyBirthdays: { member: Member; date: string }[];
  musicShowPlaces: Place[];
  stats: { events: number; birthdays: number; spots: number };
}

const DAY_MS = 86_400_000;
const toUtc = (d: string) => Date.parse(`${d}T00:00:00Z`);
const fromUtc = (t: number) => new Date(t).toISOString().slice(0, 10);

export function tripDates(from: string, to: string): string[] {
  const start = toUtc(from);
  const end = toUtc(to);
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return [];
  if (fromUtc(start) !== from || fromUtc(end) !== to) return [];
  const out: string[] = [];
  for (let t = start; t <= end && out.length < MAX_TRIP_DAYS; t += DAY_MS) out.push(fromUtc(t));
  return out;
}

/** The member's birthday in the year of `date` (YYYY-MM-DD). */
function birthdayInYearOf(member: Member, date: string): string {
  return `${date.slice(0, 4)}${member.birthday.slice(4)}`;
}

export function buildPlan(input: PlanInput): Plan {
  const dates = tripDates(input.from, input.to);
  const focus = input.memberSlugs.length
    ? input.group.members.filter((m) => input.memberSlugs.includes(m.slug))
    : input.group.members;

  // A multi-day listing is an opportunity to visit once, not an appointment every day.
  const assigned = new Set<string>();
  const days: PlanDay[] = dates.map((date) => ({
    date,
    events: input.events.filter((e) => {
      if (assigned.has(e.id) || e.startDate > date || e.endDate < date) return false;
      assigned.add(e.id);
      return true;
    }),
    birthdays: focus.filter((m) => birthdayInYearOf(m, date) === date),
    areas: [],
  }));

  const nearbyBirthdays: Plan["nearbyBirthdays"] = [];
  if (dates.length) {
    const first = toUtc(dates[0]);
    const last = toUtc(dates[dates.length - 1]);
    for (const member of focus) {
      // Check the birthday in both years a trip spanning New Year could touch.
      for (const year of new Set([dates[0].slice(0, 4), dates[dates.length - 1].slice(0, 4)])) {
        const bday = `${year}${member.birthday.slice(4)}`;
        const t = toUtc(bday);
        const outside = t < first || t > last;
        const near = t >= first - BIRTHDAY_WINDOW_DAYS * DAY_MS && t <= last + BIRTHDAY_WINDOW_DAYS * DAY_MS;
        if (outside && near) nearbyBirthdays.push({ member, date: bday });
      }
    }
  }

  // Group sightseeing spots by neighbourhood; the group's own spots first.
  const byArea = new Map<Area, Place[]>();
  for (const p of input.places.filter((p) => SIGHTSEEING_TYPES.has(p.type))) {
    byArea.set(p.area, [...(byArea.get(p.area) ?? []), p]);
  }
  const ownCount = (ps: Place[]) => ps.filter((p) => p.groups.includes(input.group.slug)).length;
  const areas = [...byArea.entries()].sort((a, b) => ownCount(b[1]) - ownCount(a[1]) || b[1].length - a[1].length);

  // Put each area on the day where it fits best: same area as an event that day,
  // otherwise the least busy day. Events weigh more than a sightseeing area.
  const load = days.map((d) => d.events.length * 2);
  for (const [area, ps] of areas) {
    const pending = new Set(ps.map((p) => p.id));
    while (pending.size) {
      const choices = days.map((day, idx) => ({
        idx,
        sameArea: day.events.some((event) => event.area === area),
        places: ps.filter((place) => pending.has(place.id) && !place.visit?.closedWeekdays?.includes(new Date(`${day.date}T00:00:00Z`).getUTCDay())),
      })).filter((choice) => choice.places.length)
        .sort((a, b) => b.places.length - a.places.length || Number(b.sameArea) - Number(a.sameArea) || load[a.idx] - load[b.idx]);
      const best = choices[0];
      if (!best) break; // No open day in this trip: omit, rather than suggest a closed attraction.
      days[best.idx].areas.push({ area, places: best.places });
      load[best.idx] += 1;
      for (const place of best.places) pending.delete(place.id);
    }
  }

  return {
    days,
    nearbyBirthdays,
    musicShowPlaces: input.places.filter((p) => p.type === "broadcast"),
    stats: {
      events: new Set(days.flatMap((d) => d.events.map((e) => e.id))).size,
      birthdays: days.reduce((n, d) => n + d.birthdays.length, 0) + nearbyBirthdays.length,
      spots: days.reduce((n, day) => n + day.areas.reduce((sum, area) => sum + area.places.length, 0), 0),
    },
  };
}
