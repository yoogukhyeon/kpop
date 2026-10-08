import { z } from "zod";
import { getGroup, listEvents, listPlacesForGroup } from "@/lib/data";
import { buildPlan, tripDates } from "@/lib/planner";

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const planQuery = z.object({
  group: z.string().min(1),
  from: date,
  to: date,
  members: z
    .string()
    .optional()
    .transform((v) => (v ? v.split(",").filter(Boolean) : [])),
});

/** Parses plan URL params and builds the plan; null when the params are invalid. */
export async function loadPlan(raw: Record<string, string | string[] | undefined>) {
  const flat = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]));
  const parsed = planQuery.safeParse(flat);
  if (!parsed.success) return null;
  const q = parsed.data;
  const group = await getGroup(q.group);
  const dates = tripDates(q.from, q.to);
  if (!group || !dates.length) return null;
  const to = dates[dates.length - 1];
  const memberSlugs = q.members.filter((s) => group.members.some((m) => m.slug === s));

  const events = (await listEvents({ from: q.from, to, group: group.slug })).filter(
    (e) => (e.type !== "birthday-cafe" && e.type !== "birthday-event") || !memberSlugs.length || e.members?.some((m) => memberSlugs.includes(m.split("/")[1])),
  );
  const plan = buildPlan({ group, memberSlugs, from: q.from, to, events, places: await listPlacesForGroup(group.slug) });
  return { group, memberSlugs, from: q.from, to, plan };
}

export function planSearch(p: { group: string; from: string; to: string; memberSlugs: string[] }) {
  const q = new URLSearchParams({ group: p.group, from: p.from, to: p.to });
  if (p.memberSlugs.length) q.set("members", p.memberSlugs.join(","));
  return q.toString();
}
