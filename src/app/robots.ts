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
  // Personal trip plans (/<locale>/plan) are rendered per request and noindex, and
  // /api/card renders images — keep crawlers off both to save function time.
  const disallow = ["/admin", "/*/plan", "/api/"];
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
