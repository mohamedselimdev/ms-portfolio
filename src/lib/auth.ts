import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { readEnv } from "./env";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifySession } from "./session";

export async function getSession() {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

export async function isAdmin() {
  return (await getSession()) !== null;
}

/** Guard for admin pages and server actions. */
export async function requireAdmin(locale = "en") {
  const session = await getSession();
  if (!session) redirect(`/${locale}/admin/login`);
  return session;
}

/** Constant-time string comparison. */
function safeEqual(a: string, b: string) {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

const hex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((x) => x.toString(16).padStart(2, "0")).join("");
const fromHex = (h: string) => new Uint8Array((h.match(/../g) ?? []).map((x) => parseInt(x, 16)));

/** PBKDF2-SHA256 via Web Crypto (works on Cloudflare Workers and Node). Format: pbkdf2:<iterations>:<saltHex>:<hashHex> */
export async function pbkdf2(password: string, salt: Uint8Array, iterations: number) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  return hex(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations }, key, 256));
}

export async function checkCredentials(email: string, password: string) {
  const adminEmail = readEnv("ADMIN_EMAIL").trim().toLowerCase();
  const stored = readEnv("ADMIN_PASSWORD_HASH");
  if (!adminEmail || !stored) return false;
  const [scheme, iter, salt, hash] = stored.split(":");
  const iterations = Number(iter);
  if (scheme !== "pbkdf2" || !salt || !hash || !(iterations > 0 && iterations <= 100000)) return false;
  // Always derive the hash to keep timing uniform.
  const candidate = await pbkdf2(password, fromHex(salt), iterations);
  const passwordOk = safeEqual(candidate, hash);
  return passwordOk && safeEqual(email.trim().toLowerCase(), adminEmail);
}

export function isAuthConfigured() {
  return Boolean(readEnv("ADMIN_EMAIL") && readEnv("ADMIN_PASSWORD_HASH"));
}

export async function createSession(email: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, await signSession(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function clientIp() {
  const h = await headers();
  return (h.get("x-forwarded-for")?.split(",")[0] || h.get("x-real-ip") || "local").trim();
}

// Fixed-window in-memory rate limiter (per server instance).
const buckets = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= limit;
}
