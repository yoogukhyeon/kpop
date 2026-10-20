import Link from "next/link";
import { logout } from "@/app/admin/login/actions";
import { refreshSiteData } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { adminCounts } from "@/app/admin/counts";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const c = await adminCounts();
  return (
    <div className="grid gap-6">
      <header className="sticky top-0 z-40 -mx-4 grid gap-3 border-b border-line bg-surface/95 px-4 pb-2 pt-4 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/admin" className="text-xl font-black tracking-tight">
            SideQuest<span className="text-brand"> Day</span> <span className="ml-1 rounded-full bg-brand-soft px-2 py-0.5 align-middle text-xs font-bold text-brand">관리자</span>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <a href="/ko" target="_blank" rel="noopener" className="btn-ghost h-9 px-3 text-xs">🌐 사이트 보기</a>
            <form action={refreshSiteData}>
              <SubmitButton className="btn-ghost h-9 px-3 text-xs" pendingLabel="새로고침 중…">🔄 데이터 새로고침</SubmitButton>
            </form>
            <form action={logout}>
              <SubmitButton className="btn-ghost h-9 px-3 text-xs">로그아웃</SubmitButton>
            </form>
          </div>
        </div>
        <AdminNav
          tabs={[
            { href: "/admin", label: "🏠 홈" },
            { href: "/admin/cafes", label: "🎂 생카 검토", badge: c.pendingCafes },
            { href: "/admin/messages", label: "💌 메시지", badge: c.reportedMessages },
            { href: "/admin/catalog", label: "🗂️ 콘텐츠 검토", badge: c.eventsDue },
            { href: "/admin/stats", label: "📊 통계" },
          ]}
        />
      </header>
      {children}
    </div>
  );
}
