// Usage: npm run hash-password -- "your-password"
// Produces a PBKDF2-SHA256 hash compatible with Cloudflare Workers (Web Crypto, max 100k iterations).
import { webcrypto as crypto } from "node:crypto";

const password = process.argv[2];
if (!password || password.length < 10) {
  console.error("Provide a password of at least 10 characters.");
  process.exit(1);
}
const iterations = 100000;
const salt = crypto.getRandomValues(new Uint8Array(16));
const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256);
const hex = (b) => Buffer.from(b).toString("hex");
console.log(`ADMIN_PASSWORD_HASH=pbkdf2:${iterations}:${hex(salt)}:${hex(bits)}`);
