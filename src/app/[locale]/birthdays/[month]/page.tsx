import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BirthdayList } from "@/components/BirthdayList";
import { BreadcrumbJsonLd, JsonLd } from "@/components/JsonLd";
import { MONTHS, birthdayEvents, isMonthParam, listBirthdays } from "@/lib/birthdays";
import { alternates, formatDate, getDictionary, isLocale, locales } from "@/lib/i18n";
import { seoTitle, seoulToday, site } from "@/lib/site";

// Daily: cafe counts and the year of the next birthday depend on today.
export const revalidate = 86400;

type Props = { params: Promise<{ locale: string; month: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => MONTHS.map((month) => ({ locale, month })));
}

const monthName = (mm: string, locale: Parameters<typeof formatDate>[1]) => formatDate(`2026-${mm}-01`, locale, { month: "long" });

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, month } = await params;
  if (!isLocale(locale) || !isMonthParam(month)) return {};
  const t = getDictionary(locale);
  const name = monthName(month, locale);
  return { title: seoTitle(t.birthdays.title(name)), description: t.birthdays.desc(name), alternates: alternates(locale, `/birthdays/${month}`) };
}

export default async function BirthdayMonthPage({ params }: Props) {
  const { locale, month } = await params;
  if (!isLocale(locale) || !isMonthParam(month)) notFound();
  const t = getDictionary(locale);
  const today = seoulToday();
  const [all, events] = await Promise.all([listBirthdays(), birthdayEvents()]);
  const items = all.filter((b) => b.monthDay.startsWith(month));
  const name = monthName(month, locale);
  const idx = MONTHS.indexOf(month);
  const prev = MONTHS[(idx + 11) % 12];
  const next = MONTHS[(idx + 1) % 12];

  return (
    <div className="grid gap-6">
      <BreadcrumbJsonLd
        items={[
          [t.detail.home, `${site.url}/${locale}`],
          [t.birthdays.indexTitle, `${site.url}/${locale}/birthdays`],
          [t.birthdays.title(name), `${site.url}/${locale}/birthdays/${month}`],
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: t.birthdays.title(name),
          itemListElement: items.map((b, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Person",
              name: b.member.stageName,
              birthDate: b.member.birthday,
              memberOf: { "@type": "MusicGroup", name: b.group.name },
              url: `${site.url}/${locale}/groups/${b.group.slug}/${b.member.slug}`,
            },
          })),
        }}
      />
      <Link href={`/${locale}/birthdays`} className="inline-flex min-h-10 w-fit items-center text-sm text-brand hover:underline">← {t.birthdays.indexTitle}</Link>
      <header className="grid gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">🎂 {t.birthdays.title(name)}</h1>
        <p className="max-w-3xl text-muted">{t.birthdays.intro(items.length, name)}</p>
      </header>
      <BirthdayList items={items} events={events} locale={locale} today={today} />
      <nav className="flex justify-between gap-3 text-sm font-bold">
        <Link href={`/${locale}/birthdays/${prev}`} className="btn-ghost">← {monthName(prev, locale)}</Link>
        <Link href={`/${locale}/birthdays/${next}`} className="btn-ghost">{monthName(next, locale)} →</Link>
      </nav>
    </div>
  );
}
