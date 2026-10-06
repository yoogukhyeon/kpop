export const site = {
  name: "SideQuest Day",
  contactEmail: "rnrgus5897@gmail.com",
  // Explicit URL (custom domain) → Vercel's production domain → local dev.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
    "http://localhost:3000",
};

/** Today in Seoul as YYYY-MM-DD. */
export function seoulToday(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date());
}

export const mapsUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
