import Link from "next/link";
import { notFound } from "next/navigation";
import { ActivityCard } from "@/components/ActivityCard";
import { BreadcrumbJsonLd, JsonLd } from "@/components/JsonLd";
import { KlookWidget } from "@/components/KlookWidget";
import { KLOOK_WIDGETS } from "@/lib/partners";
import { listActivities } from "@/lib/data";
import { getDictionary, isLocale } from "@/lib/i18n";
import { site } from "@/lib/site";
import type { ActivityCategory } from "@/lib/types";

export const ACTIVITY_CATEGORIES: ActivityCategory[] = ["tour", "experience", "ticket"];

/** Shared body of /activities and /activities/[category]. */
export async function ActivitiesPage({ locale, category }: { locale: string; category?: ActivityCategory }) {
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const items = await listActivities({ category });
  const tabs: [string, string][] = [
    [`/${locale}/activities`, t.activities.all],
    ...ACTIVITY_CATEGORIES.map((c): [string, string] => [`/${locale}/activities/${c}`, t.activities.categories[c]]),
  ];
  const current = category ? `/${locale}/activities/${category}` : `/${locale}/activities`;

  return (
    <div className="grid gap-6">
      <BreadcrumbJsonLd
        items={[
          [t.detail.home, `${site.url}/${locale}`],
          [t.activities.title, `${site.url}/${locale}/activities`],
          ...(category ? [[t.activities.categories[category], `${site.url}/${locale}/activities/${category}`] as [string, string]] : []),
        ]}
      />
      {items.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: category ? `${t.activities.categories[category]} · ${t.activities.title}` : t.activities.title,
            itemListElement: items.map((a, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: a.title,
              url: a.url,
              image: `${site.url}/${locale}/activities/thumb/${a.id}`,
            })),
          }}
        />
      )}
      <header className="grid gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">🎟️ {t.activities.title}</h1>
        <p className="max-w-2xl text-muted">{t.activities.intro}</p>
      </header>
      <nav className="flex flex-wrap gap-2">
        {tabs.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className={`rounded-full border-2 px-4 py-1.5 text-sm font-bold transition ${
              href === current ? "border-brand bg-brand-soft text-brand" : "border-line bg-surface text-muted hover:border-brand hover:text-brand"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
      {items.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
            <li key={a.id}><ActivityCard activity={a} locale={locale} /></li>
          ))}
        </ul>
      ) : (
        <p className="rounded-3xl bg-subtle p-6 text-muted">{t.activities.empty}</p>
      )}
      <KlookWidget adid={KLOOK_WIDGETS.essentials} title={t.activities.travelEssentials} />
      <p className="text-xs text-muted">{t.activities.note}</p>
    </div>
  );
}
