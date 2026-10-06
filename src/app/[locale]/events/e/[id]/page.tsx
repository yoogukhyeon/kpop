import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActivityCard } from "@/components/ActivityCard";
import { JsonLd } from "@/components/JsonLd";
import { getEvent, getGroup, listActivities, listAllEvents } from "@/lib/data";
import { alternates, formatDate, getDictionary, isLocale, locales } from "@/lib/i18n";
import { NOINDEX } from "@/lib/indexing";
import { mapsUrl, seoTitle, site } from "@/lib/site";

// One page per event: shareable link, Event structured data, a trip CTA and
// downloadable promo cards in every language (for birthday cafe hosts).
export const revalidate = 86400;

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateStaticParams() {
  const events = await listAllEvents();
  return locales.flatMap((locale) => events.map((e) => ({ locale, id: e.id })));
}

const shift = (d: string, n: number) => new Date(Date.parse(`${d}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  if (!isLocale(locale)) return {};
  const e = await getEvent(id);
  if (!e) return {};
  const t = getDictionary(locale);
  const desc = `${t.eventType[e.type]} · ${formatDate(e.startDate, locale, { month: "long", day: "numeric", year: "numeric" })} · ${e.venue}, Seoul`;
  const card = `/${locale}/events/e/${e.id}/card`;
  return {
    title: seoTitle(e.title),
    description: desc,
    alternates: alternates(locale, `/events/e/${e.id}`),
    // Unverified listings stay out of the index until checked.
    robots: e.verifiedAt ? undefined : NOINDEX,
    openGraph: { title: e.title, description: desc, images: [{ url: card, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title: e.title, images: [card] },
  };
}

export default async function EventPage({ params }: Props) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const e = await getEvent(id);
  if (!e) notFound();
  const t = getDictionary(locale);
  const d = t.eventDetail;
  const groups = (await Promise.all(e.groups.map(getGroup))).filter((g) => g !== undefined);
  const activities = (await listActivities({ group: groups[0]?.slug, tags: ["fan-tour", "dance"] })).filter((a) => !a.weekdays?.length).slice(0, 2);
  const memberSlugs = (e.members ?? []).map((m) => m.split("/")[1]);
  // Multi-artist events (no listed group) send people to the planner to pick their group.
  const planHref = groups[0]
    ? `/${locale}/plan?${new URLSearchParams({
        group: groups[0].slug,
        from: shift(e.startDate, -1),
        to: shift(e.endDate, 1),
        ...(memberSlugs.length ? { members: memberSlugs.join(",") } : {}),
      })}`
    : `/${locale}#planner`;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      {e.verifiedAt && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": e.type === "concert" ? "MusicEvent" : "Event",
            name: e.title,
            startDate: e.startDate,
            endDate: e.endDate,
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            eventStatus: "https://schema.org/EventScheduled",
            location: { "@type": "Place", name: e.venue, address: { "@type": "PostalAddress", addressLocality: "Seoul", addressCountry: "KR" } },
            performer: groups.map((g) => ({ "@type": "MusicGroup", name: g.name })),
            image: `${site.url}/${locale}/events/e/${e.id}/card`,
            url: `${site.url}/${locale}/events/e/${e.id}`,
          }}
        />
      )}
      <article className="grid content-start gap-6">
        <Link href={`/${locale}/events`} className="inline-flex min-h-10 w-fit items-center text-sm text-brand hover:underline">← {t.events.title}</Link>
        <header className="grid gap-3">
          <span className="chip-pink w-fit">{t.eventType[e.type]}</span>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{e.title}</h1>
          <div className="flex flex-wrap gap-1.5">
            {groups.map((g) => (
              <Link key={g.slug} href={`/${locale}/groups/${g.slug}`} className="chip hover:text-text">{g.name}</Link>
            ))}
          </div>
        </header>
        <dl className="card grid gap-3 text-sm">
          <div className="grid gap-0.5">
            <dt className="font-bold text-muted">📅 {d.when}</dt>
            <dd className="font-semibold">
              {formatDate(e.startDate, locale, { weekday: "short", month: "long", day: "numeric", year: "numeric" })}
              {e.endDate !== e.startDate && ` – ${formatDate(e.endDate, locale, { weekday: "short", month: "long", day: "numeric" })}`}
            </dd>
          </div>
          <div className="grid gap-0.5">
            <dt className="font-bold text-muted">📍 {d.where}</dt>
            <dd className="font-semibold">
              {e.venue} · {t.area[e.area]}{" "}
              <a href={mapsUrl(`${e.venue} Seoul`)} target="_blank" rel="noopener" className="font-bold text-brand hover:underline">{d.map} ↗</a>
            </dd>
          </div>
          {e.ticketing && (
            <div className="grid gap-0.5">
              <dt className="font-bold text-muted">🎫 {d.tickets}</dt>
              <dd>{e.ticketing.platform} · {t.access[e.ticketing.foreignerAccess]}</dd>
            </div>
          )}
          {!e.verifiedAt && <p className="text-xs text-warn">⚠ {t.plan.unverified}</p>}
          <a href={e.sourceUrl} target="_blank" rel="noopener" className="w-fit text-xs font-bold text-brand hover:underline">{t.plan.source} ↗</a>
        </dl>
        <Link href={planHref} className="btn w-fit">{d.plan}</Link>

        {activities.length > 0 && (
          <section className="grid gap-3">
            <h2 className="section-title">🎟️ {t.activities.recommended}</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {activities.map((a) => (
                <li key={a.id}><ActivityCard activity={a} locale={locale} compact /></li>
              ))}
            </ul>
          </section>
        )}
      </article>

      <aside className="grid h-fit gap-4 lg:sticky lg:top-24">
        <div className="card grid gap-3">
          <h2 className="font-bold">{d.share}</h2>
          {/* eslint-disable-next-line @next/next/no-img-element -- generated image */}
          <img src={`/${locale}/events/e/${e.id}/card?format=post`} alt="" width={1080} height={1350} className="mx-auto w-48 rounded-3xl border border-line" />
          <p className="text-xs text-muted">{d.promo}</p>
          <ul className="grid grid-cols-3 gap-1.5 text-xs font-bold">
            {locales.map((l) => (
              <li key={l}>
                <a
                  href={`/${l}/events/e/${e.id}/card?format=story`}
                  download={`${e.id}-${l}.png`}
                  className="inline-flex min-h-9 w-full items-center justify-center rounded-full border-2 border-line px-2 hover:border-brand hover:text-brand"
                >
                  {getDictionary(l).langName}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
