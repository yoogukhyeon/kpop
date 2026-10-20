"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type AdminTab = { href: string; label: string; badge?: number };

/** Tab bar for the admin panel; badges flag work waiting in a section. */
export function AdminNav({ tabs }: { tabs: AdminTab[] }) {
  const path = usePathname();
  return (
    <nav className="-mx-4 flex gap-1 overflow-x-auto whitespace-nowrap px-4 pb-1">
      {tabs.map((t) => {
        const active = t.href === "/admin" ? path === "/admin" : path.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-bold transition ${
              active ? "bg-brand text-white shadow-[0_6px_16px_rgba(124,92,255,0.3)]" : "text-muted hover:bg-brand-soft hover:text-brand"
            }`}
          >
            {t.label}
            {!!t.badge && (
              <span className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-black ${active ? "bg-white text-brand" : "bg-pink text-white"}`}>
                {t.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
