import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listGuides, listGuidesForLists } from "@/lib/guides";
import { alternates, getDictionary, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  // Index only when the locale has its own translated guides.
  const translated = (await listGuides(locale)).length > 0;
  return {
    title: t.guides.title,
    description: t.meta.guidesDesc,
    alternates: alternates(locale, "/guides"),
    robots: translated ? undefined : { index: false, follow: true },
  };
}

export default async function GuidesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const guides = await listGuidesForLists(locale);

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-extrabold tracking-tight">{t.guides.title}</h1>
      <ul className="grid gap-3 sm:grid-cols-2">
        {guides.map((g) => (
          <li key={g.slug}>
            <Link href={`/${g.lang}/guides/${g.slug}`} hrefLang={g.lang} className="card grid h-full gap-1.5 transition hover:border-brand">
              {g.lang !== locale && <span className="chip w-fit">English</span>}
              <b>{g.title}</b>
              <span className="text-sm text-muted">{g.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
