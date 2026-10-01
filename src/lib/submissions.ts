import "server-only";
import { z } from "zod";
import { publicDb, supabaseConfigured } from "@/lib/supabase";

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const cafeSubmission = z
  .object({
    member: z.string().regex(/^[a-z0-9-]+\/[a-z0-9-]+$/),
    cafeName: z.string().trim().min(2).max(120),
    address: z.string().trim().min(5).max(300),
    startDate: date,
    endDate: date,
    contact: z.string().trim().min(2).max(120),
    sourceUrl: z.url().max(500),
  })
  .refine((v) => v.endDate >= v.startDate, { path: ["endDate"], message: "End date must be after start date" });

export type CafeSubmission = z.infer<typeof cafeSubmission>;

export const submissionsEnabled = supabaseConfigured;

/** Stores a pending submission. RLS only allows inserting pending rows with the publishable key. */
export async function saveSubmission(s: CafeSubmission) {
  const { error } = await publicDb().from("cafe_submissions").insert({
    member: s.member,
    cafe_name: s.cafeName,
    address: s.address,
    start_date: s.startDate,
    end_date: s.endDate,
    contact: s.contact,
    source_url: s.sourceUrl,
  });
  if (error) throw new Error(`Supabase: failed to save submission: ${error.message}`);
}
