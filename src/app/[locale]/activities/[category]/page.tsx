import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ACTIVITY_CATEGORIES, ActivitiesPage } from "@/components/ActivitiesPage";
import { alternates, getDictionary, isLocale, locales, ogBase } from "@/lib/i18n";
import { listActivities } from "@/lib/data";
import { seoTitle } from "@/lib/site";
import type { ActivityCategory } from "@/lib/types";

type Props = { params: Promise<{ locale: string; category: string }> };

const isCategory = (c: string): c is ActivityCategory => (ACTIVITY_CATEGORIES as string[]).includes(c);

export function generateStaticParams() {
  return locales.flatMap((locale) => ACTIVITY_CATEGORIES.map((category) => ({ locale, category })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category } = await params;
  if (!isLocale(locale) || !isCategory(category)) return {};
  const t = getDictionary(locale);
  const title = `${t.activities.categories[category]} · ${t.activities.title}`;
  const first = (await listActivities({ category }))[0];
  const image = first ? [{ url: `/${locale}/activities/thumb/${first.id}`, width: 1200, height: 630, alt: first.title }] : undefined;
  return {
    title: seoTitle(title),
    description: t.activities.metaDesc,
    alternates: alternates(locale, `/activities/${category}`),
    openGraph: { ...ogBase(locale), title, description: t.activities.metaDesc, images: image },
    twitter: { card: "summary_large_image", images: image?.map((i) => i.url) },
  };
}

export default async function Page({ params }: Props) {
  const { locale, category } = await params;
  if (!isCategory(category)) notFound();
  return <ActivitiesPage locale={locale} category={category} />;
}
