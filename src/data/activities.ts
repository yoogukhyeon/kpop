import type { Activity } from "@/lib/types";

// Real partner products found on Klook / KKday (checked 2026-10-05). Titles are
// the partners' own; summaries are ours. `duration` only where the listing states it. Prices and availability change — the
// card always sends people to the partner page to check.

const CHECKED = "2026-10-05";

export const activities: Activity[] = [
  // Music show tickets / packages
  {
    id: "kkday-the-show-ticket", partner: "kkday", category: "ticket",
    title: "The Show: SBS K-Pop Music Show Live Broadcast Ticket",
    url: "https://www.kkday.com/en/product/144446", area: "mapo", groups: [], tags: ["music-show"], weekdays: [2], checkedAt: CHECKED,
    summary: {
      en: "Watch SBS The Show's live broadcast on a Tuesday — no fan club membership needed.",
      ja: "火曜日のSBS「THE SHOW」生放送を観覧。ファンクラブ会員でなくても参加できます。",
      es: "Mira en vivo The Show de SBS un martes, sin membresía de fan club.",
      ko: "화요일 SBS 더쇼 생방송 방청. 팬클럽 회원이 아니어도 참여할 수 있습니다.",

      "zh-tw": "週二觀看 SBS《THE SHOW》直播，不需要粉絲俱樂部會員。",

      "zh-cn": "周二观看 SBS《THE SHOW》直播，不需要粉丝俱乐部会员。",

      "vi": "Xem trực tiếp The Show của SBS vào thứ Ba — không cần thành viên fan club.",

      "th": "ชมไลฟ์ The Show ของ SBS วันอังคาร ไม่ต้องเป็นสมาชิกแฟนคลับ",

      "id": "Nonton siaran langsung The Show SBS hari Selasa — tanpa keanggotaan fan club.",
    },
  },
  {
    id: "klook-the-show-mvp", partner: "klook", category: "ticket",
    title: "[KPOP] THE SHOW + MVP Seoul Tour Package",
    url: "https://www.klook.com/activity/91793-kpop-tour/", area: "mapo", groups: [], tags: ["music-show", "fan-tour"], weekdays: [2], checkedAt: CHECKED,
    summary: {
      en: "A Seoul K-pop tour that ends at The Show's live broadcast on Tuesday.",
      ja: "ソウルのK-POPツアーと火曜日のTHE SHOW生放送観覧がセットに。",
      es: "Tour K-pop por Seúl que termina en la transmisión en vivo de The Show el martes.",
      ko: "서울 K-POP 투어와 화요일 더쇼 생방송 방청을 함께하는 패키지.",

      "zh-tw": "首爾 K-POP 行程，最後觀看週二《THE SHOW》直播。",

      "zh-cn": "首尔 K-POP 行程，最后观看周二《THE SHOW》直播。",

      "vi": "Tour K-pop Seoul kết thúc bằng buổi phát trực tiếp The Show thứ Ba.",

      "th": "ทัวร์ K-pop โซล ปิดท้ายด้วยการชมไลฟ์ The Show วันอังคาร",

      "id": "Tur K-pop Seoul yang diakhiri dengan siaran langsung The Show hari Selasa.",
    },
  },
  {
    id: "kkday-inkigayo-half-day", partner: "kkday", category: "ticket",
    title: "Seoul SBS Inkigayo Music Program Half-Day Tour",
    url: "https://www.kkday.com/en/product/265931", groups: [], tags: ["music-show"], weekdays: [0], duration: "half-day", checkedAt: CHECKED,
    summary: {
      en: "Sunday half-day tour that includes watching SBS Inkigayo.",
      ja: "日曜日にSBS「人気歌謡」を観覧する半日ツアー。",
      es: "Tour de medio día en domingo que incluye ver Inkigayo de SBS.",
      ko: "일요일 SBS 인기가요 방청이 포함된 반나절 투어.",

      "zh-tw": "週日半日遊，包含觀看 SBS《人氣歌謠》。",

      "zh-cn": "周日半日游，包含观看 SBS《人气歌谣》。",

      "vi": "Tour nửa ngày Chủ nhật có xem Inkigayo của SBS.",

      "th": "ทัวร์ครึ่งวันวันอาทิตย์ รวมชม Inkigayo ของ SBS",

      "id": "Tur setengah hari di hari Minggu termasuk menonton Inkigayo SBS.",
    },
  },
  {
    id: "klook-inkigayo-mvp", partner: "klook", category: "ticket",
    title: "[KPOP] SBS Inkigayo + MVP Seoul Tour Package",
    url: "https://www.klook.com/activity/187920-kpop-sbs-inkigayo-mvp-seoul-tour-package/", groups: [], tags: ["music-show", "fan-tour"], weekdays: [0], checkedAt: CHECKED,
    summary: {
      en: "Seoul tour package with a seat at SBS Inkigayo on Sunday.",
      ja: "日曜日のSBS「人気歌謡」観覧付きソウルツアーパッケージ。",
      es: "Paquete de tour por Seúl con asiento en Inkigayo de SBS el domingo.",
      ko: "일요일 SBS 인기가요 방청이 포함된 서울 투어 패키지.",

      "zh-tw": "含週日 SBS《人氣歌謠》座位的首爾行程套票。",

      "zh-cn": "含周日 SBS《人气歌谣》座位的首尔行程套票。",

      "vi": "Gói tour Seoul kèm chỗ xem Inkigayo của SBS vào Chủ nhật.",

      "th": "แพ็กเกจทัวร์โซลพร้อมที่นั่งชม Inkigayo ของ SBS วันอาทิตย์",

      "id": "Paket tur Seoul dengan kursi di Inkigayo SBS hari Minggu.",
    },
  },
  {
    id: "kkday-inkigayo-on-the-go", partner: "kkday", category: "ticket",
    title: "2026 SBS Inkigayo ON THE GO Ticket Package",
    url: "https://www.kkday.com/en/product/578500", groups: [], tags: ["music-show"], weekdays: [0], checkedAt: CHECKED,
    summary: {
      en: "Ticket package for SBS Inkigayo's ON THE GO events in 2026.",
      ja: "2026年SBS「人気歌謡 ON THE GO」のチケットパッケージ。",
      es: "Paquete de entradas para Inkigayo ON THE GO de SBS en 2026.",
      ko: "2026 SBS 인기가요 ON THE GO 티켓 패키지.",

      "zh-tw": "2026 SBS《人氣歌謠 ON THE GO》門票套票。",

      "zh-cn": "2026 SBS《人气歌谣 ON THE GO》门票套票。",

      "vi": "Gói vé sự kiện Inkigayo ON THE GO của SBS năm 2026.",

      "th": "แพ็กเกจบัตร Inkigayo ON THE GO ของ SBS ปี 2026",

      "id": "Paket tiket Inkigayo ON THE GO SBS tahun 2026.",
    },
  },

  // Fan tours
  {
    id: "klook-kpop-fan-tour", partner: "klook", category: "tour",
    title: "Seoul K-POP Fan Tour: Real Idol Show & K-POP Agency Visit",
    url: "https://www.klook.com/activity/21948-k-pop-fan-tour-seoul/", groups: [], tags: ["fan-tour", "agency"], checkedAt: CHECKED,
    summary: {
      en: "Guided fan tour with an entertainment agency visit and K-pop landmarks.",
      ja: "芸能事務所の訪問とK-POPの名所をめぐるガイド付きファンツアー。",
      es: "Tour guiado para fans con visita a una agencia y lugares icónicos del K-pop.",
      ko: "기획사 방문과 K-POP 명소를 도는 가이드 팬 투어.",

      "zh-tw": "含參觀經紀公司和 K-POP 景點的導覽追星行程。",

      "zh-cn": "含参观经纪公司和 K-POP 景点的导览追星行程。",

      "vi": "Tour có hướng dẫn, ghé thăm công ty giải trí và các địa điểm K-pop.",

      "th": "ทัวร์มีไกด์ เยี่ยมชมค่ายเพลงและแลนด์มาร์ก K-pop",

      "id": "Tur berpemandu dengan kunjungan ke agensi dan landmark K-pop.",
    },
  },
  {
    id: "kkday-kpop-fan-tour", partner: "kkday", category: "tour",
    title: "K-POP Fan Tour in Seoul: Agency Visits & Iconic Landmarks",
    url: "https://www.kkday.com/en/product/158982", groups: [], tags: ["fan-tour", "agency"], checkedAt: CHECKED,
    summary: {
      en: "Day tour past agency buildings and well-known K-pop spots in Seoul.",
      ja: "事務所の建物や有名なK-POPスポットをめぐる日帰りツアー。",
      es: "Tour de un día por edificios de agencias y lugares famosos del K-pop en Seúl.",
      ko: "기획사 사옥과 유명 K-POP 명소를 둘러보는 일일 투어.",

      "zh-tw": "一日遊，走訪經紀公司大樓和首爾知名 K-POP 景點。",

      "zh-cn": "一日游，走访经纪公司大楼和首尔知名 K-POP 景点。",

      "vi": "Tour một ngày qua các tòa nhà công ty và địa điểm K-pop nổi tiếng ở Seoul.",

      "th": "ทัวร์หนึ่งวัน ผ่านตึกค่ายและจุด K-pop ชื่อดังในโซล",

      "id": "Tur sehari melewati gedung agensi dan spot K-pop terkenal di Seoul.",
    },
  },
  {
    id: "klook-army-one-day", partner: "klook", category: "tour",
    title: "ARMY One-Day Tour: BTS Spots, Cafes & Spa Experience from Seoul",
    url: "https://www.klook.com/activity/75044-tour-bts-seoul-hybe/", area: "yongsan", groups: ["bts"], tags: ["fan-tour", "agency"], duration: "full-day", checkedAt: CHECKED,
    summary: {
      en: "A BTS-themed day: HYBE, places linked to BTS's early years, and cafes.",
      ja: "HYBEやBTSゆかりの場所、カフェをめぐるBTSテーマの1日ツアー。",
      es: "Un día temático de BTS: HYBE, lugares de sus primeros años y cafés.",
      ko: "HYBE, BTS 데뷔 시절과 관련된 장소, 카페를 도는 BTS 테마 투어.",

      "zh-tw": "BTS 主題一日遊：HYBE、BTS 出道初期相關地點和咖啡廳。",

      "zh-cn": "BTS 主题一日游：HYBE、BTS 出道初期相关地点和咖啡馆。",

      "vi": "Một ngày chủ đề BTS: HYBE, những nơi gắn với thời kỳ đầu của BTS và các quán cà phê.",

      "th": "ทริปธีม BTS: HYBE สถานที่ช่วงเดบิวต์ของ BTS และคาเฟ่",

      "id": "Sehari bertema BTS: HYBE, tempat-tempat masa awal BTS, dan kafe.",
    },
  },
  {
    id: "klook-seongsu-walk", partner: "klook", category: "tour",
    title: "K-Pop & Culture & Seongsu-dong Cafe & Hot places Walking Tour",
    url: "https://www.klook.com/activity/91724-kpop-tour/", area: "seongsu", groups: [], tags: ["fan-tour", "seongsu"], checkedAt: CHECKED,
    summary: {
      en: "Walking tour of Seongsu's K-pop and cafe hot spots.",
      ja: "聖水のK-POPスポットと人気カフェを歩いてめぐるツアー。",
      es: "Recorrido a pie por los lugares K-pop y cafés de moda de Seongsu.",
      ko: "성수동의 K-POP 명소와 인기 카페를 걸으며 도는 투어.",

      "zh-tw": "步行探索聖水的 K-POP 和咖啡廳熱點。",

      "zh-cn": "步行探索圣水的 K-POP 和咖啡馆热点。",

      "vi": "Tour đi bộ khám phá các điểm K-pop và quán cà phê ở Seongsu.",

      "th": "ทัวร์เดินเที่ยวจุด K-pop และคาเฟ่ฮิตในซองซู",

      "id": "Tur jalan kaki ke spot K-pop dan kafe hits di Seongsu.",
    },
  },

  // Dance classes and experiences
  {
    id: "klook-dance-class-3248", partner: "klook", category: "experience",
    title: "Seoul: K-Pop Dance Class",
    url: "https://www.klook.com/activity/3248-kpop-dance-class-seoul/", groups: [], tags: ["dance"], duration: 90, checkedAt: CHECKED,
    summary: {
      en: "Beginner-friendly class taught by professional dancers, with photos and video.",
      ja: "プロダンサーが教える初心者向けクラス。写真と動画付き。",
      es: "Clase para principiantes con bailarines profesionales, con fotos y video.",
      ko: "프로 댄서가 가르치는 초보자용 클래스. 사진·영상 포함.",

      "zh-tw": "專業舞者授課的新手課程，附照片和影片。",

      "zh-cn": "专业舞者授课的新手课程，附照片和视频。",

      "vi": "Lớp cho người mới do vũ công chuyên nghiệp dạy, kèm ảnh và video.",

      "th": "คลาสสำหรับมือใหม่ สอนโดยแดนเซอร์มืออาชีพ พร้อมรูปและวิดีโอ",

      "id": "Kelas ramah pemula oleh penari profesional, dengan foto dan video.",
    },
  },
  {
    id: "klook-ktown4u-dance", partner: "klook", category: "experience",
    title: "Ktown4u K-pop Dance One Day Class + Video Shooting Experience",
    url: "https://www.klook.com/activity/105517-kpop-dance-class/", area: "gangnam", groups: [], tags: ["dance"], checkedAt: CHECKED,
    summary: {
      en: "One-day dance class at COEX with a video shoot at the end.",
      ja: "COEXで受けるワンデーダンスクラス。最後に動画撮影付き。",
      es: "Clase de un día en COEX con grabación de video al final.",
      ko: "코엑스에서 듣는 원데이 댄스 클래스, 마지막에 영상 촬영.",

      "zh-tw": "在 COEX 上一日舞蹈課，最後拍攝影片。",

      "zh-cn": "在 COEX 上一日舞蹈课，最后拍摄视频。",

      "vi": "Lớp nhảy một ngày tại COEX, cuối buổi quay video.",

      "th": "คลาสเต้นวันเดียวที่ COEX ปิดท้ายด้วยการถ่ายวิดีโอ",

      "id": "Kelas dance sehari di COEX dengan sesi rekam video di akhir.",
    },
  },
  {
    id: "kkday-real-kpop-studio", partner: "kkday", category: "experience",
    title: "Real K-Pop Dance Studio Class in Seoul: Photos, Video & Certificate",
    url: "https://www.kkday.com/en/product/2742", area: "mapo", groups: [], tags: ["dance", "hongdae"], duration: 90, checkedAt: CHECKED,
    summary: {
      en: "90-minute studio class near Hapjeong with photos, video and a certificate.",
      ja: "合井駅近くのスタジオで90分。写真・動画・修了証付き。",
      es: "Clase de 90 minutos cerca de Hapjeong con fotos, video y certificado.",
      ko: "합정역 근처 스튜디오 90분 클래스. 사진·영상·수료증 제공.",

      "zh-tw": "合井站附近的 90 分鐘舞蹈課，附照片、影片和結業證書。",

      "zh-cn": "合井站附近的 90 分钟舞蹈课，附照片、视频和结业证书。",

      "vi": "Lớp 90 phút gần ga Hapjeong, kèm ảnh, video và chứng nhận.",

      "th": "คลาส 90 นาทีใกล้สถานีฮับจอง พร้อมรูป วิดีโอ และใบประกาศ",

      "id": "Kelas 90 menit dekat Hapjeong dengan foto, video, dan sertifikat.",
    },
  },
  {
    id: "kkday-hongdae-dance", partner: "kkday", category: "experience",
    title: "K-POP Dance Class in Hongdae, Seoul",
    url: "https://www.kkday.com/en/product/164393", area: "mapo", groups: [], tags: ["dance", "hongdae"], duration: 90, checkedAt: CHECKED,
    summary: {
      en: "Learn a choreography in Hongdae and film your own dance video.",
      ja: "弘大で振り付けを覚えて、自分のダンス動画を撮影。",
      es: "Aprende una coreografía en Hongdae y graba tu propio video.",
      ko: "홍대에서 안무를 배우고 나만의 댄스 영상을 촬영.",

      "zh-tw": "在弘大學一支編舞，並拍攝自己的舞蹈影片。",

      "zh-cn": "在弘大学一支编舞，并拍摄自己的舞蹈视频。",

      "vi": "Học một bài nhảy ở Hongdae và quay video của riêng bạn.",

      "th": "เรียนท่าเต้นที่ฮงแดและถ่ายวิดีโอเต้นของคุณเอง",

      "id": "Belajar koreografi di Hongdae dan rekam video dance-mu sendiri.",
    },
  },
  {
    id: "kkday-korean-with-kpop", partner: "kkday", category: "experience",
    title: "Learn Korean with K-POP: Lyrics, Slang & Dance in One Fun Day (Private)",
    url: "https://www.kkday.com/en/product/570723", area: "mapo", groups: [], tags: ["dance", "hongdae", "korean"], duration: "full-day", checkedAt: CHECKED,
    summary: {
      en: "Private day in Hongdae: K-pop lyrics, slang and a dance class.",
      ja: "弘大でプライベートに。K-POPの歌詞、スラング、ダンスクラス。",
      es: "Día privado en Hongdae: letras, jerga del K-pop y clase de baile.",
      ko: "홍대에서 프라이빗하게. K-POP 가사, 신조어, 댄스 클래스.",

      "zh-tw": "弘大私人一日課：K-POP 歌詞、流行語和舞蹈。",

      "zh-cn": "弘大私人一日课：K-POP 歌词、流行语和舞蹈。",

      "vi": "Một ngày riêng tư ở Hongdae: lời bài hát, tiếng lóng K-pop và lớp nhảy.",

      "th": "วันส่วนตัวที่ฮงแด: เนื้อเพลง K-pop สแลง และคลาสเต้น",

      "id": "Sehari privat di Hongdae: lirik K-pop, slang, dan kelas dance.",
    },
  },
];
