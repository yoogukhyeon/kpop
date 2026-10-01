import type { Dictionary } from "./en";

export const ko: Dictionary = {
  langName: "한국어",
  tagline: "최애 일정에 맞춘 서울 K-POP 여행.",
  heroSub: "그룹과 여행 날짜만 고르세요. 콘서트, 생일카페, 팝업, 성지순례 장소를 하루 단위로 정리해 드립니다.",
  nav: { planner: "여행 플래너", groups: "그룹", events: "이벤트", guides: "가이드", submit: "생일카페 등록" },
  form: {
    group: "그룹", members: "최애 (선택)", allMembers: "그룹 전체",
    from: "도착", to: "출발", submit: "일정 만들기", maxDays: "최대 14일",
  },
  plan: {
    title: (group: string) => `${group} 서울 여행 일정`,
    day: (n: number) => `${n}일차`,
    noEvents: "이 날은 아직 확정된 이벤트가 없습니다. 자유롭게 둘러보세요.",
    birthday: (name: string) => `${name} 생일 — 이 날짜 전후로 팬들이 생일카페를 엽니다.`,
    nearby: "여행 날짜 바로 전후의 생일",
    musicShows: "음악방송",
    musicShowsNote: "매주 열리는 음악방송 방청은 무료이거나 저렴하지만 사전 신청이 필요합니다. 방송별 신청 방법을 확인하세요.",
    share: "일정 공유하기",
    shareNote: "스토리용 카드를 저장하거나 링크를 복사하세요.",
    download: "스토리 카드 저장",
    copy: "링크 복사",
    copied: "복사했습니다",
    edit: "날짜나 그룹 바꾸기",
    unverified: "정보를 확인하고 있습니다. 가기 전에 출처를 확인하세요.",
    source: "출처",
  },
  stats: {
    events: (n: number) => `이벤트 ${n}개`,
    birthdays: (n: number) => `생일 ${n}개`,
    spots: (n: number) => `장소 ${n}곳`,
  },
  card: {
    title: (group: string) => [`나의 ${group}`, "서울 여행"],
    birthday: (name: string) => `${name} 생일`,
    live: "공연",
    spot: "장소",
    cta: "나도 일정 만들기",
  },
  group: {
    fandom: "팬덤", agency: "소속사", debut: "데뷔", members: "멤버",
    membersSoon: "멤버 가이드를 준비하고 있습니다.", spots: "팬을 위한 장소", upcoming: "서울 예정 이벤트",
    noUpcoming: "아직 확정된 이벤트가 없습니다.", planCta: (g: string) => `${g} 여행 일정 만들기`,
  },
  member: {
    birthday: "생일", nextBirthday: "다가오는 생일",
    cafes: "생일카페는 보통 생일 며칠 전부터 며칠 후까지 열리며, 주로 홍대·마포와 성수에 모여 있습니다.",
    planCta: "이 생일에 맞춰 일정 만들기",
  },
  events: {
    title: "서울 K-POP 이벤트", empty: "이 기간에 등록된 이벤트가 아직 없습니다.", access: "외국인 예매",
    byMonth: "월별 보기", monthTitle: (month: string) => `서울 K-POP 이벤트 — ${month}`,
  },
  guides: { title: "K-POP 팬을 위한 서울 가이드", updated: "마지막 확인", sources: "출처", more: "다른 가이드" },
  partners: {
    title: "여행에 유용한 서비스",
    disclosure: "일부 링크는 제휴 링크일 수 있으며, 추가 비용 없이 사이트에 수수료가 지급될 수 있습니다.",
  },
  submit: {
    title: "생일카페 무료 등록",
    intro: "서울에서 생일카페를 여시나요? 무료로 등록하고 해외 팬들에게 알리세요. 등록된 내용은 확인 후 영어·일본어·스페인어로 함께 소개됩니다.",
    member: "멤버", cafeName: "카페 이름", address: "주소", start: "시작일", end: "종료일",
    contact: "X/인스타그램 계정 또는 이메일", sourceUrl: "공지 링크", send: "검토 요청",
    thanks: "감사합니다! 곧 확인하겠습니다.",
    closed: "등록은 곧 열립니다.",
    failed: "문제가 생겼습니다. 잠시 후 다시 시도해 주세요.",
  },
  meta: {
    groupsTitle: "K-POP 그룹별 서울 성지순례 가이드",
    groupsDesc: "그룹별 소속사 사옥, 생일카페, 콘서트, 성지순례 장소를 정리한 서울 K-POP 여행 가이드.",
    groupTitle: (g: string) => `${g} 성지순례 가이드 — 서울 장소, 생일카페, 콘서트`,
    groupDesc: (g: string, agency: string, fandom: string) =>
      `${g} 서울 성지순례를 계획 중이라면? ${agency} 사옥, ${fandom} 생일카페, 다가오는 콘서트와 방문 장소를 한곳에 모았습니다.`,
    memberTitle: (m: string, g: string) => `${m} (${g}) 생일카페 정보`,
    memberDesc: (m: string, date: string, fandom: string) =>
      `${m}의 생일은 ${date}입니다. ${fandom} 생일카페가 주로 열리는 곳과 생일에 맞춘 일정 짜는 법.`,
    eventsDesc: "서울에서 열리는 K-POP 콘서트, 팬미팅, 생일카페, 팝업스토어 일정.",
    monthDesc: (month: string) => `${month} 서울 K-POP 콘서트, 팬미팅, 생일카페, 팝업스토어 일정.`,
    submitDesc: "생일카페를 무료로 등록하고 해외 K-POP 팬들에게 영어·일본어·스페인어로 홍보하세요.",
    guidesDesc: "K-POP 팬을 위한 서울 실전 가이드: 티켓, 음악방송, 생일카페, 공연장, 여행 준비.",
  },
  footer: "팬이 만든 가이드입니다. 아티스트·소속사와 관계가 없습니다. 이벤트 정보는 바뀔 수 있으니 반드시 공식 공지를 확인하세요.",
  area: {
    yongsan: "용산", seongsu: "성수", gangnam: "강남·압구정", mapo: "마포·홍대·상암",
    songpa: "송파·올림픽공원", jung: "중구·시청", gangdong: "강동", yeouido: "여의도", guro: "구로",
  },
  eventType: {
    concert: "콘서트", fanmeeting: "팬미팅", "music-show": "음악방송", "birthday-cafe": "생일카페", popup: "팝업",
  },
  access: {
    open: "외국인 직접 예매 가능", verification: "사전 여권 인증 필요",
    fanclub: "팬클럽 회원 필요", "korean-id-only": "한국 본인인증만 가능", unknown: "확인 전",
  },
};
