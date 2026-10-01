import { NextResponse, type NextRequest } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { isLocale, pickLocale } from "@/lib/i18n";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (isAdminAuthorized(req.headers.get("authorization"))) return;
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="BiasTrip admin"' },
    });
  }

  const first = pathname.split("/")[1] ?? "";
  if (isLocale(first)) return;
  const url = req.nextUrl.clone();
  const locale = pickLocale(req.headers.get("accept-language"));
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  // 302 (not 308): the target depends on the visitor's language.
  return NextResponse.redirect(url, 302);
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};
