import type { Dictionary } from "./en";

export const ja: Dictionary = {
  langName: "日本語",
  tagline: "推しに合わせて組む、ソウルK-POP旅行。",
  heroSub: "グループと旅行日程を選ぶだけ。コンサート、センイルカフェ、ポップアップ、聖地巡礼スポットを1日ごとにまとめます。",
  nav: { planner: "旅行プランナー", groups: "グループ", events: "イベント", guides: "ガイド", submit: "センイルカフェを掲載" },
  form: {
    group: "グループ", members: "推しメン（任意）", allMembers: "グループ全体",
    from: "到着日", to: "出発日", submit: "旅行プランを作る", maxDays: "最大14日",
  },
  plan: {
    title: (group: string) => `${group}のソウル旅行プラン`,
    day: (n: number) => `${n}日目`,
    noEvents: "この日に確定したイベントはまだありません。観光に使えます。",
    birthday: (name: string) => `${name}の誕生日 — この前後にファンがセンイルカフェを開きます。`,
    nearby: "旅行日程の前後にある誕生日",
    musicShows: "音楽番組",
    musicShowsNote: "毎週の音楽番組の観覧は無料または低価格ですが、事前申し込みが必要です。番組ごとの外国人向けルールを確認してください。",
    share: "旅行プランをシェア",
    shareNote: "ストーリー用カードを保存するか、リンクをコピーしてください。",
    download: "ストーリー用カードを保存",
    copy: "リンクをコピー",
    copied: "コピーしました",
    edit: "日程やグループを変更",
    unverified: "情報を確認中です。お出かけ前に出典をご確認ください。",
    source: "出典",
  },
  stats: {
    events: (n: number) => `イベント ${n}件`,
    birthdays: (n: number) => `誕生日 ${n}件`,
    spots: (n: number) => `スポット ${n}か所`,
  },
  card: {
    title: (group: string) => [`${group}と行く`, "ソウル旅行"],
    birthday: (name: string) => `${name}の誕生日`,
    live: "公演",
    spot: "スポット",
    cta: "あなたのプランも",
  },
  group: {
    fandom: "ファンダム", agency: "事務所", debut: "デビュー", members: "メンバー",
    membersSoon: "メンバーガイドは準備中です。", spots: "ファンにおすすめの場所", upcoming: "ソウルの今後の予定",
    noUpcoming: "確定したイベントはまだありません。", planCta: (g: string) => `${g}の旅行プランを作る`,
  },
  member: {
    birthday: "誕生日", nextBirthday: "次のソウルでの誕生日",
    cafes: "センイルカフェはたいてい誕生日の数日前から数日後まで、主に弘大・麻浦と聖水で開かれます。",
    planCta: "この誕生日に合わせて旅行を計画",
  },
  events: {
    title: "ソウルのK-POPイベント", empty: "この期間に掲載中のイベントはまだありません。", access: "外国人の購入",
    byMonth: "月別", monthTitle: (month: string) => `ソウルのK-POPイベント — ${month}`,
  },
  guides: { title: "K-POPファンのためのソウルガイド", updated: "最終確認日", sources: "出典", more: "ほかのガイド" },
  partners: {
    title: "この旅行に役立つもの",
    disclosure: "一部のリンクはアフィリエイトリンクの場合があります。追加料金なしで当サイトに手数料が入ることがあります。",
  },
  submit: {
    title: "センイルカフェを掲載する",
    intro: "ソウルでセンイルカフェを開催しますか？無料で掲載して海外ファンに届けましょう。すべての掲載は公開前に確認します。",
    member: "メンバー", cafeName: "カフェ名", address: "住所", start: "開始日", end: "終了日",
    contact: "X/Instagramのアカウントまたはメール", sourceUrl: "告知のリンク", send: "審査に送信",
    thanks: "ありがとうございます。まもなく確認します。",
    closed: "掲載受付はまもなく開始します。",
    failed: "エラーが発生しました。しばらくしてからもう一度お試しください。",
  },
  meta: {
    groupsTitle: "K-POPグループ別 ソウル旅行ガイド",
    groupsDesc: "K-POPファンのためのソウル旅行ガイド。事務所、センイルカフェ、コンサート、聖地巡礼スポットをグループ別に紹介。",
    groupTitle: (g: string) => `${g}のソウル聖地巡礼ガイド｜スポット・センイルカフェ・コンサート`,
    groupDesc: (g: string, agency: string, fandom: string) =>
      `${g}のソウル旅行を計画中ですか？${agency}の社屋、${fandom}のセンイルカフェ、今後のコンサート、聖地巡礼スポットをまとめました。`,
    memberTitle: (m: string, g: string) => `${m}（${g}）のソウル センイルカフェ情報`,
    memberDesc: (m: string, date: string, fandom: string) =>
      `${m}の誕生日は${date}。${fandom}のセンイルカフェがソウルのどこで開かれるか、誕生日に合わせた旅行の計画方法を紹介。`,
    eventsDesc: "ソウルで開催予定のK-POPコンサート、ファンミーティング、センイルカフェ、ポップアップを外国人向けチケット情報とともに紹介。",
    monthDesc: (month: string) => `${month}のソウルのK-POPコンサート、ファンミーティング、センイルカフェ、ポップアップ情報。`,
    submitDesc: "ソウルでK-POPのセンイルカフェを開催するなら、無料で掲載して海外ファンに届けましょう。",
    guidesDesc: "ソウルを訪れるK-POPファンのための実用ガイド。チケット、音楽番組、センイルカフェ、会場、旅の基本。",
  },
  footer: "ファンが作るガイドです。アーティストや事務所とは関係ありません。イベント情報は変わることがあるため、必ず公式告知をご確認ください。",
  area: {
    yongsan: "龍山", seongsu: "聖水", gangnam: "江南・狎鴎亭", mapo: "麻浦・弘大・上岩",
    songpa: "松坡・オリンピック公園", jung: "中区・市庁", gangdong: "江東", yeouido: "汝矣島", guro: "九老",
  },
  eventType: {
    concert: "コンサート", fanmeeting: "ファンミーティング", "music-show": "音楽番組", "birthday-cafe": "センイルカフェ", popup: "ポップアップ",
  },
  access: {
    open: "外国人も直接予約可能", verification: "事前のパスポート認証が必要",
    fanclub: "ファンクラブ会員が必要", "korean-id-only": "韓国の本人認証のみ", unknown: "未確認",
  },
};
