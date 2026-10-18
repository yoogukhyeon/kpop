"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { seoulToday } from "@/lib/site";
import { adminDb, DB_CACHE_TAG } from "@/lib/supabase";

const AREAS = ["yongsan", "seongsu", "gangnam", "mapo", "songpa", "jung", "jongno", "gangdong", "yeouido", "guro"] as const;

async function requireAdmin() {
  if (!isAdminAuthorized((await headers()).get("authorization"))) throw new Error("Unauthorized");
}

const approveInput = z.object({
  id: z.uuid(),
  title: z.string().trim().min(2).max(200),
  area: z.enum(AREAS),
  sourceChecked: z.literal("on"),
});

/** Turns a pending submission into a published birthday-cafe event. */
export async function approveSubmission(form: FormData) {
  await requireAdmin();
  const { id, title, area } = approveInput.parse(Object.fromEntries(form));
  const db = adminDb();

  const { data: sub, error } = await db.from("cafe_submissions").select("*").eq("id", id).eq("status", "pending").single();
  if (error || !sub) throw new Error(`Submission not found or already reviewed: ${error?.message ?? id}`);

  const eventId = `cafe-${id.slice(0, 8)}`;
  const insert = await db.from("events").insert({
    id: eventId,
    type: "birthday-cafe",
    title,
    groups: [String(sub.member).split("/")[0]],
    members: [sub.member],
    start_date: sub.start_date,
    end_date: sub.end_date,
    venue: `${sub.cafe_name} · ${sub.address}`,
    area,
    source_url: sub.source_url,
    // Approval means the admin checked the announcement link.
    verified_at: seoulToday(),
    editorial: {
      summary: {
        en: `Fan-organized birthday cafe at ${sub.cafe_name}. This is a fan event, not a confirmed artist appearance.`,
        ko: `${sub.cafe_name}에서 열리는 팬 주최 생일카페입니다. 아티스트의 현장 출연이 확인된 행사가 아닙니다.`,
        ja: `${sub.cafe_name}で開かれるファン主催の誕生日カフェです。アーティスト本人の出演が確認された企画ではありません。`,
      },
      entry: {
        en: "Use the host's original notice to check opening hours, ordering requirements, reservations and any limited gifts before visiting.",
        ko: "방문 전에 주최자 원문에서 운영 시간·주문 조건·예약·한정 특전을 확인하세요.",
        ja: "訪問前に主催者の原文で営業時間・注文条件・予約・数量限定特典を確認してください。",
      },
      sourceKind: "organizer", status: "scheduled",
      reviewDue: new Date(Date.now() + 7 * 86400000).toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" }),
    },
  });
  if (insert.error) throw new Error(`Event insert failed: ${insert.error.message}`);

  const update = await db
    .from("cafe_submissions")
    .update({ status: "approved", event_id: eventId, reviewed_at: new Date().toISOString() })
    .eq("id", id);
  if (update.error) throw new Error(`Submission update failed: ${update.error.message}`);

  revalidateTag(DB_CACHE_TAG);
  revalidatePath("/", "layout");
}

export async function rejectSubmission(form: FormData) {
  await requireAdmin();
  const id = z.uuid().parse(form.get("id"));
  const { error } = await adminDb()
    .from("cafe_submissions")
    .update({ status: "rejected", reviewed_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "pending");
  if (error) throw new Error(`Reject failed: ${error.message}`);
  revalidatePath("/admin");
}

/** Drops cached DB reads and regenerates pages — use after editing data or running db:seed. */
export async function refreshSiteData() {
  await requireAdmin();
  revalidateTag(DB_CACHE_TAG);
  revalidatePath("/", "layout");
}

const messageInput = z.object({ id: z.uuid(), op: z.enum(["hide", "show", "delete"]) });

/** Guestbook moderation: hide, restore (also clears reports) or delete a message. */
export async function moderateMessage(form: FormData) {
  await requireAdmin();
  const { id, op } = messageInput.parse(Object.fromEntries(form));
  const db = adminDb().from("birthday_messages");
  const { error } =
    op === "delete" ? await db.delete().eq("id", id) : await db.update(op === "hide" ? { hidden: true } : { hidden: false, reports: 0 }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

const reviewEventInput = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/).max(100),
  sourceUrl: z.url().max(500).refine((value) => { const u = new URL(value); return u.protocol === "https:" && !u.username && !u.password; }),
  startDate: z.iso.date(), endDate: z.iso.date(), reviewDue: z.iso.date(),
  venue: z.string().trim().min(2).max(400),
  hours: z.string().trim().max(200),
  status: z.enum(["scheduled", "cancelled", "postponed"]),
  sourceKind: z.enum(["organizer", "operator", "tourism"]),
  sourceChecked: z.literal("on"),
  summary_en: z.string().trim().min(20).max(3000), summary_ko: z.string().trim().min(20).max(3000), summary_ja: z.string().trim().min(20).max(3000),
  entry_en: z.string().trim().min(20).max(3000), entry_ko: z.string().trim().min(20).max(3000), entry_ja: z.string().trim().min(20).max(3000),
}).refine((value) => value.endDate >= value.startDate, "Invalid event dates");

export async function reviewCatalogEvent(form: FormData) {
  await requireAdmin();
  const value = reviewEventInput.parse(Object.fromEntries(form));
  const today = seoulToday();
  if (value.reviewDue < today || !Number.isFinite(Date.parse(value.reviewDue))) throw new Error("재확인일을 오늘 이후로 설정하세요.");
  const db = adminDb();
  const current = await db.from("events").select("editorial").eq("id", value.id).single();
  if (current.error) throw new Error("Event not found");
  const { error } = await db.from("events").update({
    source_url: value.sourceUrl, start_date: value.startDate, end_date: value.endDate, venue: value.venue, verified_at: today,
    editorial: {
      ...(current.data.editorial ?? {}),
      summary: { en: value.summary_en, ko: value.summary_ko, ja: value.summary_ja },
      entry: { en: value.entry_en, ko: value.entry_ko, ja: value.entry_ja },
      sourceKind: value.sourceKind, status: value.status, reviewDue: value.reviewDue,
      hours: value.hours || undefined,
    },
  }).eq("id", value.id);
  if (error) throw new Error("Event review could not be saved");
  revalidateTag(DB_CACHE_TAG);
  revalidatePath("/", "layout");
}
