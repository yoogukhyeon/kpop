import { marked } from "marked";

// CommonMark doesn't close `**bold**` when the closing `**` follows punctuation
// and is directly followed by a letter — which is normal in Chinese, Japanese and
// Korean ("**地鐵：**奧林匹克", "**{{email}}**로"). Converting bold spans to <strong>
// before parsing makes them render in every language.
const BOLD = /\*\*(?=\S)([^*\n]+?)(?<=\S)\*\*/g;

export async function renderMarkdown(source: string): Promise<string> {
  return marked.parse(source.replace(BOLD, "<strong>$1</strong>"));
}
