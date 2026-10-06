import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGroup, listEvents, listGroups } from "@/lib/data";
import { EventCard } from "@/components/EventCard";
import { alternates, formatDate, getDictionary, isLocale, locales } from "@/lib/i18n";
import { JsonLd } from "@/components/JsonLd";
import { isMemberIndexable, NOINDEX } from "@/lib/indexing";
import { AlertSignup } from "@/components/AlertSignup";
import { seoulToday, site, seoTitle } from "@/lib/site";

type Props = { params: Promise<{ locale: string; slug: string; member: string }> };

// Upcoming events and "next birthday" depend on today.
// Daily: "upcoming" depends on the date; data edits refresh on demand.
export const revalidate = 86400;

const shift = (d: string, n: number) => new Date(Date.parse(`${d}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

/** Next occurrence of a YYYY-MM-DD birthday on or after `today`. */
function nextBirthday(birthday: string, today: string) {
  const thisYear = `${today.slice(0, 4)}${birthday.slice(4)}`;
  return thisYear >= today ? thisYear : `${Number(today.slice(0, 4)) + 1}${birthday.slice(4)}`;
}

async function find(slug: string, memberSlug: string) {
  const g = await getGroup(slug);
  const m = g?.members.find((x) => x.slug === memberSlug);
  return g && m ? { g, m } : null;
}

export async function generateStaticParams() {
  const groups = await listGroups();
  return locales.flatMap((locale) => groups.flatMap((g) => g.members.map((m) => ({ locale, slug: g.slug, member: m.slug }))));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, member } = await params;
  const found = await find(slug, member);
  if (!found || !isLocale(locale)) return {};
  const { g, m } = found;
  const t = getDictionary(locale);
  return {
    title: seoTitle(t.meta.memberTitle(m.stageName, g.name)),
    description: t.meta.memberDesc(m.stageName, formatDate(m.birthday, locale, { month: "long", day: "numeric" }), g.fandom),
    alternates: alternates(locale, `/groups/${g.slug}/${m.slug}`),
    robots: (await isMemberIndexable(g, m)) ? undefined : NOINDEX,
  };
}

export default async function MemberPage({ params }: Props) {
  const { locale, slug, member } = await params;
  if (!isLocale(locale)) notFound();
  const found = await find(slug, member);
  if (!found) notFound();
  const { g, m } = found;
  const t = getDictionary(locale);
  const today = seoulToday();
  const next = nextBirthday(m.birthday, today);
  const days = Math.round((Date.parse(next) - Date.parse(today)) / 86_400_000);
  const upcoming = (await listEvents({ from: today, group: g.slug })).slice(0, 4);
  const others = g.members.filter((x) => x.slug !== m.slug);
  const planHref = `/${locale}/plan?${new URLSearchParams({ group: g.slug, members: m.slug, from: shift(next, -2), to: shift(next, 2) })}`;

  return (
    <div className="tap-links grid max-w-2xl gap-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: m.stageName,
          birthDate: m.birthday,
          memberOf: { "@type": "MusicGroup", name: g.name, url: `${site.url}/${locale}/groups/${g.slug}` },
          url: `${site.url}/${locale}/groups/${g.slug}/${m.slug}`,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: t.nav.groups, item: `${site.url}/${locale}/groups` },
            { "@type": "ListItem", position: 2, name: g.name, item: `${site.url}/${locale}/groups/${g.slug}` },
            { "@type": "ListItem", position: 3, name: m.stageName, item: `${site.url}/${locale}/groups/${g.slug}/${m.slug}` },
          ],
        }}
      />
      <Link href={`/${locale}/groups/${g.slug}`} className="text-sm text-brand hover:underline">← {g.name}</Link>
      <header className="flex flex-wrap items-center gap-3">
        <h1 className="text-4xl font-extrabold tracking-tight">{m.stageName}</h1>
        {days <= 60 && (
          <span className={`rounded-full px-3 py-1 text-sm font-black ${days === 0 ? "bg-pink text-white" : "bg-pink-soft text-pink"}`}>
            🎂 {days === 0 ? t.ux.today : `D-${days}`}
          </span>
        )}
      </header>
      <Link href={`/${locale}/groups/${g.slug}`} className="chip -mt-3 w-fit hover:text-text">{g.name} · {g.fandom}</Link>
      <div className="card grid gap-2">
        <p><span className="text-muted">{t.member.birthday}: </span><b>{formatDate(m.birthday, locale, { month: "long", day: "numeric" })}</b></p>
        <p><span className="text-muted">{t.member.nextBirthday}: </span><b>{formatDate(next, locale, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</b></p>
        <p className="text-sm text-muted">{t.member.cafes}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href={planHref} className="btn w-fit">{t.member.planCta}</Link>
        <Link href={`/${locale}/birthdays/${m.birthday.slice(5, 7)}`} className="btn-ghost h-12 w-fit">🎂 {t.birthdays.title(formatDate(m.birthday, locale, { month: "long" }))}</Link>
      </div>
      <AlertSignup
        locale={locale}
        group={g.slug}
        member={m.slug}
        failedLabel={t.submit.failed}
        labels={{ ...t.alerts, title: t.alerts.title(m.stageName), desc: t.alerts.desc(m.stageName), thanks: t.alerts.thanks(m.stageName) }}
      />
      {upcoming.length > 0 && (
        <section className="grid gap-3">
          <h2 className="section-title">🗓️ {t.group.upcoming}</h2>
          <ul className="grid gap-3">
            {upcoming.map((e) => (
              <li key={e.id}><EventCard e={e} locale={locale} today={today} accent={g.accent} /></li>
            ))}
          </ul>
        </section>
      )}
      {others.length > 0 && (
        <section className="grid gap-3">
          <h2 className="section-title">💜 {t.ux.otherMembers(g.name)}</h2>
          <ul className="flex flex-wrap gap-2">
            {others.map((x) => (
              <li key={x.slug}>
                <Link href={`/${locale}/groups/${g.slug}/${x.slug}`} className="inline-flex min-h-10 items-center rounded-full border-2 border-line bg-surface px-4 text-sm font-bold hover:border-brand hover:text-brand">
                  {x.stageName}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
