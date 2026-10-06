import { NextResponse, type NextRequest } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { isLocale, pickLocale } from "@/lib/i18n";

// The domain previously hosted an unrelated WordPress site (2021–2022). Its old
// URLs answer 410 Gone so search engines drop them for good instead of retrying.
const LEGACY_PATH = /^\/(\d{4}\/\d{2}\/\d{2}\/|wp-(content|admin|includes|json)\b|wp-login\.php|xmlrpc\.php|feed\b|comments\/feed|18-usc-2257|category\/|tag\/|author\/)/;

/** Production host every other host (www, *.vercel.app) is redirected to. */
const CANONICAL_HOST = process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).host : null;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (LEGACY_PATH.test(pathname) || req.nextUrl.searchParams.has("p")) {
    return new NextResponse("Gone", { status: 410, headers: { "X-Robots-Tag": "noindex" } });
  }

  // Normalise trailing slashes (the built-in redirect is disabled in next.config).
  if (pathname.length > 1 && pathname.endsWith("/")) {
    // Plain URL: NextURL would re-append the slash and loop.
    const url = new URL(req.url);
    url.pathname = pathname.replace(/\/+$/, "");
    return NextResponse.redirect(url, 308);
  }

  const host = req.headers.get("host");
  if (process.env.VERCEL_ENV === "production" && CANONICAL_HOST && host && host !== CANONICAL_HOST) {
    const url = req.nextUrl.clone();
    url.host = CANONICAL_HOST;
    url.protocol = "https";
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (isAdminAuthorized(req.headers.get("authorization"))) return;
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="SideQuest Day admin"' },
    });
  }

  // Files and APIs below only needed the checks above.
  if (/\.[a-z0-9]+$/i.test(pathname) || pathname.startsWith("/api/") || /^\/(apple-icon|icon)\b/.test(pathname)) return;

  const first = pathname.split("/")[1] ?? "";
  if (isLocale(first)) return;
  const url = req.nextUrl.clone();
  const locale = pickLocale(req.headers.get("accept-language"));
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  // 302 (not 308): the target depends on the visitor's language.
  return NextResponse.redirect(url, 302);
}

export const config = {
  // Everything except Next internals, so legacy file URLs (wp-login.php, uploads)
  // and non-canonical hosts are handled too.
  matcher: ["/((?!_next/static|_next/image).*)"],
};
