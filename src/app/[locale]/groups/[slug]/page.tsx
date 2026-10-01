import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGroup, listEvents, listGroups, listPlacesForGroup } from "@/lib/data";
import { alternates, formatDate, getDictionary, isLocale, locales } from "@/lib/i18n";
import { JsonLd } from "@/components/JsonLd";
import { mapsUrl, seoulToday, site } from "@/lib/site";

type Props = { params: Promise<{ locale: string; slug: string }> };

// Upcoming events and "next birthday" depend on today.
export const revalidate = 3600;

export async function generateStaticParams() {
  const groups = await listGroups();
  return locales.flatMap((locale) => groups.map((g) => ({ locale, slug: g.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const g = await getGroup(slug);
  if (!g || !isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    title: t.meta.groupTitle(g.name),
    description: t.meta.groupDesc(g.name, g.agency, g.fandom),
    alternates: alternates(locale, `/groups/${g.slug}`),
  };
}

export default async function GroupPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const g = await getGroup(slug);
  if (!g) notFound();
  const t = getDictionary(locale);
  const [places, upcoming] = await Promise.all([
    listPlacesForGroup(g.slug).then((ps) => ps.filter((p) => p.groups.includes(g.slug))),
    listEvents({ from: seoulToday(), group: g.slug }),
  ]);

  return (
    <div className="grid gap-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: t.nav.groups, item: `${site.url}/${locale}/groups` },
            { "@type": "ListItem", position: 2, name: g.name, item: `${site.url}/${locale}/groups/${g.slug}` },
          ],
        }}
      />
      <section className="grid gap-3">
        <span className="h-2 w-16 rounded-full" style={{ background: g.accent }} />
        <h1 className="text-4xl font-extrabold tracking-tight">{g.name} <span className="text-2xl font-semibold text-muted">{g.nameKo}</span></h1>
        <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
          <div><dt className="inline text-muted">{t.group.fandom}: </dt><dd className="inline font-medium">{g.fandom}</dd></div>
          <div><dt className="inline text-muted">{t.group.agency}: </dt><dd className="inline font-medium">{g.agency}</dd></div>
          <div><dt className="inline text-muted">{t.group.debut}: </dt><dd className="inline font-medium">{g.debutYear}</dd></div>
        </dl>
        <Link href={`/${locale}?group=${g.slug}`} className="btn w-fit">{t.group.planCta(g.name)}</Link>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-bold">{t.group.upcoming}</h2>
        {upcoming.length ? (
          <ul className="grid gap-2">
            {upcoming.map((e) => (
              <li key={e.id} className="card text-sm">
                <b>{e.title}</b> · {formatDate(e.startDate, locale)}–{formatDate(e.endDate, locale)} · {e.venue}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">{t.group.noUpcoming}</p>
        )}
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-bold">{t.group.members}</h2>
        {g.members.length ? (
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {g.members.map((m) => (
              <li key={m.slug}>
                <Link href={`/${locale}/groups/${g.slug}/${m.slug}`} className="card grid gap-0.5 p-4 transition hover:border-brand">
                  <b>{m.stageName}</b>
                  <span className="text-xs text-muted">🎂 {formatDate(m.birthday, locale, { month: "long", day: "numeric" })}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">{t.group.membersSoon}</p>
        )}
      </section>

      {places.length > 0 && (
        <section className="grid gap-3">
          <h2 className="text-xl font-bold">{t.group.spots}</h2>
          <ul className="grid gap-2">
            {places.map((p) => (
              <li key={p.id} className="card text-sm">
                <a href={mapsUrl(p.address ?? p.name)} target="_blank" rel="noopener" className="font-semibold hover:text-brand">{p.name}</a>
                <p className="text-muted">{t.area[p.area]} — {p.note[locale]}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
