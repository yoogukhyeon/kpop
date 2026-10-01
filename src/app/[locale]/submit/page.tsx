import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SubmitCafeForm } from "@/components/SubmitCafeForm";
import { listGroups } from "@/lib/data";
import { alternates, getDictionary, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return { title: t.submit.title, description: t.meta.submitDesc, alternates: alternates(locale, "/submit") };
}

export default async function SubmitPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const groups = await listGroups();

  return (
    <div className="grid max-w-2xl gap-6">
      <h1 className="text-3xl font-extrabold tracking-tight">{t.submit.title}</h1>
      <p className="text-muted">{t.submit.intro}</p>
      <SubmitCafeForm
        labels={t.submit}
        groups={groups.map((g) => ({ slug: g.slug, name: g.name, members: g.members.map((m) => ({ slug: m.slug, stageName: m.stageName })) }))}
      />
    </div>
  );
}
