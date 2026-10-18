import "server-only";
import { listEvents, listPlaces } from "@/lib/data";
import { seoulToday } from "@/lib/site";
import type { Group, Member } from "@/lib/types";
import { groupResearch } from "@/data/group-research";
import { groupPublicationIssues } from "@/lib/group-publication";
import { locales, type Locale } from "@/lib/i18n";
import { isReviewedEvent } from "@/lib/catalog-quality";

// Which pages we ask search engines to index. Search engines judge a site by the
// share of useful pages, so templated pages without real content stay out
// (noindex + left out of the sitemap) until they have it. Visitors can still use them.

export async function groupIndexableLocales(group: Group): Promise<Locale[]> {
  const places = await listPlaces();
  return locales.filter((locale) => !groupPublicationIssues(group, groupResearch[group.slug], places, locale, seoulToday()).length);
}

/** Member pages are thin (a birthday and boilerplate) until a real birthday cafe is listed for them. */
export async function isMemberIndexable(g: Group, m: Member): Promise<boolean> {
  const events = await listEvents({ from: seoulToday(), group: g.slug });
  return events.some((e) => isReviewedEvent(e, seoulToday()) && (e.type === "birthday-cafe" || e.type === "birthday-event") && e.members?.includes(`${g.slug}/${m.slug}`));
}

export const NOINDEX = { index: false, follow: true } as const;
