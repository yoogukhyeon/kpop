import { ImageResponse } from "next/og";
import { ActivityIcon, ACTIVITY_TONE, Sparkle, stageBackground } from "@/lib/activity-art";
import { BrandMark } from "@/lib/brand-image";
import { listActivities } from "@/lib/data";
import { getDictionary, isLocale } from "@/lib/i18n";
import { ogFonts } from "@/lib/og-font";
import { partnerName } from "@/lib/partners";
import { site } from "@/lib/site";

// Thumbnail for one partner activity (1200×630): stage-light background,
// category icon, product title, area and duration. Used as the card image and
// as the share/search image, so it is crawlable (not under /api). Rendered on
// first request and then served from the CDN cache (rendering 100+ images at
// build time overloads the font fetches).
export const dynamic = "force-dynamic";


export async function GET(_req: Request, { params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  if (!isLocale(locale)) return new Response("Not found", { status: 404 });
  const a = (await listActivities()).find((x) => x.id === id);
  if (!a) return new Response("Not found", { status: 404 });
  const t = getDictionary(locale);
  const tone = ACTIVITY_TONE[a.category];
  const category = t.activities.categories[a.category];
  const partner = partnerName(a.partner);
  const duration =
    a.duration === undefined ? null : typeof a.duration === "number" ? t.activities.duration.minutes(a.duration) : t.activities.duration[a.duration];
  const facts = [a.area ? t.area[a.area] : "Seoul", duration].filter((x): x is string => Boolean(x));
  const fonts = await ogFonts(locale, `${site.name}${category}${partner}${a.title}${facts.join("")}SEOUL K-POP`);
  const titleSize = a.title.length > 60 ? 52 : a.title.length > 40 ? 60 : 68;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", position: "relative", padding: 64, color: "#ffffff",
          fontFamily: fonts.length ? [...new Set(fonts.map((f) => f.name))].join(", ") : undefined,
          backgroundImage: stageBackground(a.category),
        }}
      >
        {/* Light beams */}
        <div style={{ position: "absolute", top: -120, right: 220, width: 160, height: 900, display: "flex", transform: "rotate(28deg)", backgroundImage: `linear-gradient(180deg, ${tone.glow}55, transparent 70%)` }} />
        <div style={{ position: "absolute", top: -120, right: 60, width: 110, height: 900, display: "flex", transform: "rotate(-22deg)", backgroundImage: `linear-gradient(180deg, ${tone.accent}44, transparent 70%)` }} />
        <div style={{ position: "absolute", right: 70, bottom: 70, display: "flex", width: 300, height: 300, alignItems: "center", justifyContent: "center", borderRadius: 999, background: "rgba(255,255,255,0.10)", border: "2px solid rgba(255,255,255,0.25)" }}>
          <ActivityIcon category={a.category} size={180} />
        </div>
        <div style={{ position: "absolute", top: 70, right: 330, display: "flex" }}><Sparkle size={40} color={tone.accent} /></div>
        <div style={{ position: "absolute", top: 190, right: 90, display: "flex" }}><Sparkle size={26} color="#ffffff" /></div>
        <div style={{ position: "absolute", bottom: 60, right: 420, display: "flex" }}><Sparkle size={22} color={tone.glow} /></div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 740, height: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ display: "flex", padding: "10px 24px", borderRadius: 999, background: tone.accent, color: tone.from, fontSize: 28, fontWeight: 800 }}>{category}</span>
            <span style={{ display: "flex", padding: "10px 22px", borderRadius: 999, border: "2px solid rgba(255,255,255,0.5)", fontSize: 26, fontWeight: 800 }}>{partner}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: 6, color: tone.accent }}>SEOUL K-POP</span>
            <span style={{ fontSize: titleSize, fontWeight: 800, lineHeight: 1.12 }}>{a.title}</span>
            <div style={{ display: "flex", gap: 12 }}>
              {facts.map((f) => (
                <span key={f} style={{ display: "flex", padding: "8px 20px", borderRadius: 999, background: "rgba(255,255,255,0.16)", fontSize: 26, fontWeight: 800 }}>{f}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <BrandMark size={40} />
            <span style={{ fontSize: 26, fontWeight: 800, opacity: 0.9 }}>{site.name}</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts, headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400" } },
  );
}
