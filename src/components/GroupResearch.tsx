import type { GroupResearch as Research } from "@/data/group-research";
import type { Locale } from "@/lib/i18n";
import { researchCopy } from "@/lib/research-copy";
import { researchText } from "@/lib/catalog-quality";

export function GroupResearch({ research, locale }: { research: Research; locale: Locale }) {
  const c = researchCopy(locale);
  return <section className="grid gap-4 rounded-3xl bg-brand-soft p-5 sm:p-6" aria-label={c.title}>
    <h2 className="section-title">{c.title}</h2>
    <p className="leading-relaxed">{researchText(research.intro, locale)}</p>
    <div className="grid gap-2"><h3 className="font-bold">{c.itinerary}</h3><p className="leading-relaxed text-muted">{researchText(research.itinerary, locale)}</p></div>
    <div className="grid gap-2"><h3 className="font-bold">{c.booking}</h3><p className="leading-relaxed text-muted">{researchText(research.booking, locale)}</p></div>
    <div className="grid gap-1 border-t border-brand/15 pt-3 text-xs"><p>{c.checked}: <time dateTime={research.reviewedAt}>{research.reviewedAt}</time></p>{research.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer" className="w-fit text-brand underline">{source.label} ↗</a>)}</div>
  </section>;
}
