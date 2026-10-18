import { reviewCatalogEvent } from "@/app/admin/actions";
import { groupResearch } from "@/data/group-research";
import { eventReviewReason, isReviewedPlace } from "@/lib/catalog-quality";
import { listAllEvents, listGroups, listPlaces } from "@/lib/data";
import { groupPublicationIssues } from "@/lib/group-publication";
import { seoulToday } from "@/lib/site";

export async function CatalogReview() {
  const today = seoulToday();
  const [events, places, groups] = await Promise.all([listAllEvents(), listPlaces(), listGroups()]);
  const upcoming = events.filter((event) => event.endDate >= today);
  const due = upcoming.filter((event) => eventReviewReason(event, today));
  const checked = places.filter((place) => isReviewedPlace(place, today));
  const publicGroups = groups.filter((group) => !groupPublicationIssues(group, groupResearch[group.slug], places, "ko", today).length);
  const nextWeek = new Date(Date.parse(`${today}T00:00:00Z`) + 7 * 86400000).toISOString().slice(0, 10);
  return <section className="grid gap-4" aria-label="콘텐츠 출처 검토">
    <h2 className="text-xl font-extrabold">방문 정보·행사 출처 검토</h2>
    <p className="text-sm text-muted">{today} 기준 · 방문 조건과 출처가 유효한 장소 {checked.length}/{places.length} · 한국어 검색 공개 그룹 {publicGroups.length}/{groups.length} · 진행·예정 행사 재확인 필요 {due.length}/{upcoming.length}</p>
    <p className="text-xs text-muted">검색 공개는 편집 검토와 실제 방문 정보로 결정합니다. 링크가 HTTP 200으로 열리는 것만으로 확인일을 갱신하지 않습니다. 공식 원문의 날짜·장소·입장 조건을 확인한 뒤 아래에서 저장하세요. 종료된 행사는 현재 추천에서 자동 제외되며, 취소·연기는 직접 반영합니다.</p>
    <div className="grid gap-3">{upcoming.map((event) => <details key={event.id} className="card p-4">
      <summary className="cursor-pointer font-semibold">{eventReviewReason(event, today) ? "⚠ " : "✓ "}{event.title} · {event.editorial?.reviewDue ?? "검토일 미설정"}</summary>
      <form action={reviewCatalogEvent} className="mt-4 grid gap-3 text-sm">
        <input type="hidden" name="id" value={event.id} />
        <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" className="w-fit text-brand underline">현재 출처 열기 ↗</a>
        <label className="grid gap-1">공식 원문 URL<input className="input" type="url" name="sourceUrl" required defaultValue={event.sourceUrl} /></label>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="grid gap-1">시작일<input className="input" type="date" name="startDate" required defaultValue={event.startDate} /></label>
          <label className="grid gap-1">종료일<input className="input" type="date" name="endDate" required defaultValue={event.endDate} /></label>
          <label className="grid gap-1">다음 재확인일<input className="input" type="date" name="reviewDue" required min={today} defaultValue={event.endDate < nextWeek ? event.endDate : nextWeek} /></label>
        </div>
        <label className="grid gap-1">장소·주소<input className="input" name="venue" required defaultValue={event.venue} /></label>
        <label className="grid gap-1">운영·회차 시간 (KST)<input className="input" name="hours" maxLength={200} defaultValue={event.editorial?.hours ?? ""} /></label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1">출처 유형<select className="input" name="sourceKind" defaultValue={event.editorial?.sourceKind ?? "organizer"}><option value="organizer">주최자</option><option value="operator">운영자·공식 예매처</option><option value="tourism">공식 관광기관</option></select></label>
          <label className="grid gap-1">행사 상태<select className="input" name="status" defaultValue={event.editorial?.status ?? "scheduled"}><option value="scheduled">확정 일정</option><option value="cancelled">취소</option><option value="postponed">연기</option></select></label>
        </div>
        {(["ko", "en", "ja"] as const).map((locale) => <div key={locale} className="grid gap-2 rounded-2xl bg-subtle p-3">
          <label className="grid gap-1">{locale.toUpperCase()} · 방문자를 위한 설명<textarea className="input min-h-24" name={`summary_${locale}`} minLength={20} required defaultValue={event.editorial?.summary[locale]} /></label>
          <label className="grid gap-1">{locale.toUpperCase()} · 입장·예약 조건<textarea className="input min-h-24" name={`entry_${locale}`} minLength={20} required defaultValue={event.editorial?.entry[locale]} /></label>
        </div>)}
        <label className="flex items-start gap-2"><input className="mt-1" type="checkbox" name="sourceChecked" required /><span>원문에서 날짜·장소·입장 조건과 변경·취소 여부를 확인했습니다. 저장하면 오늘을 출처 확인일로 기록합니다.</span></label>
        <button className="btn w-fit">검토 결과 저장·공개 상태 갱신</button>
      </form>
    </details>)}</div>
    <details className="card p-4"><summary className="cursor-pointer font-semibold">그룹별 검색 공개 보류 사유</summary><ul className="mt-3 grid gap-2 text-sm">{groups.map((group) => {
      const issues = groupPublicationIssues(group, groupResearch[group.slug], places, "ko", today);
      return <li key={group.slug}><b>{group.name}</b> · {issues.join(" / ") || "한·영·일 본문과 방문 정보 검토 완료"}</li>;
    })}</ul></details>
    {checked.length < places.length && <details className="card p-4"><summary className="cursor-pointer font-semibold">방문 추천에서 보류한 장소</summary><ul className="mt-3 grid gap-1 text-sm">{places.filter((place) => !isReviewedPlace(place, today)).map((place) => <li key={place.id}>{place.name} · 출처·방문 조건·확인일 검토 필요</li>)}</ul></details>}
  </section>;
}
