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
    <select
      aria-label="Language"
      className="h-9 rounded-lg border border-line bg-surface px-2 text-sm font-semibold"
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
  );
}
