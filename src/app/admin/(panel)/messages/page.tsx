import Link from "next/link";
import { moderateMessage } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { adminDb } from "@/lib/supabase";

const FILTERS = { reported: "🚩 신고됨", hidden: "🙈 숨김", all: "전체" } as const;
type Filter = keyof typeof FILTERS;
const CARD_BG: Record<string, string> = { pink: "#ffe3ef", lavender: "#ece5ff", sky: "#e1f1ff", mint: "#dcf7ea", lemon: "#fff6c9", peach: "#ffe7da" };

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const { filter: raw } = await searchParams;
  const filter: Filter = raw && raw in FILTERS ? (raw as Filter) : "reported";
  let q = adminDb()
    .from("birthday_messages")
    .select("id, group_slug, member_slug, nickname, body, card, reports, hidden, created_at")
    .order("created_at", { ascending: false })
    .limit(60);
  if (filter === "reported") q = q.gt("reports", 0).eq("hidden", false);
  if (filter === "hidden") q = q.eq("hidden", true);
  const { data, error } = await q;
  if (error) throw new Error(error.message);

  return (
    <div className="grid gap-5">
      <div className="grid gap-1">
        <h1 className="text-2xl font-extrabold">💌 생일 축하 메시지</h1>
        <p className="text-sm text-muted">신고가 3번 쌓이면 자동으로 숨겨집니다. 문제없으면 복구, 악성이면 삭제하세요.</p>
      </div>
      <nav className="flex flex-wrap gap-2">
        {(Object.keys(FILTERS) as Filter[]).map((f) => (
          <Link
            key={f}
            href={`/admin/messages?filter=${f}`}
            className={`inline-flex h-9 items-center rounded-full border-2 px-4 text-sm font-bold ${f === filter ? "border-brand bg-brand-soft text-brand" : "border-line text-muted hover:border-brand"}`}
          >
            {FILTERS[f]}
          </Link>
        ))}
      </nav>
      {(data ?? []).length === 0 && (
        <p className="rounded-3xl bg-subtle p-8 text-center text-muted">{filter === "reported" ? "신고된 메시지가 없어요 ✨" : "메시지가 없습니다."}</p>
      )}
      <ul className="grid gap-3 sm:grid-cols-2">
        {(data ?? []).map((m) => (
          <li key={m.id} className={`grid gap-2 rounded-3xl border-2 border-white p-4 shadow-[0_4px_14px_rgba(124,92,255,0.08)] ${m.hidden ? "opacity-60" : ""}`} style={{ background: CARD_BG[m.card] ?? CARD_BG.pink }}>
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <a href={`/ko/groups/${m.group_slug}/${m.member_slug}#messages`} target="_blank" rel="noopener" className="rounded-full bg-white/80 px-2 py-0.5 font-bold text-brand">
                {m.group_slug}/{m.member_slug} ↗
              </a>
              {m.reports > 0 && <span className="rounded-full bg-pink px-2 py-0.5 font-black text-white">신고 {m.reports}</span>}
              {m.hidden && <span className="rounded-full bg-text px-2 py-0.5 font-bold text-white">숨김</span>}
            </div>
            <p className="whitespace-pre-wrap break-words leading-relaxed">{m.body}</p>
            <p className="text-xs font-bold text-muted">💜 {m.nickname} · {new Date(m.created_at).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}</p>
            <div className="flex gap-2">
              {(m.hidden ? (["show", "delete"] as const) : (["hide", "delete"] as const)).map((op) => (
                <form key={op} action={moderateMessage}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="op" value={op} />
                  <SubmitButton
                    className={op === "delete" ? "btn-ghost h-8 px-3 text-xs text-warn" : "btn-ghost h-8 px-3 text-xs"}
                    confirm={op === "delete" ? "이 메시지를 완전히 삭제할까요? 되돌릴 수 없습니다." : undefined}
                  >
                    {{ hide: "🙈 숨기기", show: "↩️ 복구", delete: "🗑 삭제" }[op]}
                  </SubmitButton>
                </form>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
