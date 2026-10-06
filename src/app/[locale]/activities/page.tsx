import type { Metadata } from "next";
import { ActivitiesPage } from "@/components/ActivitiesPage";
import { seoTitle } from "@/lib/site";
import { alternates, getDictionary, isLocale } from "@/lib/i18n";
import { listActivities } from "@/lib/data";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  const first = (await listActivities())[0];
  const image = first ? [{ url: `/${locale}/activities/thumb/${first.id}`, width: 1200, height: 630, alt: first.title }] : undefined;
  return {
    title: seoTitle(t.activities.title),
    description: t.activities.metaDesc,
    alternates: alternates(locale, "/activities"),
    openGraph: { title: t.activities.title, description: t.activities.metaDesc, images: image },
    twitter: { card: "summary_large_image", images: image?.map((i) => i.url) },
  };
}

export default async function Page({ params }: Props) {
  return <ActivitiesPage locale={(await params).locale} />;
}
