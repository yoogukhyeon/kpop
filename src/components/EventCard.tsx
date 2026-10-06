import Link from "next/link";
import { ink, pastel } from "@/lib/color";
import { formatDate, getDictionary, type Locale } from "@/lib/i18n";
import type { KEvent } from "@/lib/types";

const DEFAULT_ACCENT = "#7c5cff";

/** "Oct 7" for one-day events, "Sep 29 – Oct 11" otherwise. */
export function eventDates(e: KEvent, locale: Locale) {
  const day = (d: string) => formatDate(d, locale, { month: "short", day: "numeric" });
  return e.startDate === e.endDate ? day(e.startDate) : `${day(e.startDate)} – ${day(e.endDate)}`;
}

/**
 * One event as a card that links to its detail page. Events already running
 * show "Now on · until …" instead of a start date that has passed.
 */
export function EventCard({
  e,
  locale,
  today,
  accent = DEFAULT_ACCENT,
  groupNames,
  details = false,
}: {
  e: KEvent;
  locale: Locale;
  today: string;
  accent?: string;
  /** Performer names, shown under the venue. */
  groupNames?: string;
  /** Also show foreigner ticket access and the "being verified" note. */
  details?: boolean;
}) {
  const t = getDictionary(locale);
  const ongoing = e.startDate <= today && today <= e.endDate;
  const shown = ongoing ? e.endDate : e.startDate;

  return (
    <Link
      href={`/${locale}/events/e/${e.id}`}
      className="card flex h-full gap-4 p-4 transition hover:-translate-y-0.5 hover:border-brand"
    >
      <div
        className="grid h-16 w-16 shrink-0 place-items-center content-center gap-1 rounded-2xl text-center"
        style={{ background: pastel(accent, 30), color: ink(accent) }}
      >
        <span className="text-[11px] font-bold leading-none">
          {ongoing ? t.ux.nowOn : formatDate(shown, locale, { month: "short" })}
        </span>
        <span className={`font-black leading-none ${ongoing ? "text-sm" : "text-2xl"}`}>
          {ongoing ? `~${formatDate(shown, locale, { month: "numeric", day: "numeric" })}` : formatDate(shown, locale, { day: "numeric" })}
        </span>
      </div>
      <div className="grid min-w-0 flex-1 content-start gap-1">
        <span className={ongoing ? "chip-pink w-fit" : "chip w-fit"}>{t.eventType[e.type]}</span>
        <p className="line-clamp-2 font-bold leading-snug">{e.title}</p>
        <p className="text-xs text-muted">
          {ongoing ? t.ux.until(formatDate(e.endDate, locale, { month: "short", day: "numeric" })) : eventDates(e, locale)} · {e.venue} · {t.area[e.area]}
        </p>
        {groupNames && <p className="text-xs font-semibold text-muted">{groupNames}</p>}
        {details && e.ticketing && (
          <p className="text-xs text-muted">{t.events.access}: {t.access[e.ticketing.foreignerAccess]}</p>
        )}
        {details && !e.verifiedAt && <p className="text-xs text-warn">⚠ {t.plan.unverified}</p>}
      </div>
    </Link>
  );
}
