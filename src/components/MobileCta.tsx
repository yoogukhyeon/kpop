import Link from "next/link";

/** Fixed bottom bar on small screens, like a booking bar on travel product pages. */
export function MobileCta({ href, label, note }: { href: string; label: string; note?: string }) {
  return (
    <>
      <div className="h-20 lg:hidden" aria-hidden />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          {note && <p className="min-w-0 flex-1 truncate text-xs text-muted">{note}</p>}
          <Link href={href} className="btn flex-1">{label}</Link>
        </div>
      </div>
    </>
  );
}
