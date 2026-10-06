"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Header CTA. Off the home page it navigates to the planner; on the home page
 * (where a plain #planner link would do nothing visible) it scrolls to the form
 * and asks it to highlight itself.
 */
export function PlannerButton({ locale, label }: { locale: string; label: string }) {
  const pathname = usePathname();
  return (
    <Link
      href={`/${locale}#planner`}
      className="btn hidden h-9 px-4 text-sm sm:inline-flex"
      onClick={(e) => {
        if (pathname !== `/${locale}`) return;
        e.preventDefault();
        history.replaceState(null, "", "#planner");
        window.dispatchEvent(new Event("planner:open"));
      }}
    >
      ✈️ {label}
    </Link>
  );
}
