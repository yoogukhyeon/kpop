import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ACTIVITY_CATEGORIES, ActivitiesPage } from "@/components/ActivitiesPage";
import { alternates, getDictionary, isLocale, locales } from "@/lib/i18n";
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
  return {
    title: seoTitle(`${t.activities.categories[category]} · ${t.activities.title}`),
    description: t.activities.metaDesc,
    alternates: alternates(locale, `/activities/${category}`),
  };
}

export default async function Page({ params }: Props) {
  const { locale, category } = await params;
  if (!isCategory(category)) notFound();
  return <ActivitiesPage locale={locale} category={category} />;
}
