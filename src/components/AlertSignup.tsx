"use client";

import Link from "next/link";
import { useActionState } from "react";
import { subscribe, type SubscribeState } from "@/app/actions/subscribe";

/** Bias alert sign-up box (email per group, optional member). */
export function AlertSignup({
  locale,
  group,
  member,
  labels,
  failedLabel,
}: {
  locale: string;
  group: string;
  member?: string;
  labels: { title: string; desc: string; placeholder: string; submit: string; thanks: string; consent: string; invalid: string };
  failedLabel: string;
}) {
  const [state, action, pending] = useActionState<SubscribeState, FormData>(subscribe, { ok: false });

  return (
    <section className="grid gap-3 rounded-3xl bg-gradient-to-br from-pink-soft to-brand-soft p-6" aria-label={labels.title}>
      <p className="text-lg font-extrabold">🔔 {labels.title}</p>
      {state.ok ? (
        <p className="font-semibold text-brand">{labels.thanks}</p>
      ) : (
        <>
          <p className="text-sm text-muted">{labels.desc}</p>
          <form action={action} className="grid gap-2">
            <input type="hidden" name="group" value={group} />
            <input type="hidden" name="locale" value={locale} />
            {member && <input type="hidden" name="member" value={member} />}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <input
              type="email"
              name="email"
              required
              placeholder={labels.placeholder}
              aria-label={labels.placeholder}
              className="input w-full bg-surface"
            />
            <button className="btn w-full" disabled={pending}>{labels.submit}</button>
          </form>
          {state.error && <p className="text-xs text-warn">{state.error === "invalid" ? labels.invalid : failedLabel}</p>}
          <p className="text-xs text-muted">
            <Link href={`/${locale}/privacy`} className="underline">{labels.consent}</Link>
          </p>
        </>
      )}
    </section>
  );
}
