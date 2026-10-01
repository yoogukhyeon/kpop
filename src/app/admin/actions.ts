"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { seoulToday } from "@/lib/site";
import { adminDb } from "@/lib/supabase";

const AREAS = ["yongsan", "seongsu", "gangnam", "mapo", "songpa", "jung", "gangdong", "yeouido", "guro"] as const;

async function requireAdmin() {
  if (!isAdminAuthorized((await headers()).get("authorization"))) throw new Error("Unauthorized");
}

const approveInput = z.object({
  id: z.uuid(),
  title: z.string().trim().min(2).max(200),
  area: z.enum(AREAS),
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
  });
  if (insert.error) throw new Error(`Event insert failed: ${insert.error.message}`);

  const update = await db
    .from("cafe_submissions")
    .update({ status: "approved", event_id: eventId, reviewed_at: new Date().toISOString() })
    .eq("id", id);
  if (update.error) throw new Error(`Submission update failed: ${update.error.message}`);

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
