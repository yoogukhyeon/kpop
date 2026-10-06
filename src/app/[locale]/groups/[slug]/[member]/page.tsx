import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGroup, listGroups } from "@/lib/data";
import { alternates, formatDate, getDictionary, isLocale, locales } from "@/lib/i18n";
import { JsonLd } from "@/components/JsonLd";
import { isMemberIndexable, NOINDEX } from "@/lib/indexing";
import { seoulToday, site } from "@/lib/site";

type Props = { params: Promise<{ locale: string; slug: string; member: string }> };

// Upcoming events and "next birthday" depend on today.
export const revalidate = 3600;

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
    title: t.meta.memberTitle(m.stageName, g.name),
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
  const next = nextBirthday(m.birthday, seoulToday());
  const planHref = `/${locale}/plan?${new URLSearchParams({ group: g.slug, members: m.slug, from: shift(next, -2), to: shift(next, 2) })}`;

  return (
    <div className="tap-links grid max-w-2xl gap-6">
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
      <h1 className="text-4xl font-extrabold tracking-tight">{m.stageName}</h1>
      <div className="card grid gap-2">
        <p><span className="text-muted">{t.member.birthday}: </span><b>{formatDate(m.birthday, locale, { month: "long", day: "numeric" })}</b></p>
        <p><span className="text-muted">{t.member.nextBirthday}: </span><b>{formatDate(next, locale, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</b></p>
        <p className="text-sm text-muted">{t.member.cafes}</p>
      </div>
      <Link href={planHref} className="btn w-fit">{t.member.planCta}</Link>
    </div>
  );
}
