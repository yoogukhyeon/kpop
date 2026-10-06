import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventList } from "@/components/EventList";
import { listEvents } from "@/lib/data";
import { alternates, getDictionary, isLocale, locales } from "@/lib/i18n";
import { isMonth, monthLabel, monthRange, upcomingMonths } from "@/lib/months";
import { seoulToday } from "@/lib/site";

type Props = { params: Promise<{ locale: string; month: string }> };

export const revalidate = 3600;

export function generateStaticParams() {
  return locales.flatMap((locale) => upcomingMonths(seoulToday()).map((month) => ({ locale, month })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, month } = await params;
  if (!isLocale(locale) || !isMonth(month)) return {};
  const t = getDictionary(locale);
  const label = monthLabel(month, locale);
  const hasEvents = (await listEvents(monthRange(month))).length > 0;
  return {
    title: t.events.monthTitle(label),
    description: t.meta.monthDesc(label),
    alternates: alternates(locale, `/events/${month}`),
    // Empty month pages are thin content; keep them out of the index until they have events.
    robots: hasEvents ? undefined : { index: false, follow: true },
  };
}

export default async function MonthEventsPage({ params }: Props) {
  const { locale, month } = await params;
  if (!isLocale(locale) || !isMonth(month)) notFound();
  const t = getDictionary(locale);
  const events = await listEvents(monthRange(month));

  return (
    <div className="tap-links grid gap-6">
      <Link href={`/${locale}/events`} className="text-sm text-brand hover:underline">← {t.events.title}</Link>
      <h1 className="text-3xl font-extrabold tracking-tight">{t.events.monthTitle(monthLabel(month, locale))}</h1>
      <EventList events={events} locale={locale} />
    </div>
  );
}
