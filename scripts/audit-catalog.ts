import { events } from "../src/data/events";
import { groups } from "../src/data/groups";
import { places } from "../src/data/places";
import { groupResearch } from "../src/data/group-research";
import { eventIndexableLocales, eventReviewReason, isActionableEvent, isReviewedPlace, validSource } from "../src/lib/catalog-quality";
import { groupPublicationIssues } from "../src/lib/group-publication";

const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date());
const errors: string[] = [];
for (const place of places) {
  if (place.visit && (!place.sources?.length || !place.verifiedAt || !place.address)) errors.push(`${place.id}: incomplete researched visitor information`);
  for (const source of place.sources ?? []) if (!validSource(source)) errors.push(`${place.id}: invalid source URL`);
}
for (const [slug, research] of Object.entries(groupResearch)) {
  const group = groups.find((group) => group.slug === slug);
  if (!group) errors.push(`${slug}: unknown group`);
  for (const id of research.placeIds) if (!places.some((place) => place.id === id)) errors.push(`${slug}: missing route place ${id}`);
  for (const locale of research.locales) for (const key of ["intro", "itinerary", "booking"] as const) if (!research[key][locale]?.trim()) errors.push(`${slug}/${locale}: incomplete ${key}`);
}
console.log(JSON.stringify({ today, places: places.length, reviewedPlaces: places.filter((p) => isReviewedPlace(p, today)).length,
  currentEvents: events.filter((e) => isActionableEvent(e, today)).map((e) => ({ id: e.id, reviewDue: e.editorial!.reviewDue, languages: eventIndexableLocales(e, today) })),
  needsEventReview: events.filter((e) => e.endDate >= today && eventReviewReason(e, today)).map((e) => ({ id: e.id, reason: eventReviewReason(e, today) })),
  groups: groups.map((g) => ({ slug: g.slug, issues: groupPublicationIssues(g, groupResearch[g.slug], places, "ko", today) })), errors,
}, null, 2));
if (errors.length) process.exitCode = 1;
