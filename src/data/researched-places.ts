import type { CatalogSource, Place, ResearchedText, VisitInfo } from "../lib/types";

const checked = "2026-10-18";
export const text = (en: string, ko: string, ja: string): ResearchedText => ({ en, ko, ja });
const source = (label: string, url: string, kind: CatalogSource["kind"] = "operator"): CatalogSource => ({ label, url, kind });
export const BTS_CITY_SOURCE = source("Seoul Metropolitan Government: BTS location map (historical association)", "https://english.seoul.go.kr/make-a-pilgrimage-to-seoul-and-celebrate-the-10th-anniversary-of-bts/", "tourism");
const officeAccess = text("Working office: plan only a brief look from public space. No public building tour or artist meeting is offered here; keep entrances clear.", "업무용 사옥입니다. 공공 보행 공간에서 외관만 짧게 보세요. 내부 투어나 아티스트 만남을 제공하는 장소가 아니며 출입구를 비워 주세요.", "業務用オフィスです。公共の歩道から外観を短時間見る計画にしてください。館内ツアーやアーティストとの面会はなく、出入口をふさがないでください。");
const officeHours = text("No public visitor hours. A dated pop-up announcement is a separate admission arrangement.", "일반 관람 시간이 없습니다. 특정 날짜의 팝업 공지는 별도 입장 안내입니다.", "一般見学時間はありません。期間限定ポップアップの入場案内とは別です。");
const outside = text("No admission product for the office exterior.", "사옥 외관 관람용 입장권은 없습니다.", "オフィス外観を見るための入場券はありません。");
const liveDirections = text("Use the address link for a current public-transport route; exits and walking times have not been independently checked.", "주소의 지도 링크에서 대중교통 경로를 확인하세요. 출구 번호와 도보 시간은 별도 검증하지 않았습니다.", "住所の地図リンクで最新の公共交通ルートを確認してください。出口番号と徒歩時間は個別確認していません。");
const storeHours = text("Check the shop's latest notice on the day; event and floor opening times can differ.", "방문 당일 매장 최신 공지를 확인하세요. 행사와 층별 운영 시간이 다를 수 있습니다.", "当日の店舗公式案内を確認してください。イベントやフロアで営業時間が異なる場合があります。");
const storeAdmission = text("Shopping costs and special-event applications are separate. Stock and purchase benefits are not guaranteed.", "상품 구매비와 별도 행사 응모 조건을 구분하세요. 재고와 구매 특전은 보장되지 않습니다.", "商品代金とイベント応募条件は別です。在庫や購入特典は保証されません。");

type Patch = Partial<Place> & Pick<Place, "sources" | "visit" | "verifiedAt">;
const office = (sources: CatalogSource[]): Patch => ({ verifiedAt: checked, sources, visit: { transit: liveDirections, hours: officeHours, admission: outside, access: officeAccess, suggestedMinutes: 15 } });

/** Only fields checked against the linked evidence are updated; seed-less live records are preserved. */
export const researchedPlaceUpdates: Record<string, Patch> = {
  "hybe-yongsan": office([source("HYBE: Yongsan pop-up venue and address", "https://weverse.io/bts/notice/39365", "organizer")]),
  "sm-seongsu": office([source("SM Entertainment: company location", "https://www.smentertainment.com/en/contact/location/")]),
  "jyp-gangdong": office([source("JYP Entertainment: JYP Center contact", "https://www.jype.com/JYP/Contact")]),
  "yg-hapjeong": office([source("YG Entertainment: headquarters", "https://www.ygfamily.com/ko/about/headquarters"), source("YG Entertainment: registered head-office address", "https://ygfamily.com/contents/attachments/2025/08/YG%2BEntertainment%2B2025%2BSustainability%2BReport%2B%28ENG%29_1.pdf")]),
  "kspo-dome": {
    note: notes("An Olympic Park concert venue. Check the selected show's actual gate, pickup and performance schedule.", "올림픽공원의 공연장입니다. 선택한 공연의 실제 입구·수령·공연 시간을 확인하세요.", "オリンピック公園の公演会場です。選んだ公演の入口・受取・開演時刻を確認してください。", ["奧林匹克公園的演出場館，請確認所選場次的入場資訊。", "奥林匹克公园的演出场馆，请确认所选场次的入场信息。", "Địa điểm biểu diễn ở Công viên Olympic; kiểm tra thông tin của suất đã chọn.", "สถานที่แสดงในสวนโอลิมปิก โปรดตรวจข้อมูลรอบที่เลือก", "Venue di Taman Olimpiade; periksa informasi pertunjukan yang dipilih.", "Recinto del Parque Olímpico; comprueba los datos de tu función."]),
    verifiedAt: checked, sources: [source("KSPO&CO: KSPO DOME directions", "https://www.ksponco.or.kr/sports/menu.es?mid=a60505000000")],
    visit: {
      transit: liveDirections,
      hours: text("Concert entry, merchandise and collection times are set by each event organizer; the sports-center timetable is not the concert schedule.", "공연 입장·상품 판매·티켓 수령 시간은 행사 주최자가 정합니다. 스포츠센터 운영 시간과 공연 일정은 다릅니다.", "公演入場・物販・受取時刻は各主催者が決めます。スポーツセンターの営業時間と公演日程は別です。"),
      admission: text("A ticket for the selected performance is required; admission to another Olympic Park facility does not cover the concert.", "선택한 공연의 티켓이 필요합니다. 올림픽공원 다른 시설 이용권으로 공연에 입장할 수 없습니다.", "選んだ公演のチケットが必要です。オリンピック公園内の別施設の利用券では公演に入れません。"),
      access: text("Follow the organizer's gate and pickup notice, not the sports-center entrance number. Keep a buffer for queues and transport after the show.", "스포츠센터 출입문 번호가 아닌 주최자의 공연 입구·수령 안내를 따르세요. 대기와 공연 후 이동에 쓸 여유 시간을 확보하세요.", "スポーツセンターの入口番号ではなく、公演主催者のゲート・受取案内に従ってください。行列と終演後の移動に余裕を残してください。"), suggestedMinutes: 180,
    },
  },
  "gocheok-dome": {
    note: notes("A large event venue in Guro. Use the organizer's event-specific entry information.", "구로의 대형 행사장입니다. 주최자의 행사별 입장 안내를 확인하세요.", "九老の大型イベント会場です。主催者のイベント別入場案内を確認してください。", ["九老的大型活動場館，請確認主辦方入場公告。", "九老的大型活动场馆，请确认主办方入场公告。", "Địa điểm sự kiện lớn tại Guro; xem hướng dẫn vào cửa của ban tổ chức.", "สถานที่จัดงานขนาดใหญ่ในกูโร โปรดดูประกาศเข้าชมของผู้จัด", "Venue acara besar di Guro; ikuti petunjuk masuk penyelenggara.", "Gran recinto de eventos en Guro; sigue las instrucciones del organizador."]),
    verifiedAt: checked, sources: [source("Seoul Facilities Corporation: Gocheok Sky Dome directions", "https://www.sisul.or.kr/open_content/skydome/introduce/location.jsp")],
    visit: {
      transit: text("Use the operator's Line 1 route guide; Guro Station Exit 2 is listed as a longer alternative for approaching from Seoul/Suwon/Anyang.", "운영자의 1호선 경로 안내를 확인하세요. 서울·수원·안양 방면에는 구로역 2번 출구의 더 긴 도보 대안도 안내합니다.", "運営者の1号線アクセスを確認してください。ソウル・水原・安養方面からは、九老駅2番出口からの長めの徒歩ルートも掲載されています。"),
      hours: text("Check the selected event's entry and ticket-collection times.", "선택한 행사의 입장·티켓 수령 시간을 확인하세요.", "選んだイベントの入場・チケット受取時間を確認してください。"),
      admission: text("The event's ticket and identity rules apply; venue directions do not establish ticket availability.", "행사의 티켓·본인 확인 조건이 적용됩니다. 오시는 길 안내가 잔여석을 보장하지 않습니다.", "イベントの券種・本人確認条件が適用されます。アクセス案内は残席を保証しません。"),
      access: text("Use the ticket's actual gate and keep time for entry queues. A baseball or venue-tour ticket is not an awards-show ticket.", "티켓에 안내된 출입구를 이용하고 입장 대기 시간을 확보하세요. 야구·시설 투어 입장권은 시상식 티켓과 다릅니다.", "券面のゲートを使い、入場の列に備えてください。野球や施設見学の券は授賞式の券とは異なります。"), suggestedMinutes: 180,
    },
  },
  "kstar-road": {
    verifiedAt: checked,
    sources: [source("Gangnam District: K-Star Road", "https://visitgangnam.net/en/kpop", "tourism")],
    visit: {
      transit: text("Apgujeong Rodeo Station (Suin–Bundang Line), Exit 2; follow the street toward Cheongdam Intersection.", "수인분당선 압구정로데오역 2번 출구에서 청담사거리 방향으로 이동합니다.", "水仁・盆唐線の狎鴎亭ロデオ駅2番出口から清潭交差点方面へ。"),
      hours: text("Outdoor public street; choose daylight for the walk.", "야외 보행 구간입니다. 낮 시간 방문을 권합니다.", "屋外の公道です。明るい時間帯の散策がおすすめです。"),
      admission: text("No street admission ticket.", "거리 입장권은 없습니다.", "通りの入場券はありません。"),
      access: text("The official list includes BTS, but not every group on this site has a GangnamDol. Statue positions can move; this is not a current agency-address guide.", "공식 조형물 목록에는 BTS가 있지만, 이 사이트의 모든 그룹 조형물이 있는 것은 아닙니다. 조형물 위치는 바뀔 수 있으며 현재 사옥 주소 안내와는 다릅니다.", "公式リストにはBTSが含まれますが、すべてのグループの像があるわけではありません。像の位置は変わり、現在の事務所所在地とは異なります。"),
      suggestedMinutes: 40,
    },
  },
  "hikr-ground": {
    verifiedAt: checked,
    sources: [source("Korea Tourism Organization: HiKR visitor information", "https://english.visitkorea.or.kr/svc/sp/hikr?menuSn=994", "tourism")],
    visit: {
      transit: text("Jonggak Station Line 1, Exit 5; the operator also lists Euljiro 1-ga Line 2, Exit 2.", "1호선 종각역 5번 출구. 운영자는 2호선 을지로입구역 2번 출구 경로도 안내합니다.", "1号線鐘閣駅5番出口。運営者は2号線乙支路入口駅2番出口からのルートも案内しています。"),
      hours: text("Exhibition floors: Tue–Sun 10:00–20:00; last entry 19:40. Monday access differs by floor.", "전시층 화~일 10:00~20:00, 입장 마감 19:40. 월요일은 층별 이용 가능 여부가 다릅니다.", "展示フロアは火〜日10:00〜20:00、最終入場19:40。月曜日はフロア別に利用可否が異なります。"),
      admission: text("General admission is free; separately advertised programs may charge.", "일반 입장 무료. 별도 안내되는 프로그램은 유료일 수 있습니다.", "一般入場無料。個別プログラムは有料の場合があります。"),
      access: text("Public tourism experience, not a broadcast recording or artist-appearance event. Plan this stop on a day the exhibition floors open.", "관광 체험 시설이며 방송 녹화장이나 아티스트 출연 행사가 아닙니다. 전시층 운영일에 배치하세요.", "観光体験施設で、番組収録やアーティスト出演イベントではありません。展示フロアの営業日に組み込んでください。"),
      suggestedMinutes: 60, closedWeekdays: [1],
    },
  },
};

function notes(en: string, ko: string, ja: string, rest: [string, string, string, string, string, string]): Place["note"] {
  const [tw, cn, vi, th, id, es] = rest;
  return { en, ko, ja, "zh-tw": tw, "zh-cn": cn, vi, th, id, es };
}
const shopVisit = (access: ResearchedText): VisitInfo => ({ transit: liveDirections, hours: storeHours, admission: storeAdmission, access, suggestedMinutes: 45 });
export const researchedNewPlaces: Place[] = [
  {
    id: "national-museum-korea", name: "National Museum of Korea", area: "yongsan", type: "landmark", groups: ["bts"],
    address: "137 Seobinggo-ro, Yongsan-gu, Seoul",
    note: notes("A BTS tourism-video location identified by Seoul's official BTS map; combine a collection visit with Yongsan.", "서울시 BTS 지도에 소개된 서울관광 영상 촬영지. 소장품 관람과 용산 일정을 함께 계획하세요.", "ソウル市のBTSマップで紹介された観光映像の撮影地。展示鑑賞と龍山の旅程を組み合わせられます。", ["首爾官方 BTS 地圖介紹的觀光影片拍攝地。", "首尔官方 BTS 地图介绍的旅游宣传片拍摄地。", "Địa điểm quay video du lịch trong bản đồ BTS chính thức của Seoul.", "สถานที่ถ่ายวิดีโอท่องเที่ยวในแผนที่ BTS ทางการของโซล", "Lokasi video wisata dalam peta BTS resmi Seoul.", "Lugar de un vídeo turístico incluido en el mapa oficial de BTS de Seúl."]),
    verifiedAt: checked, sources: [BTS_CITY_SOURCE, source("National Museum of Korea: directions", "https://www.museum.go.kr/ENG/contents/E0105010000.do")],
    visit: {
      transit: text("Ichon Station, Line 4 or Gyeongui–Jungang; Exit 2 / Museum Nadeulgil passage. Use the museum's accessibility directions for lifts.", "4호선·경의중앙선 이촌역 2번 출구 또는 박물관 나들길. 엘리베이터 경로는 박물관 접근 안내를 확인하세요.", "4号線・京義中央線二村駅2番出口または博物館ナドゥル道。エレベーターは館のバリアフリー案内を確認してください。"),
      hours: text("Check the museum's current visitor notice for gallery hours and temporary closures; passage opening hours are not gallery hours.", "전시실 운영 시간과 임시 휴실은 박물관 최신 안내를 확인하세요. 연결 통로 운영 시간과 전시실 관람 시간은 다릅니다.", "展示室の営業時間と臨時休室は最新案内を確認してください。連絡通路の開放時間は展示室の営業時間ではありません。"),
      admission: text("Check the selected exhibition's admission terms. Special exhibitions and the Children's Museum have separate arrangements.", "선택한 전시의 입장 조건을 확인하세요. 특별전과 어린이박물관은 별도 조건이 적용됩니다.", "選ぶ展示の入場条件を確認してください。特別展と子ども博物館は別の条件です。"),
      access: text("The BTS connection is a past filming credit, not a standing BTS exhibition or current appearance. Allow time to explore the museum itself.", "BTS 관련성은 과거 촬영 이력이며, 상설 BTS 전시나 현재 출연을 뜻하지 않습니다. 박물관 자체를 관람할 시간을 확보하세요.", "BTSとの関係は過去の撮影実績で、常設BTS展や現在の出演を意味しません。博物館そのものを見る時間を確保してください。"), suggestedMinutes: 120,
    },
  },
  {
    id: "oil-tank-culture-park", name: "Oil Tank Culture Park", area: "mapo", type: "landmark", groups: ["bts"],
    address: "87 Jeungsan-ro, Mapo-gu, Seoul",
    note: notes("Run BTS filming association on the city's BTS map; plan an outdoor visit, not guaranteed tank-interior access.", "서울시 BTS 지도에 소개된 달려라 방탄 촬영지. 탱크 내부 입장을 전제로 하지 않는 야외 동선입니다.", "市のBTSマップに掲載されたRun BTSの撮影地。タンク内部の入場を前提としない屋外コースです。", ["官方 BTS 地圖上的拍攝地；請以戶外參觀規劃。", "官方 BTS 地图上的拍摄地；请按户外参观规划。", "Địa điểm quay Run BTS; nên lên lịch tham quan ngoài trời.", "สถานที่ถ่าย Run BTS ควรวางแผนเที่ยวพื้นที่กลางแจ้ง", "Lokasi syuting Run BTS; rencanakan kunjungan area luar.", "Lugar de rodaje de Run BTS; planifica una visita exterior."]),
    verifiedAt: checked, sources: [BTS_CITY_SOURCE, source("Seoul Parks: current access and transport notice", "https://parks.seoul.go.kr/content.do?key=2604300014")],
    visit: {
      transit: text("World Cup Stadium Station Line 6, Exit 2 or 3; the operator suggests about a 10-minute walk toward the west gate.", "6호선 월드컵경기장역 2·3번 출구. 운영자는 서문 방향 도보 약 10분 경로를 안내합니다.", "6号線ワールドカップ競技場駅2・3番出口。運営者は西門方面へ徒歩約10分と案内しています。"),
      hours: text("Outdoor park: open 24 hours. Since April 2025 the tanks are no longer continuously open for interior viewing.", "야외공원 24시간 개방. 2025년 4월부터 탱크 내부 상시 관람이 불가능합니다.", "屋外公園は24時間開放。2025年4月以降、タンク内部の常時見学はできません。"),
      admission: text("Outdoor walk and separately booked tours/programs are different activities; check each program's terms.", "야외 산책과 별도 예약 투어·프로그램은 구분해 이용 조건을 확인하세요.", "屋外散策と別途予約するツアー・プログラムは異なります。各条件を確認してください。"),
      access: text("Choose daylight and suitable weather. Do not rely on older guides promising entry into every tank.", "날씨가 좋은 낮 시간을 선택하세요. 모든 탱크 내부에 들어갈 수 있다는 과거 안내를 그대로 적용하지 마세요.", "天候のよい明るい時間を選んでください。すべてのタンクに入れるという古い案内は適用できません。"), suggestedMinutes: 60,
    },
  },
  {
    id: "gyeongbokgung", name: "Gyeongbokgung Palace", area: "jongno", type: "landmark", groups: ["bts"],
    address: "161 Sajik-ro, Jongno-gu, Seoul",
    note: notes("The BTS 2020 Tonight Show performance location documented by Korean tourism authorities.", "한국관광공사에서 소개한 BTS 2020 지미 팰런쇼 공연 촬영지입니다.", "韓国観光公社が紹介するBTSの2020年Tonight Showパフォーマンス撮影地です。", ["韓國觀光公社介紹的 BTS 2020 年表演拍攝地。", "韩国观光公社介绍的 BTS 2020 年表演拍摄地。", "Nơi quay màn trình diễn BTS năm 2020 được cơ quan du lịch giới thiệu.", "สถานที่ถ่ายการแสดง BTS ปี 2020 ตามข้อมูลการท่องเที่ยวเกาหลี", "Lokasi penampilan BTS tahun 2020 dalam informasi pariwisata resmi.", "Lugar de la actuación de BTS de 2020 documentado por turismo oficial."]),
    verifiedAt: checked,
    sources: [source("VISITKOREA: BTS in Seoul", "https://english.visitkorea.or.kr/svc/whereToGo/hdrdslt/hdrdsltView.do?crsSn=399187", "tourism"), source("Royal Palaces: Gyeongbokgung directions", "https://royal.cha.go.kr/ROYAL/contents/R707000000.do?schGroupCode=gbg")],
    visit: {
      transit: text("Gyeongbokgung Station Line 3, Exit 5. The operator also lists Gwanghwamun Station Line 5, Exit 2.", "3호선 경복궁역 5번 출구. 운영자는 5호선 광화문역 2번 출구도 안내합니다.", "3号線景福宮駅5番出口。公式案内には5号線光化門駅2番出口も掲載されています。"),
      hours: text("Use the palace's date-specific opening and closure notice. Night admission has a separate seasonal schedule and ticket.", "방문 날짜의 궁궐 관람·휴궁 안내를 확인하세요. 야간관람은 별도 기간과 입장 조건이 적용됩니다.", "訪問日の開館・休館案内を確認してください。夜間観覧は別の期間・入場条件です。"),
      admission: text("Palace admission rules apply. Check age, nationality and any exemption on the official page before paying.", "궁궐 관람 요금이 적용됩니다. 연령·국적·면제 조건을 공식 안내에서 확인하세요.", "宮殿の入場規則が適用されます。年齢・国籍・免除条件は公式案内で確認してください。"),
      access: text("A past filming location; there is no BTS performance included in palace admission. Restricted buildings remain off limits.", "과거 촬영지이며 궁궐 입장권에 BTS 공연은 포함되지 않습니다. 관람 제한 건물에는 들어갈 수 없습니다.", "過去の撮影地で、入場券にBTSの公演は含まれません。立入制限のある建物には入れません。"), suggestedMinutes: 120,
    },
  },
  {
    id: "samee-hapjeong", name: "theSameE Hapjeong", area: "mapo", type: "store", groups: ["blackpink", "babymonster"],
    address: "6-3 Huiujeong-ro 1-gil, Mapo-gu, Seoul",
    note: notes("An official YG retail route across from the office area; check the current floor and artist stock with the shop.", "YG 공식 판매처로 안내된 합정 매장입니다. 현재 이용 층과 아티스트별 재고는 매장에서 확인하세요.", "YG公式販売先として案内される合井店。現在のフロアとアーティスト別在庫は店舗に確認してください。", ["YG 官方公告列出的合井門市；樓層與庫存需另確認。", "YG 官方公告列出的合井门店；楼层与库存需另确认。", "Cửa hàng tại Hapjeong trong thông báo YG; kiểm tra tầng và tồn kho.", "ร้านฮับจองที่ระบุในประกาศ YG ควรตรวจสอบชั้นและสต็อก", "Toko Hapjeong dalam pengumuman YG; cek lantai dan stok.", "Tienda de Hapjeong indicada por YG; comprueba la planta y las existencias."]),
    verifiedAt: checked, sources: [source("YG: 2026 official offline retail addresses", "https://www.ygfamily.com/ko/artists/treasure/notice/243", "organizer"), source("YG: BLACKPINK JISOO offline retail association", "https://www.ygfamily.com/ko/news/notice/5741", "organizer")],
    visit: shopVisit(text("This is a retail stop, not entry to YG headquarters or an artist meeting. Older notices list different floors; check the shop before a special trip.", "매장 방문이며 YG 사옥 입장이나 아티스트 만남이 아닙니다. 과거 공지의 층별 표기가 달라 방문 전 매장 안내를 확인하세요.", "店舗への訪問で、YG社屋への入場や面会ではありません。過去の告知でフロア表記が異なるため、訪問前に店舗案内を確認してください。")),
  },
  {
    id: "samee-insadong", name: "theSameE Insadong", area: "jongno", type: "store", groups: ["blackpink", "babymonster"],
    address: "3F, Annyeong Insadong, 49 Insadong-gil, Jongno-gu, Seoul",
    note: notes("The 2026 YG retail notice places this shop on the third floor; older YG PLACE guides can list the fourth floor.", "2026년 YG 판매처 공지는 3층으로 안내합니다. 과거 YG PLACE 소개의 4층 표기와 구분하세요.", "2026年のYG販売店案内は3階です。旧YG PLACEの記事にある4階表記と区別してください。", ["2026 年官方銷售公告列為 3 樓，請勿沿用舊 4 樓資訊。", "2026 年官方销售公告列为 3 楼，请勿沿用旧 4 楼信息。", "Thông báo bán hàng YG năm 2026 ghi tầng 3; thông tin cũ có thể ghi tầng 4.", "ประกาศ YG ปี 2026 ระบุชั้น 3 ข้อมูลเก่าอาจระบุชั้น 4", "Pengumuman YG tahun 2026 mencantumkan lantai 3; panduan lama mungkin lantai 4.", "El aviso de YG de 2026 indica la planta 3; las guías antiguas pueden indicar la 4."]),
    verifiedAt: checked, sources: [source("YG: 2026 theSameE Insadong retail address", "https://www.ygfamily.com/ko/artists/treasure/notice/243", "organizer")],
    visit: shopVisit(text("A shopping option in central Seoul; check BLACKPINK/BABYMONSTER stock separately. A past artist promotion does not promise the same benefits today.", "도심 쇼핑 대안입니다. BLACKPINK·BABYMONSTER 재고는 별도 확인하세요. 과거 아티스트 행사의 특전이 현재도 제공된다는 뜻은 아닙니다.", "都心の買い物候補です。BLACKPINK・BABYMONSTERの在庫は別途確認してください。過去の特典が現在もあるとは限りません。")),
  },
  {
    id: "withmuu-hongdae", name: "WITHMUU AK Hongdae", area: "mapo", type: "store", groups: [],
    address: "2F, AK Plaza Hongdae, 188 Yanghwa-ro, Mapo-gu, Seoul",
    note: notes("A practical album-shopping stop on a Hongdae day. Fan-sign applications and ordinary purchases have different rules.", "홍대 일정에 묶기 좋은 음반 쇼핑 장소입니다. 팬사인회 응모와 일반 구매 조건을 구분하세요.", "弘大の旅程に組み込みやすいアルバム店。サイン会応募と通常購入の条件は異なります。", ["可安排在弘大行程的唱片店；簽售應募與一般購物條件不同。", "可安排在弘大行程的唱片店；签售应募与一般购物条件不同。", "Điểm mua album ở Hongdae; điều kiện fansign khác mua sắm thông thường.", "ร้านอัลบั้มในฮงแด เงื่อนไขแฟนไซน์ต่างจากการซื้อทั่วไป", "Tempat belanja album di Hongdae; syarat fansign berbeda dari pembelian biasa.", "Tienda de álbumes en Hongdae; las firmas tienen condiciones distintas de una compra normal."]),
    verifiedAt: checked, sources: [source("YG: WITHMUU AK Hongdae retail address", "https://www.ygfamily.com/ko/artists/treasure/notice/243", "organizer"), source("HYBE: WITHMUU retailer information", "https://weverse.io/seventeen/notice/39448", "organizer")],
    visit: shopVisit(text("A general multi-artist retailer, not evidence that your artist visited. Confirm the artist, version and refund terms before purchase.", "여러 아티스트를 취급하는 일반 판매처로, 아티스트 방문 이력을 뜻하지 않습니다. 구매 전 아티스트·버전·환불 조건을 확인하세요.", "複数アーティストを扱う一般販売店で、本人の来店実績を示しません。購入前にアーティスト・版・返品条件を確認してください。")),
  },
  {
    id: "ktown4u-coex", name: "Ktown4u COEX", area: "gangnam", type: "store", groups: [],
    address: "COEX Artium, 513 Yeongdong-daero, Gangnam-gu, Seoul",
    note: notes("An indoor K-pop shopping and experience option. The retail and cafe floors have different uses.", "실내 K-POP 쇼핑·체험 대안입니다. 판매 공간과 카페 층의 용도가 다릅니다.", "屋内のK-POPショッピング・体験候補。販売フロアとカフェは用途が異なります。", ["室內 K-POP 購物與體驗選項，商店和咖啡廳樓層不同。", "室内 K-POP 购物与体验选项，商店和咖啡厅楼层不同。", "Điểm mua sắm và trải nghiệm K-pop trong nhà, gồm các tầng khác nhau.", "ตัวเลือกช้อปและทำกิจกรรม K-pop ในอาคาร แยกชั้นร้านค้าและคาเฟ่", "Pilihan belanja dan pengalaman K-pop di dalam gedung dengan lantai terpisah.", "Opción de compras y experiencias K-pop bajo techo, con plantas de usos distintos."]),
    verifiedAt: checked, sources: [source("Gangnam District: Ktown4u COEX visitor guide", "https://visitgangnam.net/en/courses/is-this-the-place-the-holy-land-of-g-content", "tourism"), source("YG: COEX retail/cafe address", "https://www.ygfamily.com/ko/artists/treasure/notice/243", "organizer")],
    visit: shopVisit(text("Classes and fan events require their own booking. Visiting the retail floors does not include a dance class or an artist appearance.", "수업과 팬 행사는 각각 별도 신청이 필요합니다. 매장 방문에 댄스 수업이나 아티스트 출연이 포함되지 않습니다.", "レッスンやファンイベントには別途申込みが必要です。店舗訪問にダンスレッスンや本人の出演は含まれません。")),
  },
];
