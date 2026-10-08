import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ActivityCard } from "@/components/ActivityCard";
import { ShareActions } from "@/components/ShareActions";
import { EventCard } from "@/components/EventCard";
import { listActivities, listEvents, listGroups } from "@/lib/data";
import { formatDate, getDictionary, isLocale, ogBase, type Locale } from "@/lib/i18n";
import { loadPlan, planSearch } from "@/lib/plan-params";
import { ink, pastelGradient } from "@/lib/color";
import { mapsUrl, seoulToday } from "@/lib/site";
import { AlertSignup } from "@/components/AlertSignup";
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
    openGraph: { ...ogBase(locale), title, images: [{ url: og, width: 1200, height: 630 }] },
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
  const [showTickets, anyDay, seoulEvents, groups] = await Promise.all([
    listActivities({ category: "ticket", tags: ["music-show"] }),
    listActivities({ group: group.slug, tags: ["fan-tour", "dance", "hongdae", "seongsu"] }),
    listEvents({ from, to }),
    listGroups(),
  ]);
  // Other groups' events while the fan is in Seoul (pop-ups are open to everyone).
  const inPlan = new Set(plan.days.flatMap((d) => d.events.map((e) => e.id)));
  const alsoOn = seoulEvents.filter((e) => !inPlan.has(e.id) && e.type !== "birthday-cafe" && e.type !== "birthday-event").slice(0, 6);
  const accentOf = new Map(groups.map((g) => [g.slug, g.accent]));
  const today = seoulToday();
  // Products tied to a weekday (music show packages) only appear in the
  // weekday-matched ticket slot, never as a free-day idea.
  const bookable = anyDay.filter((a) => !a.weekdays?.length);

  // Free days (no event) get one bookable idea: same neighbourhood as the day's
  // spots if possible, the bias group's own products first, never repeated.
  const ideas = new Map<string, (typeof bookable)[number]>();
  const used = new Set<string>();
  for (const day of plan.days) {
    if (day.events.length) continue;
    const dayAreas = new Set(day.areas.map((a) => a.area));
    const pick =
      bookable.find((a) => !used.has(a.id) && a.area && dayAreas.has(a.area)) ?? bookable.find((a) => !used.has(a.id));
    if (!pick) break;
    used.add(pick.id);
    ideas.set(day.date, pick);
  }
  const recommended = bookable.filter((a) => !used.has(a.id)).slice(0, 3);
  // Music show tickets for a given date, matched on the weekday the show records.
  const ticketsOn = (date: string) => {
    const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
    return showTickets.filter((a) => a.weekdays?.includes(weekday)).slice(0, 1);
  };

  return (
    <div className="grid gap-8">
      <section
        className="relative grid gap-3 overflow-hidden rounded-[2rem] p-6 sm:p-8"
        style={{ background: pastelGradient(group.accent), color: ink(group.accent) }}
      >
        <p className="text-sm font-semibold opacity-90">{focusNames.length ? focusNames.join(" · ") : group.fandom}</p>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{t.plan.title(group.name)}</h1>
        <p className="opacity-90">
          {formatDate(from, locale, { month: "long", day: "numeric", year: "numeric" })} – {formatDate(to, locale, { month: "long", day: "numeric" })}
        </p>
        <div className="flex flex-wrap gap-2 text-sm">
          {plan.stats.events > 0 && <Stat label={t.stats.events(plan.stats.events)} />}
          {plan.stats.birthdays > 0 && <Stat label={t.stats.birthdays(plan.stats.birthdays)} />}
          {plan.stats.spots > 0 && <Stat label={t.stats.spots(plan.stats.spots)} />}
        </div>
        <Link href={`/${locale}?group=${group.slug}#planner`} className="inline-flex min-h-10 w-fit items-center text-sm font-semibold underline underline-offset-4 opacity-90 hover:opacity-100">
          {t.plan.edit}
        </Link>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <ol className="grid gap-4">
          {plan.days.map((day, i) => (
            <li key={day.date} className="card grid gap-3">
              <h2 className="font-bold">
                <span className="text-muted">{t.plan.day(i + 1)} · </span>
                {formatDate(day.date, locale, { weekday: "short", month: "short", day: "numeric" })}
              </h2>

              {day.birthdays.map((m) => (
                <p key={m.slug} className="rounded-full bg-pink-soft px-4 py-2 text-sm font-bold text-pink">
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

              {ticketsOn(day.date).map((a) => (
                <div key={a.id} className="grid gap-1.5">
                  <p className="text-xs font-bold text-muted">🎫 {t.activities.onThisDay}</p>
                  <ActivityCard activity={a} locale={locale} compact />
                </div>
              ))}

              {ideas.get(day.date) && (
                <div className="grid gap-1.5">
                  <p className="text-xs font-bold text-muted">💡 {t.activities.freeDayIdea}</p>
                  <ActivityCard activity={ideas.get(day.date)!} locale={locale} compact />
                </div>
              )}

              {!day.events.length && !day.areas.length && !day.birthdays.length && !ideas.get(day.date) && (
                <p className="text-sm text-muted">{t.plan.noEvents}</p>
              )}
            </li>
          ))}
          {alsoOn.length > 0 && (
            <li className="grid gap-3">
              <h2 className="section-title">🗓️ {t.ux.alsoInSeoul}</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {alsoOn.map((e) => (
                  <li key={e.id}><EventCard e={e} locale={locale} today={today} accent={accentOf.get(e.groups[0])} /></li>
                ))}
              </ul>
            </li>
          )}
        </ol>

        <aside className="grid h-fit gap-4 lg:sticky lg:top-24">
          <div className="card grid gap-3">
            <h2 className="font-bold">{t.plan.share}</h2>
            {/* eslint-disable-next-line @next/next/no-img-element -- generated image, not a static asset */}
            <img
              src={`/api/card?${search}&format=story&locale=${locale}`}
              alt=""
              width={1080}
              height={1920}
              className="mx-auto w-40 rounded-3xl border border-line"
            />
            <p className="text-xs text-muted">{t.plan.shareNote}</p>
            <ShareActions
              cardUrl={`/api/card?${search}&format=story&locale=${locale}`}
              fileName={`${group.slug}-seoul-trip.png`}
              labels={{ download: t.plan.download, copy: t.plan.copy, copied: t.plan.copied }}
            />
          </div>

          <AlertSignup
            locale={locale}
            group={group.slug}
            member={memberSlugs[0]}
            failedLabel={t.submit.failed}
            labels={{ ...t.alerts, title: t.alerts.title(group.name), desc: t.alerts.desc(group.name), thanks: t.alerts.thanks(group.name) }}
          />

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
          {recommended.length > 0 && (
            <div className="card grid gap-3">
              <h2 className="font-bold">🎟️ {t.activities.recommended}</h2>
              {recommended.map((a) => (
                <ActivityCard key={a.id} activity={a} locale={locale} compact />
              ))}
              <p className="text-xs text-muted">{t.activities.note}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function Stat({ label }: { label: string }) {
  return <span className="rounded-full bg-white/70 px-3 py-1 font-bold">{label}</span>;
}

function EventRow({ e, locale }: { e: KEvent; locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <div className="grid gap-1 rounded-3xl bg-subtle p-4 text-sm">
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
