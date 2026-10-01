import type { KEvent } from "@/lib/types";

// Only events with a source are listed. Prefer official notices over news/blogs,
// and replace secondary sources with the official one during verification.

export const events: KEvent[] = [
  {
    id: "andteam-encore-2026-10",
    type: "concert",
    title: "&TEAM Encore Concert",
    groups: ["andteam"],
    startDate: "2026-10-03",
    endDate: "2026-10-04",
    venue: "KSPO Dome",
    area: "songpa",
    ticketing: { platform: "Check official notice", foreignerAccess: "unknown" },
    sourceUrl: "https://hapskorea.com/whats-on-in-seoul-september-28-26",
    verifiedAt: null,
  },
];
