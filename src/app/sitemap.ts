import type { MetadataRoute } from "next";
import { listEvents, listGroups } from "@/lib/data";
import { guideLocales, listGuides } from "@/lib/guides";
import { defaultLocale, locales, type Locale } from "@/lib/i18n";
import { monthRange, upcomingMonths } from "@/lib/months";
import { seoulToday, site } from "@/lib/site";

type Entry = MetadataRoute.Sitemap[number];

/** One entry per locale, each listing every language version (hreflang in the sitemap). */
function localized(path: string, only: readonly Locale[], extra: Omit<Entry, "url"> = {}): Entry[] {
  const languages: Record<string, string> = Object.fromEntries(only.map((l) => [l, `${site.url}/${l}${path}`]));
  if (only.includes(defaultLocale)) languages["x-default"] = `${site.url}/${defaultLocale}${path}`;
  return only.map((l) => ({ url: `${site.url}/${l}${path}`, alternates: { languages }, ...extra }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const groups = await listGroups();
  const guideSlugs = [...new Set((await Promise.all(locales.map(listGuides))).flat().map((g) => g.slug))];
  const months = [];
  for (const m of upcomingMonths(seoulToday())) {
    if ((await listEvents(monthRange(m))).length) months.push(m);
  }

  return [
    ...localized("", locales, { changeFrequency: "weekly", priority: 1 }),
    ...localized("/groups", locales, { changeFrequency: "weekly" }),
    ...localized("/events", locales, { changeFrequency: "daily" }),
    ...months.flatMap((m) => localized(`/events/${m}`, locales, { changeFrequency: "daily" })),
    ...localized("/guides", locales, { changeFrequency: "weekly" }),
    ...(await Promise.all(guideSlugs.map(async (slug) => localized(`/guides/${slug}`, await guideLocales(slug), { changeFrequency: "monthly", priority: 0.8 })))).flat(),
    ...localized("/submit", locales, { changeFrequency: "monthly" }),
    ...groups.flatMap((g) => [
      ...localized(`/groups/${g.slug}`, locales, { changeFrequency: "weekly", priority: 0.8 }),
      ...g.members.flatMap((m) => localized(`/groups/${g.slug}/${m.slug}`, locales, { changeFrequency: "monthly" })),
    ]),
  ];
}
