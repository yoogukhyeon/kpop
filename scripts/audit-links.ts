// npm run audit:links [-- --live]
// Live checks use clean merchant URLs without affiliate IDs: audits must not inflate paid click reports.
import { readdirSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import matter from "gray-matter";
import { activities } from "../src/data/activities";
import { buildPartnerUrl, publicHttpsUrl } from "../src/lib/partner-url";
import { locales } from "../src/lib/i18n";

async function main() {
const errors: string[] = [];
const warnings: string[] = [];
let checked = 0;
const report: object[] = [];
for (const activity of activities) {
  const key = activity.partner === "klook" ? "PARTNER_KLOOK_QUERY" : "PARTNER_KKDAY_QUERY";
  const query = process.env[key] ?? "";
  const required = activity.partner === "klook" ? "aid" : "cid";
  if (!new URLSearchParams(query.replace(/^\?/, "")).get(required)) errors.push(`${activity.id}: missing ${required} in ${key}`);
  for (const locale of locales) {
    const href = buildPartnerUrl(activity.partner, activity.url, query, locale);
    if (!href || !new URL(href).searchParams.get(required)) errors.push(`${activity.id}/${locale}: invalid tracked product URL`);
    if (!activity.summary[locale]?.trim()) errors.push(`${activity.id}/${locale}: missing product summary`);
    checked++;
  }
}

let guides = 0;
for (const locale of locales) {
  const titles = new Set<string>();
  for (const filename of readdirSync(`src/content/guides/${locale}`).filter((file) => file.endsWith(".md"))) {
    const { data, content } = matter(readFileSync(`src/content/guides/${locale}/${filename}`, "utf8"));
    guides++;
    const name = `${locale}/${filename}`;
    if (!data.title || !data.description || !content.trim()) errors.push(`${name}: missing editorial metadata or body`);
    if (titles.has(String(data.title))) errors.push(`${name}: duplicate title within locale`);
    titles.add(String(data.title));
    if (!data.sources?.length) warnings.push(`${name}: needs a source / editorial review`);
    for (const source of (data.sources ?? []) as string[]) if (!publicHttpsUrl(source)) errors.push(`${name}: invalid source protocol`);
    for (const match of content.matchAll(/\]\(\/(en|ja|ko|zh-tw|zh-cn|th|vi|id|es)\/guides\/([a-z0-9-]+)(?:#[^)]*)?\)/g)) {
      try { readFileSync(`src/content/guides/${match[1]}/${match[2]}.md`); }
      catch { errors.push(`${name}: broken internal guide link ${match[1]}/${match[2]}`); }
    }
  }
}

if (process.argv.includes("--live")) {
  const checks = [...activities.map((a) => ({ id: a.id, url: a.url })),
    ...locales.flatMap((locale) => ["klook", "kkday"].map((partner) => {
      const product = activities.find((a) => a.partner === partner)!;
      return { id: `${partner}/${locale}`, url: buildPartnerUrl(partner, product.url, "", locale)! };
    })),
  ];
  // Limit concurrent merchant requests; never retry blocks as a different crawler.
  let next = 0;
  await Promise.all(Array.from({ length: 3 }, async () => {
    while (next < checks.length) {
      const item = checks[next++];
      await new Promise<void>((resolve) => {
        setImmediate(() => {
          try {
            const result = execFileSync("curl", ["-sS", "-L", "--max-time", "20", "-A", "Mozilla/5.0 (compatible; SideQuestLinkCheck/1.0)", "-w", "\n%{http_code}\t%{url_effective}", item.url], { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 });
            const boundary = result.lastIndexOf("\n");
            const [status, target] = result.slice(boundary + 1).split("\t");
            const clean = new URL(target); clean.search = "";
            const title = result.slice(0, boundary).match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, " ").slice(0, 160) ?? "";
            const manualReview = ["403", "429", "503"].includes(status) || /access denied|captcha|just a moment/i.test(title);
            report.push({ id: item.id, status, destination: clean.toString(), title, manualReview });
            if (!manualReview && (Number(status) >= 400 || !/\/(activity|product)\//.test(clean.pathname))) errors.push(`${item.id}: product destination failed (${status})`);
            if (manualReview) warnings.push(`${item.id}: merchant blocked automated checking; verify in a browser`);
          } catch { warnings.push(`${item.id}: live request failed; manual review needed`); }
          resolve();
        });
      });
    }
  }));
}
console.log(JSON.stringify({ localizedProductLinks: checked, guides, errors, warnings, live: report }, null, 2));
if (errors.length) process.exitCode = 1;
}
main().catch(() => { console.error("Link audit could not complete."); process.exitCode = 1; });
