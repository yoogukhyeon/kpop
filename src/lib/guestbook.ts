import "server-only";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

// Birthday guestbook helpers (server only): password + IP hashing and content checks.

export const CARDS = ["pink", "lavender", "sky", "mint", "lemon", "peach"] as const;
export const STICKERS = ["cake", "heart", "sparkle", "party", "flower", "star", "bunny", "gift"] as const;
export type Card = (typeof CARDS)[number];
export type StickerKey = (typeof STICKERS)[number];

/** Hides a message after this many reports, until an admin reviews it. */
export const REPORT_LIMIT = 3;

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  return `${salt.toString("hex")}:${scryptSync(password, salt, 32).toString("hex")}`;
}

export function checkPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const actual = scryptSync(password, Buffer.from(salt, "hex"), 32);
  const expected = Buffer.from(hash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** One-way, salted IP hash: enough to enforce "one a day", never reversible to the IP. */
export function hashIp(ip: string): string {
  const pepper = process.env.GUESTBOOK_SALT ?? process.env.SUPABASE_SECRET_KEY ?? "sidequest";
  return createHash("sha256").update(`${pepper}|guestbook|${ip}`).digest("hex");
}

export function clientIp(h: Headers): string {
  return h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "0.0.0.0";
}

// Slurs and common abuse in the site's languages, plus links (spam).
const BLOCKED = [
  /씨\s*발|시\s*발|ㅅ\s*ㅂ|병\s*신|ㅂ\s*ㅅ|좆|개\s*새\s*끼|썅|니\s*애\s*미|느\s*금|지\s*랄|꺼\s*져|죽\s*어/,
  /\b(fuck|shit|bitch|cunt|whore|slut|nigg|fag|retard|kys)\w*/i,
  /(https?:\/\/|www\.|\.com\b|\.net\b|\.kr\b|t\.me\/|open\.kakao)/i,
];
export const isBlocked = (text: string) => BLOCKED.some((re) => re.test(text));
