import test from "node:test";
import assert from "node:assert/strict";
import { buildPartnerUrl, publicHttpsUrl } from "../src/lib/partner-url";
import { metricSource } from "../src/lib/metrics";
import { buildPlan, tripDates } from "../src/lib/planner";
import { groups } from "../src/data/groups";
import type { KEvent } from "../src/lib/types";
import { sameRequestOrigin } from "../src/lib/request-origin";

test("same-origin beacons work behind a proxy without allowing another origin", () => {
  assert.equal(sameRequestOrigin("https://sidequestday.com", "http://localhost:3000/api/metrics", "sidequestday.com"), true);
  assert.equal(sameRequestOrigin("http://127.0.0.1:3100", "http://localhost:3100/api/metrics", "127.0.0.1:3100"), true);
  assert.equal(sameRequestOrigin("https://attacker.example", "https://sidequestday.com/api/metrics", "sidequestday.com"), false);
  assert.equal(sameRequestOrigin("https://sidequestday.com.attacker.example", "https://sidequestday.com/api/metrics", "sidequestday.com"), false);
  assert.equal(sameRequestOrigin(null, "https://sidequestday.com/api/metrics", "sidequestday.com"), false);
});

test("affiliate attribution survives localization and preserves the exact product and package", () => {
  const klook = new URL(buildPartnerUrl("klook", "https://www.klook.com/activity/91793-kpop-tour/?package=42", "aid=9876&campaign=guide", "ja")!);
  assert.equal(klook.pathname, "/ja/activity/91793-kpop-tour/");
  assert.equal(klook.searchParams.get("package"), "42");
  assert.equal(klook.searchParams.get("aid"), "9876");
  const kkday = new URL(buildPartnerUrl("kkday", "https://www.kkday.com/en/product/2742?pkg_oid=10", "?cid=9876", "ko")!);
  assert.equal(kkday.pathname, "/ko/product/2742");
  assert.equal(kkday.searchParams.get("pkg_oid"), "10");
  assert.equal(kkday.searchParams.get("cid"), "9876");
  assert.equal(new URL(buildPartnerUrl("kkday", "https://www.kkday.com/en/product/2742", "cid=1", "es")!).pathname, "/en/product/2742");
});

test("tracking credentials cannot be sent to another host or a script URL", () => {
  for (const input of ["https://klook.com.attacker.example/activity/1", "javascript:alert(1)", "https://www.kkday.com/en/product/1", "https://user:pass@www.klook.com/activity/1", "http://www.klook.com/activity/1"]) {
    assert.equal(buildPartnerUrl("klook", input, "aid=private-id"), null);
  }
  assert.equal(publicHttpsUrl("javascript:alert(1)"), null);
});

test("measurement classifies referrers by domain, never a deceptive substring", () => {
  assert.equal(metricSource("https://search.naver.com/search.naver?query=private"), "naver");
  assert.equal(metricSource("https://www.google.co.jp/search?q=private"), "google");
  assert.equal(metricSource("https://google.com.attacker.example/"), "other");
  assert.equal(metricSource("", "reddit"), "community");
  assert.equal(metricSource(""), "direct");
});

test("a multi-day event is visited once during a trip, including an already running event", () => {
  const event: KEvent = { id: "popup", type: "popup", title: "Test", groups: ["bts"], startDate: "2026-10-01", endDate: "2026-10-10", venue: "Venue", area: "yongsan", sourceUrl: "https://example.com", verifiedAt: "2026-10-01" };
  const plan = buildPlan({ group: groups[0], memberSlugs: [], from: "2026-10-05", to: "2026-10-08", events: [event], places: [] });
  assert.equal(plan.days.flatMap((day) => day.events).length, 1);
  assert.equal(plan.days[0].events[0].id, "popup");
  assert.equal(plan.stats.events, 1);
});

test("trip dates validate the calendar and respect the itinerary limit", () => {
  assert.deepEqual(tripDates("2026-02-30", "2026-03-05"), []);
  assert.deepEqual(tripDates("2026-10-20", "2026-10-19"), []);
  assert.equal(tripDates("2026-12-29", "2027-01-03").length, 6);
  assert.equal(tripDates("2026-10-01", "2026-10-31").length, 14);
});
