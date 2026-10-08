"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { getGroup } from "@/lib/data";
import { CARDS, checkPassword, clientIp, hashIp, hashPassword, isBlocked, REPORT_LIMIT, STICKERS } from "@/lib/guestbook";
import { isLocale } from "@/lib/i18n";
import { seoulToday } from "@/lib/site";
import { adminDb } from "@/lib/supabase";

export interface Message {
  id: string;
  nickname: string;
  body: string;
  card: string;
  sticker: string;
  created_at: string;
  updated_at: string | null;
}

export type GuestbookError = "invalid" | "blocked" | "daily" | "password" | "failed";
export type GuestbookResult = { ok: true; message?: Message } | { ok: false; error: GuestbookError };

const PUBLIC_COLUMNS = "id, nickname, body, card, sticker, created_at, updated_at";
const PAGE = 24;

const slug = z.string().regex(/^[a-z0-9-]{1,40}$/);
const text = {
  nickname: z.string().trim().min(1).max(20),
  body: z.string().trim().min(1).max(300),
  password: z.string().min(4).max(30),
  card: z.enum(CARDS),
  sticker: z.enum(STICKERS),
};

/** Latest visible messages for a member, newest first. */
export async function listMessages(group: string, member: string, before?: string): Promise<{ items: Message[]; total: number }> {
  if (!slug.safeParse(group).success || !slug.safeParse(member).success) return { items: [], total: 0 };
  let q = adminDb()
    .from("birthday_messages")
    .select(PUBLIC_COLUMNS, { count: "exact" })
    .eq("group_slug", group)
    .eq("member_slug", member)
    .eq("hidden", false)
    .order("created_at", { ascending: false })
    .limit(PAGE);
  if (before) q = q.lt("created_at", before);
  const { data, count, error } = await q;
  if (error) return { items: [], total: 0 };
  return { items: (data ?? []) as Message[], total: count ?? 0 };
}

const postInput = z.object({ group: slug, member: slug, locale: z.string().refine(isLocale), website: z.string().max(0).optional(), ...text });

export async function postMessage(input: Record<string, string>): Promise<GuestbookResult> {
  const parsed = postInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const { group, member, locale, nickname, body, password, card, sticker } = parsed.data;
  if (!(await getGroup(group))?.members.some((m) => m.slug === member)) return { ok: false, error: "invalid" };
  if (isBlocked(`${nickname} ${body}`)) return { ok: false, error: "blocked" };

  const { data, error } = await adminDb()
    .from("birthday_messages")
    .insert({
      group_slug: group,
      member_slug: member,
      nickname,
      body,
      card,
      sticker,
      locale,
      password_hash: hashPassword(password),
      ip_hash: hashIp(clientIp(await headers())),
      kst_day: seoulToday(),
    })
    .select(PUBLIC_COLUMNS)
    .single();
  if (error) return { ok: false, error: error.code === "23505" ? "daily" : "failed" };
  return { ok: true, message: data as Message };
}

async function authorize(id: string, password: string) {
  const { data } = await adminDb().from("birthday_messages").select("password_hash").eq("id", id).single();
  return Boolean(data && checkPassword(password, data.password_hash as string));
}

const editInput = z.object({ id: z.uuid(), ...text });

export async function editMessage(input: Record<string, string>): Promise<GuestbookResult> {
  const parsed = editInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const { id, password, nickname, body, card, sticker } = parsed.data;
  if (isBlocked(`${nickname} ${body}`)) return { ok: false, error: "blocked" };
  if (!(await authorize(id, password))) return { ok: false, error: "password" };
  const { data, error } = await adminDb()
    .from("birthday_messages")
    .update({ nickname, body, card, sticker, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select(PUBLIC_COLUMNS)
    .single();
  return error ? { ok: false, error: "failed" } : { ok: true, message: data as Message };
}

export async function deleteMessage(input: { id: string; password: string }): Promise<GuestbookResult> {
  const parsed = z.object({ id: z.uuid(), password: text.password }).safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  if (!(await authorize(parsed.data.id, parsed.data.password))) return { ok: false, error: "password" };
  const { error } = await adminDb().from("birthday_messages").delete().eq("id", parsed.data.id);
  return error ? { ok: false, error: "failed" } : { ok: true };
}

/** Counts a report; hides the message once it reaches REPORT_LIMIT (admin can restore it). */
export async function reportMessage(id: string): Promise<GuestbookResult> {
  if (!z.uuid().safeParse(id).success) return { ok: false, error: "invalid" };
  const db = adminDb();
  const { data } = await db.from("birthday_messages").select("reports").eq("id", id).single();
  if (!data) return { ok: false, error: "invalid" };
  const reports = (data.reports as number) + 1;
  await db.from("birthday_messages").update({ reports, hidden: reports >= REPORT_LIMIT }).eq("id", id);
  return { ok: true };
}
