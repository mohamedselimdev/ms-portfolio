import { SignJWT, jwtVerify } from "jose";
import { readEnv } from "./env";

export const SESSION_COOKIE = "ms_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret() {
  const value = readEnv("AUTH_SECRET");
  if (!value || value.length < 32) {
    if (process.env.NODE_ENV === "production") throw new Error("AUTH_SECRET must be set (32+ characters).");
    return new TextEncoder().encode("dev-only-insecure-secret-change-me-please-0000");
  }
  return new TextEncoder().encode(value);
}

export async function signSession(email: string) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .setSubject("admin")
    .sign(secret());
}

export async function verifySession(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    return payload.sub === "admin" ? { email: String(payload.email ?? "") } : null;
  } catch {
    return null;
  }
}
