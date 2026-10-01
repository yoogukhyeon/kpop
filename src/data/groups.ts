import type { Group, Member } from "@/lib/types";

// SEED DATA — every entry has verifiedAt: null until checked against official
// sources (agency site, Weverse/fan café notices). See docs/PLAN.md §13.
// Lineups and activity status can change; re-check before launch.

const m = (slug: string, stageName: string, birthday: string): Member => ({ slug, stageName, birthday });

export const groups: Group[] = [
  {
    slug: "bts", name: "BTS", nameKo: "방탄소년단", fandom: "ARMY", agency: "BIGHIT MUSIC",
    debutYear: 2013, kind: "boy", accent: "#7c3aed", verifiedAt: null,
    members: [
      m("rm", "RM", "1994-09-12"), m("jin", "Jin", "1992-12-04"), m("suga", "SUGA", "1993-03-09"),
      m("j-hope", "j-hope", "1994-02-18"), m("jimin", "Jimin", "1995-10-13"), m("v", "V", "1995-12-30"),
      m("jung-kook", "Jung Kook", "1997-09-01"),
    ],
  },
  {
    slug: "seventeen", name: "SEVENTEEN", nameKo: "세븐틴", fandom: "CARAT", agency: "PLEDIS Entertainment",
    debutYear: 2015, kind: "boy", accent: "#f472b6", verifiedAt: null,
    members: [
      m("s-coups", "S.Coups", "1995-08-08"), m("jeonghan", "Jeonghan", "1995-10-04"), m("joshua", "Joshua", "1995-12-30"),
      m("jun", "Jun", "1996-06-10"), m("hoshi", "Hoshi", "1996-06-15"), m("wonwoo", "Wonwoo", "1996-07-17"),
      m("woozi", "Woozi", "1996-11-22"), m("dk", "DK", "1997-02-18"), m("mingyu", "Mingyu", "1997-04-06"),
      m("the8", "The8", "1997-11-07"), m("seungkwan", "Seungkwan", "1998-01-16"), m("vernon", "Vernon", "1998-02-18"),
      m("dino", "Dino", "1999-02-11"),
    ],
  },
  {
    slug: "stray-kids", name: "Stray Kids", nameKo: "스트레이 키즈", fandom: "STAY", agency: "JYP Entertainment",
    debutYear: 2018, kind: "boy", accent: "#dc2626", verifiedAt: null,
    members: [
      m("bang-chan", "Bang Chan", "1997-10-03"), m("lee-know", "Lee Know", "1998-10-25"), m("changbin", "Changbin", "1999-08-11"),
      m("hyunjin", "Hyunjin", "2000-03-20"), m("han", "HAN", "2000-09-14"), m("felix", "Felix", "2000-09-15"),
      m("seungmin", "Seungmin", "2000-09-22"), m("i-n", "I.N", "2001-02-08"),
    ],
  },
  { slug: "enhypen", name: "ENHYPEN", nameKo: "엔하이픈", fandom: "ENGENE", agency: "BELIFT LAB", debutYear: 2020, kind: "boy", accent: "#b91c1c", verifiedAt: null, members: [] },
  { slug: "txt", name: "TOMORROW X TOGETHER", nameKo: "투모로우바이투게더", fandom: "MOA", agency: "BIGHIT MUSIC", debutYear: 2019, kind: "boy", accent: "#38bdf8", verifiedAt: null, members: [] },
  { slug: "ateez", name: "ATEEZ", nameKo: "에이티즈", fandom: "ATINY", agency: "KQ Entertainment", debutYear: 2018, kind: "boy", accent: "#ea580c", verifiedAt: null, members: [] },
  { slug: "nct-dream", name: "NCT DREAM", nameKo: "엔시티 드림", fandom: "NCTzen", agency: "SM Entertainment", debutYear: 2016, kind: "boy", accent: "#22c55e", verifiedAt: null, members: [] },
  { slug: "zerobaseone", name: "ZEROBASEONE", nameKo: "제로베이스원", fandom: "ZEROSE", agency: "WAKEONE", debutYear: 2023, kind: "boy", accent: "#2563eb", verifiedAt: null, members: [] },
  { slug: "riize", name: "RIIZE", nameKo: "라이즈", fandom: "BRIIZE", agency: "SM Entertainment", debutYear: 2023, kind: "boy", accent: "#f97316", verifiedAt: null, members: [] },
  { slug: "boynextdoor", name: "BOYNEXTDOOR", nameKo: "보이넥스트도어", fandom: "ONEDOOR", agency: "KOZ Entertainment", debutYear: 2023, kind: "boy", accent: "#65a30d", verifiedAt: null, members: [] },
  { slug: "andteam", name: "&TEAM", nameKo: "앤팀", fandom: "LUNÉ", agency: "HYBE LABELS JAPAN", debutYear: 2022, kind: "boy", accent: "#0f766e", verifiedAt: null, members: [] },
  { slug: "tws", name: "TWS", nameKo: "투어스", fandom: "42", agency: "PLEDIS Entertainment", debutYear: 2024, kind: "boy", accent: "#0ea5e9", verifiedAt: null, members: [] },
  {
    slug: "twice", name: "TWICE", nameKo: "트와이스", fandom: "ONCE", agency: "JYP Entertainment",
    debutYear: 2015, kind: "girl", accent: "#f59e0b", verifiedAt: null,
    members: [
      m("nayeon", "Nayeon", "1995-09-22"), m("jeongyeon", "Jeongyeon", "1996-11-01"), m("momo", "Momo", "1996-11-09"),
      m("sana", "Sana", "1996-12-29"), m("jihyo", "Jihyo", "1997-02-01"), m("mina", "Mina", "1997-03-24"),
      m("dahyun", "Dahyun", "1998-05-28"), m("chaeyoung", "Chaeyoung", "1999-04-23"), m("tzuyu", "Tzuyu", "1999-06-14"),
    ],
  },
  {
    slug: "blackpink", name: "BLACKPINK", nameKo: "블랙핑크", fandom: "BLINK", agency: "YG Entertainment",
    debutYear: 2016, kind: "girl", accent: "#ec4899", verifiedAt: null,
    members: [
      m("jisoo", "JISOO", "1995-01-03"), m("jennie", "JENNIE", "1996-01-16"),
      m("rose", "ROSÉ", "1997-02-11"), m("lisa", "LISA", "1997-03-27"),
    ],
  },
  {
    slug: "aespa", name: "aespa", nameKo: "에스파", fandom: "MY", agency: "SM Entertainment",
    debutYear: 2020, kind: "girl", accent: "#6366f1", verifiedAt: null,
    members: [
      m("karina", "KARINA", "2000-04-11"), m("giselle", "GISELLE", "2000-10-30"),
      m("winter", "WINTER", "2001-01-01"), m("ningning", "NINGNING", "2002-10-23"),
    ],
  },
  { slug: "ive", name: "IVE", nameKo: "아이브", fandom: "DIVE", agency: "Starship Entertainment", debutYear: 2021, kind: "girl", accent: "#e11d48", verifiedAt: null, members: [] },
  { slug: "le-sserafim", name: "LE SSERAFIM", nameKo: "르세라핌", fandom: "FEARNOT", agency: "SOURCE MUSIC", debutYear: 2022, kind: "girl", accent: "#475569", verifiedAt: null, members: [] },
  { slug: "newjeans", name: "NewJeans", nameKo: "뉴진스", fandom: "Bunnies", agency: "ADOR", debutYear: 2022, kind: "girl", accent: "#3b82f6", verifiedAt: null, members: [] },
  { slug: "babymonster", name: "BABYMONSTER", nameKo: "베이비몬스터", fandom: "MONSTIEZ", agency: "YG Entertainment", debutYear: 2024, kind: "girl", accent: "#be123c", verifiedAt: null, members: [] },
  { slug: "illit", name: "ILLIT", nameKo: "아일릿", fandom: "GLLIT", agency: "BELIFT LAB", debutYear: 2024, kind: "girl", accent: "#a855f7", verifiedAt: null, members: [] },
];
