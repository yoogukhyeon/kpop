"use client";

import { usePathname, useSearchParams } from "next/navigation";

export function LanguageSwitcher({
  current,
  options,
}: {
  current: string;
  options: { locale: string; name: string }[];
}) {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <label className="relative inline-flex h-9 items-center">
      <span aria-hidden className="pointer-events-none absolute left-3 text-sm">🌐</span>
      <select
        aria-label="Language"
        className="h-9 max-w-[9.5rem] cursor-pointer appearance-none truncate rounded-full border-2 border-line bg-surface pl-8 pr-8 text-sm font-bold text-text transition hover:border-brand focus:border-brand focus:outline-none"
        value={current}
        onChange={(e) => {
          const q = search ? `?${search}` : "";
          window.location.href = `/${e.target.value}${rest ? `/${rest}` : ""}${q}`;
        }}
      >
        {options.map((o) => (
          <option key={o.locale} value={o.locale} lang={o.locale}>{o.name}</option>
        ))}
      </select>
      <svg aria-hidden viewBox="0 0 12 12" className="pointer-events-none absolute right-3 h-3 w-3 text-muted">
        <path d="M2 4.5 6 8l4-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </label>
  );
}
