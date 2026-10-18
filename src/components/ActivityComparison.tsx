import { commerceCopy } from "@/lib/commerce-copy";
import { formatDate, getDictionary, type Locale } from "@/lib/i18n";
import { partnerHref, partnerName } from "@/lib/partners";
import type { Activity } from "@/lib/types";

/** Curated context stays in the article; this table compares the actual catalog, without invented prices. */
export function ActivityComparison({ items, locale }: { items: Activity[]; locale: Locale }) {
  const c = commerceCopy(locale);
  const t = getDictionary(locale);
  if (!items.length) return null;
  return (
    <section className="grid gap-3 rounded-3xl border border-brand/20 bg-brand-soft/30 p-4 sm:p-5">
      <h2 className="text-xl font-extrabold">{c.compare}</h2>
      <p className="text-sm text-muted">{c.conditions}</p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[540px] text-left text-sm">
          <thead><tr className="border-b border-line"><th className="p-3">{t.activities.title}</th><th className="p-3">{c.place}</th><th className="p-3">{c.duration}</th><th className="p-3">{c.check}</th></tr></thead>
          <tbody>{items.map((a) => {
            const href = partnerHref(a.partner, a.url, locale);
            if (!href) return null;
            const duration = typeof a.duration === "number" ? t.activities.duration.minutes(a.duration) : a.duration ? t.activities.duration[a.duration] : "—";
            return <tr key={a.id} className="border-b border-line last:border-0">
              <td className="max-w-xs p-3 align-top"><p className="font-bold">{a.title}</p><p className="mt-1 text-xs text-muted">{a.summary[locale]}</p>{a.checkedAt && <p className="mt-2 text-xs text-muted">{t.guides.updated}: {formatDate(a.checkedAt, locale, { year: "numeric", month: "short", day: "numeric" })}</p>}</td>
              <td className="p-3 align-top">{a.area ? t.area[a.area] : "—"}</td><td className="p-3 align-top">{duration}</td>
              <td className="p-3 align-top"><a href={href} target="_blank" rel="sponsored nofollow noopener" data-affiliate-id={a.id} data-placement="guide_compare" className="inline-flex min-h-11 items-center font-bold text-brand underline underline-offset-4">{partnerName(a.partner)} ↗</a></td>
            </tr>;
          })}</tbody>
        </table>
      </div>
      <p className="text-xs text-muted">{t.partners.disclosure}</p>
    </section>
  );
}
