"use client";

import { useActionState } from "react";
import { login } from "./actions";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, {});
  return (
    <form action={action} className="card grid gap-4">
      <input type="hidden" name="next" value={next} />
      {/* Username field lets password managers save the login. */}
      <input type="text" name="username" autoComplete="username" defaultValue="admin" className="hidden" aria-hidden tabIndex={-1} readOnly />
      <label className="grid gap-1.5">
        <span className="text-sm font-bold">비밀번호</span>
        <input type="password" name="password" required autoFocus autoComplete="current-password" className="input" />
      </label>
      {state.error && <p className="text-sm font-semibold text-warn">{state.error}</p>}
      <button className="btn" disabled={pending}>{pending ? "확인 중…" : "로그인"}</button>
      <p className="text-xs text-muted">로그인 상태는 30일 동안 유지됩니다.</p>
    </form>
  );
}
