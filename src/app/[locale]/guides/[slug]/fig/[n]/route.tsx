import { ImageResponse } from "next/og";
import { BrandMark } from "@/lib/brand-image";
import { getGuide } from "@/lib/guides";
import { getDictionary, isLocale } from "@/lib/i18n";
import { ogFonts } from "@/lib/og-font";
import { site } from "@/lib/site";

// Infographic for a guide (1200×900). n=0 is the automatic "key points" card
// built from the guide's section headings; n≥1 draws `figures[n-1]` from the
// guide's front matter. Rendered on first request, then served from the CDN
// cache (building every image at deploy time overloads the font fetches).
export const dynamic = "force-dynamic";

const ROW_COLOURS = ["#ff6fa8", "#a48bff", "#ffb547", "#4cc9f0", "#5fd39a", "#ff8a65", "#c084fc"];

export async function GET(_req: Request, { params }: { params: Promise<{ locale: string; slug: string; n: string }> }) {
  const { locale, slug, n } = await params;
  if (!isLocale(locale)) return new Response("Not found", { status: 404 });
  const guide = await getGuide(locale, slug);
  const index = Number(n);
  if (!guide || !Number.isInteger(index) || index < 0 || index > guide.figures.length) return new Response("Not found", { status: 404 });
  const t = getDictionary(locale);

  const figure = index === 0 ? { title: t.seo.keyPoints, items: guide.headings.map((h) => h.text) } : guide.figures[index - 1];
  const items = figure.items.slice(0, 7);
  const fonts = await ogFonts(locale, `${site.name}${figure.title}${guide.title}${items.join("")}0123456789`);
  const fontFamily = fonts.length ? [...new Set(fonts.map((f) => f.name))].join(", ") : undefined;
  const itemSize = items.length > 5 ? 32 : 36;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", position: "relative", padding: 56, color: "#2a2440", fontFamily,
          backgroundImage: "linear-gradient(150deg, #ffe3f0 0%, #f1ebff 55%, #e3f1ff 100%)",
        }}
      >
        <Sticker kind="heart" x={30} y={28} size={70} rot={-14} color="#ff6fa8" />
        <Sticker kind="star" x={1100} y={24} size={70} rot={12} color="#ffd36b" />
        <Sticker kind="sparkle" x={1120} y={780} size={46} rot={0} color="#ffffff" />
        <div
          style={{
            display: "flex", flexDirection: "column", width: "100%", gap: 22, padding: "44px 52px", borderRadius: 44,
            background: "#ffffff", border: "6px solid #e7dcff", boxShadow: "0 20px 50px rgba(124,92,255,0.18)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ display: "flex", padding: "10px 26px", borderRadius: 999, backgroundImage: "linear-gradient(90deg, #ff6fa8, #7c5cff)", color: "#ffffff", fontSize: 30, fontWeight: 800 }}>
              {figure.title}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <BrandMark size={36} />
              <span style={{ fontSize: 24, fontWeight: 800 }}>{site.name}</span>
            </div>
          </div>
          {index === 0 && <span style={{ display: "flex", fontSize: 30, fontWeight: 800, color: "#7a7491", lineHeight: 1.3 }}>{guide.title}</span>}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 6 }}>
            {items.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, padding: "12px 20px", borderRadius: 24, background: i % 2 ? "#ffffff" : "#faf7ff" }}>
                <span
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", width: 52, height: 52, flexShrink: 0, borderRadius: 999,
                    background: ROW_COLOURS[i % ROW_COLOURS.length], color: "#ffffff", fontSize: 28, fontWeight: 800,
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ display: "flex", fontSize: itemSize, fontWeight: 800, lineHeight: 1.25 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 900, fonts, headers: { "Cache-Control": "public, max-age=86400, s-maxage=2592000, stale-while-revalidate=86400" } },
  );
}

type Kind = "heart" | "star" | "sparkle";

function Sticker({ kind, x, y, size, rot, color }: { kind: Kind; x: number; y: number; size: number; rot: number; color: string }) {
  const d = {
    heart: "M12 21s-7.5-4.6-10-9.3C.3 8.4 2.2 4 6.4 4c2.3 0 4 1.3 5.6 3.3C13.6 5.3 15.3 4 17.6 4 21.8 4 23.7 8.4 22 11.7 19.5 16.4 12 21 12 21z",
    star: "M12 1.5l3.1 6.7 7.3.8-5.4 5 1.5 7.2L12 17.6l-6.5 3.6 1.5-7.2-5.4-5 7.3-.8z",
    sparkle: "M12 0c.8 6.4 5.6 11.2 12 12-6.4.8-11.2 5.6-12 12-.8-6.4-5.6-11.2-12-12C6.4 11.2 11.2 6.4 12 0z",
  }[kind];
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", transform: `rotate(${rot}deg)` }}>
      <svg width={size} height={size} viewBox="0 0 24 24">
        <path d={d} fill={color} stroke={kind === "sparkle" ? "none" : "#ffffff"} strokeWidth={1.5} />
      </svg>
    </div>
  );
}
