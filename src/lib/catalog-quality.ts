import type { CatalogSource, KEvent, Place, ResearchedText } from "./types";
import type { Locale } from "./i18n";

export const RESEARCH_LOCALES = ["en", "ko", "ja"] as const;
export type ResearchLocale = (typeof RESEARCH_LOCALES)[number];
export const isResearchLocale = (locale: Locale): locale is ResearchLocale => RESEARCH_LOCALES.some((l) => l === locale);
export const researchText = (text: ResearchedText, locale: Locale) => text[locale] ?? text.en;
const DAY = 86_400_000;
const dateNumber = (day: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return NaN;
  const value = Date.parse(`${day}T00:00:00Z`);
  return Number.isFinite(value) && new Date(value).toISOString().slice(0, 10) === day ? value : NaN;
};

export function isRecentCheck(checked: string | null, today: string, days: number) {
  if (!checked) return false;
  const age = (dateNumber(today) - dateNumber(checked)) / DAY;
  return Number.isFinite(age) && age >= 0 && age <= days;
}

export function validSource(source: CatalogSource) {
  try {
    const url = new URL(source.url);
    return url.protocol === "https:" && !url.username && !url.password && Boolean(source.label.trim());
  } catch { return false; }
}

/** Our editorial release rule, not a claim about a search engine's minimum requirements. */
export function isReviewedPlace(place: Place, today: string) {
  return isRecentCheck(place.verifiedAt, today, 90) && Boolean(place.address?.trim()) &&
    Boolean(place.visit && place.visit.suggestedMinutes > 0 &&
      [place.visit.transit, place.visit.hours, place.visit.admission, place.visit.access].every((part) =>
        part && RESEARCH_LOCALES.every((locale) => Boolean(part[locale]?.trim())))) &&
    Boolean(place.sources?.some((s) => s.kind !== "news" && validSource(s)));
}

export function eventReviewReason(event: KEvent, today: string): string | null {
  if (!event.verifiedAt || !event.editorial) return "출처·입장 조건 검토 필요";
  if (![event.editorial.summary, event.editorial.entry].every((part) => part && RESEARCH_LOCALES.every((locale) => Boolean(part[locale]?.trim())))) return "설명·입장 조건 본문 검토 필요";
  if (!isRecentCheck(event.verifiedAt, today, 30)) return "확인일 갱신 필요";
  if (!validSource({ label: "announcement", url: event.sourceUrl, kind: event.editorial.sourceKind }) || event.editorial.sourceKind === "news") return "주최자·운영자 원문 필요";
  if (!Number.isFinite(dateNumber(event.editorial.reviewDue)) || event.editorial.reviewDue < today) return "재확인 기한 경과";
  if (event.editorial.status !== "scheduled") return "취소·연기 상태";
  return null;
}

/** Stale/cancelled listings keep their detail URL, but aren't proposed as available trips. */
export function isActionableEvent(event: KEvent, today: string) {
  return event.endDate >= today && eventReviewReason(event, today) === null;
}

export function isReviewedEvent(event: KEvent, today: string) {
  // A completed, sourced archive does not require perpetual freshness checks.
  if (event.endDate < today) return Boolean(event.verifiedAt && event.editorial && event.editorial.sourceKind !== "news" && validSource({ label: "archive", url: event.sourceUrl, kind: event.editorial.sourceKind }));
  return eventReviewReason(event, today) === null;
}

export function eventIndexableLocales(event: KEvent, today: string): Locale[] {
  if (!isReviewedEvent(event, today) || !event.editorial) return [];
  return RESEARCH_LOCALES.filter((locale) => event.editorial?.summary[locale]?.trim() && event.editorial?.entry[locale]?.trim());
}
