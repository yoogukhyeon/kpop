import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { alternates, defaultLocale, formatDate, getDictionary, isLocale } from "@/lib/i18n";
import { getPage, pageLocales, type PageSlug } from "@/lib/pages";

// Shared implementation for /[locale]/about, /privacy, /terms, /disclosure.
// A page missing in a locale redirects to the English version instead of
// serving duplicate English text under another language's URL.

export async function sitePageMetadata(locale: string, slug: PageSlug): Promise<Metadata> {
  if (!isLocale(locale)) return {};
  const page = await getPage(locale, slug);
  if (!page) return {};
  return { title: page.title, description: page.description, alternates: alternates(locale, `/${slug}`, await pageLocales(slug)) };
}

export async function SitePage({ locale, slug }: { locale: string; slug: PageSlug }) {
  if (!isLocale(locale)) notFound();
  const page = await getPage(locale, slug);
  if (!page) {
    if (locale !== defaultLocale) redirect(`/${defaultLocale}/${slug}`);
    notFound();
  }
  const t = getDictionary(locale);
  return (
    <article className="mx-auto grid max-w-3xl gap-6">
      <header className="grid gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight">{page.title}</h1>
        <p className="text-sm text-muted">
          {t.guides.updated}: {formatDate(page.updated, locale, { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </header>
      <div className="prose" dangerouslySetInnerHTML={{ __html: page.html }} />
    </article>
  );
}
