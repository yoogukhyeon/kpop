import "server-only";
import { listEvents } from "@/lib/data";
import { seoulToday } from "@/lib/site";
import type { Group, Member } from "@/lib/types";

// Which pages we ask search engines to index. Search engines judge a site by the
// share of useful pages, so templated pages without real content stay out
// (noindex + left out of the sitemap) until they have it. Visitors can still use them.

/** Group hubs are indexable once the group has member data (route, birthdays, members). */
export const isGroupIndexable = (g: Group) => g.members.length > 0;

/** Member pages are thin (a birthday and boilerplate) until a real birthday cafe is listed for them. */
export async function isMemberIndexable(g: Group, m: Member): Promise<boolean> {
  const events = await listEvents({ from: seoulToday(), group: g.slug });
  return events.some((e) => (e.type === "birthday-cafe" || e.type === "birthday-event") && e.members?.includes(`${g.slug}/${m.slug}`));
}

export const NOINDEX = { index: false, follow: true } as const;
