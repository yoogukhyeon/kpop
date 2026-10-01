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

  const days: PlanDay[] = dates.map((date) => ({
    date,
    events: input.events.filter((e) => e.startDate <= date && e.endDate >= date),
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
    if (!days.length) break;
    let idx = days.findIndex((d) => d.events.some((e) => e.area === area));
    if (idx === -1) idx = load.indexOf(Math.min(...load));
    days[idx].areas.push({ area, places: ps });
    load[idx] += 1;
  }

  return {
    days,
    nearbyBirthdays,
    musicShowPlaces: input.places.filter((p) => p.type === "broadcast"),
    stats: {
      events: new Set(days.flatMap((d) => d.events.map((e) => e.id))).size,
      birthdays: days.reduce((n, d) => n + d.birthdays.length, 0) + nearbyBirthdays.length,
      spots: areas.reduce((n, [, ps]) => n + ps.length, 0),
    },
  };
}
