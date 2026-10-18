import type { Locale } from "@/lib/i18n";
import type { Place } from "@/lib/types";
import { researchText } from "@/lib/catalog-quality";
import { researchCopy } from "@/lib/research-copy";
import { mapsUrl } from "@/lib/site";

export function PlaceDetails({ place, locale, group }: { place: Place; locale: Locale; group?: string }) {
  const c = researchCopy(locale);
  const v = place.visit;
  return <article className="grid gap-3 rounded-3xl border border-line bg-surface p-5" data-place-id={place.id}>
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h3 className="font-bold">{place.name}</h3>
      {group && <span className={place.groups.includes(group) ? "chip-pink" : "chip"}>{place.groups.includes(group) ? c.related : c.general}</span>}
    </div>
    <p className="text-sm text-muted">{place.note[locale]}</p>
    <a href={mapsUrl(place.address ?? place.name)} target="_blank" rel="noopener noreferrer" className="w-fit text-sm font-semibold text-brand underline">{place.address ?? place.name} ↗</a>
    {v && <dl className="grid gap-2 text-sm">{[
      [c.transit, v.transit], [c.hours, v.hours], [c.admission, v.admission], [c.access, v.access],
    ].map(([label, value]) => <div key={String(label)} className="grid gap-0.5 sm:grid-cols-[140px_1fr]"><dt className="font-semibold">{String(label)}</dt><dd lang={typeof value === "object" && value[locale] ? locale : "en"} className="text-muted">{researchText(value as typeof v.transit, locale)}</dd></div>)}
      <div className="grid gap-0.5 sm:grid-cols-[140px_1fr]"><dt className="font-semibold">{c.duration}</dt><dd>{v.suggestedMinutes} {c.minutes}</dd></div>
    </dl>}
    <div className="grid gap-1 border-t border-line pt-3 text-xs text-muted">
      <p>{c.checked}: <time dateTime={place.verifiedAt ?? undefined}>{place.verifiedAt}</time></p>
      {place.sources?.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer" className="w-fit text-brand underline">{source.label} ↗</a>)}
      <p>{c.estimate}</p>
    </div>
  </article>;
}
