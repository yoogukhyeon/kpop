import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — K-pop trip planner for Seoul`,
    short_name: site.name,
    description: "Plan a K-pop trip to Seoul around your bias: concerts, birthday cafes, pop-ups and fan spots, day by day.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffbfe",
    theme_color: "#7c5cff",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/logo.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
