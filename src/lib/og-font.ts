import type { Locale } from "@/lib/i18n";

// Fonts for next/og images. The default font has no Japanese/Korean glyphs, so we
// fetch a Google Fonts subset containing only the characters actually drawn.

export const FONT_FAMILY: Record<Locale, string> = {
  en: "Noto Sans", es: "Noto Sans", vi: "Noto Sans", id: "Noto Sans",
  ja: "Noto Sans JP", ko: "Noto Sans KR", "zh-tw": "Noto Sans TC", "zh-cn": "Noto Sans SC",
  th: "Noto Sans Thai",
};

/** Scripts whose font lacks Latin glyphs need Noto Sans as a fallback for names and numbers. */
const NEEDS_LATIN_FALLBACK = new Set<Locale>(["th"]);

export async function loadFont(family: string, weight: number, text: string): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`;
    // Cached for a year in the data cache: same text → same subset.
    const css = await (await fetch(cssUrl, { next: { revalidate: 31536000 } } as RequestInit)).text();
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!src) return null;
    const res = await fetch(src, { next: { revalidate: 31536000 } } as RequestInit);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

/** Regular + extra-bold font set for `text`, ready for ImageResponse `fonts` (fallback fonts last). */
export async function ogFonts(locale: Locale, text: string) {
  const families = [FONT_FAMILY[locale], ...(NEEDS_LATIN_FALLBACK.has(locale) ? ["Noto Sans"] : [])];
  const loaded = await Promise.all(
    families.flatMap((family) =>
      ([400, 800] as const).map(async (weight) => ({ family, weight, data: await loadFont(family, weight, text) })),
    ),
  );
  return loaded.flatMap(({ family, weight, data }) =>
    data ? [{ name: family === families[0] ? "Card" : `Card-${family}`, data, weight, style: "normal" as const }] : [],
  );
}
