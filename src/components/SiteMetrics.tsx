"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { METRIC_PLACEMENTS, type MetricPlacement } from "@/lib/metrics";
import { track } from "@/lib/track";

export function SiteMetrics() {
  const pathname = usePathname();
  const last = useRef("");
  useEffect(() => {
    if (last.current === pathname) return;
    last.current = pathname;
    track("page_view");
    if (/^\/[a-z-]+\/plan$/.test(pathname)) track("plan_created");
  }, [pathname]);

  useEffect(() => {
    const clicked = (event: MouseEvent) => {
      const element = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[data-affiliate-id]") : null;
      if (!element || event.defaultPrevented || event.button > 1) return;
      const value = element.dataset.placement;
      const placement: MetricPlacement = METRIC_PLACEMENTS.includes(value as MetricPlacement) ? value as MetricPlacement : "catalog";
      track("affiliate_click", { product: element.dataset.affiliateId, placement });
    };
    document.addEventListener("click", clicked);
    document.addEventListener("auxclick", clicked);
    return () => {
      document.removeEventListener("click", clicked);
      document.removeEventListener("auxclick", clicked);
    };
  }, []);
  return null;
}
