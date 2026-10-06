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

  const allText = [header, ...title, dates, ...stats, ...highlights, footer, "SEOUL TRIP"].join("");
  const fonts = await ogFonts(locale, allText);

  const s = <T,>(storyValue: T, ogValue: T) => (story ? storyValue : ogValue);

  // Shrink the title so the longest line fits: CJK glyphs are ~1em wide, Latin ~0.6em.
  const em = (line: string) => [...line].reduce((w, ch) => w + (/[\u3000-\u9fff\uac00-\ud7af\uff00-\uffef]/.test(ch) ? 1 : 0.6), 0);
  const titleSize = Math.min(s(116, 58), Math.floor(s(780, 620) / Math.max(...title.map(em))));

  const dark = mixHex(group.accent, "#120a24", 0.78);
  const light = mixHex(group.accent, "#ffffff", 0.35);
  const fontFamily = fonts.length ? [...new Set(fonts.map((f) => f.name))].join(", ") : undefined;
  // Deterministic "barcode" from the trip so each card looks unique.
  const bars = [...`${group.slug}${from}${to}`].map((ch) => 2 + (ch.charCodeAt(0) % 5));

  return new ImageResponse(
    (
      <div
        style={{
          width, height, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative",
          padding: s(80, 48), color: "#ffffff", fontFamily,
          backgroundImage: [
            `radial-gradient(circle at 85% 8%, ${light}aa 0%, transparent 40%)`,
            `radial-gradient(circle at 0% 100%, #ff6fd877 0%, transparent 45%)`,
            `linear-gradient(165deg, ${mixHex(group.accent, "#120a24", 0.45)} 0%, ${dark} 100%)`,
          ].join(", "),
        }}
      >
        {/* Stage light beams and sparkles */}
        <div style={{ position: "absolute", top: s(-200, -150), right: s(260, 300), width: s(220, 140), height: s(1700, 900), display: "flex", transform: "rotate(24deg)", backgroundImage: `linear-gradient(180deg, ${light}66, transparent 65%)` }} />
        <div style={{ position: "absolute", top: s(-200, -150), right: s(40, 80), width: s(160, 100), height: s(1700, 900), display: "flex", transform: "rotate(-18deg)", backgroundImage: "linear-gradient(180deg, #ff9fd055, transparent 65%)" }} />
        <Sparkle x={s(820, 980)} y={s(220, 110)} size={s(56, 34)} color="#ffe08a" />
        <Sparkle x={s(140, 640)} y={s(1500, 70)} size={s(40, 24)} color="#ffffff" />
        <Sparkle x={s(900, 1110)} y={s(1320, 520)} size={s(34, 22)} color="#ff9fd0" />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ display: "flex", fontSize: s(34, 22), fontWeight: 800, opacity: 0.9 }}>{header}</span>
          <span style={{ display: "flex", padding: s("10px 26px", "6px 16px"), borderRadius: 999, border: "2px solid rgba(255,255,255,0.6)", fontSize: s(28, 18), fontWeight: 800, letterSpacing: 4 }}>
            SEOUL TRIP
          </span>
        </div>

        {/* The ticket */}
        <div
          style={{
            display: "flex", flexDirection: "column", gap: s(28, 12), position: "relative",
            padding: s("64px 60px", "32px 40px"), borderRadius: s(56, 32),
            background: "rgba(255,255,255,0.13)", border: "2px solid rgba(255,255,255,0.35)",
            boxShadow: `0 30px 80px ${mixHex(group.accent, "#000000", 0.6)}88`,
          }}
        >
          <div style={{ position: "absolute", left: s(-30, -18), top: "50%", width: s(60, 36), height: s(60, 36), borderRadius: 999, background: dark, display: "flex" }} />
          <div style={{ position: "absolute", right: s(-30, -18), top: "50%", width: s(60, 36), height: s(60, 36), borderRadius: 999, background: dark, display: "flex" }} />
          <div style={{ display: "flex", flexDirection: "column", fontSize: titleSize, fontWeight: 800, lineHeight: 1.06, textShadow: `0 6px 30px ${light}` }}>
            {title.map((line) => <span key={line}>{line}</span>)}
          </div>
          <div style={{ display: "flex", fontSize: s(46, 28), fontWeight: 800, color: "#ffe08a" }}>{dates}</div>
          {stats.length > 0 && (
            <div style={{ display: "flex", gap: s(20, 12), fontSize: s(36, 22) }}>
              {stats.map((label) => (
                <div key={label} style={{ display: "flex", lineHeight: 1.2, padding: s("12px 28px", "6px 16px"), borderRadius: 999, background: "#ffffff", color: dark, fontWeight: 800 }}>
                  {label}
                </div>
              ))}
            </div>
          )}
          {highlights.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: s(18, 8), fontSize: s(36, 22), marginTop: s(24, 4), paddingTop: s(32, 12), borderTop: "3px dashed rgba(255,255,255,0.35)" }}>
              {highlights.map((h) => (
                <div key={h} style={{ display: "flex", alignItems: "center", gap: s(18, 10) }}>
                  <div style={{ display: "flex", width: s(16, 10), height: s(16, 10), borderRadius: 999, background: "#ff9fd0", flexShrink: 0 }} />
                  <span style={{ display: "flex" }}>{h}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <span style={{ display: "flex", fontSize: s(32, 20), fontWeight: 800, opacity: 0.9 }}>{footer}</span>
          <div style={{ display: "flex", alignItems: "flex-end", gap: s(5, 3), height: s(70, 40) }}>
            {bars.slice(0, story ? 28 : 18).map((w, i) => (
              <div key={i} style={{ display: "flex", width: s(w * 2, w), height: "100%", background: "rgba(255,255,255,0.85)" }} />
            ))}
          </div>
        </div>
      </div>
    ),
    { width, height, fonts, headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400" } },
  );
}

function Sparkle({ x, y, size, color }: { x: number; y: number; size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: "absolute", left: x, top: y }}>
      <path d="M12 0c.8 6.4 5.6 11.2 12 12-6.4.8-11.2 5.6-12 12-.8-6.4-5.6-11.2-12-12C6.4 11.2 11.2 6.4 12 0z" fill={color} />
    </svg>
  );
}
