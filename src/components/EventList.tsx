import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { getGroup } from "@/lib/data";
import { formatDate, getDictionary, type Locale } from "@/lib/i18n";
import type { KEvent } from "@/lib/types";

/** Event cards plus schema.org Event data — only for verified events, so search engines never get unchecked details. */
export async function EventList({ events, locale }: { events: KEvent[]; locale: Locale }) {
  const t = getDictionary(locale);
  const groupNames = new Map(
    await Promise.all([...new Set(events.flatMap((e) => e.groups))].map(async (s) => [s, (await getGroup(s))?.name ?? s] as const)),
  );

  if (!events.length) return <p className="text-muted">{t.events.empty}</p>;

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
              performer: e.groups.map((g) => ({ "@type": "MusicGroup", name: groupNames.get(g) })),
              url: e.sourceUrl,
            })),
          }}
        />
      )}
      <ul className="grid gap-3">
        {events.map((e) => (
          <li key={e.id} className="card grid gap-1 text-sm">
            <p>
              <span className="mr-2 rounded-md bg-brand-soft px-1.5 py-0.5 text-xs font-semibold text-brand">{t.eventType[e.type]}</span>
              <Link href={`/${locale}/events/e/${e.id}`} className="font-bold hover:text-brand hover:underline">{e.title}</Link>
            </p>
            <p className="text-muted">
              {formatDate(e.startDate, locale)}–{formatDate(e.endDate, locale)} · {e.venue} · {t.area[e.area]} · {e.groups.map((g) => groupNames.get(g)).join(", ")}
            </p>
            {e.ticketing && <p className="text-muted">{t.events.access}: {t.access[e.ticketing.foreignerAccess]}</p>}
            {!e.verifiedAt && <p className="text-xs text-warn">⚠ {t.plan.unverified}</p>}
            <a href={e.sourceUrl} target="_blank" rel="noopener" className="w-fit text-xs text-brand hover:underline">{t.plan.source} ↗</a>
          </li>
        ))}
      </ul>
    </>
  );
}
