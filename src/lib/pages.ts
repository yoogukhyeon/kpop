import { readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { renderMarkdown } from "@/lib/markdown";
import { locales, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

// Site pages (about, privacy, terms, disclosure) as Markdown in
// src/content/pages/<locale>/<slug>.md. `{{email}}` is replaced with the contact address.

export const PAGE_SLUGS = ["about", "privacy", "terms", "disclosure"] as const;
export type PageSlug = (typeof PAGE_SLUGS)[number];

const ROOT = path.join(process.cwd(), "src/content/pages");

export async function getPage(locale: Locale, slug: PageSlug) {
  try {
    const { data, content } = matter(await readFile(path.join(ROOT, locale, `${slug}.md`), "utf8"));
    const body = content.replaceAll("{{email}}", site.contactEmail);
    return {
      title: String(data.title),
      description: String(data.description),
      updated: data.updated instanceof Date ? data.updated.toISOString().slice(0, 10) : String(data.updated),
      html: await renderMarkdown(body),
    };
  } catch {
    return null;
  }
}

/** Locales in which a page exists, for hreflang and the sitemap. */
export async function pageLocales(slug: PageSlug): Promise<Locale[]> {
  const found = await Promise.all(locales.map(async (l) => ((await getPage(l, slug)) ? l : null)));
  return found.filter((l): l is Locale => l !== null);
}
