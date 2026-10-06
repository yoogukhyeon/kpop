import { ImageResponse } from "next/og";
import { BrandMark } from "@/lib/brand-image";
import { getGuide, listGuides } from "@/lib/guides";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { ogFonts } from "@/lib/og-font";
import { site } from "@/lib/site";

// Share image for a guide (1200×630): guide title on the brand background, in
// the guide's language. Built at deploy time for every guide.
export const dynamic = "force-static";

export async function generateStaticParams() {
  const perLocale = await Promise.all(locales.map(async (locale) => (await listGuides(locale)).map((g) => ({ locale, slug: g.slug }))));
  return perLocale.flat();
}

export async function GET(_req: Request, { params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return new Response("Not found", { status: 404 });
  const guide = await getGuide(locale, slug);
  if (!guide) return new Response("Not found", { status: 404 });
  const t = getDictionary(locale);
  const host = site.url.replace(/^https?:\/\//, "");
  const fonts = await ogFonts(locale, `${site.name}${guide.title}${t.guides.title}${host}`);
  const size = [...guide.title].length > 60 ? 50 : 60;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: 72, color: "#2a2440", fontFamily: fonts.length ? [...new Set(fonts.map((f) => f.name))].join(", ") : undefined,
          background: "linear-gradient(135deg, #fff0f6 0%, #f3edff 50%, #e9f2ff 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <BrandMark size={64} />
          <span style={{ fontSize: 34, fontWeight: 800 }}>{site.name}</span>
          <span style={{ fontSize: 26, color: "#7c5cff", fontWeight: 800, marginLeft: 12 }}>{t.guides.title}</span>
        </div>
        <span style={{ fontSize: size, fontWeight: 800, lineHeight: 1.2, maxWidth: 1050 }}>{guide.title}</span>
        <span style={{ fontSize: 24, color: "#7a7491" }}>{host}</span>
      </div>
    ),
    { width: 1200, height: 630, fonts },
  );
}
