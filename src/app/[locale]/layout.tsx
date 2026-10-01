import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { site } from "@/lib/site";
import "../globals.css";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });

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
    openGraph: { siteName: site.name, locale, type: "website" },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      other: process.env.NAVER_SITE_VERIFICATION
        ? { "naver-site-verification": process.env.NAVER_SITE_VERIFICATION }
        : undefined,
    },
    alternates: { types: { "application/rss+xml": `/${locale}/rss.xml` } },
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
      <body className={`${jakarta.variable} antialiased`}>
        <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: `${site.url}/${locale}`, inLanguage: locale }} />
        <header className="border-b border-line bg-surface/80 backdrop-blur">
          <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 text-sm">
            <Link href={`/${locale}`} className="mr-auto text-lg font-extrabold tracking-tight text-brand">
              {site.name}
            </Link>
            <Link href={`/${locale}`} className="text-muted hover:text-text">{t.nav.planner}</Link>
            <Link href={`/${locale}/groups`} className="text-muted hover:text-text">{t.nav.groups}</Link>
            <Link href={`/${locale}/events`} className="text-muted hover:text-text">{t.nav.events}</Link>
            <Link href={`/${locale}/guides`} className="text-muted hover:text-text">{t.nav.guides}</Link>
            <Link href={`/${locale}/submit`} className="text-muted hover:text-text">{t.nav.submit}</Link>
            <Suspense>
              <LanguageSwitcher current={locale} options={languageOptions} />
            </Suspense>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 pb-10 pt-6 text-xs text-muted">{t.footer}</footer>
      </body>
    </html>
  );
}
