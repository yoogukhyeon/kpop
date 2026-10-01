import type { Metadata } from "next";
import { en, type Dictionary } from "@/i18n/en";
import { es } from "@/i18n/es";
import { ja } from "@/i18n/ja";
import { ko } from "@/i18n/ko";

// English is the default and x-default. ja/es target the largest visiting and
// online fandoms after English; ko serves Korean birthday cafe hosts and Naver.
// See docs/PLAN.md §3 for the rollout order (id, th, zh-TW, pt-BR next).
export const locales = ["en", "ja", "es", "ko"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export type { Dictionary };

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);

const dictionaries: Record<Locale, Dictionary> = { en, ja, es, ko };
export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];

export function formatDate(date: string, locale: Locale, opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }) {
  return new Intl.DateTimeFormat(locale, { ...opts, timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

/** Best locale from an Accept-Language header. */
export function pickLocale(acceptLanguage: string | null): Locale {
  const wanted = (acceptLanguage ?? "")
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.toLowerCase().split("-")[0], q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  return wanted.find((w) => isLocale(w.lang))?.lang as Locale | undefined ?? defaultLocale;
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
