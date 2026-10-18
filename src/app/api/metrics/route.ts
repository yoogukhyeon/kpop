import { z } from "zod";
import { isLocale } from "@/lib/i18n";
import { METRIC_EVENTS, METRIC_PLACEMENTS, METRIC_SOURCES } from "@/lib/metrics";
import { adminDb, adminConfigured } from "@/lib/supabase";
import { sameRequestOrigin } from "@/lib/request-origin";

export const dynamic = "force-dynamic";
const payload = z.object({
  event: z.enum(METRIC_EVENTS),
  locale: z.string().refine(isLocale),
  path: z.string().max(200).regex(/^\/[a-z0-9/-]*$/),
  product: z.string().max(80).regex(/^[a-z0-9-]*$/),
  placement: z.enum(METRIC_PLACEMENTS),
  source: z.enum(METRIC_SOURCES),
}).strict().refine((v) => v.path.split("/")[1] === v.locale)
  .refine((v) => v.event !== "affiliate_click" || Boolean(v.product));

export async function POST(req: Request) {
  // A JSON beacon from our own pages only; don't expose a public database writer.
  if (!sameRequestOrigin(req.headers.get("origin"), req.url, req.headers.get("host"))) return new Response(null, { status: 403 });
  if (Number(req.headers.get("content-length") ?? 0) > 1500) return new Response(null, { status: 413 });
  if (!req.headers.get("content-type")?.startsWith("application/json")) return new Response(null, { status: 415 });
  if (req.headers.get("dnt") === "1" || req.headers.get("sec-gpc") === "1" || /bot|crawler|spider|headless/i.test(req.headers.get("user-agent") ?? "")) return new Response(null, { status: 204 });
  const raw = await req.text();
  if (raw.length > 1500) return new Response(null, { status: 413 });
  let json: unknown;
  try { json = JSON.parse(raw); } catch { return new Response(null, { status: 400 }); }
  const parsed = payload.safeParse(json);
  if (!parsed.success) return new Response(null, { status: 400 });
  if (adminConfigured()) {
    const p = parsed.data;
    try {
      const { error } = await adminDb().rpc("record_site_metric", {
        event_name: p.event, locale_name: p.locale, page_name: p.path,
        product_name: p.product, placement_name: p.placement, source_name: p.source,
      });
      if (error) console.error("Aggregate metrics unavailable:", error.code);
    } catch { console.error("Aggregate metrics connection unavailable"); }
  }
  return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}
