"use client";

import { useRef, useState } from "react";

/**
 * Downloads a generated image. Cards render on the server and can take a few
 * seconds, so the button starts fetching on hover/touch, shows a spinner while
 * busy and ignores repeat clicks (no duplicate downloads).
 */
export function DownloadButton({ url, fileName, className, children }: { url: string; fileName: string; className: string; children: React.ReactNode }) {
  const [busy, setBusy] = useState(false);
  const pending = useRef<Promise<Blob> | null>(null);

  const prefetch = () => {
    pending.current ??= fetch(url).then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.blob();
    });
    pending.current.catch(() => (pending.current = null));
    return pending.current;
  };

  async function download(e: React.MouseEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const blob = await prefetch();
      const href = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement("a"), { href, download: fileName });
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(href), 10_000);
    } catch {
      window.open(url, "_blank", "noopener");
    } finally {
      setBusy(false);
    }
  }

  return (
    <a
      href={url}
      download={fileName}
      onClick={download}
      onPointerEnter={prefetch}
      onTouchStart={prefetch}
      onFocus={prefetch}
      aria-busy={busy}
      aria-disabled={busy}
      className={`${className} ${busy ? "pointer-events-none cursor-wait opacity-70" : ""}`}
    >
      {busy && <span aria-hidden className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </a>
  );
}
