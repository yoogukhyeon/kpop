"use client";

import { useEffect, useState, useTransition } from "react";
import {
  deleteMessage,
  editMessage,
  listMessages,
  postMessage,
  reportMessage,
  type GuestbookError,
  type Message,
} from "@/app/actions/guestbook";

// Birthday guestbook ("rolling paper"): nickname + password, a card colour and a
// sticker. Messages load on the client so the member page itself stays static.

const CARD_STYLE: Record<string, { bg: string; border: string }> = {
  pink: { bg: "#ffe3ef", border: "#ffb3d1" },
  lavender: { bg: "#ece5ff", border: "#c9b8ff" },
  sky: { bg: "#e1f1ff", border: "#a9d4ff" },
  mint: { bg: "#dcf7ea", border: "#9fe0c0" },
  lemon: { bg: "#fff6c9", border: "#ffe07a" },
  peach: { bg: "#ffe7da", border: "#ffbf9c" },
};
const STICKER: Record<string, string> = { cake: "🎂", heart: "💖", sparkle: "✨", party: "🎉", flower: "🌸", star: "⭐", bunny: "🐰", gift: "🎁" };
const CARDS = Object.keys(CARD_STYLE);
const STICKERS = Object.keys(STICKER);

export interface GuestbookLabels {
  title: string; desc: string; nickname: string; password: string; passwordHint: string; message: string; placeholder: string;
  card: string; sticker: string; submit: string; thanks: string; daily: string; invalid: string; blocked: string;
  wrongPassword: string; failed: string; edit: string; delete: string; save: string; cancel: string; confirmDelete: string;
  report: string; reported: string; empty: string; more: string; count: string; edited: string; note: string;
}

type Draft = { nickname: string; body: string; card: string; sticker: string };
const NICK_KEY = "sq-guestbook-nick";

export function Guestbook({ locale, group, member, labels }: { locale: string; group: string; member: string; labels: GuestbookLabels }) {
  const [items, setItems] = useState<Message[]>([]);
  const [total, setTotal] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [draft, setDraft] = useState<Draft>({ nickname: "", body: "", card: "pink", sticker: "cake" });
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [pending, start] = useTransition();

  const errorText = (e: GuestbookError) =>
    ({ invalid: labels.invalid, blocked: labels.blocked, daily: labels.daily, password: labels.wrongPassword, failed: labels.failed })[e];

  useEffect(() => {
    listMessages(group, member).then((r) => {
      setItems(r.items);
      setTotal(r.total);
      setLoaded(true);
    });
    try {
      const nick = localStorage.getItem(NICK_KEY);
      if (nick) setDraft((d) => ({ ...d, nickname: nick }));
    } catch {}
  }, [group, member]);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    const website = String(new FormData(e.currentTarget).get("website") ?? "");
    start(async () => {
      const r = await postMessage({ ...draft, password, group, member, locale, website });
      if (!r.ok) return setNotice({ tone: "error", text: errorText(r.error) });
      if (r.message) setItems((xs) => [r.message!, ...xs]);
      setTotal((n) => n + 1);
      setDraft((d) => ({ ...d, body: "" }));
      setPassword("");
      setNotice({ tone: "ok", text: labels.thanks });
      try {
        localStorage.setItem(NICK_KEY, draft.nickname);
      } catch {}
    });
  }

  function more() {
    const last = items.at(-1);
    if (!last || pending) return;
    start(async () => {
      const r = await listMessages(group, member, last.created_at);
      setItems((xs) => [...xs, ...r.items.filter((m) => !xs.some((x) => x.id === m.id))]);
    });
  }

  return (
    <section id="messages" className="grid gap-5 rounded-[2rem] p-5 sm:p-7" style={{ background: "linear-gradient(160deg, #fff3f8 0%, #f3eeff 60%, #eaf4ff 100%)" }}>
      <header className="grid gap-1">
        <h2 className="text-xl font-extrabold sm:text-2xl">💌 {labels.title}</h2>
        <p className="text-sm text-muted">{labels.desc}</p>
      </header>

      <form onSubmit={submit} className="grid gap-3 rounded-3xl bg-white/90 p-4 shadow-[0_8px_24px_rgba(255,111,170,0.12)] sm:p-5">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-xs font-bold text-muted">{labels.nickname}</span>
            <input className="input" maxLength={20} required value={draft.nickname} onChange={(e) => setDraft({ ...draft, nickname: e.target.value })} />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-bold text-muted">{labels.password}</span>
            <input className="input" type="password" minLength={4} maxLength={30} required autoComplete="new-password" placeholder={labels.passwordHint} value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
        </div>
        <label className="grid gap-1">
          <span className="flex justify-between text-xs font-bold text-muted">
            {labels.message}
            <span>{draft.body.length}/300</span>
          </span>
          <textarea
            className="input min-h-28 resize-y py-3 leading-relaxed"
            maxLength={300}
            required
            placeholder={labels.placeholder}
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            style={{ background: CARD_STYLE[draft.card].bg }}
          />
        </label>
        <Picker label={labels.card} value={draft.card} options={CARDS} onChange={(card) => setDraft({ ...draft, card })} render={(c) => <span className="h-6 w-6 rounded-full border-2" style={{ background: CARD_STYLE[c].bg, borderColor: CARD_STYLE[c].border }} />} />
        <Picker label={labels.sticker} value={draft.sticker} options={STICKERS} onChange={(sticker) => setDraft({ ...draft, sticker })} render={(s) => <span className="text-xl leading-none">{STICKER[s]}</span>} />
        {notice && <p className={`rounded-2xl px-4 py-2 text-sm font-semibold ${notice.tone === "ok" ? "bg-mint-soft text-ok" : "bg-pink-soft text-warn"}`}>{notice.text}</p>}
        <button className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink to-brand px-6 font-extrabold text-white shadow-[0_8px_20px_rgba(255,111,170,0.3)] transition hover:-translate-y-0.5 disabled:opacity-60 sm:w-fit" disabled={pending}>
          {pending && <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
          {STICKER[draft.sticker]} {labels.submit}
        </button>
        <p className="text-[11px] leading-relaxed text-muted">🔒 {labels.note}</p>
      </form>

      {loaded && (
        <p className="text-sm font-bold text-brand">{labels.count.replace("{n}", String(total))}</p>
      )}
      {loaded && items.length === 0 && <p className="rounded-3xl bg-white/70 p-6 text-center font-semibold text-muted">🎈 {labels.empty}</p>}
      <ul className="columns-1 gap-3 sm:columns-2 lg:columns-3">
        {items.map((m) => (
          <MessageCard
            key={m.id}
            m={m}
            locale={locale}
            labels={labels}
            errorText={errorText}
            onChange={(next) => setItems((xs) => (next ? xs.map((x) => (x.id === next.id ? next : x)) : xs.filter((x) => x.id !== m.id)))}
            onDeleted={() => setTotal((n) => n - 1)}
          />
        ))}
      </ul>
      {items.length < total && (
        <button type="button" onClick={more} disabled={pending} className="btn-ghost mx-auto">{labels.more}</button>
      )}
    </section>
  );
}

function Picker({ label, value, options, onChange, render }: { label: string; value: string; options: string[]; onChange: (v: string) => void; render: (v: string) => React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <span className="text-xs font-bold text-muted">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            aria-label={o}
            onClick={() => onChange(o)}
            className={`grid h-10 w-10 place-items-center rounded-full border-2 bg-white transition ${value === o ? "scale-110 border-brand shadow-[0_0_0_3px_rgba(124,92,255,0.2)]" : "border-line hover:border-brand"}`}
          >
            {render(o)}
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageCard({ m, locale, labels, errorText, onChange, onDeleted }: {
  m: Message;
  locale: string;
  labels: GuestbookLabels;
  errorText: (e: GuestbookError) => string;
  onChange: (next: Message | null) => void;
  onDeleted: () => void;
}) {
  const [mode, setMode] = useState<"view" | "edit" | "delete">("view");
  const [draft, setDraft] = useState<Draft>({ nickname: m.nickname, body: m.body, card: m.card, sticker: m.sticker });
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [reported, setReported] = useState(false);
  const [pending, start] = useTransition();
  const style = CARD_STYLE[mode === "edit" ? draft.card : m.card] ?? CARD_STYLE.pink;
  // A slight, stable tilt per card, like notes pinned on a rolling paper.
  const tilt = ((m.id.charCodeAt(0) + m.id.charCodeAt(1)) % 5) - 2;

  const run = (fn: () => Promise<void>) => start(async () => { setError(""); await fn(); });

  return (
    <li
      className="relative mb-3 break-inside-avoid rounded-3xl border-2 p-4 shadow-[0_6px_18px_rgba(124,92,255,0.08)]"
      style={{ background: style.bg, borderColor: style.border, transform: mode === "view" ? `rotate(${tilt * 0.5}deg)` : undefined }}
    >
      <span aria-hidden className="absolute -right-2 -top-3 text-3xl drop-shadow-sm">{STICKER[mode === "edit" ? draft.sticker : m.sticker] ?? "🎂"}</span>
      {mode === "edit" ? (
        <div className="grid gap-2">
          <input className="input h-10 bg-white" maxLength={20} value={draft.nickname} onChange={(e) => setDraft({ ...draft, nickname: e.target.value })} />
          <textarea className="input min-h-24 bg-white py-2" maxLength={300} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
          <div className="flex flex-wrap gap-1">
            {CARDS.map((c) => (
              <button key={c} type="button" aria-label={c} onClick={() => setDraft({ ...draft, card: c })} className={`h-7 w-7 rounded-full border-2 ${draft.card === c ? "border-brand" : "border-white"}`} style={{ background: CARD_STYLE[c].bg }} />
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {STICKERS.map((s) => (
              <button key={s} type="button" aria-label={s} onClick={() => setDraft({ ...draft, sticker: s })} className={`grid h-8 w-8 place-items-center rounded-full bg-white ${draft.sticker === s ? "ring-2 ring-brand" : ""}`}>{STICKER[s]}</button>
            ))}
          </div>
          <PasswordRow labels={labels} password={password} setPassword={setPassword} />
        </div>
      ) : (
        <>
          <p className="whitespace-pre-wrap break-words pr-4 leading-relaxed">{m.body}</p>
          <p className="mt-3 text-xs font-bold text-muted">
            💜 {m.nickname} · {new Date(m.created_at).toLocaleDateString(locale, { month: "short", day: "numeric" })}
            {m.updated_at && ` · ${labels.edited}`}
          </p>
        </>
      )}

      {mode === "delete" && <div className="mt-3"><p className="mb-1 text-xs font-bold">{labels.confirmDelete}</p><PasswordRow labels={labels} password={password} setPassword={setPassword} /></div>}
      {error && <p className="mt-2 text-xs font-bold text-warn">{error}</p>}

      <div className="mt-2 flex flex-wrap gap-x-3 text-xs font-bold text-muted">
        {mode === "view" ? (
          <>
            <button type="button" className="min-h-8 hover:text-brand" onClick={() => setMode("edit")}>{labels.edit}</button>
            <button type="button" className="min-h-8 hover:text-brand" onClick={() => setMode("delete")}>{labels.delete}</button>
            <button
              type="button"
              className="ml-auto min-h-8 hover:text-warn disabled:opacity-60"
              disabled={reported || pending}
              onClick={() => run(async () => { await reportMessage(m.id); setReported(true); })}
            >
              {reported ? labels.reported : `🚩 ${labels.report}`}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              disabled={pending || password.length < 4}
              className="min-h-8 text-brand disabled:opacity-50"
              onClick={() =>
                run(async () => {
                  if (mode === "edit") {
                    const r = await editMessage({ id: m.id, password, ...draft });
                    if (!r.ok) return setError(errorText(r.error));
                    onChange(r.message ?? null);
                  } else {
                    const r = await deleteMessage({ id: m.id, password });
                    if (!r.ok) return setError(errorText(r.error));
                    onChange(null);
                    onDeleted();
                  }
                  setMode("view");
                  setPassword("");
                })
              }
            >
              {mode === "edit" ? labels.save : labels.delete}
            </button>
            <button type="button" className="min-h-8" onClick={() => { setMode("view"); setPassword(""); setError(""); setDraft({ nickname: m.nickname, body: m.body, card: m.card, sticker: m.sticker }); }}>{labels.cancel}</button>
          </>
        )}
      </div>
    </li>
  );
}

function PasswordRow({ labels, password, setPassword }: { labels: GuestbookLabels; password: string; setPassword: (v: string) => void }) {
  return (
    <input
      type="password"
      className="input h-10 bg-white"
      placeholder={labels.password}
      autoComplete="current-password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
  );
}
