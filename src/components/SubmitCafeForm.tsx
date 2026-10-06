"use client";

import { useActionState } from "react";
import { submitCafe, type SubmitState } from "@/app/[locale]/submit/actions";
import type { Dictionary } from "@/lib/i18n";

interface GroupOption {
  slug: string;
  name: string;
  members: { slug: string; stageName: string }[];
}

export function SubmitCafeForm({ groups, labels, consent }: { groups: GroupOption[]; labels: Dictionary["submit"]; consent: string }) {
  const [state, action, pending] = useActionState<SubmitState, FormData>(submitCafe, { ok: false });

  if (state.ok) return <p className="card font-medium text-brand">{labels.thanks}</p>;
  if (state.errors?.form === "closed") return <p className="card text-muted">{labels.closed}</p>;

  const err = (name: string) => state.errors?.[name] && <span className="text-xs text-warn">{state.errors[name]}</span>;

  return (
    <form action={action} className="card grid gap-4 sm:grid-cols-2">
      {state.errors?.form === "failed" && <p className="text-sm text-warn sm:col-span-2">{labels.failed}</p>}
      <label className="grid gap-1.5 sm:col-span-2">
        <span className="text-sm font-medium">{labels.member}</span>
        <select name="member" className="input" required defaultValue="">
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
      <Field name="cafeName" label={labels.cafeName} error={err("cafeName")} />
      <Field name="address" label={labels.address} error={err("address")} />
      <Field name="startDate" type="date" label={labels.start} error={err("startDate")} />
      <Field name="endDate" type="date" label={labels.end} error={err("endDate")} />
      <Field name="contact" label={labels.contact} error={err("contact")} />
      <Field name="sourceUrl" type="url" label={labels.sourceUrl} error={err("sourceUrl")} />
      <p className="text-xs text-muted sm:col-span-2">{consent}</p>
      <button className="btn w-fit sm:col-span-2" disabled={pending}>{labels.send}</button>
    </form>
  );
}

function Field({ name, label, type = "text", error }: { name: string; label: string; type?: string; error: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      <input name={name} type={type} className="input" required />
      {error}
    </label>
  );
}
