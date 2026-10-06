import type { Locale } from "@/lib/i18n";

// Core domain types. Every record that can go stale carries `verifiedAt`
// (ISO date the data was last checked against an official source, or null).

export type Area =
  | "yongsan"
  | "seongsu"
  | "gangnam"
  | "mapo"
  | "songpa"
  | "jung"
  | "gangdong"
  | "yeouido"
  | "guro";

export interface Member {
  slug: string;
  stageName: string;
  /** YYYY-MM-DD */
  birthday: string;
}

export interface Group {
  slug: string;
  name: string;
  nameKo: string;
  fandom: string;
  agency: string;
  debutYear: number;
  kind: "boy" | "girl";
  /** Card/theme accent. Not an official color claim. */
  accent: string;
  members: Member[];
  verifiedAt: string | null;
}

export type PlaceType = "agency" | "venue" | "broadcast" | "landmark" | "store" | "experience";

export interface Place {
  id: string;
  name: string;
  area: Area;
  type: PlaceType;
  /** Group slugs this place is tied to; empty = relevant to every fan. */
  groups: string[];
  address?: string;
  note: Record<Locale, string>;
  verifiedAt: string | null;
}

export type EventType = "concert" | "fanmeeting" | "music-show" | "birthday-cafe" | "popup";

export type ForeignerAccess = "open" | "verification" | "fanclub" | "korean-id-only" | "unknown";

export interface KEvent {
  id: string;
  type: EventType;
  title: string;
  groups: string[];
  /** Member slugs for birthday cafes, as `${group}/${member}`. */
  members?: string[];
  /** YYYY-MM-DD, inclusive */
  startDate: string;
  endDate: string;
  venue: string;
  area: Area;
  ticketing?: { platform: string; url?: string; foreignerAccess: ForeignerAccess };
  sourceUrl: string;
  verifiedAt: string | null;
}

export type ActivityCategory = "tour" | "experience" | "ticket";

/** A bookable partner product (tour, class, ticket). Prices aren't stored — they change; we link to the partner page. */
export interface Activity {
  id: string;
  partner: "klook" | "kkday";
  category: ActivityCategory;
  /** Product name as the partner lists it. */
  title: string;
  summary: Record<Locale, string>;
  /** Partner product page; affiliate tracking is appended at render time. */
  url: string;
  area?: Area;
  /** Group slugs the product is specifically about; empty = any fan. */
  groups: string[];
  /** Matching keys for contextual placement, e.g. "music-show", "dance", "fan-tour". */
  tags: string[];
  /** Days of week the product runs (0 = Sunday), for music show tickets. */
  weekdays?: number[];
  /** Length as stated on the partner page — minutes, or half/full day. Omit when not confirmed. */
  duration?: number | "half-day" | "full-day";
  /** Date we last confirmed the product page exists. */
  checkedAt: string | null;
}
