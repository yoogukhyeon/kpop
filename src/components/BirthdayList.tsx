import Link from "next/link";
import { cafesFor, nextOccurrence, planHref, type Birthday } from "@/lib/birthdays";
import { ink, pastel } from "@/lib/color";
import { formatDate, getDictionary, type Locale } from "@/lib/i18n";
import type { KEvent } from "@/lib/types";

/** Birthday rows: date badge, member + group, listed cafes, trip CTA. */
export function BirthdayList({ items, events, locale, today }: { items: Birthday[]; events: KEvent[]; locale: Locale; today: string }) {
  const t = getDictionary(locale);
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((b) => {
        const date = nextOccurrence(b.monthDay, today);
        const cafes = cafesFor(events, b, date);
        return (
          <li key={`${b.group.slug}/${b.member.slug}`} className="card flex items-center gap-4 p-4">
            <div
              className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-center"
              style={{ background: pastel(b.group.accent, 30), color: ink(b.group.accent) }}
            >
              <span className="text-[11px] font-bold leading-none">{formatDate(date, locale, { month: "short" })}</span>
              <span className="text-2xl font-black leading-none">{formatDate(date, locale, { day: "numeric" })}</span>
            </div>
            <div className="grid min-w-0 flex-1 gap-1">
              <p className="truncate font-bold">
                <Link href={`/${locale}/groups/${b.group.slug}/${b.member.slug}`} className="hover:underline">{b.member.stageName}</Link>
              </p>
              <Link href={`/${locale}/groups/${b.group.slug}`} className="w-fit text-sm text-muted hover:text-text">{b.group.name}</Link>
              <span className={cafes.length ? "chip-pink w-fit" : "chip w-fit"}>🎂 {cafes.length ? t.birthdays.cafes(cafes.length) : t.birthdays.noCafe}</span>
            </div>
            <Link href={planHref(locale, b, date)} className="btn h-10 shrink-0 px-4 text-sm">{t.birthdays.plan}</Link>
          </li>
        );
      })}
    </ul>
  );
}
