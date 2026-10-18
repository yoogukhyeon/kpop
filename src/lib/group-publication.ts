import type { Locale } from "./i18n";
import type { Group, Place } from "./types";
import type { GroupResearch } from "../data/group-research";
import { isRecentCheck, isReviewedPlace, validSource } from "./catalog-quality";

/** Explicit editorial release checklist shared by metadata, sitemap and the admin audit. */
export function groupPublicationIssues(group: Group, research: GroupResearch | undefined, places: Place[], locale: Locale, today: string): string[] {
  if (!research) return ["그룹별 동선·선택 기준 편집 검토 필요"];
  const issues: string[] = [];
  if (!(research.locales as readonly string[]).includes(locale) || ![research.intro, research.itinerary, research.booking].every((part) => part[locale]?.trim())) issues.push("이 언어의 본문 검토 필요");
  if (!isRecentCheck(research.reviewedAt, today, 90)) issues.push("그룹 본문 확인일 갱신 필요");
  if (new Set(research.sources.filter(validSource).filter((s) => s.kind !== "news").map((s) => s.url)).size < 2) issues.push("관련 공식 근거 보강 필요");
  const route = research.placeIds.map((id) => places.find((p) => p.id === id));
  if (route.some((p) => !p || !isReviewedPlace(p, today))) issues.push("동선에 출처·방문 조건이 만료되거나 누락된 장소 포함");
  if (new Set(route.filter((p) => p && isReviewedPlace(p, today)).map((p) => p!.id)).size < 2) issues.push("검토한 방문지 보강 필요");
  if (!route.some((p) => p && isReviewedPlace(p, today) && p.groups.includes(group.slug))) issues.push("그룹과의 관련성이 확인된 방문지 필요");
  return issues;
}
