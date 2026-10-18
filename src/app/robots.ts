import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Search engines and AI assistants are explicitly welcome (GEO): being crawlable
// by answer engines is how guides get cited in ChatGPT, Perplexity, Gemini etc.
const AI_AND_SEARCH_BOTS = [
  "Googlebot", "Bingbot", "Yeti", // Yeti = Naver
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "ClaudeBot", "Claude-SearchBot", "Claude-User",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended", "Applebot", "Applebot-Extended",
];

// Link-preview bots that fetch share images from /api/card.
const PREVIEW_BOTS = ["Twitterbot", "facebookexternalhit", "Discordbot", "Slackbot", "LinkedInBot", "TelegramBot", "WhatsApp", "Line"];

export default function robots(): MetadataRoute.Robots {
  // Plans must be crawlable for their noindex to be read. They remain outside the sitemap.
  const disallow = ["/admin", "/api/"];
  return {
    rules: [
      { userAgent: PREVIEW_BOTS, allow: ["/api/card", "/"], disallow: ["/admin"] },
      { userAgent: AI_AND_SEARCH_BOTS, allow: "/", disallow },
      { userAgent: "*", allow: "/", disallow },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
