import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from "@/i18n/config";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

/** English is the default. Arabic only when the visitor chose it with the language switcher (cookie). */
function preferredLocale(request: NextRequest) {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  return isLocale(saved) ? saved : DEFAULT_LOCALE;
}

// Kept as edge `middleware` (not Next 16 `proxy`): Cloudflare/OpenNext officially supports edge middleware only.
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const [, segment, area, page] = pathname.split("/");

  if (!isLocale(segment)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
    url.search = search;
    return NextResponse.redirect(url);
  }

  if (area === "admin" && page !== "login") {
    const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = `/${segment}/admin/login`;
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|media|images|_next|favicon.ico|icon.svg|apple-icon|opengraph-image|robots.txt|sitemap.xml|manifest.webmanifest|.*\\..*).*)"],
};
