import type { ActivityCategory } from "@/lib/types";

// Shared look for activity visuals: the generated thumbnail (next/og) and the
// small tile in compact cards. Plain SVG + inline styles so both renderers work.

export const ACTIVITY_TONE: Record<ActivityCategory, { from: string; to: string; glow: string; accent: string }> = {
  ticket: { from: "#1b1036", to: "#4a1f7a", glow: "#ff6fd8", accent: "#ffd36b" },
  experience: { from: "#2b0c2c", to: "#8a2160", glow: "#ffb86b", accent: "#ff9fd0" },
  tour: { from: "#0c1838", to: "#1f56a8", glow: "#7af0ff", accent: "#a8d8ff" },
};

/** Stage-light background: dark gradient with two coloured spotlights. */
export function stageBackground(c: ActivityCategory) {
  const t = ACTIVITY_TONE[c];
  return [
    `radial-gradient(circle at 85% 15%, ${t.glow}66 0%, transparent 45%)`,
    `radial-gradient(circle at 10% 100%, ${t.accent}55 0%, transparent 50%)`,
    `linear-gradient(135deg, ${t.from} 0%, ${t.to} 100%)`,
  ].join(", ");
}

/** Category icon: ticket stub, microphone (classes/experiences), map pin (tours). */
export function ActivityIcon({ category, size, color = "#ffffff" }: { category: ActivityCategory; size: number; color?: string }) {
  const accent = ACTIVITY_TONE[category].accent;
  if (category === "ticket") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64">
        <path d="M8 18a4 4 0 0 1 4-4h40a4 4 0 0 1 4 4v7a7 7 0 0 0 0 14v7a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4v-7a7 7 0 0 0 0-14z" fill={color} />
        <path d="M42 16v32" stroke={accent} strokeWidth="3" strokeDasharray="4 4" />
        <path d="M24 24l2.6 5.4 5.9.8-4.3 4.1 1 5.8L24 37.4l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z" fill={accent} />
      </svg>
    );
  }
  if (category === "experience") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64">
        <rect x="22" y="6" width="20" height="32" rx="10" fill={color} />
        <path d="M27 14h10M27 20h10M27 26h10" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M14 30a18 18 0 0 0 36 0" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
        <path d="M32 48v9M22 58h20" stroke={color} strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <path d="M32 4c-11 0-20 8.6-20 19.6C12 38 32 60 32 60s20-22 20-36.4C52 12.6 43 4 32 4z" fill={color} />
      <circle cx="32" cy="23" r="8" fill={accent} />
    </svg>
  );
}

/** Small sparkle used as decoration. */
export function Sparkle({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 0c.8 6.4 5.6 11.2 12 12-6.4.8-11.2 5.6-12 12-.8-6.4-5.6-11.2-12-12C6.4 11.2 11.2 6.4 12 0z" fill={color} />
    </svg>
  );
}
