// Pastel helpers built on a group's accent color (CSS color-mix, no JS color math).

/** Light pastel tint of the accent: `strength` is the % of accent mixed into white. */
export const pastel = (accent: string, strength = 30) => `color-mix(in srgb, ${accent} ${strength}%, #ffffff)`;

/** Deep shade of the accent for text on pastel backgrounds. */
export const ink = (accent: string) => `color-mix(in srgb, ${accent} 70%, #1b1530)`;

/** Soft two-tone pastel gradient for covers and banners. */
export const pastelGradient = (accent: string) =>
  `radial-gradient(circle at 88% 18%, rgba(255,255,255,0.75) 0 10%, transparent 11%),
   radial-gradient(circle at 12% 108%, rgba(255,255,255,0.55) 0 28%, transparent 29%),
   linear-gradient(135deg, ${pastel(accent, 22)} 0%, ${pastel(accent, 45)} 100%)`;

/** Mixes two #rrggbb colors in JS (`weight` = share of `a`). For places without CSS color-mix, like OG images. */
export function mixHex(a: string, b: string, weight: number): string {
  const parse = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [parse(a), parse(b)];
  return `#${x.map((v, i) => Math.round(v * weight + y[i] * (1 - weight)).toString(16).padStart(2, "0")).join("")}`;
}
