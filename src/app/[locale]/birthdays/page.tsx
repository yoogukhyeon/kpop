import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BirthdayList } from "@/components/BirthdayList";
import { MONTHS, birthdayEvents, listBirthdays, nextOccurrence } from "@/lib/birthdays";
import { alternates, formatDate, getDictionary, isLocale } from "@/lib/i18n";
import { seoTitle, seoulToday } from "@/lib/site";

// Daily: "this month" and "coming up" depend on today's date.
export const revalidate = 86400;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return { title: seoTitle(t.birthdays.indexTitle), description: t.birthdays.indexDesc, alternates: alternates(locale, "/birthdays") };
}

export default async function BirthdaysPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const today = seoulToday();
  const [all, events] = await Promise.all([listBirthdays(), birthdayEvents()]);
  const in14 = new Date(Date.parse(`${today}T00:00:00Z`) + 14 * 86_400_000).toISOString().slice(0, 10);
  const upcoming = all
    .filter((b) => nextOccurrence(b.monthDay, today) <= in14)
    .sort((a, b) => nextOccurrence(a.monthDay, today).localeCompare(nextOccurrence(b.monthDay, today)));
  const thisMonth = today.slice(5, 7);
  const monthName = (mm: string) => formatDate(`2026-${mm}-01`, locale, { month: "long" });

  return (
    <div className="grid gap-10">
      <header className="grid gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">🎂 {t.birthdays.indexTitle}</h1>
        <p className="max-w-3xl text-muted">{t.birthdays.indexDesc}</p>
      </header>

      {upcoming.length > 0 && (
        <section className="grid gap-4">
          <h2 className="section-title">✨ {t.birthdays.upcoming}</h2>
          <BirthdayList items={upcoming} events={events} locale={locale} today={today} />
        </section>
      )}

      <section className="grid gap-4">
        <h2 className="section-title">📅 {t.birthdays.nav}</h2>
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {MONTHS.map((mm) => {
            const count = all.filter((b) => b.monthDay.startsWith(mm)).length;
            return (
              <li key={mm}>
                <Link
                  href={`/${locale}/birthdays/${mm}`}
                  className={`grid gap-0.5 rounded-3xl border p-4 text-center transition hover:border-brand ${mm === thisMonth ? "border-brand bg-brand-soft" : "border-line bg-surface"}`}
                >
                  <span className="font-bold">{monthName(mm)}</span>
                  <span className="text-xs text-muted">🎂 {count}</span>
                  {mm === thisMonth && <span className="text-[11px] font-bold text-brand">{t.birthdays.thisMonth}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
