"use client";

import { metricSource, type MetricEvent, type MetricPlacement } from "@/lib/metrics";

export function track(event: MetricEvent, options: { product?: string; placement?: MetricPlacement } = {}) {
  if (typeof window === "undefined" || navigator.doNotTrack === "1" || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return;
  const path = window.location.pathname;
  const locale = path.split("/")[1];
  const payload = JSON.stringify({
    event, path, locale, product: options.product ?? "", placement: options.placement ?? "page",
    source: metricSource(document.referrer, new URLSearchParams(window.location.search).get("utm_source")),
  });
  try {
    const blob = new Blob([payload], { type: "application/json" });
    if (!navigator.sendBeacon?.("/api/metrics", blob)) {
      void fetch("/api/metrics", { method: "POST", body: payload, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
    }
  } catch { /* Measurement must never interrupt navigation or downloads. */ }
}
