import Link from "next/link";
import { adminCounts } from "@/app/admin/counts";
import { adminDb } from "@/lib/supabase";

// Admin home: what needs attention today, plus the headline numbers.

export default async function AdminHome() {
  const c = await adminCounts();
  const since = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date(Date.now() - 27 * 86400000));
  const { data } = await adminDb().rpc("site_metrics_report", { since_day: since });
  const totals = (data as { totals?: Record<string, number> } | null)?.totals ?? {};

  const todo = [
    { href: "/admin/cafes", icon: "🎂", title: "생카 등록 검토", count: c.pendingCafes, note: "승인하면 9개 언어 페이지와 홍보 카드가 생깁니다" },
    { href: "/admin/messages", icon: "🚩", title: "신고된 메시지", count: c.reportedMessages, note: `숨김 ${c.hiddenMessages} · 전체 ${c.totalMessages}` },
    { href: "/admin/catalog", icon: "🗂️", title: "재확인 필요 행사", count: c.eventsDue, note: `진행·예정 행사 ${c.upcomingEvents}개 중` },
  ];
  const stats: [string, string][] = [["page_view", "페이지 조회"], ["plan_created", "일정 생성"], ["affiliate_click", "제휴 링크 클릭"], ["card_download", "카드 다운로드"]];
  const allClear = todo.every((t) => t.count === 0);

  return (
    <div className="grid gap-8">
      <section className="grid gap-3">
        <h1 className="text-2xl font-extrabold">{allClear ? "오늘 처리할 일이 없어요 ✨" : "오늘 처리할 일"}</h1>
        <ul className="grid gap-3 sm:grid-cols-3">
          {todo.map((t) => (
            <li key={t.href}>
              <Link
                href={t.href}
                className={`grid h-full gap-2 rounded-3xl border-2 p-5 transition hover:-translate-y-0.5 ${t.count ? "border-pink bg-pink-soft" : "border-line bg-surface"}`}
              >
                <span className="flex items-center justify-between">
                  <span className="text-2xl">{t.icon}</span>
                  <span className={`text-3xl font-black ${t.count ? "text-pink" : "text-muted"}`}>{t.count}</span>
                </span>
                <b>{t.title}</b>
                <span className="text-xs text-muted">{t.note}</span>
                <span className="text-xs font-bold text-brand">{t.count ? "지금 처리하기 →" : "열어 보기 →"}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-3">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-extrabold">최근 28일</h2>
          <Link href="/admin/stats" className="text-sm font-bold text-brand">자세한 통계 →</Link>
        </div>
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map(([key, label]) => (
            <li key={key} className="card p-4">
              <p className="text-xs font-bold text-muted">{label}</p>
              <p className="mt-1 text-2xl font-black">{Number(totals[key] ?? 0).toLocaleString("ko-KR")}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-3">
        <h2 className="text-lg font-extrabold">바로가기</h2>
        <ul className="flex flex-wrap gap-2 text-sm">
          {[
            ["Google Search Console", "https://search.google.com/search-console"],
            ["네이버 서치어드바이저", "https://searchadvisor.naver.com/console/board"],
            ["Klook 파트너", "https://affiliate.klook.com/"],
            ["KKday 파트너", "https://affiliate.kkday.com/"],
            ["Vercel", "https://vercel.com/my-business/biastrip"],
            ["GitHub PR", "https://github.com/yoogukhyeon/kpop/pulls"],
          ].map(([label, href]) => (
            <li key={href}>
              <a href={href} target="_blank" rel="noopener noreferrer" className="btn-ghost h-9 px-3 text-xs">{label} ↗</a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
