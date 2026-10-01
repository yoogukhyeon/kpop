import type { Locale } from "@/lib/i18n";

// Affiliate partners. Each partner stays hidden until its tracking query is set
// in the environment (e.g. PARTNER_KLOOK_QUERY="aid=12345"), so nothing shows
// before the program approves the site. Copy the exact parameter from the
// partner dashboard; replace `url` with deep links once available.

interface Partner {
  name: string;
  url: string;
  envKey: string;
  label: Record<Locale, string>;
}

const partners: Record<string, Partner> = {
  klook: {
    name: "Klook",
    url: "https://www.klook.com/",
    envKey: "PARTNER_KLOOK_QUERY",
    label: {
      en: "Music show passes, K-pop tours, eSIMs and airport transfers",
      ja: "音楽番組パス、K-POPツアー、eSIM、空港送迎",
      es: "Pases para programas musicales, tours K-pop, eSIM y traslados",
      ko: "음악방송 패스, K-POP 투어, eSIM, 공항 이동",
    },
  },
  kkday: {
    name: "KKday",
    url: "https://www.kkday.com/",
    envKey: "PARTNER_KKDAY_QUERY",
    label: {
      en: "Tours, eSIMs and transport passes",
      ja: "ツアー、eSIM、交通パス",
      es: "Tours, eSIM y pases de transporte",
      ko: "투어, eSIM, 교통 패스",
    },
  },
  agoda: {
    name: "Agoda",
    url: "https://www.agoda.com/",
    envKey: "PARTNER_AGODA_QUERY",
    label: {
      en: "Hotels near concert venues",
      ja: "コンサート会場近くのホテル",
      es: "Hoteles cerca de los recintos",
      ko: "공연장 근처 숙소",
    },
  },
};

export interface PartnerLink {
  id: string;
  name: string;
  href: string;
  label: string;
}

/** Configured partners among `ids`, with tracking applied. */
export function partnerLinks(ids: string[], locale: Locale): PartnerLink[] {
  return ids.flatMap((id) => {
    const p = partners[id];
    const query = p && process.env[p.envKey];
    if (!p || !query) return [];
    const url = new URL(p.url);
    new URLSearchParams(query).forEach((v, k) => url.searchParams.set(k, v));
    return [{ id, name: p.name, href: url.toString(), label: p.label[locale] }];
  });
}
