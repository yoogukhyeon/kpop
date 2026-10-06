import { EventCard } from "@/components/EventCard";
import { JsonLd } from "@/components/JsonLd";
import { getGroup } from "@/lib/data";
import { getDictionary, type Locale } from "@/lib/i18n";
import { seoulToday, site } from "@/lib/site";
import type { KEvent } from "@/lib/types";

/** Event cards plus schema.org Event data — only for verified events, so search engines never get unchecked details. */
export async function EventList({ events, locale }: { events: KEvent[]; locale: Locale }) {
  const t = getDictionary(locale);
  const slugs = [...new Set(events.flatMap((e) => e.groups))];
  const groups = new Map((await Promise.all(slugs.map(getGroup))).filter((g) => g !== undefined).map((g) => [g.slug, g]));

  if (!events.length) return <p className="rounded-3xl bg-subtle p-5 text-sm text-muted">{t.events.empty}</p>;

  const today = seoulToday();
  const verified = events.filter((e) => e.verifiedAt);
  return (
    <>
      {verified.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": verified.map((e) => ({
              "@type": e.type === "concert" ? "MusicEvent" : "Event",
              name: e.title,
              startDate: e.startDate,
              endDate: e.endDate,
              eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
              eventStatus: "https://schema.org/EventScheduled",
              location: { "@type": "Place", name: e.venue, address: { "@type": "PostalAddress", addressLocality: "Seoul", addressCountry: "KR" } },
              performer: e.groups.map((g) => ({ "@type": "MusicGroup", name: groups.get(g)?.name ?? g })),
              url: `${site.url}/${locale}/events/e/${e.id}`,
            })),
          }}
        />
      )}
      <ul className="grid gap-3 sm:grid-cols-2">
        {events.map((e) => (
          <li key={e.id}>
            <EventCard
              e={e}
              locale={locale}
              today={today}
              accent={groups.get(e.groups[0])?.accent}
              groupNames={e.groups.map((g) => groups.get(g)?.name ?? g).join(", ") || undefined}
              details
            />
          </li>
        ))}
      </ul>
    </>
  );
}
