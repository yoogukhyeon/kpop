import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActivityCard } from "@/components/ActivityCard";
import { BirthdayList } from "@/components/BirthdayList";
import { EventCard } from "@/components/EventCard";
import { birthdayEvents, listBirthdays, nextOccurrence } from "@/lib/birthdays";
import { GroupCard } from "@/components/GroupCard";
import { PlannerForm } from "@/components/PlannerForm";
import { listActivities, listEvents, listGroups } from "@/lib/data";
import { listGuidesForLists } from "@/lib/guides";
import { alternates, getDictionary, isLocale, ogBase } from "@/lib/i18n";
import { seoulToday } from "@/lib/site";

const addDays = (d: string, n: number) =>
  new Date(Date.parse(`${d}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    title: { absolute: t.seo.homeTitle },
    alternates: alternates(locale, ""),
    openGraph: { ...ogBase(locale), title: t.seo.homeTitle, description: t.heroSub },
  };
}

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ group?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { group } = await searchParams;
  const t = getDictionary(locale);
  const today = seoulToday();
  const [groups, events, guides, activities, birthdays, birthdayCafes] = await Promise.all([
    listGroups(),
    listEvents({ from: today }),
    listGuidesForLists(locale),
    listActivities(),
    listBirthdays(),
    birthdayEvents(),
  ]);
  // Birthdays in the next week, soonest first.
  const weekOut = addDays(today, 7);
  const soon = birthdays
    .filter((b) => nextOccurrence(b.monthDay, today) <= weekOut)
    .sort((a, b) => nextOccurrence(a.monthDay, today).localeCompare(nextOccurrence(b.monthDay, today)))
    .slice(0, 4);
  // One of each category first, so the row shows the range.
  const featured = (["ticket", "experience", "tour"] as const)
    .map((c) => activities.find((a) => a.category === c))
    .filter((a) => a !== undefined);
  const groupName = new Map(groups.map((g) => [g.slug, g]));

  return (
    <div className="grid gap-14">
      <section
        id="planner"
        className="relative -mx-4 -mt-6 overflow-hidden px-4 pb-6 pt-10 sm:-mt-8 sm:rounded-b-[2rem] sm:pt-14"
        style={{
          background:
            "radial-gradient(circle at 8% 20%, #ffd6e7 0, transparent 38%), radial-gradient(circle at 92% 10%, #fff1b8 0, transparent 35%), radial-gradient(circle at 75% 95%, #d9e7ff 0, transparent 45%), #fffafc",
        }}
      >
        <span aria-hidden className="pointer-events-none absolute -right-6 top-6 hidden text-7xl opacity-80 sm:block">💜</span>
        <span aria-hidden className="pointer-events-none absolute right-28 top-24 hidden text-4xl opacity-70 sm:block">✨</span>
        <span aria-hidden className="pointer-events-none absolute right-10 top-44 hidden text-5xl opacity-70 lg:block">🎤</span>
        <div className="relative mx-auto grid max-w-6xl gap-6">
          <div className="grid max-w-3xl gap-3">
            <span className="chip-pink w-fit">{t.home.badge}</span>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">{t.tagline}</h1>
            <p className="text-base text-muted sm:text-lg">{t.heroSub}</p>
          </div>
          <PlannerForm
            locale={locale}
            labels={t.form}
            groups={groups.map((g) => ({
              slug: g.slug,
              name: g.name,
              members: g.members.map((m) => ({ slug: m.slug, stageName: m.stageName })),
            }))}
            defaults={{ group, from: addDays(today, 30), to: addDays(today, 35) }}
          />
        </div>
      </section>

      <section className="grid gap-5">
        <div className="flex items-end justify-between gap-4">
          <h2 className="section-title">⭐ {t.home.popular}</h2>
          <Link href={`/${locale}/groups`} className="inline-flex min-h-10 items-center text-sm font-semibold text-muted hover:text-text">{t.home.seeAll} ›</Link>
        </div>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
          {groups.slice(0, 8).map((g) => (
            <li key={g.slug}>
              <GroupCard group={g} locale={locale} membersLabel={g.members.length ? t.detail.members(g.members.length) : undefined} />
            </li>
          ))}
        </ul>
      </section>

      {featured.length > 0 && (
        <section className="grid gap-5">
          <div className="flex items-end justify-between gap-4">
            <h2 className="section-title">🎟️ {t.activities.recommended}</h2>
            <Link href={`/${locale}/activities`} className="inline-flex min-h-10 items-center text-sm font-semibold text-muted hover:text-text">{t.home.seeAll} ›</Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-3">
            {featured.map((a) => (
              <li key={a.id}><ActivityCard activity={a} locale={locale} /></li>
            ))}
          </ul>
          <p className="text-xs text-muted">{t.activities.note}</p>
        </section>
      )}

      {events.length > 0 && (
        <section className="grid gap-5">
          <div className="flex items-end justify-between gap-4">
            <h2 className="section-title">🗓️ {t.home.upcoming}</h2>
            <Link href={`/${locale}/events`} className="inline-flex min-h-10 items-center text-sm font-semibold text-muted hover:text-text">{t.home.seeAll} ›</Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {events.slice(0, 6).map((e) => (
              <li key={e.id}>
                <EventCard e={e} locale={locale} today={today} accent={groupName.get(e.groups[0])?.accent} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {soon.length > 0 && (
        <section className="grid gap-5">
          <div className="flex items-end justify-between gap-4">
            <h2 className="section-title">🎂 {t.birthdays.upcoming}</h2>
            <Link href={`/${locale}/birthdays`} className="inline-flex min-h-10 items-center text-sm font-semibold text-muted hover:text-text">{t.home.seeAll} ›</Link>
          </div>
          <BirthdayList items={soon} events={birthdayCafes} locale={locale} today={today} />
        </section>
      )}

      <section className="grid gap-3 sm:grid-cols-3">
        {t.home.why.map((w, i) => {
          const tone = [
            { bg: "bg-pink-soft", dot: "bg-pink", icon: "💖" },
            { bg: "bg-sun-soft", dot: "bg-sun", icon: "🗺️" },
            { bg: "bg-brand-soft", dot: "bg-brand", icon: "📸" },
          ][i % 3];
          return (
            <div key={w.title} className={`grid content-start gap-2 rounded-3xl p-6 ${tone.bg}`}>
              <span className={`grid h-11 w-11 place-items-center rounded-full text-xl ${tone.dot}`}>{tone.icon}</span>
              <p className="text-lg font-bold">{w.title}</p>
              <p className="text-sm text-muted">{w.body}</p>
            </div>
          );
        })}
      </section>

      {guides.length > 0 && (
        <section className="grid gap-5">
          <div className="flex items-end justify-between gap-4">
            <h2 className="section-title">📚 {t.home.guides}</h2>
            <Link href={`/${locale}/guides`} className="inline-flex min-h-10 items-center text-sm font-semibold text-muted hover:text-text">{t.home.seeAll} ›</Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {guides.slice(0, 6).map((g) => (
              <li key={g.slug}>
                <Link href={`/${g.lang}/guides/${g.slug}`} hrefLang={g.lang} className="card grid h-full gap-1.5 transition hover:border-text">
                  {g.lang !== locale && <span className="chip w-fit">English</span>}
                  <p className="font-bold leading-snug">{g.title}</p>
                  <p className="line-clamp-2 text-sm text-muted">{g.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
