import { NextResponse, type NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/session";
import { rateLimit } from "@/lib/auth";
import { recordHit } from "@/lib/store";

const VISIT_COOKIE = "ms_v";
const BOT_RE = /bot|crawl|spider|slurp|preview|headless|lighthouse/i;

/** Anonymous page-view counter. Stores only aggregate counts per day, path and referrer domain. */
export async function POST(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";
  if (BOT_RE.test(ua)) return new NextResponse(null, { status: 204 });
  if (await verifySession(request.cookies.get(SESSION_COOKIE)?.value)) return new NextResponse(null, { status: 204 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!rateLimit(`track:${ip}`, 120, 60_000)) return new NextResponse(null, { status: 429 });

  let body: { path?: unknown; referrer?: unknown };
  try {
    body = await request.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  const path = typeof body.path === "string" ? body.path.slice(0, 200) : "";
  if (!/^\/(en|ar)(\/|$)/.test(path) || path.includes("/admin")) return new NextResponse(null, { status: 204 });

  let referrer = "";
  try {
    const host = new URL(String(body.referrer || "")).hostname;
    if (host && host !== request.nextUrl.hostname) referrer = host.replace(/^www\./, "");
  } catch {
    /* no or invalid referrer */
  }

  const day = new Date().toISOString().slice(0, 10);
  const newVisitor = request.cookies.get(VISIT_COOKIE)?.value !== day;
  const normalized = path.replace(/^\/(en|ar)/, "") || "/";
  const locale = path.slice(1, 3);

  await recordHit({ day, path: normalized, referrer, locale, newVisitor });

  const res = new NextResponse(null, { status: 204 });
  if (newVisitor) res.cookies.set(VISIT_COOKIE, day, { path: "/", maxAge: 60 * 60 * 24, sameSite: "lax", httpOnly: true });
  return res;
}
