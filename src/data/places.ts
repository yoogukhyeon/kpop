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
    },
    verifiedAt: null,
  },
];
