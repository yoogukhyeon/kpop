import { getDictionary, type Locale } from "@/lib/i18n";
import { partnerHref, partnerName } from "@/lib/partners";
import type { Activity } from "@/lib/types";

const TONE: Record<Activity["category"], { bg: string; icon: string }> = {
  tour: { bg: "linear-gradient(135deg, #e6f3ff, #cfe6ff)", icon: "🚌" },
  experience: { bg: "linear-gradient(135deg, #ffeef4, #ffd6e7)", icon: "💃" },
  ticket: { bg: "linear-gradient(135deg, #fff6d9, #ffe9a8)", icon: "🎫" },
};

/** Product card for a partner activity. The whole card links out to the partner page. */
export function ActivityCard({ activity: a, locale, compact = false }: { activity: Activity; locale: Locale; compact?: boolean }) {
  const t = getDictionary(locale);
  const tone = TONE[a.category];
  const partner = partnerName(a.partner);
  const duration =
    a.duration === undefined ? null : typeof a.duration === "number" ? t.activities.duration.minutes(a.duration) : t.activities.duration[a.duration];

  return (
    <a
      href={partnerHref(a.partner, a.url)}
      target="_blank"
      rel="sponsored nofollow noopener"
      className={`group grid h-full overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_4px_18px_rgba(124,92,255,0.07)] transition hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(124,92,255,0.15)] ${compact ? "grid-cols-[88px_1fr]" : "grid-rows-[auto_1fr]"}`}
    >
      <div className={`relative grid place-items-center ${compact ? "" : "aspect-[16/9]"}`} style={{ background: tone.bg }}>
        <span className={compact ? "text-3xl" : "text-5xl"} aria-hidden>{tone.icon}</span>
        {!compact && (
          <span className="absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-xs font-bold">
            {t.activities.categories[a.category]}
          </span>
        )}
      </div>
      <div className="grid content-start gap-1.5 p-4">
        <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs font-bold text-muted">
          <span>{partner}{a.area ? ` · ${t.area[a.area]}` : ""}</span>
          {duration && <span className="rounded-full bg-subtle px-2 py-0.5">⏱ {duration}</span>}
        </span>
        <p className="line-clamp-2 font-bold leading-snug">{a.title}</p>
        {!compact && <p className="line-clamp-2 text-sm text-muted">{a.summary[locale]}</p>}
        <span className="mt-1 text-sm font-bold text-brand group-hover:underline">{t.activities.view(partner)} ↗</span>
      </div>
    </a>
  );
}
