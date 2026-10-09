// Builds the Cloudflare bundle without local dev env files, so test credentials never ship.
// OpenNext embeds every .env* file it finds into the worker bundle.
import { existsSync, renameSync } from "node:fs";
import { execSync } from "node:child_process";

const hidden = [".env.local", ".env.development.local", ".env.development"].filter(existsSync);
hidden.forEach((f) => renameSync(f, `${f}.hidden`));
try {
  execSync("npx opennextjs-cloudflare build", { stdio: "inherit" });
} finally {
  hidden.forEach((f) => renameSync(`${f}.hidden`, f));
}
