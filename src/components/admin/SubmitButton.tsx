"use client";

import { useFormStatus } from "react-dom";

/** Form button with a spinner while the server action runs; optional confirm prompt. */
export function SubmitButton({ children, className = "btn", confirm, pendingLabel }: { children: React.ReactNode; className?: string; confirm?: string; pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      className={`${className} disabled:cursor-wait disabled:opacity-60`}
      disabled={pending}
      onClick={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
    >
      {pending && <span aria-hidden className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}
