import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { JsonLd } from "@/components/JsonLd";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { site } from "@/lib/site";
import "../globals.css";

// Always light, so the browser's dark mode doesn't tint form controls or the address bar.
export const viewport: Viewport = { colorScheme: "light", themeColor: "#ffffff" };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    metadataBase: new URL(site.url),
    title: { default: `${site.name} — ${t.tagline}`, template: `%s · ${site.name}` },
    description: t.heroSub,
    applicationName: site.name,
    publisher: site.name,
    creator: site.name,
    openGraph: { siteName: site.name, locale, type: "website" },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      other: process.env.NAVER_SITE_VERIFICATION
        ? { "naver-site-verification": process.env.NAVER_SITE_VERIFICATION }
        : undefined,
    },
    alternates: { types: { "application/rss+xml": `/${locale}/rss.xml` } },
    // The site is about Seoul: regional geo tags for local/answer engines.
    other: { "geo.region": "KR-11", "geo.placename": "Seoul", "geo.position": "37.5665;126.9780", ICBM: "37.5665, 126.9780" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const languageOptions = locales.map((l) => ({ locale: l, name: getDictionary(l).langName }));

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${site.url}/#organization`,
                name: site.name,
                url: site.url,
                logo: { "@type": "ImageObject", url: `${site.url}/logo.png`, width: 512, height: 512 },
                email: site.contactEmail,
                description: "Fan-made K-pop trip planner and travel guide for international fans visiting Seoul.",
                contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: site.contactEmail, availableLanguage: ["en", "ja", "zh-TW", "zh-CN", "vi", "th", "id", "es", "ko"] },
                areaServed: { "@type": "City", name: "Seoul", sameAs: "https://en.wikipedia.org/wiki/Seoul", containedInPlace: { "@type": "Country", name: "South Korea" } },
                knowsAbout: ["K-pop", "K-pop concerts in Seoul", "Idol birthday cafes", "K-pop pop-up stores", "Music show recordings", "Travel in Seoul"],
              },
              {
                "@type": "WebSite",
                "@id": `${site.url}/#website`,
                name: site.name,
                url: `${site.url}/${locale}`,
                inLanguage: locale,
                publisher: { "@id": `${site.url}/#organization` },
              },
            ],
          }}
        />
        <header className="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
            <Link href={`/${locale}`} className="whitespace-nowrap text-xl font-black tracking-tight">
              SideQuest<span className="text-brand"> Day</span>
            </Link>
            <nav className="hidden items-center gap-5 text-[15px] font-semibold text-muted md:flex">
              <Link href={`/${locale}/groups`} className="hover:text-text">{t.nav.groups}</Link>
              <Link href={`/${locale}/birthdays`} className="hover:text-text">{t.birthdays.nav}</Link>
              <Link href={`/${locale}/activities`} className="hover:text-text">{t.activities.nav}</Link>
              <Link href={`/${locale}/events`} className="hover:text-text">{t.nav.events}</Link>
              <Link href={`/${locale}/guides`} className="hover:text-text">{t.nav.guides}</Link>
            </nav>
            <div className="ml-auto flex items-center gap-2">
              <Link href={`/${locale}/submit`} className="hidden text-sm font-semibold text-muted hover:text-text sm:block">
                {t.nav.submit}
              </Link>
              <Suspense>
                <LanguageSwitcher current={locale} options={languageOptions} />
              </Suspense>
              <Link href={`/${locale}#planner`} className="btn hidden h-9 px-3 text-sm sm:inline-flex">{t.nav.planner}</Link>
            </div>
          </div>
          <nav className="flex gap-5 overflow-x-auto px-4 pb-2.5 text-sm font-semibold text-muted md:hidden">
            <Link href={`/${locale}/groups`} className="shrink-0">{t.nav.groups}</Link>
            <Link href={`/${locale}/birthdays`} className="shrink-0">{t.birthdays.nav}</Link>
            <Link href={`/${locale}/activities`} className="shrink-0">{t.activities.nav}</Link>
            <Link href={`/${locale}/events`} className="shrink-0">{t.nav.events}</Link>
            <Link href={`/${locale}/guides`} className="shrink-0">{t.nav.guides}</Link>
            <Link href={`/${locale}/submit`} className="shrink-0">{t.nav.submit}</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">{children}</main>
        <footer className="mt-12 border-t border-line bg-[#fafbff]">
          <div className="mx-auto grid max-w-6xl gap-4 px-4 py-10 text-sm text-muted sm:grid-cols-[1fr_auto]">
            <div className="grid gap-2">
              <p className="text-base font-black text-text">SideQuest<span className="text-brand"> Day</span></p>
              <p className="max-w-xl text-xs leading-relaxed">{t.footer}</p>
              <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                <Link href={`/${locale}/about`} className="hover:text-text">{t.legal.about}</Link>
                <Link href={`/${locale}/privacy`} className="font-bold hover:text-text">{t.legal.privacy}</Link>
                <Link href={`/${locale}/terms`} className="hover:text-text">{t.legal.terms}</Link>
                <Link href={`/${locale}/disclosure`} className="hover:text-text">{t.legal.disclosure}</Link>
                <a href={`mailto:${site.contactEmail}`} className="hover:text-text">{t.legal.contact}: {site.contactEmail}</a>
              </p>
            </div>
            <nav className="flex flex-wrap gap-x-5 gap-y-2 font-semibold">
              <Link href={`/${locale}/groups`} className="hover:text-text">{t.nav.groups}</Link>
              <Link href={`/${locale}/birthdays`} className="hover:text-text">{t.birthdays.nav}</Link>
              <Link href={`/${locale}/activities`} className="hover:text-text">{t.activities.nav}</Link>
              <Link href={`/${locale}/events`} className="hover:text-text">{t.nav.events}</Link>
              <Link href={`/${locale}/guides`} className="hover:text-text">{t.nav.guides}</Link>
              <Link href={`/${locale}/submit`} className="hover:text-text">{t.nav.submit}</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
