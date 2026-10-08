import { readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { listGuides } from "@/lib/guides";
import { site } from "@/lib/site";

// All English guides as one Markdown document, for AI assistants that prefer
// to ingest a site's content in a single fetch. Linked from /llms.txt.

export const dynamic = "force-static";

export async function GET() {
  const guides = [
    ...(await listGuides("en")).map((g) => ({ ...g, lang: "en" })),
    ...(await listGuides("ko")).map((g) => ({ ...g, lang: "ko" })),
  ];
  const parts = await Promise.all(
    guides.map(async (g) => {
      const { content } = matter(await readFile(path.join(process.cwd(), "src/content/guides", g.lang, `${g.slug}.md`), "utf8"));
      // Make relative links absolute so they still work out of context.
      const body = content.replace(/!\[[^\]]*\]\(fig:\d+\)\n?/g, "").replace(/\]\(\//g, `](${site.url}/`);
      return `# ${g.title}\n\nSource: ${site.url}/${g.lang}/guides/${g.slug} · Language: ${g.lang} · Last checked: ${g.updated}\n\n> ${g.description}\n${body}`;
    }),
  );
  const doc = `# ${site.name} — K-pop travel guides for Seoul\n\n${site.name} is a free, fan-made K-pop trip planner for international fans visiting Seoul. Not affiliated with any artist or agency. Contact: ${site.contactEmail}\n\n---\n\n${parts.join("\n\n---\n\n")}\n`;
  return new Response(doc, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
