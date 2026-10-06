"use server";

import { z } from "zod";
import { isLocale } from "@/lib/i18n";
import { publicDb, supabaseConfigured } from "@/lib/supabase";

export type SubscribeState = { ok: boolean; error?: "invalid" | "failed" };

const input = z.object({
  email: z.email().max(254),
  group: z.string().regex(/^[a-z0-9-]+$/),
  member: z.string().regex(/^[a-z0-9-]*$/).optional(),
  locale: z.string().refine(isLocale),
  // Honeypot: real users never fill this hidden field.
  website: z.string().max(0).optional(),
});

/** Stores a bias alert sign-up. A repeat sign-up for the same group counts as success. */
export async function subscribe(_prev: SubscribeState, form: FormData): Promise<SubscribeState> {
  const parsed = input.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { ok: false, error: "invalid" };
  if (!supabaseConfigured()) return { ok: false, error: "failed" };
  const { email, group, member, locale } = parsed.data;
  const { error } = await publicDb()
    .from("subscriptions")
    .insert({ email: email.toLowerCase(), group_slug: group, member_slug: member || null, locale });
  if (error && error.code !== "23505") {
    console.error("subscribe failed", error.message);
    return { ok: false, error: "failed" };
  }
  return { ok: true };
}
