// Daily Vercel Cron ping (see vercel.json). Supabase's free plan pauses a project
// after a week without requests; with long caches and little early traffic the
// site might not query the DB that often. One tiny uncached read keeps it awake.
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // Vercel Cron sends `Authorization: Bearer $CRON_SECRET` when CRON_SECRET is set.
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) return new Response("Unauthorized", { status: 401 });

  const url = process.env.SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "");
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return Response.json({ ok: false, reason: "supabase not configured" });
  const res = await fetch(`${url}/rest/v1/groups?select=slug&limit=1`, { headers: { apikey: key }, cache: "no-store" });
  return Response.json({ ok: res.ok, status: res.status, at: new Date().toISOString() });
}
