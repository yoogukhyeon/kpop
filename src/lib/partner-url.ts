import type { Locale } from "@/lib/i18n";

const hosts: Record<string, readonly string[]> = {
  klook: ["www.klook.com", "klook.com"],
  kkday: ["www.kkday.com", "kkday.com"],
  agoda: ["www.agoda.com", "agoda.com"],
};

/** Only apply our tracking to the intended merchant, preserving the product and its options. */
export function buildPartnerUrl(partner: string, input: string, query = "", locale?: Locale): string | null {
  try {
    const url = new URL(input);
    if (url.protocol !== "https:" || url.username || url.password || url.port || !hosts[partner]?.includes(url.hostname)) return null;
    if (locale && partner === "klook" && /^\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?activity\//i.test(url.pathname)) {
      const language: Record<Locale, string> = { en: "en-US", ja: "ja", ko: "ko", "zh-tw": "zh-TW", "zh-cn": "zh-CN", vi: "vi", th: "th", id: "id", es: "es" };
      url.pathname = `/${language[locale]}/${url.pathname.replace(/^\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?activity\//i, "activity/")}`;
    }
    if (locale && partner === "kkday" && /^\/[a-z-]+\/product\//i.test(url.pathname)) {
      // KKday has no Spanish storefront. Keep its English product rather than inventing a URL.
      url.pathname = url.pathname.replace(/^\/[a-z-]+\/product\//i, `/${locale === "es" ? "en" : locale}/product/`);
    }
    new URLSearchParams(query.replace(/^\?/, "")).forEach((value, key) => {
      if (value) url.searchParams.set(key, value);
    });
    return url.toString();
  } catch { return null; }
}

/** Safe public source / ticket links; rejects script, data and credential URLs. */
export function publicHttpsUrl(input?: string): string | null {
  try {
    const url = new URL(input ?? "");
    return url.protocol === "https:" && !url.username && !url.password ? url.toString() : null;
  } catch { return null; }
}
