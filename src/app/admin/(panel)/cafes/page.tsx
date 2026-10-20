import { approveSubmission, rejectSubmission } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { listGroups } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import { seoulToday } from "@/lib/site";
import { adminDb } from "@/lib/supabase";

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

const kst = (iso: string) => new Date(iso).toLocaleString("ko-KR", { timeZone: "Asia/Seoul", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });

export default async function CafesPage() {
  const db = adminDb();
  const [pending, reviewed, groups] = await Promise.all([
    db.from("cafe_submissions").select("*").eq("status", "pending").order("start_date"),
    db.from("cafe_submissions").select("*").neq("status", "pending").order("reviewed_at", { ascending: false }).limit(30),
    listGroups(),
  ]);
  if (pending.error) throw new Error(pending.error.message);
  if (reviewed.error) throw new Error(reviewed.error.message);
  const today = seoulToday();
  const areas = getDictionary("ko").area;
  const name = (key: string) => {
    const [g, m] = key.split("/");
    const group = groups.find((x) => x.slug === g);
    return { group: group?.name ?? g, member: group?.members.find((x) => x.slug === m)?.stageName ?? m };
  };

  return (
    <div className="grid gap-8">
      <section className="grid gap-4">
        <div className="grid gap-1">
          <h1 className="text-2xl font-extrabold">🎂 생카 등록 검토 <span className="text-pink">{pending.data.length}</span></h1>
          <p className="text-sm text-muted">공지 원문에서 날짜·주소를 확인하고 승인하세요. 승인하면 바로 사이트에 게시되고 홍보 카드가 생깁니다.</p>
        </div>
        {pending.data.length === 0 && <p className="rounded-3xl bg-subtle p-8 text-center text-muted">검토할 등록이 없어요 ✨</p>}
        {(pending.data as Submission[]).map((s) => {
          const n = name(s.member);
          const ended = s.end_date < today;
          return (
            <article key={s.id} className={`card grid gap-4 ${ended ? "opacity-70" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="grid gap-1">
                  <span className="chip-pink w-fit">{n.group} · {n.member}</span>
                  <p className="text-lg font-extrabold">{s.cafe_name}</p>
                  <p className="text-sm">📅 {s.start_date} ~ {s.end_date} {ended && <b className="text-warn">· 이미 종료됨</b>}</p>
                  <p className="text-sm">📍 {s.address}</p>
                  <p className="text-xs text-muted">연락처: {s.contact} · 접수 {kst(s.created_at)}</p>
                </div>
                <a href={s.source_url} target="_blank" rel="noopener noreferrer" className="btn-ghost h-9 px-3 text-xs">📢 공지 원문 확인 ↗</a>
              </div>
              <form action={approveSubmission} className="grid gap-3 rounded-2xl bg-subtle p-4 sm:grid-cols-[1fr_180px]">
                <input type="hidden" name="id" value={s.id} />
                <label className="grid gap-1 text-xs font-bold text-muted">
                  게시 제목 (영어)
                  <input name="title" className="input bg-white text-sm font-normal text-text" defaultValue={`${n.member} Birthday Cafe — ${s.cafe_name}`} required />
                </label>
                <label className="grid gap-1 text-xs font-bold text-muted">
                  지역
                  <select name="area" className="input bg-white text-sm font-normal text-text" required defaultValue="">
                    <option value="" disabled>지역 선택</option>
                    {Object.entries(areas).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </label>
                <label className="flex items-start gap-2 text-sm sm:col-span-2">
                  <input type="checkbox" name="sourceChecked" required className="mt-1" />
                  <span>주최자·카페 원문에서 날짜·주소·입장 조건과 취소 여부를 확인했습니다.</span>
                </label>
                <div className="flex flex-wrap gap-2 sm:col-span-2">
                  <SubmitButton pendingLabel="게시 중…">✅ 승인·게시</SubmitButton>
                </div>
              </form>
              <form action={rejectSubmission}>
                <input type="hidden" name="id" value={s.id} />
                <SubmitButton className="btn-ghost h-9 px-3 text-xs" confirm={`'${s.cafe_name}' 등록을 거절할까요?`}>거절</SubmitButton>
              </form>
            </article>
          );
        })}
      </section>

      <section className="grid gap-3">
        <h2 className="text-lg font-extrabold">최근 처리 내역</h2>
        {(reviewed.data ?? []).length === 0 && <p className="text-sm text-muted">아직 처리한 등록이 없습니다.</p>}
        <ul className="grid gap-2">
          {(reviewed.data as Submission[]).map((s) => {
            const n = name(s.member);
            return (
              <li key={s.id} className="card flex flex-wrap items-center gap-x-3 gap-y-2 p-3 text-sm">
                <span className={s.status === "approved" ? "chip-pink" : "chip"}>{s.status === "approved" ? "승인" : "거절"}</span>
                <b>{n.member}</b>
                <span className="text-muted">{s.cafe_name} · {s.start_date}</span>
                {s.event_id && (
                  <span className="ml-auto flex flex-wrap items-center gap-1 text-xs">
                    <a href={`/ko/events/e/${s.event_id}`} target="_blank" rel="noopener" className="font-bold text-brand underline">페이지</a>
                    <span className="text-muted">· 홍보 카드:</span>
                    {["ko", "en", "ja", "zh-tw", "th"].map((l) => (
                      <a key={l} href={`/${l}/events/e/${s.event_id}/card?format=story`} target="_blank" rel="noopener" className="rounded-full bg-brand-soft px-2 py-0.5 font-bold text-brand">{l}</a>
                    ))}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
