import type { KEvent } from "@/lib/types";
import { publicHttpsUrl } from "@/lib/partner-url";

// Manually checked product pages, not a guess at a ticketing homepage or a resale listing.
// These are useful official/supplier routes even when no commission is available.
const resources: Record<string, { name: string; url: string }[]> = {
  "kgma-2026-day1": [
    { name: "NOL Ticket", url: "https://nol.yanolja.com/ticket/products/26013920" },
    { name: "MAISEAT", url: "https://www.maiseat.com/ko-KR/shows/17206" },
  ],
  "kgma-2026-day2": [
    { name: "NOL Ticket", url: "https://nol.yanolja.com/ticket/products/26013920" },
    { name: "MAISEAT", url: "https://www.maiseat.com/ko-KR/shows/17206" },
  ],
};

export function eventBookingLinks(event: KEvent) {
  const direct = publicHttpsUrl(event.ticketing?.url);
  const links = [...(direct ? [{ name: event.ticketing!.platform, url: direct }] : []), ...(resources[event.id] ?? [])];
  return links.filter((link, index) => links.findIndex((other) => other.url === link.url) === index);
}
