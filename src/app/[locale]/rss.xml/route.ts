import { listGuides } from "@/lib/guides";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { site } from "@/lib/site";

// Per-language RSS of guides. Naver Search Advisor accepts an RSS feed for
// faster discovery; submit /ko/rss.xml there and the others where useful.

export const dynamic = "force-static";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET(_req: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return new Response("Not found", { status: 404 });
  const t = getDictionary(locale);
  const guides = await listGuides(locale);

  const items = guides
    .map((g) => {
      const url = `${site.url}/${locale}/guides/${g.slug}`;
      return `<item><title>${esc(g.title)}</title><link>${url}</link><guid>${url}</guid><description>${esc(g.description)}</description><pubDate>${new Date(`${g.updated}T00:00:00Z`).toUTCString()}</pubDate></item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(`${site.name} — ${t.guides.title}`)}</title><link>${site.url}/${locale}</link><description>${esc(t.meta.guidesDesc)}</description><language>${locale}</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
