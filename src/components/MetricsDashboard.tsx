import { adminDb } from "@/lib/supabase";

interface Breakdown { views: number | null; clicks: number | null }
interface Report {
  totals: Record<string, number>;
  languages: (Breakdown & { locale: string })[];
  products: { product_id: string; clicks: number }[];
  pages: (Breakdown & { path: string })[];
  sources: (Breakdown & { source: string })[];
}

export async function MetricsDashboard() {
  const since = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date(Date.now() - 27 * 86400000));
  const { data, error } = await adminDb().rpc("site_metrics_report", { since_day: since });
  if (error || !data) return <section className="card grid gap-2 text-sm"><h2 className="font-bold">방문·제휴 클릭 통계</h2><p>집계 테이블을 연결한 뒤부터 통계가 쌓입니다. 개인정보나 방문자 식별자는 저장하지 않습니다.</p><code>npm run db:migrate:metrics</code></section>;
  const report = data as Report;
  const metrics: [string, string][] = [["page_view", "페이지 조회"], ["plan_created", "일정 생성"], ["affiliate_click", "제휴 링크 클릭"], ["card_download", "카드 다운로드"]];
  return <section className="grid gap-4">
    <h2 className="text-xl font-extrabold">최근 28일 방문·제휴 클릭</h2>
    <p className="text-xs text-muted">한국 날짜 기준 · 페이지 조회와 클릭 횟수입니다. 순방문자·구매 건수가 아니며, 광고 차단·추적 거부·브라우저 종료 등으로 누락될 수 있습니다. 구매·승인 수익은 제휴사 대시보드와 대조하세요.</p>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{metrics.map(([key, title]) => <div key={key} className="card"><p className="text-sm text-muted">{title}</p><p className="mt-2 text-3xl font-black">{Number(report.totals[key] ?? 0).toLocaleString("ko-KR")}</p></div>)}</div>
    <div className="grid gap-4 lg:grid-cols-2">
      <Counts title="언어별" rows={report.languages.map((r) => ({ name: r.locale, ...r }))} />
      <Counts title="유입 경로별" rows={report.sources.map((r) => ({ name: r.source, ...r }))} />
      <Counts title="페이지별" rows={report.pages.map((r) => ({ name: r.path, ...r }))} />
      <div className="card grid content-start gap-3"><h3 className="font-bold">상품별 제휴 클릭</h3>{report.products.length ? report.products.map((r) => <p key={r.product_id} className="flex justify-between gap-3 text-sm"><span className="break-all">{r.product_id}</span><b>{r.clicks}</b></p>) : <p className="text-sm text-muted">아직 기록된 제휴 클릭이 없습니다.</p>}</div>
    </div>
  </section>;
}

function Counts({ title, rows }: { title: string; rows: (Breakdown & { name: string })[] }) {
  return <div className="card overflow-x-auto"><h3 className="mb-3 font-bold">{title}</h3><table className="w-full text-left text-sm"><thead><tr className="border-b border-line"><th className="py-2">항목</th><th className="px-2">조회</th><th className="px-2">제휴 클릭</th></tr></thead><tbody>{rows.map((r) => <tr key={r.name}><td className="max-w-xs break-all py-2">{r.name}</td><td className="px-2">{r.views ?? 0}</td><td className="px-2">{r.clicks ?? 0}</td></tr>)}</tbody></table></div>;
}
