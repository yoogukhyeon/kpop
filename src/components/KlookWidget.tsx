"use client";

import { useEffect, useRef, useState } from "react";

// Klook affiliate "dynamic widget" (configured in the Klook partner dashboard).
// The init script turns every `ins.klk-aff-widget` on the page into an iframe
// when it runs, so we only render the placeholder once it nears the viewport
// (no third-party JS on first load) and add a fresh copy of the script per
// mount, which also re-initialises widgets after client-side navigation.

const INIT_SCRIPT = "https://affiliate.klook.com/widget/fetch-iframe-init.js";

export function KlookWidget({ adid, amount = 4, title }: { adid: string; amount?: number; title: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el || visible) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const script = document.createElement("script");
    script.src = INIT_SCRIPT;
    script.async = true;
    document.body.appendChild(script);
    return () => script.remove();
  }, [visible]);

  return (
    <section ref={box} className="grid gap-3" aria-label={title}>
      <h2 className="section-title">🧳 {title}</h2>
      <div className="min-h-[200px] overflow-hidden rounded-3xl border border-line bg-surface">
        {visible && (
          // Attributes copied from the Klook dashboard; empty lang/currency = visitor's browser settings.
          <ins
            className="klk-aff-widget"
            data-adid={adid}
            data-lang=""
            data-currency=""
            data-cardh="126"
            data-padding="92"
            data-lgh="470"
            data-edgevalue="655"
            data-dest_id="-1"
            data-tid="-1"
            data-amount={String(amount)}
            data-prod="dynamic_widget"
          >
            <a href="https://www.klook.com/" rel="sponsored nofollow noopener">Klook.com</a>
          </ins>
        )}
      </div>
    </section>
  );
}
