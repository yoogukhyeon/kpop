import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { BrandMark } from "@/lib/brand-image";
import { mixHex } from "@/lib/color";
import { getEvent, getGroup } from "@/lib/data";
import { formatDate, getDictionary, isLocale } from "@/lib/i18n";
import { ogFonts } from "@/lib/og-font";
import { site } from "@/lib/site";

// Promo card for one event, in the requested language. Birthday cafe hosts and
// fans post it on X/Instagram; the card carries the event page URL.
// ?format=story (1080×1920) | post (1080×1350) | og (1200×630, default)

const SIZES = { story: { width: 1080, height: 1920 }, post: { width: 1080, height: 1350 }, og: { width: 1200, height: 630 } } as const;

export async function GET(req: NextRequest, { params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  if (!isLocale(locale)) return new Response("Not found", { status: 404 });
  const e = await getEvent(id);
  if (!e) return new Response("Not found", { status: 404 });
  const t = getDictionary(locale);
  const fmt = (req.nextUrl.searchParams.get("format") ?? "og") as keyof typeof SIZES;
  const { width, height } = SIZES[fmt] ?? SIZES.og;
  const tall = fmt !== "og";
  const group = e.groups[0] ? await getGroup(e.groups[0]) : undefined;
  const accent = group?.accent ?? "#7c5cff";

  const dates = e.startDate === e.endDate ? formatDate(e.startDate, locale, { month: "long", day: "numeric" }) : `${formatDate(e.startDate, locale, { month: "short", day: "numeric" })} – ${formatDate(e.endDate, locale, { month: "short", day: "numeric" })}`;
  const host = site.url.replace(/^https?:\/\//, "");
  const lines = [t.eventType[e.type], e.title, dates, `${e.venue} · ${t.area[e.area]}`, t.eventDetail.listedOn, `${host}/${locale}/events/e/${e.id}`];
  const fonts = await ogFonts(locale, `${site.name}${lines.join("")}${group?.name ?? ""}`);
  const s = <T,>(big: T, small: T) => (tall ? big : small);

  return new ImageResponse(
    (
      <div
        style={{
          width, height, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: s(88, 56),
          color: mixHex(accent, "#1b1530", 0.7), fontFamily: fonts.length ? [...new Set(fonts.map((f) => f.name))].join(", ") : undefined,
          background: `linear-gradient(160deg, ${mixHex(accent, "#ffffff", 0.16)} 0%, ${mixHex(accent, "#ffffff", 0.42)} 100%)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <BrandMark size={s(72, 56)} />
          <span style={{ fontSize: s(38, 30), fontWeight: 800 }}>{site.name}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: s(28, 14) }}>
          <span style={{ display: "flex", alignSelf: "flex-start", padding: "8px 22px", borderRadius: 999, background: "rgba(255,255,255,0.75)", fontSize: s(34, 24), fontWeight: 800 }}>
            {lines[0]}
          </span>
          <span style={{ fontSize: s(84, 54), fontWeight: 800, lineHeight: 1.12 }}>{e.title}</span>
          {group && <span style={{ fontSize: s(40, 28), fontWeight: 800, opacity: 0.85 }}>{group.name}</span>}
          <span style={{ fontSize: s(46, 32), fontWeight: 800 }}>{dates}</span>
          <span style={{ fontSize: s(40, 28) }}>{lines[3]}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: s(30, 22) }}>
          <span style={{ fontWeight: 800 }}>{lines[4]}</span>
          <span style={{ opacity: 0.8 }}>{lines[5]}</span>
        </div>
      </div>
    ),
    { width, height, fonts, headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400" } },
  );
}
