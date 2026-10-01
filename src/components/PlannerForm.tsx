"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";

interface GroupOption {
  slug: string;
  name: string;
  members: { slug: string; stageName: string }[];
}

export function PlannerForm({
  locale,
  groups,
  labels,
  defaults,
}: {
  locale: string;
  groups: GroupOption[];
  labels: Dictionary["form"];
  defaults: { group?: string; members?: string[]; from: string; to: string };
}) {
  const router = useRouter();
  const [group, setGroup] = useState(defaults.group ?? groups[0]?.slug ?? "");
  const [members, setMembers] = useState<string[]>(defaults.members ?? []);
  const [from, setFrom] = useState(defaults.from);
  const [to, setTo] = useState(defaults.to);

  const current = groups.find((g) => g.slug === group);
  const toggle = (slug: string) =>
    setMembers((ms) => (ms.includes(slug) ? ms.filter((m) => m !== slug) : [...ms, slug]));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams({ group, from, to });
    if (members.length) q.set("members", members.join(","));
    router.push(`/${locale}/plan?${q}`);
  }

  return (
    <form onSubmit={submit} className="card grid gap-4 shadow-sm sm:grid-cols-2">
      <label className="grid gap-1.5 sm:col-span-2">
        <span className="text-sm font-medium">{labels.group}</span>
        <select
          className="input"
          value={group}
          onChange={(e) => {
            setGroup(e.target.value);
            setMembers([]);
          }}
        >
          {groups.map((g) => (
            <option key={g.slug} value={g.slug}>{g.name}</option>
          ))}
        </select>
      </label>

      {current && current.members.length > 0 && (
        <fieldset className="grid gap-1.5 sm:col-span-2">
          <legend className="mb-1.5 text-sm font-medium">{labels.members}</legend>
          <div className="flex flex-wrap gap-2">
            <Chip active={members.length === 0} onClick={() => setMembers([])}>{labels.allMembers}</Chip>
            {current.members.map((m) => (
              <Chip key={m.slug} active={members.includes(m.slug)} onClick={() => toggle(m.slug)}>
                {m.stageName}
              </Chip>
            ))}
          </div>
        </fieldset>
      )}

      <label className="grid gap-1.5">
        <span className="text-sm font-medium">{labels.from}</span>
        <input type="date" className="input" value={from} required onChange={(e) => setFrom(e.target.value)} />
      </label>
      <label className="grid gap-1.5">
        <span className="text-sm font-medium">{labels.to}</span>
        <input type="date" className="input" value={to} min={from} required onChange={(e) => setTo(e.target.value)} />
      </label>

      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <button className="btn" type="submit">{labels.submit}</button>
        <span className="text-xs text-muted">{labels.maxDays}</span>
      </div>
    </form>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1.5 text-sm transition ${
        active ? "border-brand bg-brand-soft font-semibold text-brand" : "border-line bg-surface text-muted hover:text-text"
      }`}
    >
      {children}
    </button>
  );
}
