// Shared vocabulary only: no visitor identifiers, IPs, full referrers or query strings.
export const METRIC_EVENTS = ["page_view", "plan_created", "affiliate_click", "card_download"] as const;
export const METRIC_SOURCES = ["direct", "google", "naver", "bing", "social", "community", "other"] as const;
export const METRIC_PLACEMENTS = ["page", "home", "catalog", "guide", "guide_compare", "group", "event", "plan", "download"] as const;
export type MetricEvent = (typeof METRIC_EVENTS)[number];
export type MetricSource = (typeof METRIC_SOURCES)[number];
export type MetricPlacement = (typeof METRIC_PLACEMENTS)[number];

export function metricSource(referrer: string, campaignSource?: string | null): MetricSource {
  const source = (campaignSource ?? "").toLowerCase();
  if (["community", "reddit", "discord"].includes(source)) return "community";
  if (["x", "twitter", "instagram", "youtube", "tiktok", "facebook", "line"].includes(source)) return "social";
  let host = "";
  try { host = new URL(referrer).hostname.toLowerCase(); } catch { return "direct"; }
  if (/(^|\.)google\.(?:com|[a-z]{2}|(?:co|com)\.[a-z]{2})$/.test(host)) return "google";
  if (/(^|\.)naver\.com$/.test(host)) return "naver";
  if (/(^|\.)bing\.com$/.test(host)) return "bing";
  if (/(^|\.)(reddit\.com|discord\.com|discord\.gg)$/.test(host)) return "community";
  if (/(^|\.)(t\.co|x\.com|twitter\.com|instagram\.com|youtube\.com|tiktok\.com|facebook\.com|line\.me)$/.test(host)) return "social";
  if (host === "sidequestday.com" || host === "localhost") return "direct";
  return "other";
}
