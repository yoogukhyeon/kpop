import { approveSubmission, refreshSiteData, rejectSubmission } from "@/app/admin/actions";
import { listGroups } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import { adminDb } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface Submission {
  id: string;
  member: string;
  cafe_name: string;
  address: string;
  start_date: string;
  end_date: string;
  contact: string;
  source_url: string;
  status: "pending" | "approved" | "rejected";
  event_id: string | null;
  created_at: string;
}

export default async function AdminPage() {
  const db = adminDb();
  const [pending, reviewed, groups] = await Promise.all([
    db.from("cafe_submissions").select("*").eq("status", "pending").order("created_at"),
    db.from("cafe_submissions").select("*").neq("status", "pending").order("reviewed_at", { ascending: false }).limit(20),
    listGroups(),
  ]);
  if (pending.error) throw new Error(pending.error.message);
  if (reviewed.error) throw new Error(reviewed.error.message);

  const areas = getDictionary("ko").area;
  const memberName = (key: string) => {
    const [g, m] = key.split("/");
    const group = groups.find((x) => x.slug === g);
    const member = group?.members.find((x) => x.slug === m);
    return { group: group?.name ?? g, member: member?.stageName ?? m };
  };

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">생일카페 등록 검토</h1>
        <form action={refreshSiteData}>
          <button className="btn-ghost">🔄 사이트 데이터 새로고침</button>
        </form>
      </div>
      <p className="-mt-6 text-xs text-muted">DB를 직접 고치거나 시드를 다시 넣은 뒤 누르면 모든 페이지에 바로 반영됩니다.</p>

      <section className="grid gap-4">
        <h2 className="font-bold">대기 중 ({pending.data.length})</h2>
        {pending.data.length === 0 && <p className="text-muted">검토할 등록이 없습니다.</p>}
        {(pending.data as Submission[]).map((s) => {
          const n = memberName(s.member);
          return (
            <article key={s.id} className="card grid gap-3 text-sm">
              <div className="grid gap-1">
                <p className="text-base font-bold">{n.group} · {n.member} — {s.cafe_name}</p>
                <p>{s.start_date} ~ {s.end_date} · {s.address}</p>
                <p className="text-muted">연락처: {s.contact} · 접수: {new Date(s.created_at).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}</p>
                <a href={s.source_url} target="_blank" rel="noopener noreferrer" className="w-fit text-brand underline">공지 확인 ↗</a>
              </div>
              <form action={approveSubmission} className="grid gap-2 sm:grid-cols-[1fr_180px_auto]">
                <input type="hidden" name="id" value={s.id} />
                <input name="title" className="input" defaultValue={`${n.member} Birthday Cafe — ${s.cafe_name}`} required />
                <select name="area" className="input" required defaultValue="">
                  <option value="" disabled>지역 선택</option>
                  {Object.entries(areas).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <button className="btn py-2">승인·게시</button>
              </form>
              <form action={rejectSubmission}>
                <input type="hidden" name="id" value={s.id} />
                <button className="btn-ghost py-1.5 text-xs">거절</button>
              </form>
            </article>
          );
        })}
      </section>

      <section className="grid gap-2">
        <h2 className="font-bold">최근 처리 내역</h2>
        <ul className="grid gap-1 text-sm">
          {(reviewed.data as Submission[]).map((s) => {
            const n = memberName(s.member);
            return (
              <li key={s.id} className="text-muted">
                {s.status === "approved" ? "✅" : "❌"} {n.member} — {s.cafe_name} ({s.start_date})
                {s.event_id && (
                  <>
                    {" · "}
                    <a href={`/ko/events/e/${s.event_id}`} target="_blank" rel="noopener" className="text-brand underline">페이지</a>
                    {" · 홍보 카드(주최자에게 전달): "}
                    {["ko", "en", "ja", "zh-tw", "th"].map((l) => (
                      <a key={l} href={`/${l}/events/e/${s.event_id}/card?format=story`} target="_blank" rel="noopener" className="mr-1 text-brand underline">{l}</a>
                    ))}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
