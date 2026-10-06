import { ImageResponse } from "next/og";
import { BrandMark } from "@/lib/brand-image";
import { defaultLocale, getDictionary, isLocale, locales } from "@/lib/i18n";
import { ogFonts } from "@/lib/og-font";
import { site } from "@/lib/site";

// Default link-preview image for every page in a locale that doesn't set its own.

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "SideQuest Day — K-pop trip planner for Seoul";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const t = getDictionary(locale);
  const host = site.url.replace(/^https?:\/\//, "");
  const fonts = await ogFonts(locale, `${site.name}${t.tagline}${t.home.badge}${host}`);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: 72, color: "#2a2440", fontFamily: fonts.length ? [...new Set(fonts.map((f) => f.name))].join(", ") : undefined,
          background: "linear-gradient(135deg, #fff0f6 0%, #f3edff 50%, #e9f2ff 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <BrandMark size={72} />
          <span style={{ fontSize: 40, fontWeight: 800 }}>{site.name}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.15, maxWidth: 1000 }}>{t.tagline}</span>
          <span style={{ display: "flex", fontSize: 28, color: "#7c5cff", fontWeight: 800 }}>{t.home.badge}</span>
        </div>
        <span style={{ fontSize: 26, color: "#7a7491" }}>{host}</span>
      </div>
    ),
    { ...size, fonts },
  );
}
