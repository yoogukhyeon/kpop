# SideQuest Day

A Seoul K-pop trip planner and researched travel guide for international fans. Next.js 15 App Router, React 19, TypeScript, Tailwind 4 and Supabase. The historical project name is BiasTrip.

## Run and verify

Use Node **22** (`.nvmrc`).

```sh
npm install
npm run dev
npm run lint
npm test
npm run audit:links
npm run build
npm start
```

`npm run audit:links -- --live` additionally checks clean merchant product URLs. It deliberately omits affiliate IDs from network requests so auditing does not inflate partner click statistics. A merchant's bot challenge is reported as **manual review**, never a successful availability check. Structural checks cover product IDs, tracking, language variants, translated summaries, guide metadata and internal guide links.

## Environment

Keep credentials in `.env.local` / Vercel settings, never in source control.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production origin for canonical URLs, hreflang, sitemap and share images |
| `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` | Public catalog access through RLS; `NEXT_PUBLIC_*` aliases also work |
| `SUPABASE_SECRET_KEY` | Server-only admin actions and aggregate measurement |
| `POSTGRES_URL_NON_POOLING` or `SUPABASE_DB_URL` | Schema migration connection |
| `ADMIN_PASSWORD` | HTTP Basic authentication for `/admin`, rechecked by admin actions |
| `PARTNER_KLOOK_QUERY` | Exact tracking query from your Klook account, including `aid` |
| `PARTNER_KKDAY_QUERY` | Exact tracking query from your KKpartners account, including `cid` |
| `PARTNER_AGODA_QUERY` | Optional Agoda tracking query |
| `GOOGLE_SITE_VERIFICATION`, `NAVER_SITE_VERIFICATION` | Search ownership verification values |
| `CRON_SECRET` | Bearer authentication for daily maintenance |
| `GUESTBOOK_SALT` | Salt for the guestbook daily-limit hash |

## Data and operations

- `src/lib/data.ts` reads the published Supabase catalog, falling back to `src/data/` only when public DB configuration is absent.
- `npm run db:migrate` applies the base schema and ordered `supabase/migrations/*.sql` in a transaction.
- `npm run db:migrate:metrics` applies only the additive aggregate-statistics migration.
- `npm run db:seed` upserts seed records. It can overwrite fields of matching catalog records: review edits before running it against production.
- `npm run refresh` clears the public data cache after reviewed DB changes.
- `/admin` handles cafe approvals, guestbook moderation and 28-day aggregate traffic / affiliate-click reports.

### Researched places, events and group publication

`src/data/researched-places.ts` records official evidence, public-access limits, transport, opening conditions and editorial visit-time estimates. As of the 2026-10-18 review, 15 of 17 places meet the visitor-information checklist; the two unchecked broadcast entries are kept out of suggested trips. HiKR's Monday closure is respected by the planner. Oil Tank Culture Park is described as an outdoor visit because the current operator notice says tank interiors are not continuously open.

`src/data/group-research.ts` contains original BTS, TWICE, SEVENTEEN, TXT and BLACKPINK planning notes in English, Korean and Japanese. Other group/language URLs remain usable with `noindex` until their own text and supporting visitor information have been reviewed. `groupPublicationIssues` is shared by metadata, sitemap and the admin report: a member list alone is insufficient. The checklist requires a current editorial review, a complete reviewed translation, distinct official evidence and checked group-related visitor information. These are our release standards, not claimed search-engine thresholds.

Events carry an original source, entry summary, source category, status and next review date. Only current, reviewed, non-cancelled listings are proposed in event lists and itineraries. Ended detail URLs remain as archives; unchecked detail URLs are retained with `noindex` and without a plan/booking CTA. A successful HTTP request never renews a verification date. `/admin` exposes due checks and lets an editor record reviewed dates, venue, source, entry conditions, cancellation or postponement. Cafe approval requires explicit confirmation of the host's original notice. There is no automatic scraping or invented cafe supply.

```sh
npm run audit:catalog
# One-time additive schema, using the existing db:migrate runner:
npm run db:migrate -- supabase/migrations/20261018_catalog_research.sql
# Inspect targeted catalog changes, then apply after source review:
npm run db:publish:research
npm run db:publish:research -- --apply
npm run refresh
```

The publisher saves a public-catalog backup under `/tmp`, then changes only the researched place/event IDs in a transaction. It does not seed groups, overwrite user submissions or change subscriber/message records. `npm run db:seed` remains a full seed operation and should not replace this targeted publisher for editorial updates. Sitemap and content pages refresh daily; scheduled review dates intentionally expire unless an editor actually rechecks the source.

Measurement stores daily counts by event, language, path, product, placement and broad acquisition source. It stores **no visitor IDs, IPs, full referrers or query strings**, uses no analytics cookies and respects DNT / GPC. Counts are not unique visitors or purchases, and may be missed by blocked or interrupted requests. Reconcile outbound clicks and approved commissions with each partner dashboard. Do not manufacture test purchases or traffic.

## Languages and editorial publication

Locales: `en`, `ja`, `zh-tw`, `zh-cn`, `vi`, `th`, `id`, `es`, `ko`. English is the default. Guides live in `src/content/guides/<locale>/<slug>.md` and share slugs across actual translations.

Guides with `draft: true` remain available at their existing URLs with `noindex`, but are excluded from guide lists, RSS, sitemap and published-language alternates. Nine older guides currently await source / editorial review. Add useful original analysis, check factual claims against suitable primary sources, verify internal links, and remove `draft` only after review. Do not insert a source merely to satisfy a count. Update each translation's date only when that translation is actually edited or checked; never claim native review or a visit that did not happen.

The `/[locale]/editorial` pages explain research, corrections and affiliate selection. Research guides are not presented as first-hand reviews. Product descriptions are supported by original selection criteria and decision tables; no fake prices, rankings, stock, reviews or artist-appearance guarantees are generated.

## Booking links

`src/lib/partner-url.ts` validates merchant hosts and keeps the product path, option parameters and tracking while selecting a supported storefront language. KKday Spanish pages use its English product route. Product cards link to the actual product, not a general merchant homepage. `src/lib/event-booking.ts` contains separately checked event ticket resources, including useful non-affiliate official / supplier routes.

A product page being reachable does not confirm date-specific availability, nationality eligibility, affiliate-account approval or commission attribution. Recheck the selected option before describing it as bookable.

## Growth measurement

Improve the researched booking guides and actual event supply before adding template pages. Compare Search Console queries/pages/countries with the site's language, source, page and product click reports. Keep exact-date events, general sightseeing and paid alternatives clearly distinguished.

Revenue depends on approved orders, not indexed page count. For planning only: monthly target / average approved commission = required approved orders. Required partner clicks and qualified visits depend on the measured booking and outbound-click rates; do not treat assumed rates as forecasts.
