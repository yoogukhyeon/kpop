import { MONTHS, listBirthdays } from "@/lib/birthdays";
import { listActivities, listEvents, listGroups } from "@/lib/data";
import { listGuides } from "@/lib/guides";
import { seoulToday, site } from "@/lib/site";

// llms.txt (https://llmstxt.org): a plain-Markdown map of the site for AI
// assistants and answer engines, so they can find and cite the right pages.

export const revalidate = 86400;

export async function GET() {
  const [guides, koGuides, groups, activities, birthdays, events] = await Promise.all([
    listGuides("en"),
    listGuides("ko"),
    listGroups(),
    listActivities(),
    listBirthdays(),
    listEvents({ from: seoulToday() }),
  ]);
  const monthName = (mm: string) => new Date(`2026-${mm}-01T00:00:00Z`).toLocaleString("en", { month: "long", timeZone: "UTC" });
  // Only verified events: answer engines should never cite unchecked dates.
  const verified = events.filter((e) => e.verifiedAt);
  const u = site.url;

  const body = `# ${site.name}

> ${site.name} is a free, fan-made K-pop trip planner and travel guide for international fans visiting Seoul, South Korea. Fans choose a group, a member ("bias") and travel dates and get a day-by-day plan with concerts, member birthday cafes, pop-up stores, music show recordings and fan spots grouped by neighbourhood. Available in English, Japanese, Traditional and Simplified Chinese, Vietnamese, Thai, Indonesian, Spanish and Korean.

Key facts:
- Independent fan project; not affiliated with any artist, agency, broadcaster or ticketing platform.
- Every event links to its official source; unverified details are labelled on the page.
- Free to use, no sign-up. Some links to travel partners (Klook, KKday, Agoda) may be affiliate links.
- Languages: English (/en), Japanese (/ja), Traditional Chinese (/zh-tw), Simplified Chinese (/zh-cn), Vietnamese (/vi), Thai (/th), Indonesian (/id), Spanish (/es), Korean (/ko). Contact: ${site.contactEmail}

## Trip planner

- [Plan a K-pop trip to Seoul](${u}/en): choose group, member and dates; returns a day-by-day plan and a shareable trip card.

## Guides

${guides.map((g) => `- [${g.title}](${u}/en/guides/${g.slug}): ${g.description}`).join("\n")}

## Group travel guides

${groups.map((g) => `- [${g.name} Seoul fan trip guide](${u}/en/groups/${g.slug}): places, birthdays and upcoming events for ${g.fandom} (${g.agency}).`).join("\n")}

## Activities

- [K-pop tours, classes and tickets in Seoul](${u}/en/activities): ${activities.length} partner products — fan tours, dance classes and music show tickets.
- [Music show tickets](${u}/en/activities/ticket)
- [K-pop dance classes and experiences](${u}/en/activities/experience)
- [K-pop fan tours](${u}/en/activities/tour)

## Events

- [K-pop events in Seoul](${u}/en/events): concerts, fan meetings, birthday cafes and pop-ups with foreigner ticketing notes.
${verified.map((e) => `- [${e.title}](${u}/en/events/e/${e.id}): ${e.startDate === e.endDate ? e.startDate : `${e.startDate} to ${e.endDate}`}, ${e.venue}, Seoul. Checked ${e.verifiedAt}.`).join("\n")}

## K-pop idol birthday calendar

- [K-pop idol birthday calendar](${u}/en/birthdays): ${birthdays.length} idols' birthdays by month, with birthday cafes in Seoul and a trip plan for each birthday.
${MONTHS.map((mm) => `- [K-pop idol birthdays in ${monthName(mm)}](${u}/en/birthdays/${mm}): ${birthdays.filter((b) => b.monthDay.startsWith(mm)).length} idols`).join("\n")}

## Korean-language guides (한국어 가이드)

${koGuides.map((g) => `- [${g.title}](${u}/ko/guides/${g.slug}): ${g.description}`).join("\n")}

## About

- [About ${site.name}](${u}/en/about)
- [Affiliate disclosure](${u}/en/disclosure)
- [Privacy policy](${u}/en/privacy)
- [Terms of use](${u}/en/terms)

## Optional

- [Full guide text](${u}/llms-full.txt): all English and Korean guides in one Markdown file.
`;

  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
