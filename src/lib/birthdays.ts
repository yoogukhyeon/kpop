import "server-only";
import { listEvents, listGroups } from "@/lib/data";
import type { Group, KEvent, Member } from "@/lib/types";

export const MONTHS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"] as const;
export type MonthParam = (typeof MONTHS)[number];
export const isMonthParam = (v: string): v is MonthParam => (MONTHS as readonly string[]).includes(v);

export interface Birthday {
  group: Group;
  member: Member;
  /** MM-DD */
  monthDay: string;
}

const shift = (d: string, n: number) => new Date(Date.parse(`${d}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

/** Every member birthday, sorted by month and day. */
export async function listBirthdays(): Promise<Birthday[]> {
  const groups = await listGroups();
  return groups
    .flatMap((group) => group.members.map((member) => ({ group, member, monthDay: member.birthday.slice(5) })))
    .sort((a, b) => a.monthDay.localeCompare(b.monthDay) || a.member.stageName.localeCompare(b.member.stageName));
}

/** Next occurrence (on or after `today`) of a MM-DD birthday, as YYYY-MM-DD. */
export function nextOccurrence(monthDay: string, today: string): string {
  const thisYear = `${today.slice(0, 4)}-${monthDay}`;
  return thisYear >= today ? thisYear : `${Number(today.slice(0, 4)) + 1}-${monthDay}`;
}

/** Birthday cafes listed for a member around a given birthday date (±5 days). */
export function cafesFor(events: KEvent[], b: Birthday, date: string): KEvent[] {
  const key = `${b.group.slug}/${b.member.slug}`;
  const from = shift(date, -5);
  const to = shift(date, 5);
  return events.filter((e) => e.type === "birthday-cafe" && e.members?.includes(key) && e.endDate >= from && e.startDate <= to);
}

/** Trip plan link centred on the birthday. */
export const planHref = (locale: string, b: Birthday, date: string) =>
  `/${locale}/plan?${new URLSearchParams({ group: b.group.slug, members: b.member.slug, from: shift(date, -2), to: shift(date, 2) })}`;

export async function birthdayEvents() {
  return listEvents({});
}
