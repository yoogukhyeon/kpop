import Link from "next/link";
import { ink, mixHex } from "@/lib/color";
import { formatDate, getDictionary, type Locale } from "@/lib/i18n";
import type { Member } from "@/lib/types";

// Pastel partner colours mixed with the group accent, so each member's
// photocard-style tile is distinct but still reads as the same group.
const PALETTE = ["#ff8fc7", "#ffd36b", "#7ad7ff", "#a48bff", "#8be3b5", "#ffb38a", "#c9a7ff"];

/** Photocard-style member tile: monogram, name, birthday and a D-day badge near the birthday. */
export function MemberCard({ member: m, index, accent, href, locale, today }: {
  member: Member;
  index: number;
  accent: string;
  href: string;
  locale: Locale;
  today: string;
}) {
  const t = getDictionary(locale);
  const partner = PALETTE[index % PALETTE.length];
  const thisYear = `${today.slice(0, 4)}${m.birthday.slice(4)}`;
  const next = thisYear >= today ? thisYear : `${Number(today.slice(0, 4)) + 1}${m.birthday.slice(4)}`;
  const days = Math.round((Date.parse(next) - Date.parse(today)) / 86_400_000);

  return (
    <Link
      href={href}
      className="group grid overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_4px_18px_rgba(124,92,255,0.08)] transition hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(124,92,255,0.2)]"
    >
      <div
        className="relative grid aspect-[4/3] place-items-center overflow-hidden"
        style={{ background: `linear-gradient(150deg, ${mixHex(accent, "#ffffff", 0.45)} 0%, ${mixHex(partner, "#ffffff", 0.25)} 100%)`, color: ink(accent) }}
      >
        <span aria-hidden className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/40" />
        <span aria-hidden className="absolute left-3 top-2 text-sm opacity-80">✦</span>
        <span aria-hidden className="absolute bottom-2 right-3 text-xs opacity-70">✦</span>
        <span className="text-4xl font-black tracking-tight drop-shadow-[0_2px_0_rgba(255,255,255,0.7)] transition group-hover:scale-110">
          {m.stageName.slice(0, 1)}
        </span>
        {days <= 30 && (
          <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-black ${days === 0 ? "bg-pink text-white" : "bg-white/90 text-pink"}`}>
            {days === 0 ? `🎉 ${t.ux.today}` : `D-${days}`}
          </span>
        )}
      </div>
      <div className="grid gap-0.5 p-3">
        <b className="truncate leading-snug">{m.stageName}</b>
        <span className="text-xs text-muted">🎂 {formatDate(m.birthday, locale, { month: "short", day: "numeric" })}</span>
      </div>
    </Link>
  );
}
