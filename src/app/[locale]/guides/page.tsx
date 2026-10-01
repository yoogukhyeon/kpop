import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listGuides } from "@/lib/guides";
import { alternates, getDictionary, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return { title: t.guides.title, description: t.meta.guidesDesc, alternates: alternates(locale, "/guides") };
}

export default async function GuidesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const guides = await listGuides(locale);

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-extrabold tracking-tight">{t.guides.title}</h1>
      <ul className="grid gap-3 sm:grid-cols-2">
        {guides.map((g) => (
          <li key={g.slug}>
            <Link href={`/${locale}/guides/${g.slug}`} className="card grid h-full gap-1.5 transition hover:border-brand">
              <b>{g.title}</b>
              <span className="text-sm text-muted">{g.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
