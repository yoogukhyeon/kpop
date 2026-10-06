import { ink, pastelGradient } from "@/lib/color";

// Typographic pastel cover in a group's accent color. Used instead of artist
// photos, which we don't have rights to.

export function Cover({
  accent,
  title,
  subtitle,
  size = "md",
  className = "",
}: {
  accent: string;
  title: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  // Long single words (ZEROBASEONE) get a smaller size rather than breaking mid-word.
  const longest = Math.max(...title.split(/\s+/).map((w) => w.length));
  const titleSize = {
    sm: longest > 9 ? "text-base sm:text-xl" : longest > 7 ? "text-lg sm:text-xl" : "text-xl",
    md: longest > 9 ? "text-2xl sm:text-3xl" : "text-3xl",
    lg: longest > 9 ? "text-4xl sm:text-6xl" : "text-5xl sm:text-6xl",
  }[size];
  return (
    <div
      className={`relative flex flex-col justify-end overflow-hidden p-4 sm:p-5 ${className}`}
      style={{ background: pastelGradient(accent), color: ink(accent) }}
    >
      <span aria-hidden className={`absolute right-4 top-3 ${size === "lg" ? "text-4xl" : "text-xl"}`}>✨</span>
      {subtitle && <span className="text-xs font-bold opacity-80 sm:text-sm">{subtitle}</span>}
      <span className={`font-black leading-none tracking-tight ${titleSize}`}>{title}</span>
    </div>
  );
}
