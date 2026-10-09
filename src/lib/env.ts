import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Read a secret/var: Cloudflare env bindings first (Workers secrets), then process.env (local dev).
 * process.env alone is not reliable for secrets on OpenNext, so always go through this helper.
 */
export function readEnv(name: string): string {
  try {
    const value = (getCloudflareContext().env as unknown as Record<string, unknown>)[name];
    if (typeof value === "string" && value) return value;
  } catch {
    // Outside a Cloudflare request context (build time, plain Node).
  }
  return process.env[name] ?? "";
}
