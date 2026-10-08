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

  const ink = mixHex(accent, "#1b1530", 0.72);
  const soft = mixHex(accent, "#ffffff", 0.3);
  const fontFamily = fonts.length ? [...new Set(fonts.map((f) => f.name))].join(", ") : undefined;
  const titleSize = s(e.title.length > 40 ? 76 : 92, e.title.length > 40 ? 46 : 56);

  // Staggered polka-dot grid behind the card.
  const gap = s(96, 64);
  const dot = s(16, 11);
  const dots: [number, number][] = [];
  for (let row = 0; row * gap < height; row++) {
    for (let col = 0; col * gap < width + gap; col++) dots.push([col * gap + (row % 2 ? gap / 2 : 0), row * gap + gap / 3]);
  }

  // Stickers scattered around the photocard: [kind, x, y, size, rotation, colour]
  const stickers: [Kind, number, number, number, number, string][] = tall
    ? [
        ["heart", 34, s(300, 70), 130, -14, "#ff6fa8"], ["star", 900, s(250, 40), 120, 12, "#ffd36b"], ["sparkle", 980, s(520, 300), 60, 0, "#ffffff"],
        ["sparkle", 40, height - s(560, 330), 70, 0, "#ffffff"], ["heart", 930, height - s(470, 260), 100, 16, "#ff9fd0"], ["star", 60, height - s(330, 150), 90, -10, "#ffe08a"],
      ]
    : [
        ["heart", 40, 40, 64, -14, "#ff6fa8"], ["star", 1090, 30, 70, 12, "#ffd36b"], ["sparkle", 1110, 470, 44, 0, "#ffffff"], ["heart", 60, 500, 52, 10, "#ff9fd0"],
      ];

  return new ImageResponse(
    (
      <div
        style={{
          width, height, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative",
          padding: s(80, 40), color: ink, fontFamily,
          backgroundImage: `linear-gradient(160deg, ${soft} 0%, #ffe3f0 55%, ${mixHex(accent, "#ffffff", 0.55)} 100%)`,
        }}
      >
        {/* Polka dots */}
        {dots.map(([x, y], i) => (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: dot, height: dot, borderRadius: 999, background: "rgba(255,255,255,0.7)", display: "flex" }} />
        ))}

        {/* Photocard in a toploader */}
        <div
          style={{
            display: "flex", flexDirection: "column", gap: s(30, 14), width: "100%", position: "relative",
            padding: s("72px 64px", "34px 44px"), borderRadius: s(56, 36), background: "#ffffff",
            border: `${s(10, 6)}px solid ${mixHex(accent, "#ffffff", 0.6)}`,
            boxShadow: `0 ${s(30, 16)}px ${s(70, 40)}px ${mixHex(accent, "#000000", 0.35)}44`,
            transform: "rotate(-1.5deg)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ display: "flex", padding: s("12px 30px", "6px 18px"), borderRadius: 999, background: accent, color: "#ffffff", fontSize: s(34, 22), fontWeight: 800 }}>
              {lines[0]}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <BrandMark size={s(48, 32)} />
              <span style={{ fontSize: s(30, 20), fontWeight: 800 }}>{site.name}</span>
            </div>
          </div>
          {group && (
            <div style={{ display: "flex", alignItems: "center", gap: s(12, 8), fontSize: s(40, 26), fontWeight: 800, color: accent }}>
              <Sticker kind="heart" size={s(40, 26)} color="#ff6fa8" />
              {group.name}
            </div>
          )}
          <span style={{ fontSize: titleSize, fontWeight: 800, lineHeight: 1.12 }}>{e.title}</span>
          <div style={{ display: "flex", flexDirection: "column", gap: s(16, 8), marginTop: s(10, 0) }}>
            <span style={{ display: "flex", alignSelf: "flex-start", alignItems: "center", gap: 12, padding: s("14px 30px", "8px 18px"), borderRadius: 999, background: "#fff1b8", fontSize: s(44, 28), fontWeight: 800 }}>
              <Sticker kind="star" size={s(36, 22)} color="#ffb800" />
              {dates}
            </span>
            <span style={{ display: "flex", alignSelf: "flex-start", alignItems: "center", gap: 12, padding: s("14px 30px", "8px 18px"), borderRadius: 999, background: mixHex(accent, "#ffffff", 0.14), fontSize: s(36, 22), fontWeight: 800 }}>
              <Sticker kind="pin" size={s(34, 22)} color={accent} />
              {lines[3]}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: s(20, 4), paddingTop: s(26, 12), borderTop: `3px dashed ${mixHex(accent, "#ffffff", 0.35)}`, fontSize: s(28, 18) }}>
            <span style={{ fontWeight: 800, color: "#ff6fa8" }}>{lines[4]}</span>
            <span style={{ opacity: 0.75 }}>{lines[5]}</span>
          </div>
        </div>
        {stickers.map(([kind, x, y, size, rot, color], i) => (
          <div key={i} style={{ position: "absolute", left: x, top: y, display: "flex", transform: `rotate(${rot}deg)` }}>
            <Sticker kind={kind} size={size} color={color} />
          </div>
        ))}
      </div>
    ),
    { width, height, fonts, headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400" } },
  );
}

type Kind = "heart" | "star" | "sparkle" | "pin";

function Sticker({ kind, size, color }: { kind: Kind; size: number; color: string }) {
  const paths: Record<Kind, string> = {
    heart: "M12 21s-7.5-4.6-10-9.3C.3 8.4 2.2 4 6.4 4c2.3 0 4 1.3 5.6 3.3C13.6 5.3 15.3 4 17.6 4 21.8 4 23.7 8.4 22 11.7 19.5 16.4 12 21 12 21z",
    star: "M12 1.5l3.1 6.7 7.3.8-5.4 5 1.5 7.2L12 17.6l-6.5 3.6 1.5-7.2-5.4-5 7.3-.8z",
    sparkle: "M12 0c.8 6.4 5.6 11.2 12 12-6.4.8-11.2 5.6-12 12-.8-6.4-5.6-11.2-12-12C6.4 11.2 11.2 6.4 12 0z",
    pin: "M12 1C7.6 1 4 4.4 4 8.8 4 14.6 12 23 12 23s8-8.4 8-14.2C20 4.4 16.4 1 12 1zm0 11a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4z",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d={paths[kind]} fill={color} stroke={kind === "sparkle" ? "none" : "#ffffff"} strokeWidth={kind === "pin" ? 0 : 1.5} />
    </svg>
  );
}
