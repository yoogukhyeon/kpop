import type { Metadata } from "next";
import { en, type Dictionary } from "@/i18n/en";
import { es } from "@/i18n/es";
import { id } from "@/i18n/id";
import { ja } from "@/i18n/ja";
import { ko } from "@/i18n/ko";
import { th } from "@/i18n/th";
import { vi } from "@/i18n/vi";
import { zhCN } from "@/i18n/zh-cn";
import { zhTW } from "@/i18n/zh-tw";

// English is the default and x-default. ja/es target the largest visiting and
// online fandoms; zh-tw/zh-cn/vi/th/id cover Taiwan, China and Southeast Asia,
// where Klook/KKday are strongest; ko serves Korean birthday cafe hosts and Naver.
// URL segments are lowercase; Intl and hreflang accept them case-insensitively.
export const locales = ["en", "ja", "zh-tw", "zh-cn", "vi", "th", "id", "es", "ko"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export type { Dictionary };

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);

const dictionaries: Record<Locale, Dictionary> = { en, ja, "zh-tw": zhTW, "zh-cn": zhCN, vi, th, id, es, ko };
export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];

export function formatDate(date: string, locale: Locale, opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }) {
  return new Intl.DateTimeFormat(locale, { ...opts, timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

/** Maps one Accept-Language tag (e.g. "zh-Hant-TW", "id-ID", "ms") to a supported locale. */
function matchTag(tag: string): Locale | undefined {
  const t = tag.toLowerCase();
  if (t.startsWith("zh")) {
    return /hant|-tw|-hk|-mo/.test(t) ? "zh-tw" : "zh-cn";
  }
  const base = t.split("-")[0];
  if (base === "ms") return "id"; // Malay readers generally read Indonesian comfortably
  return isLocale(base) ? base : undefined;
}

/** Best locale from an Accept-Language header. */
export function pickLocale(acceptLanguage: string | null): Locale {
  const wanted = (acceptLanguage ?? "")
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag, q: q ? Number(q) : 1 };
    })
    .filter((w) => w.tag)
    .sort((a, b) => b.q - a.q);
  for (const w of wanted) {
    const match = matchTag(w.tag);
    if (match) return match;
  }
  return defaultLocale;
}

/**
 * canonical + hreflang alternates for a path without the locale prefix
 * (e.g. "/groups/bts"). `only` limits alternates to locales that have the page.
 */
export function alternates(locale: Locale, path: string, only: readonly Locale[] = locales): Metadata["alternates"] {
  const languages: Record<string, string> = Object.fromEntries(only.map((l) => [l, `/${l}${path}`]));
  if (only.includes(defaultLocale)) languages["x-default"] = `/${defaultLocale}${path}`;
  return { canonical: `/${locale}${path}`, languages };
}

/** Open Graph locale codes (language_TERRITORY). */
export const OG_LOCALE: Record<Locale, string> = {
  en: "en_US", ko: "ko_KR", ja: "ja_JP", "zh-tw": "zh_TW", "zh-cn": "zh_CN", vi: "vi_VN", th: "th_TH", id: "id_ID", es: "es_ES",
};

/** Shared Open Graph fields; spread into page-level openGraph (which replaces the layout's). */
export function ogBase(locale: Locale) {
  return {
    siteName: "SideQuest Day",
    locale: OG_LOCALE[locale],
    alternateLocale: locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
    type: "website" as const,
  };
}
