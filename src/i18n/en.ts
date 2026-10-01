import type { Area, EventType, ForeignerAccess } from "@/lib/types";

export const en = {
  langName: "English",
  tagline: "Your K-pop trip to Seoul, planned around your bias.",
  heroSub: "Pick your group and travel dates. We line up concerts, birthday cafes, pop-ups and pilgrimage spots — day by day.",
  nav: { planner: "Trip planner", groups: "Groups", events: "Events", guides: "Guides", submit: "List a birthday cafe" },
  form: {
    group: "Your group", members: "Bias (optional)", allMembers: "Whole group",
    from: "Arrive", to: "Leave", submit: "Plan my trip", maxDays: "Up to 14 days",
  },
  plan: {
    title: (group: string) => `Your ${group} Seoul trip`,
    day: (n: number) => `Day ${n}`,
    noEvents: "No confirmed events for this day yet — free for sightseeing.",
    birthday: (name: string) => `${name}'s birthday — fans run birthday cafes around this date.`,
    nearby: "Birthdays just outside your dates",
    musicShows: "Music shows",
    musicShowsNote: "Weekly music show recordings are free or low-cost but need advance applications. Check each show's foreigner rules.",
    share: "Share your trip",
    shareNote: "Download the card for your story, or copy the link.",
    download: "Download story card",
    copy: "Copy link",
    copied: "Copied!",
    edit: "Change dates or group",
    unverified: "Details being verified — check the source before you go.",
    source: "Source",
  },
  stats: {
    events: (n: number) => `${n} ${n === 1 ? "event" : "events"}`,
    birthdays: (n: number) => `${n} ${n === 1 ? "birthday" : "birthdays"}`,
    spots: (n: number) => `${n} ${n === 1 ? "spot" : "spots"}`,
  },
  card: {
    title: (group: string) => [`My ${group}`, "Seoul Trip"],
    birthday: (name: string) => `${name}'s birthday`,
    live: "Live",
    spot: "Spot",
    cta: "Plan yours",
  },
  group: {
    fandom: "Fandom", agency: "Agency", debut: "Debut", members: "Members",
    membersSoon: "Member guide coming soon.", spots: "Places for fans", upcoming: "Upcoming in Seoul",
    noUpcoming: "No confirmed events yet.", planCta: (g: string) => `Plan a ${g} trip`,
  },
  member: {
    birthday: "Birthday", nextBirthday: "Next birthday in Seoul",
    cafes: "Birthday cafes usually open a few days before and after the birthday, mostly around Hongdae/Mapo and Seongsu.",
    planCta: "Plan a trip for this birthday",
  },
  events: {
    title: "K-pop events in Seoul", empty: "No events listed for this period yet.", access: "Foreigner access",
    byMonth: "By month", monthTitle: (month: string) => `K-pop events in Seoul — ${month}`,
  },
  guides: { title: "Seoul guides for K-pop fans", updated: "Last checked", sources: "Sources", more: "More guides" },
  partners: {
    title: "Useful for this trip",
    disclosure: "Some links may be affiliate links. We may earn a commission at no extra cost to you.",
  },
  submit: {
    title: "List your birthday cafe",
    intro: "Hosting a birthday cafe in Seoul? List it for free and reach international fans. We review every listing before it goes live.",
    member: "Member", cafeName: "Cafe name", address: "Address", start: "Start date", end: "End date",
    contact: "Your X/Instagram handle or email", sourceUrl: "Announcement link", send: "Submit for review",
    thanks: "Thanks! We'll review your listing soon.",
    closed: "Listings open soon.",
    failed: "Something went wrong. Please try again in a moment.",
  },
  meta: {
    groupsTitle: "K-pop groups — Seoul fan travel guides",
    groupsDesc: "Seoul travel guides for K-pop fans: agency buildings, birthday cafes, concerts and pilgrimage spots by group.",
    groupTitle: (g: string) => `${g} Seoul trip guide — places, birthday cafes & concerts`,
    groupDesc: (g: string, agency: string, fandom: string) =>
      `Planning a ${g} trip to Seoul? ${agency} building, ${fandom} birthday cafes, upcoming concerts and pilgrimage spots in one guide.`,
    memberTitle: (m: string, g: string) => `${m} (${g}) birthday cafes in Seoul`,
    memberDesc: (m: string, date: string, fandom: string) =>
      `${m}'s birthday is ${date}. Where ${fandom} birthday cafes open in Seoul and how to plan a trip around it.`,
    eventsDesc: "Upcoming K-pop concerts, fan meetings, birthday cafes and pop-up stores in Seoul, with foreigner ticketing notes.",
    monthDesc: (month: string) => `K-pop concerts, fan meetings, birthday cafes and pop-ups in Seoul in ${month}, with foreigner ticketing notes.`,
    submitDesc: "Hosting a K-pop birthday cafe in Seoul? List it for free and reach international fans.",
    guidesDesc: "Practical guides for K-pop fans visiting Seoul: tickets, music shows, birthday cafes, venues and travel essentials.",
  },
  footer: "Fan-made guide. Not affiliated with any artist or agency. Event details can change — always check the official notice.",
  area: {
    yongsan: "Yongsan", seongsu: "Seongsu", gangnam: "Gangnam / Apgujeong", mapo: "Mapo / Hongdae / Sangam",
    songpa: "Songpa / Olympic Park", jung: "Jung-gu / City Hall", gangdong: "Gangdong", yeouido: "Yeouido", guro: "Guro",
  } satisfies Record<Area, string>,
  eventType: {
    concert: "Concert", fanmeeting: "Fan meeting", "music-show": "Music show", "birthday-cafe": "Birthday cafe", popup: "Pop-up",
  } satisfies Record<EventType, string>,
  access: {
    open: "Foreigners can book directly", verification: "Passport verification needed in advance",
    fanclub: "Fan club membership needed", "korean-id-only": "Korean ID only", unknown: "Not checked yet",
  } satisfies Record<ForeignerAccess, string>,
};

export type Dictionary = typeof en;
