import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { commerceCopy } from "@/lib/commerce-copy";
import { alternates, isLocale } from "@/lib/i18n";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const c = commerceCopy(locale);
  return { title: c.method, description: c.sources, alternates: alternates(locale, "/editorial") };
}

export default async function EditorialPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = commerceCopy(locale);
  return <article className="grid max-w-3xl gap-6">
    <h1 className="text-3xl font-extrabold">{c.method}</h1>
    <p className="text-lg leading-relaxed">{c.researched}</p>
    {[c.sources, c.updates, c.funding].map((text) => <p key={text} className="leading-relaxed text-muted">{text}</p>)}
    <div className="card grid gap-3 text-sm">
      <a href={`mailto:${site.contactEmail}`} className="font-bold text-brand">{site.contactEmail}</a>
      <Link href={`/${locale}/disclosure`} className="underline">{c.funding.split(".")[0]}</Link>
      <a href="https://developers.google.com/search/docs/essentials/spam-policies" target="_blank" rel="noopener" className="underline">Google Search — Spam policies</a>
      <a href="https://searchadvisor.naver.com/guide/content-basic" target="_blank" rel="noopener" className="underline">NAVER Search Advisor — 콘텐츠 작성시 권장 사항</a>
    </div>
  </article>;
}
