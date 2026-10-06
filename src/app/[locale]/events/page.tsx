import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventList } from "@/components/EventList";
import { listEvents } from "@/lib/data";
import { alternates, getDictionary, isLocale } from "@/lib/i18n";
import { monthLabel, upcomingMonths } from "@/lib/months";
import { seoulToday, seoTitle } from "@/lib/site";

// Daily: "upcoming" depends on the date; data edits refresh on demand.
export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return { title: seoTitle(t.events.title), description: t.meta.eventsDesc, alternates: alternates(locale, "/events") };
}

export default async function EventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const today = seoulToday();
  const events = await listEvents({ from: today });

  return (
    <div className="grid gap-6">
      <header className="grid gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight">{t.events.title}</h1>
        <p className="max-w-3xl text-muted">{t.meta.eventsDesc}</p>
      </header>
      <nav aria-label={t.events.byMonth} className="flex flex-wrap gap-2 text-sm">
        {upcomingMonths(today).map((m) => (
          <Link key={m} href={`/${locale}/events/${m}`} className="btn-ghost py-1.5">{monthLabel(m, locale)}</Link>
        ))}
      </nav>
      <EventList events={events} locale={locale} />
    </div>
  );
}
