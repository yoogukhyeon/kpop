import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { defaultLocale, formatDate, getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { loadPlan } from "@/lib/plan-params";
import { mixHex } from "@/lib/color";
import { ogFonts } from "@/lib/og-font";
import { site } from "@/lib/site";

// Share card for a trip plan. `format=story` → 1080×1920 (IG/TikTok story),
// `format=og` → 1200×630 (link previews on X, Discord, etc.). `locale` picks the language.

const SIZES = { story: { width: 1080, height: 1920 }, og: { width: 1200, height: 630 } } as const;
export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams);
  const loaded = await loadPlan(params);
  if (!loaded) return new Response("Invalid plan", { status: 400 });

  const locale: Locale = params.locale && isLocale(params.locale) ? params.locale : defaultLocale;
  const format = params.format === "og" ? "og" : "story";
  const { width, height } = SIZES[format];
  const story = format === "story";
  const t = getDictionary(locale);
  const { group, plan, from, to, memberSlugs } = loaded;
  const focus = group.members.filter((m) => memberSlugs.includes(m.slug)).map((m) => m.stageName);

  // Multi-day events appear once, with the part of their run inside the trip.
  const eventDays = new Map<string, { title: string; first: string; last: string }>();
  for (const d of plan.days) {
    for (const e of d.events) {
      const seen = eventDays.get(e.id);
      eventDays.set(e.id, { title: e.title, first: seen?.first ?? d.date, last: d.date });
    }
  }
  const range = (a: string, b: string) => (a === b ? formatDate(a, locale) : `${formatDate(a, locale)} – ${formatDate(b, locale)}`);

  const highlights = [
    ...plan.days.flatMap((d) => d.birthdays.map((m) => `${t.card.birthday(m.stageName)} · ${formatDate(d.date, locale)}`)),
    ...[...eventDays.values()].map((e) => `${t.card.live} · ${e.title} · ${range(e.first, e.last)}`),
    ...plan.days.flatMap((d) => d.areas.flatMap((a) => a.places.filter((p) => p.groups.includes(group.slug)).map((p) => `${t.card.spot} · ${p.name}`))),
  ].filter((h, i, all) => all.indexOf(h) === i).slice(0, story ? 6 : 2);

  const header = `${site.name}  ·  ${focus.length ? focus.join(" · ") : group.fandom}`;
  const title = t.card.title(group.name);
  const dates = `${formatDate(from, locale)} – ${formatDate(to, locale, { month: "short", day: "numeric", year: "numeric" })}`;
  // Zero counts read as "nothing here", so only non-empty stats go on the card.
  const stats = [
    plan.stats.events && t.stats.events(plan.stats.events),
    plan.stats.birthdays && t.stats.birthdays(plan.stats.birthdays),
    plan.stats.spots && t.stats.spots(plan.stats.spots),
  ].filter((s): s is string => Boolean(s));
  const footer = `${t.card.cta} → ${site.url.replace(/^https?:\/\//, "")}`;

  const allText = [header, ...title, dates, ...stats, ...highlights, footer].join("");
  const fonts = await ogFonts(locale, allText);

  const s = <T,>(storyValue: T, ogValue: T) => (story ? storyValue : ogValue);

  // Shrink the title so the longest line fits: CJK glyphs are ~1em wide, Latin ~0.6em.
  const em = (line: string) => [...line].reduce((w, ch) => w + (/[\u3000-\u9fff\uac00-\ud7af\uff00-\uffef]/.test(ch) ? 1 : 0.6), 0);
  const titleSize = Math.min(s(116, 58), Math.floor(s(880, 700) / Math.max(...title.map(em))));

  return new ImageResponse(
    (
      <div
        style={{
          width, height, display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: s(96, 56), color: mixHex(group.accent, "#1b1530", 0.7), fontFamily: fonts.length ? [...new Set(fonts.map((f) => f.name))].join(", ") : undefined,
          background: `linear-gradient(160deg, ${mixHex(group.accent, "#ffffff", 0.18)} 0%, ${mixHex(group.accent, "#ffffff", 0.45)} 100%)`,
        }}
      >
        <div style={{ display: "flex", fontSize: s(40, 24), opacity: 0.85 }}>{header}</div>

        <div style={{ display: "flex", flexDirection: "column", gap: s(28, 12) }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: titleSize, fontWeight: 800, lineHeight: 1.08 }}>
            {title.map((line) => <span key={line}>{line}</span>)}
          </div>
          <div style={{ display: "flex", fontSize: s(48, 30) }}>{dates}</div>
          <div style={{ display: "flex", gap: s(24, 16), fontSize: s(40, 26), marginTop: s(16, 4) }}>
            {stats.map((label) => (
              <div
                key={label}
                style={{ display: "flex", lineHeight: 1.2, padding: s("14px 28px", "8px 18px"), borderRadius: 999, background: "rgba(255,255,255,0.75)" }}
              >
                {label}
              </div>
            ))}
          </div>
          {highlights.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: s(18, 8), fontSize: s(38, 24), marginTop: s(40, 8) }}>
              {highlights.map((h) => (
                <div key={h} style={{ display: "flex" }}>{h}</div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", fontSize: s(36, 22), opacity: 0.85 }}>{footer}</div>
      </div>
    ),
    { width, height, fonts, headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400" } },
  );
}
