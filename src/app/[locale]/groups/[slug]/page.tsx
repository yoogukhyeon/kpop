import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActivityCard } from "@/components/ActivityCard";
import { Cover } from "@/components/Cover";
import { ink, pastel } from "@/lib/color";
import { GroupCard } from "@/components/GroupCard";
import { JsonLd } from "@/components/JsonLd";
import { isGroupIndexable, NOINDEX } from "@/lib/indexing";
import { MobileCta } from "@/components/MobileCta";
import { PlanBox } from "@/components/PlanBox";
import { getGroup, listActivities, listEvents, listGroups, listPlacesForGroup } from "@/lib/data";
import { alternates, formatDate, getDictionary, isLocale, locales } from "@/lib/i18n";
import { mapsUrl, seoulToday, site } from "@/lib/site";
import type { Area, Place } from "@/lib/types";

type Props = { params: Promise<{ locale: string; slug: string }> };

// Upcoming events and "next birthday" depend on today.
export const revalidate = 3600;

const SIGHTSEEING = new Set<Place["type"]>(["agency", "landmark", "store", "experience"]);
const addDays = (d: string, n: number) => new Date(Date.parse(`${d}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

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
    robots: isGroupIndexable(g) ? undefined : NOINDEX,
  };
}

export default async function GroupPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const g = await getGroup(slug);
  if (!g) notFound();
  const t = getDictionary(locale);
  const d = t.detail;
  const today = seoulToday();
  const [allPlaces, upcoming, groups, activities] = await Promise.all([
    listPlacesForGroup(g.slug),
    listEvents({ from: today, group: g.slug }),
    listGroups(),
    listActivities({ group: g.slug, tags: ["fan-tour", "dance", "music-show"], limit: 4 }),
  ]);

  // Route: the group's own places first, then spots every fan visits, grouped by area.
  const route = allPlaces
    .filter((p) => SIGHTSEEING.has(p.type))
    .sort((a, b) => Number(b.groups.includes(g.slug)) - Number(a.groups.includes(g.slug)));
  const byArea = new Map<Area, Place[]>();
  for (const p of route) byArea.set(p.area, [...(byArea.get(p.area) ?? []), p]);
  const related = groups.filter((x) => x.slug !== g.slug && x.kind === g.kind).slice(0, 4);
  const planHref = `/${locale}/plan?${new URLSearchParams({ group: g.slug, from: addDays(today, 30), to: addDays(today, 35) })}`;

  const tabs = [
    ["overview", d.tabs.overview],
    ["route", d.tabs.route],
    ["events", d.tabs.events],
    ...(activities.length ? [["activities", t.activities.nav]] : []),
    ...(g.members.length ? [["members", d.tabs.members]] : []),
    ["tips", d.tabs.tips],
    ["faq", d.tabs.faq],
  ] as const;

  return (
    <div className="grid gap-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: d.home, item: `${site.url}/${locale}` },
            { "@type": "ListItem", position: 2, name: t.nav.groups, item: `${site.url}/${locale}/groups` },
            { "@type": "ListItem", position: 3, name: g.name, item: `${site.url}/${locale}/groups/${g.slug}` },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: d.title(g.name),
          itemListElement: route.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "TouristAttraction",
              name: p.name,
              description: p.note[locale],
              ...(p.address ? { address: { "@type": "PostalAddress", streetAddress: p.address, addressLocality: "Seoul", addressCountry: "KR" } } : {}),
            },
          })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: d.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />

      <nav className="tap-links flex flex-wrap items-center gap-x-1.5 text-sm text-muted">
        <Link href={`/${locale}`} className="hover:text-text">{d.home}</Link>
        <span>›</span>
        <Link href={`/${locale}/groups`} className="hover:text-text">{t.nav.groups}</Link>
        <span>›</span>
        <span className="font-semibold text-text">{g.name}</span>
      </nav>

      {/* Gallery: one large cover + neighbourhood tiles */}
      <div className="grid h-64 grid-cols-4 grid-rows-2 gap-2.5 overflow-hidden rounded-[2rem] sm:h-96">
        <Cover accent={g.accent} title={g.name} subtitle={`${g.nameKo} · ${g.fandom}`} size="lg" className="col-span-4 row-span-2 sm:col-span-2" />
        {[
          ...[...byArea.keys()].map((area) => ({ key: area, href: "#route", label: `📍 ${d.tabs.route}`, title: t.area[area] })),
          ...(g.members.length ? [{ key: "members", href: "#members", label: "🎂", title: d.members(g.members.length) }] : []),
          { key: "events", href: "#events", label: "🗓️", title: d.tabs.events },
          { key: "faq", href: "#faq", label: "💬", title: d.tabs.faq },
        ]
          .slice(0, 4)
          .map((tile, i) => (
            <a
              key={tile.key}
              href={tile.href}
              className="hidden flex-col justify-end p-4 transition hover:brightness-[1.03] sm:flex"
              style={{ background: pastel(g.accent, 18 + i * 7), color: ink(g.accent) }}
            >
              <span className="text-xs font-semibold opacity-85">{tile.label}</span>
              <span className="text-lg font-extrabold leading-tight">{tile.title}</span>
            </a>
          ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
        <div className="grid min-w-0 gap-10">
          {/* Title + quick facts */}
          <section id="overview" className="grid gap-4">
            <div className="flex flex-wrap gap-1.5">
              <span className="chip-pink">{g.fandom}</span>
              <span className="chip">{g.agency}</span>
              <span className="chip">{t.group.debut} {g.debutYear}</span>
            </div>
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">{d.title(g.name)}</h1>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 border-y border-line py-4 text-sm font-semibold">
              {g.members.length > 0 && <li>👥 {d.members(g.members.length)}</li>}
              <li>📍 {d.spots(route.length)}</li>
              <li>🗓️ {d.events(upcoming.length)}</li>
              <li>🌏 EN · 日本語 · 繁中 · 简中 · VI · ไทย · ID · ES · 한국어</li>
            </ul>
            <p className="leading-relaxed text-muted">{d.overview(g.name, g.fandom, route.length)}</p>
          </section>

          {/* Sticky section tabs */}
          <nav className="sticky top-16 z-30 -mx-4 -mt-6 flex gap-6 overflow-x-auto border-b border-line bg-surface/95 px-4 text-[15px] font-bold text-muted backdrop-blur sm:mx-0 sm:px-0">
            {tabs.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="shrink-0 border-b-2 border-transparent py-3.5 hover:border-text hover:text-text">
                {label}
              </a>
            ))}
          </nav>

          <section id="route" className="grid gap-4">
            <div className="grid gap-1">
              <h2 className="section-title">🗺️ {d.tabs.route}</h2>
              <p className="text-sm text-muted">{d.routeNote}</p>
            </div>
            <ol className="grid">
              {[...byArea.entries()].map(([area, places], i, all) => (
                <li key={area} className="grid grid-cols-[32px_1fr] gap-4">
                  <div className="flex flex-col items-center">
                    <span className="grid h-8 w-8 place-items-center rounded-full text-sm font-black" style={{ background: pastel(g.accent, 35), color: ink(g.accent) }}>{i + 1}</span>
                    {i < all.length - 1 && <span className="w-px flex-1 bg-line" />}
                  </div>
                  <div className="grid gap-2 pb-7">
                    <p className="pt-1 font-bold">{t.area[area]}</p>
                    {places.map((p) => (
                      <a
                        key={p.id}
                        href={mapsUrl(p.address ?? p.name)}
                        target="_blank"
                        rel="noopener"
                        className="grid gap-1 rounded-3xl bg-subtle p-4 transition hover:bg-brand-soft"
                      >
                        <span className="flex flex-wrap items-center gap-1.5 font-semibold">
                          {p.name}
                          {p.groups.includes(g.slug) && <span className="chip-pink">{g.name}</span>}
                        </span>
                        <span className="text-sm text-muted">{p.note[locale]}</span>
                      </a>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="events" className="grid gap-4">
            <h2 className="section-title">🗓️ {t.group.upcoming}</h2>
            {upcoming.length ? (
              <ul className="grid gap-3">
                {upcoming.map((e) => (
                  <li key={e.id} className="card flex items-center gap-4 p-4">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl" style={{ background: pastel(g.accent, 30), color: ink(g.accent) }}>
                      <span className="text-[11px] font-semibold leading-none">{formatDate(e.startDate, locale, { month: "short" })}</span>
                      <span className="text-lg font-extrabold leading-none">{formatDate(e.startDate, locale, { day: "numeric" })}</span>
                    </div>
                    <div className="grid min-w-0 gap-1 text-sm">
                      <span className="chip w-fit">{t.eventType[e.type]}</span>
                      <b className="truncate">{e.title}</b>
                      <span className="text-muted">{formatDate(e.startDate, locale)} – {formatDate(e.endDate, locale)} · {e.venue}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-3xl bg-subtle p-5 text-sm text-muted">{t.group.noUpcoming}</p>
            )}
          </section>

          {activities.length > 0 && (
            <section id="activities" className="grid gap-4">
              <h2 className="section-title">🎟️ {t.activities.recommended}</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {activities.map((a) => (
                  <li key={a.id}><ActivityCard activity={a} locale={locale} compact /></li>
                ))}
              </ul>
              <p className="text-xs text-muted">{t.activities.note}</p>
            </section>
          )}

          {g.members.length > 0 && (
            <section id="members" className="grid gap-4">
              <h2 className="section-title">💜 {t.group.members}</h2>
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {g.members.map((m) => (
                  <li key={m.slug}>
                    <Link href={`/${locale}/groups/${g.slug}/${m.slug}`} className="flex items-center gap-3 rounded-full border border-line bg-surface p-2 pr-4 transition hover:border-brand">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-black" style={{ background: pastel(g.accent, 35), color: ink(g.accent) }}>
                        {m.stageName.slice(0, 1)}
                      </span>
                      <span className="grid min-w-0">
                        <b className="truncate">{m.stageName}</b>
                        <span className="text-xs text-muted">🎂 {formatDate(m.birthday, locale, { month: "long", day: "numeric" })}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section id="tips" className="grid gap-4">
            <h2 className="section-title">💡 {d.tabs.tips}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid content-start gap-2 rounded-3xl bg-mint-soft p-5">
                <p className="font-bold">💚 {d.doTitle}</p>
                {d.dos.map((x) => <p key={x} className="flex gap-2 text-sm"><span className="font-bold text-ok">✓</span>{x}</p>)}
              </div>
              <div className="grid content-start gap-2 rounded-3xl bg-pink-soft p-5">
                <p className="font-bold">🙏 {d.dontTitle}</p>
                {d.donts.map((x) => <p key={x} className="flex gap-2 text-sm"><span className="font-bold text-pink">✕</span>{x}</p>)}
              </div>
            </div>
          </section>

          <section id="faq" className="grid gap-3">
            <h2 className="section-title">💬 {d.tabs.faq}</h2>
            {d.faq.map((f) => (
              <details key={f.q} className="group rounded-3xl border border-line bg-surface px-5 py-4 open:bg-brand-soft">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  <span>Q. {f.q}</span>
                  <span className="text-muted transition group-open:rotate-180">⌄</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </section>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <PlanBox
              locale={locale}
              group={g.slug}
              defaults={{ from: addDays(today, 30), to: addDays(today, 35) }}
              labels={{ title: d.planTitle(g.name), note: d.planNote, from: t.form.from, to: t.form.to, submit: t.form.submit }}
            />
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-6 grid gap-5 border-t border-line pt-10">
          <h2 className="section-title">⭐ {d.related}</h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-4">
            {related.map((x) => (
              <li key={x.slug}>
                <GroupCard group={x} locale={locale} membersLabel={x.members.length ? d.members(x.members.length) : undefined} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <MobileCta href={planHref} label={d.planTitle(g.name)} note={d.planNote} />
    </div>
  );
}
