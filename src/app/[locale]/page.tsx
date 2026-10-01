import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlannerForm } from "@/components/PlannerForm";
import { listGroups } from "@/lib/data";
import { alternates, getDictionary, isLocale } from "@/lib/i18n";
import { seoulToday } from "@/lib/site";

const addDays = (d: string, n: number) =>
  new Date(Date.parse(`${d}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { alternates: alternates(locale, "") } : {};
}

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ group?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { group } = await searchParams;
  const t = getDictionary(locale);
  const groups = await listGroups();
  const today = seoulToday();

  return (
    <div className="grid gap-10">
      <section className="grid gap-6 pt-4">
        <div className="grid max-w-2xl gap-3">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{t.tagline}</h1>
          <p className="text-lg text-muted">{t.heroSub}</p>
        </div>
        <PlannerForm
          locale={locale}
          labels={t.form}
          groups={groups.map((g) => ({
            slug: g.slug,
            name: g.name,
            members: g.members.map((m) => ({ slug: m.slug, stageName: m.stageName })),
          }))}
          defaults={{ group, from: addDays(today, 30), to: addDays(today, 35) }}
        />
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-bold">{t.nav.groups}</h2>
        <div className="flex flex-wrap gap-2">
          {groups.map((g) => (
            <Link key={g.slug} href={`/${locale}/groups/${g.slug}`} className="btn-ghost text-sm">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: g.accent }} />
              {g.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
