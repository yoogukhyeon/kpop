import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listGroups } from "@/lib/data";
import { alternates, getDictionary, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return { title: t.meta.groupsTitle, description: t.meta.groupsDesc, alternates: alternates(locale, "/groups") };
}

export default async function GroupsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const groups = await listGroups();

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-extrabold tracking-tight">{t.nav.groups}</h1>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => (
          <li key={g.slug}>
            <Link href={`/${locale}/groups/${g.slug}`} className="card flex items-center gap-3 transition hover:border-brand">
              <span className="h-10 w-10 shrink-0 rounded-xl" style={{ background: g.accent }} />
              <span className="grid">
                <b>{g.name}</b>
                <span className="text-sm text-muted">{g.fandom} · {g.agency}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
