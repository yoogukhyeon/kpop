"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Sticky side box on detail pages — the "booking box" of a travel product page. */
export function PlanBox({
  locale,
  group,
  defaults,
  labels,
}: {
  locale: string;
  group: string;
  defaults: { from: string; to: string };
  labels: { title: string; note: string; from: string; to: string; submit: string };
}) {
  const router = useRouter();
  const [from, setFrom] = useState(defaults.from);
  const [to, setTo] = useState(defaults.to);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/${locale}/plan?${new URLSearchParams({ group, from, to })}`);
      }}
      className="grid gap-3 rounded-[2rem] border border-line bg-surface p-6 shadow-[0_10px_30px_rgba(124,92,255,0.12)]"
    >
      <p className="text-lg font-extrabold leading-snug">{labels.title}</p>
      <div className="grid gap-2">
        <label className="grid gap-1">
          <span className="text-xs font-bold text-muted">{labels.from}</span>
          <input type="date" className="input h-11 text-sm font-semibold" value={from} required onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-bold text-muted">{labels.to}</span>
          <input type="date" className="input h-11 text-sm font-semibold" value={to} min={from} required onChange={(e) => setTo(e.target.value)} />
        </label>
      </div>
      <button className="btn w-full">{labels.submit}</button>
      <p className="text-center text-xs text-muted">{labels.note}</p>
    </form>
  );
}
