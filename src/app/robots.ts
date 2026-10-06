import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Search engines and AI assistants are explicitly welcome (GEO): being crawlable
// by answer engines is how guides get cited in ChatGPT, Perplexity, Gemini etc.
// /api/card must stay crawlable: X/Discord fetch share images and honor robots.txt.
const AI_AND_SEARCH_BOTS = [
  "Googlebot", "Bingbot", "Yeti", // Yeti = Naver
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "ClaudeBot", "Claude-SearchBot", "Claude-User",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended", "Applebot", "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: AI_AND_SEARCH_BOTS, allow: "/", disallow: ["/admin"] },
      { userAgent: "*", allow: "/", disallow: ["/admin"] },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
