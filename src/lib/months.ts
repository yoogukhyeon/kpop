import { formatDate, type Locale } from "@/lib/i18n";

/** The next `count` months as YYYY-MM, starting with the month of `today`. */
export function upcomingMonths(today: string, count = 6): string[] {
  const [y, m] = today.split("-").map(Number);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(Date.UTC(y, m - 1 + i, 1));
    return d.toISOString().slice(0, 7);
  });
}

export const isMonth = (v: string) => /^\d{4}-(0[1-9]|1[0-2])$/.test(v);

export function monthRange(month: string): { from: string; to: string } {
  const [y, m] = month.split("-").map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return { from: `${month}-01`, to: `${month}-${String(last).padStart(2, "0")}` };
}

export const monthLabel = (month: string, locale: Locale) =>
  formatDate(`${month}-01`, locale, { month: "long", year: "numeric" });
