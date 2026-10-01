import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ShareActions } from "@/components/ShareActions";
import { formatDate, getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { loadPlan, planSearch } from "@/lib/plan-params";
import { mapsUrl } from "@/lib/site";
import type { KEvent } from "@/lib/types";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params;
  const loaded = isLocale(locale) ? await loadPlan(await searchParams) : null;
  if (!loaded || !isLocale(locale)) return {};
  const t = getDictionary(locale);
  const title = `${t.plan.title(loaded.group.name)} · ${formatDate(loaded.from, locale)} – ${formatDate(loaded.to, locale)}`;
  const og = `/api/card?${planSearch({ ...loaded, group: loaded.group.slug })}&format=og&locale=${locale}`;
  return {
    title,
    // Personal plans are share targets, not search landing pages.
    robots: { index: false, follow: true },
    openGraph: { title, images: [{ url: og, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, images: [og] },
  };
}

export default async function PlanPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const loaded = await loadPlan(await searchParams);
  if (!loaded) redirect(`/${locale}`);
  const t = getDictionary(locale);
  const { group, plan, from, to, memberSlugs } = loaded;
  const search = planSearch({ group: group.slug, from, to, memberSlugs });
  const focusNames = group.members.filter((m) => memberSlugs.includes(m.slug)).map((m) => m.stageName);

  return (
    <div className="grid gap-8">
      <section className="grid gap-3">
        <p className="text-sm font-semibold" style={{ color: group.accent }}>
          {focusNames.length ? focusNames.join(" · ") : group.fandom}
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{t.plan.title(group.name)}</h1>
        <p className="text-muted">
          {formatDate(from, locale, { month: "long", day: "numeric" })} – {formatDate(to, locale, { month: "long", day: "numeric", year: "numeric" })}
        </p>
        <div className="flex flex-wrap gap-2 text-sm">
          <Stat label={t.stats.events(plan.stats.events)} />
          <Stat label={t.stats.birthdays(plan.stats.birthdays)} />
          <Stat label={t.stats.spots(plan.stats.spots)} />
        </div>
        <Link href={`/${locale}?group=${group.slug}`} className="w-fit text-sm text-brand underline-offset-4 hover:underline">
          {t.plan.edit}
        </Link>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <ol className="grid gap-4">
          {plan.days.map((day, i) => (
            <li key={day.date} className="card grid gap-3">
              <h2 className="font-bold">
                <span className="text-muted">{t.plan.day(i + 1)} · </span>
                {formatDate(day.date, locale, { weekday: "short", month: "short", day: "numeric" })}
              </h2>

              {day.birthdays.map((m) => (
                <p key={m.slug} className="rounded-xl bg-brand-soft px-3 py-2 text-sm font-medium text-brand">
                  🎂 {t.plan.birthday(m.stageName)}
                </p>
              ))}

              {day.events.map((e) => <EventRow key={e.id} e={e} locale={locale} />)}

              {day.areas.map(({ area, places }) => (
                <div key={area} className="grid gap-1.5">
                  <h3 className="text-sm font-semibold text-muted">📍 {t.area[area]}</h3>
                  <ul className="grid gap-1.5">
                    {places.map((p) => (
                      <li key={p.id} className="text-sm">
                        <a href={mapsUrl(p.address ?? p.name)} target="_blank" rel="noopener" className="font-medium hover:text-brand">
                          {p.name}
                        </a>
                        <span className="text-muted"> — {p.note[locale]}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {!day.events.length && !day.areas.length && !day.birthdays.length && (
                <p className="text-sm text-muted">{t.plan.noEvents}</p>
              )}
            </li>
          ))}
        </ol>

        <aside className="grid h-fit gap-4 lg:sticky lg:top-4">
          <div className="card grid gap-3">
            <h2 className="font-bold">{t.plan.share}</h2>
            {/* eslint-disable-next-line @next/next/no-img-element -- generated image, not a static asset */}
            <img
              src={`/api/card?${search}&format=story&locale=${locale}`}
              alt=""
              width={1080}
              height={1920}
              className="mx-auto w-40 rounded-xl border border-line"
            />
            <p className="text-xs text-muted">{t.plan.shareNote}</p>
            <ShareActions
              cardUrl={`/api/card?${search}&format=story&locale=${locale}`}
              fileName={`${group.slug}-seoul-trip.png`}
              labels={{ download: t.plan.download, copy: t.plan.copy, copied: t.plan.copied }}
            />
          </div>

          {plan.nearbyBirthdays.length > 0 && (
            <div className="card grid gap-2 text-sm">
              <h2 className="font-bold">{t.plan.nearby}</h2>
              {plan.nearbyBirthdays.map(({ member, date }) => (
                <p key={member.slug}>🎂 {member.stageName} · {formatDate(date, locale)}</p>
              ))}
            </div>
          )}

          <div className="card grid gap-2 text-sm">
            <h2 className="font-bold">{t.plan.musicShows}</h2>
            <p className="text-muted">{t.plan.musicShowsNote}</p>
            {plan.musicShowPlaces.map((p) => (
              <p key={p.id}><span className="font-medium">{p.name}</span> — <span className="text-muted">{p.note[locale]}</span></p>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label }: { label: string }) {
  return <span className="rounded-full border border-line bg-surface px-3 py-1 font-medium">{label}</span>;
}

function EventRow({ e, locale }: { e: KEvent; locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <div className="grid gap-1 rounded-xl border border-line p-3 text-sm">
      <p>
        <span className="mr-2 rounded-md bg-brand-soft px-1.5 py-0.5 text-xs font-semibold text-brand">{t.eventType[e.type]}</span>
        <b>{e.title}</b>
      </p>
      <p className="text-muted">{e.venue} · {t.area[e.area]}</p>
      {e.ticketing && (
        <p className="text-muted">{t.events.access}: {t.access[e.ticketing.foreignerAccess]}</p>
      )}
      {!e.verifiedAt && <p className="text-xs text-warn">⚠ {t.plan.unverified}</p>}
      <a href={e.sourceUrl} target="_blank" rel="noopener" className="w-fit text-xs text-brand hover:underline">{t.plan.source} ↗</a>
    </div>
  );
}
