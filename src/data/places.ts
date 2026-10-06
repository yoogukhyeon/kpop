import type { Place } from "@/lib/types";

// SEED DATA — addresses and opening status must be verified before launch.
// Agency buildings are viewed from outside only; fans should not enter or wait for artists.

const HYBE_GROUPS = ["bts", "txt", "seventeen", "enhypen", "le-sserafim", "newjeans", "boynextdoor", "tws", "illit", "andteam"];

export const places: Place[] = [
  {
    id: "hybe-yongsan", name: "HYBE Yongsan Building", area: "yongsan", type: "agency", groups: HYBE_GROUPS,
    address: "42 Hangang-daero, Yongsan-gu, Seoul",
    note: {
      en: "Photo spot outside the HYBE headquarters. Combine with Yongsan station shopping.",
      ja: "HYBE本社の外観は人気の写真スポット。龍山駅でのショッピングとセットで。",
      es: "Punto de fotos frente a la sede de HYBE. Combínalo con compras en la estación de Yongsan.",
      ko: "HYBE 사옥 앞 인기 사진 명소. 용산역 쇼핑과 함께 들르기 좋습니다.",

      "zh-tw": "HYBE 總部外的熱門拍照點，可以順便逛龍山站。",

      "zh-cn": "HYBE 总部外的热门拍照点，可以顺便逛龙山站。",

      "vi": "Điểm chụp ảnh bên ngoài trụ sở HYBE. Kết hợp mua sắm ở ga Yongsan.",

      "th": "จุดถ่ายรูปหน้าสำนักงานใหญ่ HYBE ไปช้อปที่สถานียงซานต่อได้",

      "id": "Spot foto di luar kantor pusat HYBE. Gabungkan dengan belanja di Stasiun Yongsan.",
    },
    verifiedAt: null,
  },
  {
    id: "sm-seongsu", name: "SM Entertainment (KAMF Building)", area: "seongsu", type: "agency", groups: ["aespa", "nct-dream", "riize"],
    address: "83-21 Wangsimni-ro, Seongdong-gu, Seoul",
    note: {
      en: "Seongsu is also Seoul's pop-up store district — check the events list for your dates.",
      ja: "聖水はソウルのポップアップストアの街。滞在日程のイベントもチェックを。",
      es: "Seongsu también es el barrio de las pop-up stores de Seúl: revisa los eventos de tus fechas.",
      ko: "성수는 서울 팝업스토어의 중심지예요. 여행 날짜의 이벤트도 확인하세요.",

      "zh-tw": "聖水也是首爾的快閃店聚集地，記得看看你的日期有哪些活動。",

      "zh-cn": "圣水也是首尔的快闪店聚集地，记得看看你的日期有哪些活动。",

      "vi": "Seongsu cũng là khu cửa hàng pop-up của Seoul — xem sự kiện trong ngày bạn đi.",

      "th": "ซองซูเป็นย่านป๊อปอัพสโตร์ของโซล ลองเช็กอีเวนต์ในวันที่คุณไป",

      "id": "Seongsu juga pusat toko pop-up di Seoul — cek acara di tanggal kamu.",
    },
    verifiedAt: null,
  },
  {
    id: "jyp-gangdong", name: "JYP Entertainment", area: "gangdong", type: "agency", groups: ["twice", "stray-kids"],
    address: "205 Gangdong-daero, Gangdong-gu, Seoul",
    note: {
      en: "Short ride from the Olympic Park venues — pair with a KSPO Dome day.",
      ja: "オリンピック公園の会場から近いので、KSPO DOMEの日に合わせて。",
      es: "A poca distancia de los recintos del Parque Olímpico: combínalo con un día en KSPO Dome.",
      ko: "올림픽공원 공연장과 가까워 KSPO DOME 가는 날 함께 들르기 좋습니다.",

      "zh-tw": "離奧林匹克公園場館不遠，可以和 KSPO DOME 演出日排在一起。",

      "zh-cn": "离奥林匹克公园场馆不远，可以和 KSPO DOME 演出日排在一起。",

      "vi": "Gần các địa điểm ở Công viên Olympic — kết hợp với ngày diễn ở KSPO Dome.",

      "th": "อยู่ไม่ไกลจากสวนโอลิมปิก ไปวันเดียวกับคอนที่ KSPO Dome ได้",

      "id": "Dekat venue Taman Olimpiade — gabungkan dengan hari konser di KSPO Dome.",
    },
    verifiedAt: null,
  },
  {
    id: "yg-hapjeong", name: "YG Entertainment", area: "mapo", type: "agency", groups: ["blackpink", "babymonster"],
    address: "7 Huiujeong-ro 1-gil, Mapo-gu, Seoul",
    note: {
      en: "Walkable from Hapjeong station; Hongdae birthday cafes are nearby.",
      ja: "合井駅から徒歩圏内。弘大のセンイルカフェも近くです。",
      es: "Se llega caminando desde la estación Hapjeong; los cafés de cumpleaños de Hongdae están cerca.",
      ko: "합정역에서 걸어갈 수 있고, 홍대 생일카페와도 가깝습니다.",

      "zh-tw": "從合井站步行可到，附近就是弘大的生日咖啡廳。",

      "zh-cn": "从合井站步行可到，附近就是弘大的生日咖啡馆。",

      "vi": "Đi bộ từ ga Hapjeong; gần các quán cà phê sinh nhật ở Hongdae.",

      "th": "เดินจากสถานีฮับจองได้ ใกล้คาเฟ่วันเกิดย่านฮงแด",

      "id": "Bisa jalan kaki dari Stasiun Hapjeong; dekat kafe ulang tahun di Hongdae.",
    },
    verifiedAt: null,
  },
  {
    id: "kstar-road", name: "K-Star Road", area: "gangnam", type: "landmark", groups: [],
    address: "Apgujeong Rodeo Station Exit 2 → Cheongdam crossroads",
    note: {
      en: "Street of GangnamDol bear statues for many groups.",
      ja: "多くのグループの「カンナムドル」クマ像が並ぶ通り。",
      es: "Calle con las estatuas de osos GangnamDol de muchos grupos.",
      ko: "여러 그룹의 강남돌 곰 조형물이 늘어선 거리.",

      "zh-tw": "有多個團體 GangnamDol 熊雕像的街道。",

      "zh-cn": "有多个团体 GangnamDol 熊雕像的街道。",

      "vi": "Con phố có tượng gấu GangnamDol của nhiều nhóm nhạc.",

      "th": "ถนนที่มีรูปปั้นหมี GangnamDol ของหลายวง",

      "id": "Jalan dengan patung beruang GangnamDol dari banyak grup.",
    },
    verifiedAt: null,
  },
  {
    id: "hikr-ground", name: "HiKR Ground", area: "jung", type: "experience", groups: [],
    address: "Korea Tourism Organization Seoul Center, 40 Cheonggyecheon-ro, Jung-gu, Seoul",
    note: {
      en: "Free K-pop experience center run by the Korea Tourism Organization.",
      ja: "韓国観光公社が運営する無料のK-POP体験施設。",
      es: "Centro gratuito de experiencias K-pop de la Organización de Turismo de Corea.",
      ko: "한국관광공사가 운영하는 무료 K-POP 체험관.",

      "zh-tw": "韓國觀光公社經營的免費 K-POP 體驗館。",

      "zh-cn": "韩国观光公社经营的免费 K-POP 体验馆。",

      "vi": "Trung tâm trải nghiệm K-pop miễn phí của Tổng cục Du lịch Hàn Quốc.",

      "th": "ศูนย์ประสบการณ์ K-pop ฟรี ดำเนินการโดยการท่องเที่ยวเกาหลี",

      "id": "Pusat pengalaman K-pop gratis dari Korea Tourism Organization.",
    },
    verifiedAt: null,
  },
  {
    id: "kspo-dome", name: "KSPO Dome (Olympic Park)", area: "songpa", type: "venue", groups: [],
    address: "424 Olympic-ro, Songpa-gu, Seoul",
    note: {
      en: "Most-used arena for K-pop concerts. Merch lines open hours before the show.",
      ja: "K-POPコンサートでもっとも使われるアリーナ。グッズ列は開演の数時間前から。",
      es: "El recinto más usado para conciertos de K-pop. Las filas de merch empiezan horas antes.",
      ko: "K-POP 콘서트가 가장 많이 열리는 공연장. 굿즈 줄은 공연 몇 시간 전부터 생깁니다.",

      "zh-tw": "最常舉辦 K-POP 演唱會的場館，周邊商品隊伍會提早好幾個小時排起。",

      "zh-cn": "最常举办 K-POP 演唱会的场馆，周边商品队伍会提前好几个小时排起。",

      "vi": "Địa điểm tổ chức concert K-pop nhiều nhất. Hàng mua merch xếp từ nhiều giờ trước.",

      "th": "สถานที่จัดคอน K-pop บ่อยที่สุด คิวซื้อเมอร์ชเริ่มหลายชั่วโมงก่อนโชว์",

      "id": "Venue konser K-pop paling sering dipakai. Antrean merch mulai berjam-jam sebelum acara.",
    },
    verifiedAt: null,
  },
  {
    id: "gocheok-dome", name: "Gocheok Sky Dome", area: "guro", type: "venue", groups: [],
    address: "430 Gyeongin-ro, Guro-gu, Seoul",
    note: {
      en: "Seoul's only domed stadium, used for large concerts.",
      ja: "ソウル唯一のドーム球場。大規模コンサートの会場。",
      es: "El único estadio techado de Seúl, usado para grandes conciertos.",
      ko: "서울 유일의 돔구장으로 대형 콘서트가 열립니다.",

      "zh-tw": "首爾唯一的巨蛋，舉辦大型演唱會。",

      "zh-cn": "首尔唯一的巨蛋，举办大型演唱会。",

      "vi": "Sân vận động mái vòm duy nhất ở Seoul, dùng cho concert lớn.",

      "th": "โดมแห่งเดียวในโซล ใช้จัดคอนเสิร์ตขนาดใหญ่",

      "id": "Satu-satunya stadion beratap di Seoul, untuk konser besar.",
    },
    verifiedAt: null,
  },
  {
    id: "mcountdown", name: "CJ ENM Center (M Countdown)", area: "mapo", type: "broadcast", groups: [],
    address: "66 Sangamsan-ro, Mapo-gu, Seoul",
    note: {
      en: "M Countdown is the most foreigner-friendly music show; foreigner live passes are sold via Klook.",
      ja: "M COUNTDOWNは外国人がいちばん観覧しやすい音楽番組。外国人向けライブパスはKlookで販売。",
      es: "M Countdown es el programa musical más accesible para extranjeros; los pases se venden en Klook.",
      ko: "엠카운트다운은 외국인이 가장 방청하기 쉬운 음악방송이며, 외국인 전용 패스를 Klook에서 판매합니다.",

      "zh-tw": "M COUNTDOWN 是外國人最容易參加的打歌節目，外國人通行證在 Klook 販售。",

      "zh-cn": "M COUNTDOWN 是外国人最容易参加的打歌节目，外国人通行证在 Klook 销售。",

      "vi": "M Countdown là chương trình dễ xem nhất với người nước ngoài; vé dành cho người nước ngoài bán trên Klook.",

      "th": "M Countdown เป็นรายการเพลงที่ชาวต่างชาติเข้าชมง่ายที่สุด มีพาสขายบน Klook",

      "id": "M Countdown paling ramah orang asing; pass khusus orang asing dijual di Klook.",
    },
    verifiedAt: null,
  },
  {
    id: "kbs-music-bank", name: "KBS Main Building (Music Bank)", area: "yeouido", type: "broadcast", groups: [],
    address: "13 Yeouigongwon-ro, Yeongdeungpo-gu, Seoul",
    note: {
      en: "Free audience lottery; needs a KBS foreigner account verified with a passport.",
      ja: "無料の観覧抽選。パスポートで認証したKBSの外国人アカウントが必要。",
      es: "Sorteo gratuito de público; necesitas una cuenta de KBS para extranjeros verificada con pasaporte.",
      ko: "무료 방청 추첨. 여권으로 인증한 KBS 외국인 계정이 필요합니다.",

      "zh-tw": "免費觀眾抽籤，需要以護照認證的 KBS 外國人帳號。",

      "zh-cn": "免费观众抽签，需要用护照认证的 KBS 外国人账号。",

      "vi": "Bốc thăm khán giả miễn phí; cần tài khoản KBS cho người nước ngoài đã xác minh hộ chiếu.",

      "th": "จับฉลากผู้ชมฟรี ต้องมีบัญชี KBS สำหรับชาวต่างชาติที่ยืนยันพาสปอร์ตแล้ว",

      "id": "Undian penonton gratis; perlu akun KBS untuk orang asing yang terverifikasi paspor.",
    },
    verifiedAt: null,
  },
];
