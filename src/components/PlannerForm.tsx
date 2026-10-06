"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

  const formRef = useRef<HTMLFormElement>(null);
  const groupRef = useRef<HTMLSelectElement>(null);
  const [highlight, setHighlight] = useState(false);

  // Header "Trip planner" button: bring the form into view and point at it.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const open = () => {
      if (window.location.hash !== "#planner") return;
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      groupRef.current?.focus({ preventScroll: true });
      setHighlight(true);
      clearTimeout(timer);
      timer = setTimeout(() => setHighlight(false), 1600);
    };
    const first = setTimeout(open, 60);
    window.addEventListener("planner:open", open);
    window.addEventListener("hashchange", open);
    return () => {
      clearTimeout(first);
      clearTimeout(timer);
      window.removeEventListener("planner:open", open);
      window.removeEventListener("hashchange", open);
    };
  }, []);

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
    <form
      ref={formRef}
      onSubmit={submit}
      className={`grid gap-4 rounded-[2rem] border bg-surface p-5 shadow-[0_10px_30px_rgba(124,92,255,0.12)] transition duration-500 sm:p-6 ${highlight ? "border-brand ring-4 ring-brand/30" : "border-line"}`}
    >
      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-end">
        <label className="grid gap-1.5">
          <span className="text-xs font-bold text-muted">{labels.group}</span>
          <select
            ref={groupRef}
            className="input font-semibold"
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
        <label className="grid gap-1.5">
          <span className="text-xs font-bold text-muted">{labels.from}</span>
          <input type="date" className="input font-semibold" value={from} required onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs font-bold text-muted">{labels.to}</span>
          <input type="date" className="input font-semibold" value={to} min={from} required onChange={(e) => setTo(e.target.value)} />
        </label>
        <button className="btn lg:px-8" type="submit">{labels.submit}</button>
      </div>

      {current && current.members.length > 0 && (
        <fieldset className="grid gap-2">
          <legend className="mb-2 text-xs font-bold text-muted">{labels.members}</legend>
          <div className="flex flex-wrap gap-1.5">
            <Chip active={members.length === 0} onClick={() => setMembers([])}>{labels.allMembers}</Chip>
            {current.members.map((m) => (
              <Chip key={m.slug} active={members.includes(m.slug)} onClick={() => toggle(m.slug)}>
                {m.stageName}
              </Chip>
            ))}
          </div>
        </fieldset>
      )}
      <p className="text-xs text-muted">{labels.maxDays}</p>
    </form>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
        active ? "border-brand bg-brand-soft text-brand" : "border-line bg-surface text-muted hover:border-brand hover:text-brand"
      }`}
    >
      {children}
    </button>
  );
}
