import type { Dictionary } from "./en";

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export const es: Dictionary = {
  langName: "Español",
  tagline: "Tu viaje K-pop a Seúl, planeado alrededor de tu bias.",
  heroSub: "Elige tu grupo y tus fechas. Te armamos conciertos, cafés de cumpleaños, pop-ups y lugares de peregrinación, día por día.",
  nav: { planner: "Planificador", groups: "Grupos", events: "Eventos", guides: "Guías", submit: "Publica un café de cumpleaños" },
  form: {
    group: "Tu grupo", members: "Bias (opcional)", allMembers: "Todo el grupo",
    from: "Llegada", to: "Salida", submit: "Planear mi viaje", maxDays: "Hasta 14 días",
  },
  plan: {
    title: (group: string) => `Tu viaje a Seúl con ${group}`,
    day: (n: number) => `Día ${n}`,
    noEvents: "Aún no hay eventos confirmados este día: libre para pasear.",
    birthday: (name: string) => `Cumpleaños de ${name}: los fans abren cafés de cumpleaños alrededor de esta fecha.`,
    nearby: "Cumpleaños justo fuera de tus fechas",
    musicShows: "Programas musicales",
    musicShowsNote: "Las grabaciones semanales son gratis o baratas, pero hay que inscribirse antes. Revisa las reglas para extranjeros de cada programa.",
    share: "Comparte tu viaje",
    shareNote: "Descarga la tarjeta para tu historia o copia el enlace.",
    download: "Descargar tarjeta",
    copy: "Copiar enlace",
    copied: "¡Copiado!",
    edit: "Cambiar fechas o grupo",
    unverified: "Datos en verificación: revisa la fuente antes de ir.",
    source: "Fuente",
  },
  stats: {
    events: (n: number) => plural(n, "evento", "eventos"),
    birthdays: (n: number) => plural(n, "cumpleaños", "cumpleaños"),
    spots: (n: number) => plural(n, "lugar", "lugares"),
  },
  card: {
    title: (group: string) => ["Mi viaje a Seúl", `con ${group}`],
    birthday: (name: string) => `Cumpleaños de ${name}`,
    live: "En vivo",
    spot: "Lugar",
    cta: "Planea el tuyo",
  },
  group: {
    fandom: "Fandom", agency: "Agencia", debut: "Debut", members: "Miembros",
    membersSoon: "Guía de miembros próximamente.", spots: "Lugares para fans", upcoming: "Próximamente en Seúl",
    noUpcoming: "Aún no hay eventos confirmados.", planCta: (g: string) => `Planear un viaje de ${g}`,
  },
  member: {
    birthday: "Cumpleaños", nextBirthday: "Próximo cumpleaños en Seúl",
    cafes: "Los cafés de cumpleaños suelen abrir unos días antes y después, sobre todo en Hongdae/Mapo y Seongsu.",
    planCta: "Planear un viaje para este cumpleaños",
  },
  events: {
    title: "Eventos K-pop en Seúl", empty: "Aún no hay eventos publicados para este periodo.", access: "Acceso para extranjeros",
    byMonth: "Por mes", monthTitle: (month: string) => `Eventos K-pop en Seúl — ${month}`,
  },
  guides: { title: "Guías de Seúl para fans del K-pop", updated: "Última revisión", sources: "Fuentes", more: "Más guías" },
  partners: {
    title: "Útil para este viaje",
    disclosure: "Algunos enlaces pueden ser de afiliados. Podemos recibir una comisión sin costo extra para ti.",
  },
  submit: {
    title: "Publica tu café de cumpleaños",
    intro: "¿Organizas un café de cumpleaños en Seúl? Publícalo gratis y llega a fans internacionales. Revisamos cada publicación antes de mostrarla.",
    member: "Miembro", cafeName: "Nombre del café", address: "Dirección", start: "Fecha de inicio", end: "Fecha de fin",
    contact: "Tu cuenta de X/Instagram o email", sourceUrl: "Enlace del anuncio", send: "Enviar a revisión",
    thanks: "¡Gracias! Revisaremos tu publicación pronto.",
    closed: "Las publicaciones abren pronto.",
    failed: "Algo salió mal. Inténtalo de nuevo en un momento.",
  },
  meta: {
    groupsTitle: "Grupos K-pop — guías de viaje a Seúl para fans",
    groupsDesc: "Guías de viaje a Seúl para fans del K-pop: agencias, cafés de cumpleaños, conciertos y lugares de peregrinación por grupo.",
    groupTitle: (g: string) => `Guía de viaje a Seúl de ${g}: lugares, cafés de cumpleaños y conciertos`,
    groupDesc: (g: string, agency: string, fandom: string) =>
      `¿Planeas un viaje a Seúl por ${g}? Edificio de ${agency}, cafés de cumpleaños de ${fandom}, próximos conciertos y lugares de peregrinación en una sola guía.`,
    memberTitle: (m: string, g: string) => `Cafés de cumpleaños de ${m} (${g}) en Seúl`,
    memberDesc: (m: string, date: string, fandom: string) =>
      `El cumpleaños de ${m} es el ${date}. Dónde abren los cafés de cumpleaños de ${fandom} en Seúl y cómo planear tu viaje.`,
    eventsDesc: "Próximos conciertos, fanmeetings, cafés de cumpleaños y pop-ups de K-pop en Seúl, con notas sobre entradas para extranjeros.",
    monthDesc: (month: string) => `Conciertos, fanmeetings, cafés de cumpleaños y pop-ups de K-pop en Seúl en ${month}.`,
    submitDesc: "¿Organizas un café de cumpleaños K-pop en Seúl? Publícalo gratis y llega a fans internacionales.",
    guidesDesc: "Guías prácticas para fans del K-pop que visitan Seúl: entradas, programas musicales, cafés de cumpleaños, recintos y lo esencial.",
  },
  footer: "Guía hecha por fans. Sin relación con artistas ni agencias. Los datos de eventos pueden cambiar: revisa siempre el anuncio oficial.",
  area: {
    yongsan: "Yongsan", seongsu: "Seongsu", gangnam: "Gangnam / Apgujeong", mapo: "Mapo / Hongdae / Sangam",
    songpa: "Songpa / Parque Olímpico", jung: "Jung-gu / Ayuntamiento", gangdong: "Gangdong", yeouido: "Yeouido", guro: "Guro",
  },
  eventType: {
    concert: "Concierto", fanmeeting: "Fanmeeting", "music-show": "Programa musical", "birthday-cafe": "Café de cumpleaños", popup: "Pop-up",
  },
  access: {
    open: "Los extranjeros pueden comprar directamente", verification: "Requiere verificar el pasaporte antes",
    fanclub: "Requiere membresía del fan club", "korean-id-only": "Solo con identificación coreana", unknown: "Sin revisar",
  },
};
