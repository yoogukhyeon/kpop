import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ActivityCard } from "@/components/ActivityCard";
import { KlookWidget } from "@/components/KlookWidget";
import { JsonLd } from "@/components/JsonLd";
import { listActivities } from "@/lib/data";
import { getGuide, guideLocales, listGuides, listGuidesForLists } from "@/lib/guides";
import { alternates, formatDate, getDictionary, isLocale, locales } from "@/lib/i18n";
import { KLOOK_WIDGETS, partnerLinks } from "@/lib/partners";
import { site, seoTitle } from "@/lib/site";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const perLocale = await Promise.all(locales.map(async (locale) => (await listGuides(locale)).map((g) => ({ locale, slug: g.slug }))));
  return perLocale.flat();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const guide = await getGuide(locale, slug);
  if (!guide) return {};
  return {
    title: seoTitle(guide.title),
    description: guide.description,
    alternates: alternates(locale, `/guides/${slug}`, await guideLocales(slug)),
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.description,
      images: [{ url: `/${locale}/guides/${slug}/og`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: guide.title, images: [`/${locale}/guides/${slug}/og`] },
  };
}

export default async function GuidePage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const guide = await getGuide(locale, slug);
  if (!guide) {
    // Not translated into this language yet (e.g. after switching language): send to the guide list.
    if ((await guideLocales(slug)).length) redirect(`/${locale}/guides`);
    notFound();
  }
  const t = getDictionary(locale);
  const partners = partnerLinks(guide.partners, locale);
  const others = (await listGuidesForLists(locale)).filter((g) => g.slug !== slug);
  const activities = guide.activities.length ? await listActivities({ tags: guide.activities, limit: 4 }) : [];

  return (
    <article className="grid max-w-3xl gap-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.description,
          dateModified: guide.updated,
          inLanguage: locale,
          mainEntityOfPage: `${site.url}/${locale}/guides/${slug}`,
          image: `${site.url}/${locale}/guides/${slug}/og`,
          author: { "@id": `${site.url}/#organization` },
          publisher: { "@id": `${site.url}/#organization` },
          ...(guide.sources.length ? { citation: guide.sources } : {}),
        }}
      />
      <header className="tap-links grid gap-2">
        <Link href={`/${locale}/guides`} className="w-fit text-sm text-brand hover:underline">← {t.nav.guides}</Link>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{guide.title}</h1>
        <p className="text-sm text-muted">
          {t.guides.updated}: {formatDate(guide.updated, locale, { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </header>

      <aside className="rounded-3xl bg-brand-soft p-5">
        <p className="text-xs font-black uppercase tracking-wide text-brand">{t.guides.inShort}</p>
        <p className="mt-1.5 font-semibold leading-relaxed">{guide.description}</p>
      </aside>

      <div className="prose" dangerouslySetInnerHTML={{ __html: guide.html }} />

      {activities.length > 0 && (
        <section className="grid gap-3">
          <h2 className="section-title">🎟️ {t.activities.recommended}</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {activities.map((a) => (
              <li key={a.id}><ActivityCard activity={a} locale={locale} compact /></li>
            ))}
          </ul>
          <p className="text-xs text-muted">{t.activities.note}</p>
        </section>
      )}

      {/* Travel-essentials widget on guides about the trip itself (those recommending Klook). */}
      {guide.partners.includes("klook") && <KlookWidget adid={KLOOK_WIDGETS.essentials} title={t.activities.travelEssentials} />}

      {partners.length > 0 && (
        <aside className="tap-links card grid gap-2">
          <h2 className="font-bold">{t.partners.title}</h2>
          <ul className="grid gap-1.5 text-sm">
            {partners.map((p) => (
              <li key={p.id}>
                <a href={p.href} target="_blank" rel="sponsored noopener" className="font-semibold text-brand hover:underline">{p.name}</a>
                <span className="text-muted"> — {p.label}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted">{t.partners.disclosure}</p>
        </aside>
      )}

      {guide.sources.length > 0 && (
        <section className="tap-links grid gap-1 text-xs text-muted">
          <h2 className="font-semibold">{t.guides.sources}</h2>
          <ul className="grid gap-0.5">
            {guide.sources.map((s) => (
              <li key={s}><a href={s} target="_blank" rel="noopener nofollow" className="break-all hover:text-brand">{s}</a></li>
            ))}
          </ul>
        </section>
      )}

      {others.length > 0 && (
        <nav className="tap-links grid gap-2">
          <h2 className="font-bold">{t.guides.more}</h2>
          <ul className="grid gap-1.5 text-sm">
            {others.map((g) => (
              <li key={g.slug}>
                <Link href={`/${g.lang}/guides/${g.slug}`} hrefLang={g.lang} className="text-brand hover:underline">{g.title}</Link>
                {g.lang !== locale && <span className="text-muted"> (English)</span>}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </article>
  );
}
