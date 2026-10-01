import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { locales, type Locale } from "@/lib/i18n";

// Guides are Markdown files in src/content/guides/<locale>/<slug>.md.
// Translations share the English slug so hreflang can pair them. A guide that
// isn't translated yet simply doesn't exist in that locale (no English fallback,
// to avoid duplicate content under another language's URL).

const ROOT = path.join(process.cwd(), "src/content/guides");

export interface GuideMeta {
  slug: string;
  title: string;
  description: string;
  updated: string;
  order: number;
  partners: string[];
  sources: string[];
}

function toMeta(slug: string, data: Record<string, unknown>): GuideMeta {
  return {
    slug,
    title: String(data.title),
    description: String(data.description),
    // gray-matter parses bare YAML dates into Date objects.
    updated: data.updated instanceof Date ? data.updated.toISOString().slice(0, 10) : String(data.updated),
    order: Number(data.order ?? 99),
    partners: (data.partners as string[] | undefined) ?? [],
    sources: (data.sources as string[] | undefined) ?? [],
  };
}

async function slugs(locale: Locale): Promise<string[]> {
  try {
    return (await readdir(path.join(ROOT, locale))).filter((f) => f.endsWith(".md")).map((f) => f.slice(0, -3));
  } catch {
    return [];
  }
}

export async function listGuides(locale: Locale): Promise<GuideMeta[]> {
  const metas = await Promise.all(
    (await slugs(locale)).map(async (slug) => toMeta(slug, matter(await readFile(path.join(ROOT, locale, `${slug}.md`), "utf8")).data)),
  );
  return metas.sort((a, b) => a.order - b.order);
}

export async function getGuide(locale: Locale, slug: string): Promise<(GuideMeta & { html: string }) | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  try {
    const { data, content } = matter(await readFile(path.join(ROOT, locale, `${slug}.md`), "utf8"));
    return { ...toMeta(slug, data), html: await marked.parse(content) };
  } catch {
    return null;
  }
}

/** Locales in which a guide exists, for hreflang. */
export async function guideLocales(slug: string): Promise<Locale[]> {
  const found = await Promise.all(locales.map(async (l) => ((await slugs(l)).includes(slug) ? l : null)));
  return found.filter((l): l is Locale => l !== null);
}
