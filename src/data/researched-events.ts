import type { KEvent } from "../lib/types";
import { text } from "./researched-places";

const checked = "2026-10-18";
const editorial = (summary: NonNullable<KEvent["editorial"]>["summary"], entry: NonNullable<KEvent["editorial"]>["entry"], reviewDue: string, hours?: string): NonNullable<KEvent["editorial"]> => ({ summary, entry, reviewDue, hours, sourceKind: "organizer", status: "scheduled" });

export const eventResearchUpdates: Record<string, Partial<KEvent>> = {
  "txt-steal-the-wind-seoul-2026": {
    sourceUrl: "https://weverse.io/txt/notice/39106", verifiedAt: checked,
    ticketing: { platform: "Official concert and ticket-sale notice (Weverse)", url: "https://weverse.io/txt/notice/39106", foreignerAccess: "verification" },
    editorial: editorial(
      text("Three Seoul performances at KSPO DOME, with different start times. Plan each concert day separately; a three-day date range does not mean one ticket covers all shows.", "KSPO DOME에서 3회 공연하며 회차별 시작 시간이 다릅니다. 날짜를 묶어 표기했다고 한 장의 티켓으로 3회 입장할 수 있는 것은 아닙니다.", "KSPO DOMEで3公演、開演時刻は日によって異なります。3日間の日程表記でも1枚で全公演に入れるわけではありません。"),
      text("Ages 9+. General sale was announced for October 6, 20:00 KST, after separate domestic/global membership presales. Use the official notice to reach the correct ticket channel; passport-name and pickup rules depend on that channel.", "만 9세 이상. 국내·글로벌 멤버십 선예매 이후 일반 예매는 10월 6일 20시(KST)로 공지됐습니다. 공식 원문에서 맞는 예매 채널을 확인하고 영문 이름·현장 수령 조건을 확인하세요.", "満9歳以上。国内・グローバルの会員先行後、一般発売は10月6日20時(KST)と案内されています。公式告知から正しい販売窓口へ進み、氏名・受取条件を確認してください。"), "2026-10-25", "Nov 13 19:00 / Nov 14 18:00 / Nov 15 17:00 KST"),
  },
  "mma-2026": {
    sourceUrl: "https://m2.melon.com/en/mma/2026/info/", verifiedAt: checked,
    ticketing: { platform: "Melon: official MMA 2026 information", url: "https://www.melon.com/mma/2026", foreignerAccess: "verification" },
    editorial: editorial(
      text("Two days at Gocheok Sky Dome. The official page lists both evenings at 18:00 KST; verify the artist's day before choosing your ticket.", "고척스카이돔에서 이틀간 개최합니다. 공식 안내는 양일 18시(KST)이며, 티켓 선택 전 아티스트의 출연일을 확인하세요.", "高尺スカイドームで2日間開催。公式案内では両日18時(KST)です。購入前に目当ての出演日を確認してください。"),
      text("The official schedule lists October 19, 20:00 for GOLD tier or higher, and October 22, 20:00 for Melon paid members. This is not an unrestricted foreigner-ticket offer; confirm your account eligibility before planning attendance.", "공식 일정은 10월 19일 20시 GOLD 등급 이상, 10월 22일 20시 멜론 이용권 보유 고객으로 안내합니다. 외국인 누구나 구매할 수 있는 상품으로 단정하지 말고 계정 자격을 먼저 확인하세요.", "公式日程は10月19日20時がGOLD以上、10月22日20時がMelon有料会員向けです。外国人が無条件で購入できる案内ではないため、先にアカウント資格を確認してください。"), "2026-10-22", "Nov 14–15, 18:00 KST"),
  },
  ...Object.fromEntries(["kgma-2026-day1", "kgma-2026-day2"].map((id) => [id, {
    sourceUrl: "https://nol.yanolja.com/ticket/products/26013920", verifiedAt: checked,
    ticketing: { platform: "NOL Ticket (check account and selected performance)", url: "https://nol.yanolja.com/ticket/products/26013920", foreignerAccess: "verification" },
    editorial: { ...editorial(
      text("The official ticket listing confirms Gocheok Sky Dome on November 7–8. Each date has its own performance selection; an awards-show ticket does not promise a particular artist or seating zone.", "공식 예매처가 11월 7~8일 고척스카이돔 일정을 안내합니다. 날짜별 회차를 선택해야 하며 특정 아티스트나 좌석 구역이 자동 보장되지는 않습니다.", "公式販売ページは11月7〜8日の高尺スカイドーム開催を案内しています。日付ごとに公演を選び、特定の出演者や席種が自動的に保証されるわけではありません。"),
      text("Ages 9+ on the NOL listing. Compare the normal ticket's account/pickup rules with a supplier package's passport and inclusion rules; do not treat them as the same product.", "NOL 상품 안내는 만 9세 이상입니다. 일반 티켓의 계정·수령 조건과 공급사 패키지의 여권·포함 사항을 따로 비교하세요.", "NOLの商品案内は満9歳以上。通常券のアカウント・受取条件と、販売会社パッケージの旅券・内容条件は別々に比較してください。"), "2026-10-25"), sourceKind: "operator" },
  } satisfies Partial<KEvent>])),
  "bts-dalmajung-popup-2026": {
    sourceUrl: "https://weverse.io/bts/notice/39365", verifiedAt: checked,
    editorial: editorial(text("The September 29–October 11 pop-up has ended. The HYBE address in this archive does not imply permanent public access.", "9월 29일~10월 11일 팝업은 종료됐습니다. 이 기록의 HYBE 주소가 상시 개방을 뜻하지 않습니다.", "9月29日〜10月11日のポップアップは終了しました。この記録にあるHYBEの住所は常時開放を意味しません。"), text("The original event used Weverse reservations. Use a new, dated announcement for a future visit.", "당시 행사는 Weverse 예약제로 운영됐습니다. 이후 방문에는 새 날짜의 공지가 필요합니다.", "当時はWeverse予約制でした。今後訪問する場合は新しい日付の告知を確認してください。"), "2026-10-18"),
  },
  "enhypen-spooky-enchin-popup-2026": {
    sourceUrl: "https://weverse.io/enhypen/notice/39297", verifiedAt: checked,
    editorial: editorial(text("This September 29–October 9 pop-up at HAESO has ended; it is an archive, not a current booking recommendation.", "HAESO에서 9월 29일~10월 9일 진행한 팝업으로 현재는 종료된 기록입니다.", "HAESOで9月29日〜10月9日に開催されたポップアップの終了済み記録です。"), text("The original notice required a Weverse reservation and live entry QR code.", "당시 공지는 Weverse 예약과 실제 입장 QR 확인을 요구했습니다.", "当時の告知ではWeverse予約と実際の入場QRコードが必要でした。"), "2026-10-18"),
  },
};

export const researchedNewEvents: KEvent[] = [
  {
    id: "twice-the-thrill-popup-2026", type: "popup", title: "TWICE 11TH ANNIVERSARY POP-UP — TWICE THE THRILL", groups: ["twice"],
    startDate: "2026-10-17", endDate: "2026-10-25", venue: "Platz2 · 35 Ttukseom-ro 17-gil, Seongdong-gu, Seoul", area: "seongsu",
    ticketing: { platform: "FANS official reservation", url: "https://app.fans/shop/i/product/h5d6oz9mxy?mp=KR", foreignerAccess: "verification" },
    sourceUrl: "https://app.fans/shop/i/product/h5d6oz9mxy?mp=KR", verifiedAt: checked,
    editorial: editorial(
      text("A time-slot pop-up in Seongsu, not a concert. Keep the chosen slot as the day's anchor and leave time for on-site admission checks before adding nearby shopping.", "성수의 회차형 팝업이며 콘서트가 아닙니다. 선택한 입장 회차를 중심으로 일정을 짜고 현장 확인 시간을 확보한 뒤 주변 쇼핑을 추가하세요.", "聖水の時間枠制ポップアップで、コンサートではありません。予約枠を中心に旅程を組み、入場確認の時間を確保してから周辺の買い物を追加してください。"),
      text("FANS advance reservations and an on-site waiting system are announced; walk-in admission is not guaranteed. One reservation per person during the event; open the actual reservation screen rather than a screenshot.", "FANS 사전 예약과 현장 대기 입장으로 안내되며 현장 입장은 보장되지 않습니다. 기간 중 1인 1회 예약이며 캡처가 아닌 실제 예약 화면을 준비하세요.", "FANS事前予約と現地待機制が案内されていますが、当日入場は保証されません。期間中1人1回の予約で、スクリーンショットではなく予約画面を用意してください。"), "2026-10-21", "11:00–20:00 KST; Oct 17 opened at 12:30"),
  },
  {
    id: "jeonghan-joshua-dreamscape-popup-2026", type: "popup", title: "JEONGHAN X JOSHUA — DREAMSCAPE POP-UP", groups: ["seventeen"], members: ["seventeen/jeonghan", "seventeen/joshua"],
    startDate: "2026-10-20", endDate: "2026-10-25", venue: "HYBE Yongsan 1F · 42 Hangang-daero, Yongsan-gu, Seoul", area: "yongsan",
    ticketing: { platform: "Weverse official visit and reservation notice", url: "https://weverse.io/seventeen/notice/39890", foreignerAccess: "verification" },
    sourceUrl: "https://weverse.io/seventeen/notice/39890", verifiedAt: checked,
    editorial: editorial(
      text("A six-day unit pop-up at HYBE Yongsan. This dated event is separate from viewing the office exterior; use your confirmed slot before building the rest of a Yongsan day.", "HYBE 용산에서 6일간 진행하는 유닛 팝업입니다. 사옥 외관 방문과 별도 행사이므로 확정된 입장 회차를 먼저 확인한 뒤 용산 일정을 구성하세요.", "HYBE龍山で6日間開催されるユニットのポップアップです。社屋外観の見学とは別のイベントなので、確定した予約枠に合わせて龍山の旅程を組んでください。"),
      text("A signed-in Weverse account is required. One time slot per account; the notice applies regional account-age requirements. Follow the original reservation link and live QR instructions; no slot availability is promised here.", "로그인한 Weverse 계정이 필요하며 계정당 한 회차를 예약합니다. 지역별 계정 이용 연령 조건과 원문의 예약 링크·QR 안내를 확인하세요. 여기서 잔여 회차를 보장하지 않습니다.", "ログインしたWeverseアカウントが必要で、1アカウントにつき1枠です。地域別の利用年齢、公式予約リンク、QR案内を確認してください。空き枠は保証していません。"), "2026-10-21", "11:00–20:00 KST"),
  },
  {
    id: "hybe-cine-fest-seoul-2026", type: "popup", title: "HYBE CINE FEST 2026 — Seoul Special Location PLUS", groups: ["bts", "seventeen", "txt", "enhypen", "le-sserafim", "andteam", "boynextdoor", "tws", "illit"],
    startDate: "2026-10-24", endDate: "2026-10-31", venue: "Lotte Cinema World Tower · 300 Olympic-ro, Songpa-gu, Seoul", area: "songpa",
    ticketing: { platform: "Official cinema and screening selector", url: "https://hybecinefest.com/", foreignerAccess: "unknown" },
    sourceUrl: "https://weverse.io/seventeen/notice/39448", verifiedAt: checked,
    editorial: editorial(
      text("The Seoul special location combines cinema-related experiences and merchandise. A film or live viewing is a screen event; listed artists are not promised to appear in person.", "서울 특별 거점의 영화 관련 체험·상품 행사입니다. 영화와 라이브뷰잉은 스크린 관람이며 참여 아티스트의 현장 출연을 뜻하지 않습니다.", "ソウル特別会場の映画関連体験・グッズ企画です。映画やライブビューイングはスクリーン鑑賞で、掲載アーティストの来場を意味しません。"),
      text("Select Korea, the cinema, film and date on the official site. The special-location period is not every film's screening schedule; admission, language and seat availability depend on the chosen screening.", "공식 사이트에서 한국·극장·작품·날짜를 선택하세요. 특별 거점 운영 기간과 개별 작품 상영 일정은 다르며 입장·언어·잔여석은 선택 회차에 따라 달라집니다.", "公式サイトで韓国・映画館・作品・日付を選んでください。特別会場の期間と個別上映日程は異なり、入場条件・言語・残席は選ぶ上映回によります。"), "2026-10-23"),
  },
  {
    id: "nct-neo-dimension-seoul-2026", type: "popup", title: "NCT 2026 EXHIBITION — NEO DIMENSION", groups: ["nct-dream"],
    startDate: "2026-09-18", endDate: "2026-10-18", venue: "IMMERSIVE PLATFORM DEEP · Lotte World B3F, next to the ice rink, Jamsil", area: "songpa",
    ticketing: { platform: "Melon Global: NEO DIMENSION", url: "https://tkglobal.melon.com/performance/index.htm?langCd=EN&prodId=213828", foreignerAccess: "verification" },
    sourceUrl: "https://weverse.io/nct127/notice/38860", verifiedAt: checked,
    editorial: editorial(
      text("An immersive exhibition whose announced final day is October 18. The ice-rink-side B3F venue is not the same as a street-level Lotte World Mall pop-up.", "공지상 마지막 날은 10월 18일입니다. 아이스링크 옆 지하 3층 전시장으로, 롯데월드몰 지상 팝업과 위치가 다릅니다.", "告知上の最終日は10月18日です。アイスリンク横の地下3階で、ロッテワールドモール地上階のポップアップとは場所が異なります。"),
      text("The organizer links a global Melon booking page. Choose an eligible session; earlier general-sale tickets cover different date ranges. No admission after the announced end date is implied.", "주최자가 멜론 글로벌 예매 페이지를 안내합니다. 일반 예매 차수별 이용 기간이 달라 해당 회차를 확인하세요. 공지 종료일 이후 입장을 뜻하지 않습니다.", "主催者はMelonグローバル販売を案内しています。一般販売の回次によって利用期間が異なるため、対象枠を確認してください。終了日以降の入場を意味しません。"), "2026-10-18"),
  },
  {
    id: "close-your-eyes-256th-note-popup-2026", type: "popup", title: "CLOSE YOUR EYES — 256th Note POP-UP", groups: [],
    startDate: "2026-10-14", endDate: "2026-10-20", venue: "Lotte World Mall 1F, in front of Apple · 300 Olympic-ro, Songpa-gu, Seoul", area: "songpa",
    ticketing: { platform: "WITHMUU: organizer-linked store notice", url: "https://withmuu.com/board/view.php?bdId=notice&sno=538", foreignerAccess: "unknown" },
    sourceUrl: "https://weverse.io/closeyoureyes/notice/39882", verifiedAt: checked,
    editorial: editorial(
      text("A physical album pop-up in Jamsil. Keep the offline location separate from the online lucky-draw campaign; an online order does not establish store admission or artist attendance.", "잠실의 오프라인 음반 팝업입니다. 온라인 럭키드로우와 현장 매장을 구분하세요. 온라인 구매가 현장 입장이나 아티스트 출연을 보장하지 않습니다.", "蚕室の実店舗アルバム・ポップアップです。オンラインのラッキードローとは別で、オンライン購入が入場や本人の出演を保証するわけではありません。"),
      text("Check the linked WITHMUU notice for purchase and on-site rules. The organizer does not establish unrestricted admission or current stock in this summary.", "연결된 WITHMUU 공지에서 구매·현장 이용 조건을 확인하세요. 이 요약은 무조건 입장이나 현재 재고를 보장하지 않습니다.", "リンク先のWITHMUU告知で購入・現地利用条件を確認してください。この要約は無条件の入場や現在の在庫を保証しません。"), "2026-10-20", "10:30–22:00 KST"),
  },
];
