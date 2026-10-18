import test from "node:test";
import assert from "node:assert/strict";
import { places } from "../src/data/places";
import { groups } from "../src/data/groups";
import { events } from "../src/data/events";
import { groupResearch } from "../src/data/group-research";
import { groupPublicationIssues } from "../src/lib/group-publication";
import { eventIndexableLocales, isActionableEvent, isRecentCheck, isReviewedEvent, isReviewedPlace } from "../src/lib/catalog-quality";
import { buildPlan } from "../src/lib/planner";

const today = "2026-10-18";
test("member lists and generic shared stops do not release an unreviewed group to Search", () => {
  const group = groups.find((g) => g.slug === "stray-kids")!;
  assert.ok(group.members.length > 0);
  assert.ok(groupPublicationIssues(group, undefined, places, "ko", today).length);
  const bts = groups.find((g) => g.slug === "bts")!;
  const shared = { ...groupResearch.bts, placeIds: ["hikr-ground", "withmuu-hongdae"] };
  assert.ok(groupPublicationIssues(bts, shared, places, "ko", today).some((message) => message.includes("관련성")));
});
test("publication requires the actual reviewed translation and current visitor evidence", () => {
  const group = groups.find((g) => g.slug === "bts")!;
  assert.deepEqual(groupPublicationIssues(group, groupResearch.bts, places, "ko", today), []);
  assert.ok(groupPublicationIssues(group, groupResearch.bts, places, "th", today).length);
  const expired = places.map((place) => ({ ...place, verifiedAt: "2026-01-01" }));
  assert.ok(groupPublicationIssues(group, groupResearch.bts, expired, "ko", today).length);
  assert.ok(groupPublicationIssues(group, { ...groupResearch.bts, reviewedAt: "2026-01-01" }, places, "ko", today).length);
  const museum = places.find((place) => place.id === "national-museum-korea")!;
  assert.equal(isReviewedPlace({ ...museum, visit: { ...museum.visit!, hours: { en: "", ko: "", ja: "" } } }, today), false);
});
test("stale, unreviewed and cancelled events cannot be presented as current appointments", () => {
  const event = events.find((e) => e.id === "twice-the-thrill-popup-2026")!;
  assert.equal(isActionableEvent(event, today), true);
  assert.equal(isActionableEvent({ ...event, editorial: undefined }, today), false);
  assert.equal(isActionableEvent({ ...event, editorial: { ...event.editorial!, reviewDue: "2026-10-17" } }, today), false);
  assert.equal(isActionableEvent({ ...event, editorial: { ...event.editorial!, status: "cancelled" } }, today), false);
  assert.equal(isActionableEvent(event, "2026-10-26"), false);
  assert.deepEqual(eventIndexableLocales(event, today).sort(), ["en", "ja", "ko"]);
  assert.equal(isReviewedEvent(event, "2026-12-01"), true);
});
test("verification dates reject impossible dates, future checks and missing evidence", () => {
  assert.equal(isRecentCheck("2026-02-30", today, 365), false);
  assert.equal(isRecentCheck("2026-99-99", today, 365), false);
  assert.equal(isRecentCheck("2026-10-19", today, 90), false);
  assert.equal(isRecentCheck(null, today, 90), false);
});
test("a closed visitor attraction is not assigned to its closed weekday", () => {
  const hikr = places.find((p) => p.id === "hikr-ground")!;
  const group = groups.find((g) => g.slug === "bts")!;
  const plan = buildPlan({ group, memberSlugs: [], from: "2026-10-19", to: "2026-10-20", events: [], places: [hikr] });
  assert.equal(plan.days[0].areas.flatMap((a) => a.places).length, 0);
  assert.equal(plan.days[1].areas.flatMap((a) => a.places)[0]?.id, hikr.id);
  const mondayOnly = buildPlan({ group, memberSlugs: [], from: "2026-10-19", to: "2026-10-19", events: [], places: [hikr] });
  assert.equal(mondayOnly.stats.spots, 0);
});
