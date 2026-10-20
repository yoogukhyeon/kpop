"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, ADMIN_SESSION_DAYS, createAdminSession, isAdminPassword } from "@/lib/admin-auth";

export async function login(_prev: { error?: string }, form: FormData): Promise<{ error?: string }> {
  const password = String(form.get("password") ?? "");
  const next = String(form.get("next") ?? "/admin");
  if (!isAdminPassword(password)) {
    // Slow down guessing.
    await new Promise((r) => setTimeout(r, 800));
    return { error: "비밀번호가 맞지 않습니다." };
  }
  (await cookies()).set(ADMIN_COOKIE, await createAdminSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: ADMIN_SESSION_DAYS * 86_400,
  });
  redirect(next.startsWith("/admin") && !next.startsWith("/admin/login") ? next : "/admin");
}

export async function logout() {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin/login");
}
