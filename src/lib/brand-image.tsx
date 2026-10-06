// Brand mark drawn with plain elements so next/og can render it as PNG
// (logo for Organization schema, Apple touch icon, default share image).

export function BrandMark({ size }: { size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: size * 0.25,
        background: "linear-gradient(135deg, #a48bff, #7c5cff)",
      }}
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 64 64">
        <path d="M32 6l7.5 16.5L57 24.6 44.5 36l3.4 17.8L32 45 16.1 53.8 19.5 36 7 24.6l17.5-2.1z" fill="#ffffff" />
      </svg>
    </div>
  );
}
