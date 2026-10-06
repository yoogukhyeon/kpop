import type { Metadata } from "next";
import { ActivitiesPage } from "@/components/ActivitiesPage";
import { alternates, getDictionary, isLocale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return { title: t.activities.title, description: t.activities.metaDesc, alternates: alternates(locale, "/activities") };
}

export default async function Page({ params }: Props) {
  return <ActivitiesPage locale={(await params).locale} />;
}
