import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GroupCard } from "@/components/GroupCard";
import { listGroups } from "@/lib/data";
import { seoTitle } from "@/lib/site";
import { alternates, getDictionary, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return { title: seoTitle(t.meta.groupsTitle), description: t.meta.groupsDesc, alternates: alternates(locale, "/groups") };
}

export default async function GroupsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const groups = await listGroups();

  return (
    <div className="grid gap-6">
      <header className="grid gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{t.meta.groupsTitle}</h1>
        <p className="max-w-3xl text-muted">{t.meta.groupsDesc}</p>
      </header>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-4">
        {groups.map((g) => (
          <li key={g.slug}>
            <GroupCard group={g} locale={locale} membersLabel={g.members.length ? t.detail.members(g.members.length) : undefined} />
          </li>
        ))}
      </ul>
    </div>
  );
}
