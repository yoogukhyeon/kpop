"use server";

import { cafeSubmission, saveSubmission, submissionsEnabled } from "@/lib/submissions";

export type SubmitState = { ok: boolean; errors?: Record<string, string> };

export async function submitCafe(_prev: SubmitState, form: FormData): Promise<SubmitState> {
  if (!submissionsEnabled()) return { ok: false, errors: { form: "closed" } };
  const parsed = cafeSubmission.safeParse(Object.fromEntries(form));
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] ??= issue.message;
    return { ok: false, errors };
  }
  try {
    await saveSubmission(parsed.data);
  } catch (e) {
    console.error(e);
    return { ok: false, errors: { form: "failed" } };
  }
  return { ok: true };
}
