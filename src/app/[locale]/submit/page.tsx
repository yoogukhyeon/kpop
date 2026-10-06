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

  const perkIcons = ["💜", "🌏", "📸"];

  return (
    <div className="grid gap-8">
      <section
        className="relative -mx-4 -mt-6 overflow-hidden px-4 pb-10 pt-10 sm:-mt-8 sm:rounded-b-[2rem] sm:px-10 sm:pt-14"
        style={{
          background:
            "radial-gradient(circle at 90% 10%, #ffd6e7 0, transparent 40%), radial-gradient(circle at 5% 90%, #e4dbff 0, transparent 45%), linear-gradient(135deg, #fff0f7 0%, #f6f0ff 100%)",
        }}
      >
        <span aria-hidden className="pointer-events-none absolute right-6 top-6 text-5xl opacity-80 sm:right-16 sm:text-7xl">🎂</span>
        <span aria-hidden className="pointer-events-none absolute right-28 top-28 hidden text-3xl opacity-70 sm:block">✨</span>
        <div className="relative grid max-w-2xl gap-3">
          <span className="chip-pink w-fit">🎀 {t.home.badge}</span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">{t.submit.title}</h1>
          <p className="text-muted sm:text-lg">{t.submit.intro}</p>
        </div>
        <ul className="relative mt-6 grid gap-3 sm:grid-cols-3">
          {t.ux.submitPerks.map((p, i) => (
            <li key={p.title} className="flex items-start gap-3 rounded-3xl bg-white/80 p-4 shadow-[0_6px_20px_rgba(255,111,170,0.12)] backdrop-blur">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-pink-soft to-brand-soft text-xl">{perkIcons[i]}</span>
              <span className="grid gap-0.5">
                <b className="text-sm">{p.title}</b>
                <span className="text-xs text-muted">{p.body}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
      <div className="mx-auto w-full max-w-3xl">
        <SubmitCafeForm
          labels={t.submit}
          steps={t.ux.submitSteps}
          consent={t.legal.consent}
          groups={groups.map((g) => ({ slug: g.slug, name: g.name, members: g.members.map((m) => ({ slug: m.slug, stageName: m.stageName })) }))}
        />
      </div>
    </div>
  );
}
