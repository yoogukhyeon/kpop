"use client";

import { useState } from "react";

export function ShareActions({
  cardUrl,
  fileName,
  labels,
}: {
  cardUrl: string;
  fileName: string;
  labels: { download: string; copy: string; copied: string };
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const url = new URL(window.location.href);
    url.searchParams.set("ref", "share");
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(labels.copy, url.toString());
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <a className="btn" href={cardUrl} download={fileName}>{labels.download}</a>
      <button type="button" className="btn-ghost" onClick={copy}>{copied ? labels.copied : labels.copy}</button>
    </div>
  );
}
