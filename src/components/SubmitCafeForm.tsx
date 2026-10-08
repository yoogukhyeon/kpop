"use client";

import { useActionState } from "react";
import { submitCafe, type SubmitState } from "@/app/[locale]/submit/actions";
import type { Dictionary } from "@/lib/i18n";

interface GroupOption {
  slug: string;
  name: string;
  members: { slug: string; stageName: string }[];
}

const STEP_ICONS = ["💜", "☕", "📣"];

export function SubmitCafeForm({
  groups,
  labels,
  steps,
  consent,
  defaultMember,
}: {
  groups: GroupOption[];
  labels: Dictionary["submit"];
  steps: string[];
  consent: string;
  defaultMember?: string;
}) {
  const [state, action, pending] = useActionState<SubmitState, FormData>(submitCafe, { ok: false });

  if (state.ok) {
    return (
      <div className="grid place-items-center gap-3 rounded-[2rem] bg-gradient-to-br from-pink-soft to-brand-soft p-10 text-center">
        <span className="text-5xl">🎉</span>
        <p className="text-lg font-bold text-brand">{labels.thanks}</p>
      </div>
    );
  }
  if (state.errors?.form === "closed") return <p className="card text-muted">{labels.closed}</p>;

  const err = (name: string) => state.errors?.[name] && <span className="text-xs font-semibold text-warn">{state.errors[name]}</span>;

  return (
    // Gradient border: an outer gradient with the white form inset by 2px.
    <div className="rounded-[2rem] bg-gradient-to-br from-pink via-brand to-[#7ad7ff] p-[2px] shadow-[0_16px_40px_rgba(124,92,255,0.18)]">
      <form action={action} className="grid gap-7 rounded-[calc(2rem-2px)] bg-surface p-5 sm:p-8">
        {state.errors?.form === "failed" && <p className="rounded-2xl bg-pink-soft p-3 text-sm font-semibold text-warn">{labels.failed}</p>}

        <Step n={1} title={steps[0]}>
          <label className="grid gap-1.5">
            <span className="text-sm font-bold">{labels.member}</span>
            <select
              name="member"
              className="input font-semibold"
              required
              defaultValue={groups.some((g) => g.members.some((m) => `${g.slug}/${m.slug}` === defaultMember)) ? defaultMember : ""}
            >
              <option value="" disabled>—</option>
              {groups.filter((g) => g.members.length).map((g) => (
                <optgroup key={g.slug} label={g.name}>
                  {g.members.map((m) => (
                    <option key={m.slug} value={`${g.slug}/${m.slug}`}>{m.stageName}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            {err("member")}
          </label>
        </Step>

        <Step n={2} title={steps[1]}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="cafeName" label={labels.cafeName} error={err("cafeName")} />
            <Field name="address" label={labels.address} error={err("address")} />
            <Field name="startDate" type="date" label={labels.start} error={err("startDate")} />
            <Field name="endDate" type="date" label={labels.end} error={err("endDate")} />
          </div>
        </Step>

        <Step n={3} title={steps[2]}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="contact" label={labels.contact} error={err("contact")} />
            <Field name="sourceUrl" type="url" label={labels.sourceUrl} error={err("sourceUrl")} placeholder="https://" />
          </div>
        </Step>

        <div className="grid gap-3 border-t border-dashed border-line pt-5">
          <p className="text-xs text-muted">🔒 {consent}</p>
          <button
            className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink to-brand px-8 text-base font-extrabold text-white shadow-[0_10px_24px_rgba(255,111,170,0.35)] transition hover:-translate-y-0.5 hover:brightness-105 disabled:opacity-50 sm:w-fit"
            disabled={pending}
          >
            🎂 {labels.send}
          </button>
        </div>
      </form>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="grid gap-3">
      <legend className="mb-3 flex items-center gap-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-pink to-brand text-sm font-black text-white">{n}</span>
        <span className="text-lg font-extrabold">{STEP_ICONS[n - 1]} {title}</span>
      </legend>
      {children}
    </fieldset>
  );
}

function Field({ name, label, type = "text", error, placeholder }: { name: string; label: string; type?: string; error: React.ReactNode; placeholder?: string }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-bold">{label}</span>
      <input name={name} type={type} className="input" placeholder={placeholder} required />
      {error}
    </label>
  );
}
