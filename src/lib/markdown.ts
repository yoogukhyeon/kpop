import { marked } from "marked";

// CommonMark doesn't close `**bold**` when the closing `**` follows punctuation
// and is directly followed by a letter — which is normal in Chinese, Japanese and
// Korean ("**地鐵：**奧林匹克", "**{{email}}**로"). Converting bold spans to <strong>
// before parsing makes them render in every language.
const BOLD = /\*\*(?=\S)([^*\n]+?)(?<=\S)\*\*/g;

export async function renderMarkdown(source: string): Promise<string> {
  return marked.parse(source.replace(BOLD, "<strong>$1</strong>"));
}

/** Gives every <h2> an id (s-1, s-2, …) and returns the headings for a table of contents. */
export function withHeadingIds(html: string): { html: string; headings: { id: string; text: string }[] } {
  const headings: { id: string; text: string }[] = [];
  const out = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, inner: string) => {
    const id = `s-${headings.length + 1}`;
    headings.push({ id, text: inner.replace(/<[^>]+>/g, "").trim() });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { html: out, headings };
}
