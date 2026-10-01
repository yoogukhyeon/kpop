# BiasTrip (web)

Seoul K-pop trip planner for international fans. Service plan: [../docs/PLAN.md](../docs/PLAN.md).

## Run

```bash
npm install
npm run dev          # http://localhost:3000 → /en
npm run build && npm start
```

## Environment

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production origin — canonical URLs, hreflang, sitemap, share cards |
| `GOOGLE_SITE_VERIFICATION` | Google Search Console meta tag value |
| `NAVER_SITE_VERIFICATION` | Naver Search Advisor meta tag value |
| `PARTNER_KLOOK_QUERY`, `PARTNER_KKDAY_QUERY`, `PARTNER_AGODA_QUERY` | Affiliate tracking query (e.g. `aid=123`) — partner boxes stay hidden until set |

## Languages

Locales: `en` (default), `ja`, `es`, `ko`. UI strings live in `src/i18n/<locale>.ts`; guides in `src/content/guides/<locale>/<slug>.md` (translations share the English slug). Untranslated guides are not served in that locale.

## Layout

| Path | What |
|---|---|
| `src/data/` | Seed data: groups, places, events. All `verifiedAt: null` until checked. |
| `src/lib/data.ts` | Data access layer — swap seed arrays for Supabase here. |
| `src/lib/planner.ts` | Builds the day-by-day plan (events, birthdays, spots by area). |
| `src/lib/i18n.ts` | Locales, Accept-Language detection, hreflang helper. |
| `src/lib/guides.ts` | Markdown guides per locale. |
| `src/lib/partners.ts` | Affiliate links, enabled per env var. |
| `src/app/api/card` | Share card images (`format=story` 1080×1920, `format=og` 1200×630). |
| `src/lib/submissions.ts` | Birthday cafe submissions — dev-only JSONL storage until a DB is connected. |
