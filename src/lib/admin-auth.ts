// Admin access: either HTTP Basic auth (scripts such as `npm run refresh`) or a
// signed session cookie set by the /admin/login form (browsers — Basic-auth
// popups are unreliable on phones and in-app browsers). Both use ADMIN_PASSWORD.
// Works in the edge middleware and in Node (Web Crypto only).

export const ADMIN_COOKIE = "sq_admin";
export const ADMIN_SESSION_DAYS = 30;

function safeEqual(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

export function isAdminPassword(candidate: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  return Boolean(password) && safeEqual(candidate, password!);
}

export function isAdminAuthorized(authorization: string | null): boolean {
  if (!authorization?.startsWith("Basic ")) return false;
  try {
    const decoded = atob(authorization.slice(6));
    return isAdminPassword(decoded.slice(decoded.indexOf(":") + 1));
  } catch {
    return false;
  }
}

async function sign(message: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(process.env.ADMIN_PASSWORD), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Cookie value `<expiry ms>.<hmac>`; changing ADMIN_PASSWORD signs everyone out. */
export async function createAdminSession(): Promise<string> {
  const expires = Date.now() + ADMIN_SESSION_DAYS * 86_400_000;
  return `${expires}.${await sign(`admin:${expires}`)}`;
}

export async function isAdminSession(cookie: string | undefined): Promise<boolean> {
  if (!cookie || !process.env.ADMIN_PASSWORD) return false;
  const [expires, sig] = cookie.split(".");
  if (!expires || !sig || Number(expires) < Date.now()) return false;
  return safeEqual(sig, await sign(`admin:${expires}`));
}

export async function isAdminRequest(authorization: string | null, cookie: string | undefined): Promise<boolean> {
  return isAdminAuthorized(authorization) || (await isAdminSession(cookie));
}
