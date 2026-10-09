import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createSeed } from "./seed";
import type { ActivityEntry, Analytics, Content, Inquiry, InquiryStatus } from "./types";

// Persistence on Cloudflare: CMS content + inquiries + analytics in D1, uploads in R2.
// In `next dev`, the same bindings are emulated locally by wrangler (see next.config.ts).

async function env() {
  return (await getCloudflareContext({ async: true })).env;
}

async function db() {
  const { DB } = await env();
  if (!DB) throw new Error("D1 binding `DB` is missing. Check wrangler.jsonc.");
  return DB;
}

/* ---------- Content (single JSON document) ---------- */

/** Merge newly added seed keys into stored content so schema additions don't break old data. */
function withDefaults(content: Content): Content {
  const seed = createSeed();
  const merged = { ...seed, ...content } as Content;
  for (const key of ["settings", "theme", "seo", "hero", "about", "pages"] as const) {
    merged[key] = { ...seed[key], ...content[key] } as never;
  }
  return merged;
}

async function readContent(): Promise<Content> {
  const DB = await db();
  const row = await DB.prepare("SELECT value FROM docs WHERE key = 'content'").first<{ value: string }>();
  if (row) return withDefaults(JSON.parse(row.value) as Content);
  const seed = createSeed();
  await DB.prepare("INSERT OR IGNORE INTO docs (key, value, updated_at) VALUES ('content', ?, ?)").bind(JSON.stringify(seed), new Date().toISOString()).run();
  return seed;
}

export function getContent() {
  return readContent();
}

export async function updateContent(mutate: (c: Content) => Content | void, activity?: Omit<ActivityEntry, "id" | "at">) {
  const current = await readContent();
  const next = mutate(current) ?? current;
  if (activity) {
    next.activity = [{ ...activity, id: crypto.randomUUID(), at: new Date().toISOString() }, ...(next.activity ?? [])].slice(0, 100);
  }
  await (await db())
    .prepare("INSERT INTO docs (key, value, updated_at) VALUES ('content', ?1, ?2) ON CONFLICT(key) DO UPDATE SET value = ?1, updated_at = ?2")
    .bind(JSON.stringify(next), new Date().toISOString())
    .run();
  return next;
}

/* ---------- Inquiries ---------- */

export async function getInquiries(): Promise<Inquiry[]> {
  const { results } = await (await db()).prepare("SELECT data, status FROM inquiries ORDER BY created_at DESC LIMIT 2000").all<{ data: string; status: InquiryStatus }>();
  return results.map((r) => ({ ...(JSON.parse(r.data) as Inquiry), status: r.status }));
}

export async function addInquiry(inquiry: Inquiry) {
  await (await db())
    .prepare("INSERT INTO inquiries (id, data, status, created_at) VALUES (?, ?, ?, ?)")
    .bind(inquiry.id, JSON.stringify(inquiry), inquiry.status, inquiry.createdAt)
    .run();
}

export async function setInquiryStatusById(id: string, status: InquiryStatus) {
  await (await db()).prepare("UPDATE inquiries SET status = ? WHERE id = ?").bind(status, id).run();
}

export async function deleteInquiryById(id: string) {
  await (await db()).prepare("DELETE FROM inquiries WHERE id = ?").bind(id).run();
}

/* ---------- Analytics (aggregate counters) ---------- */

export async function recordHit(hit: { day: string; path: string; referrer: string; locale: string; newVisitor: boolean }) {
  const DB = await db();
  const inc = DB.prepare("INSERT INTO counters (kind, key, count) VALUES (?, ?, 1) ON CONFLICT(kind, key) DO UPDATE SET count = count + 1");
  const batch = [inc.bind("views", hit.day), inc.bind("path", hit.path), inc.bind("locale", hit.locale)];
  if (hit.newVisitor) batch.push(inc.bind("visitors", hit.day));
  if (hit.referrer) batch.push(inc.bind("ref", hit.referrer));
  await DB.batch(batch);
}

export async function getAnalytics(): Promise<Analytics> {
  const since = new Date(Date.now() - 366 * 86400000).toISOString().slice(0, 10);
  const { results } = await (await db())
    .prepare("SELECT kind, key, count FROM counters WHERE kind IN ('path','ref','locale') OR key >= ?")
    .bind(since)
    .all<{ kind: string; key: string; count: number }>();
  const a: Analytics = { days: {}, paths: {}, referrers: {}, locales: {} };
  for (const r of results) {
    if (r.kind === "views" || r.kind === "visitors") (a.days[r.key] ??= { views: 0, visitors: 0 })[r.kind] = r.count;
    else if (r.kind === "path") a.paths[r.key] = r.count;
    else if (r.kind === "ref") a.referrers[r.key] = r.count;
    else if (r.kind === "locale") a.locales[r.key] = r.count;
  }
  return a;
}

/* ---------- Uploads (R2) ---------- */

async function bucket() {
  const { MEDIA } = await env();
  if (!MEDIA) throw new Error("R2 binding `MEDIA` is missing. Check wrangler.jsonc.");
  return MEDIA;
}

export async function putUpload(name: string, data: ArrayBuffer, contentType: string) {
  await (await bucket()).put(`uploads/${name}`, data, { httpMetadata: { contentType, cacheControl: "public, max-age=31536000, immutable" } });
}

export async function getUpload(name: string) {
  const obj = await (await bucket()).get(`uploads/${name}`);
  return obj ? { body: obj.body, contentType: obj.httpMetadata?.contentType, etag: obj.httpEtag } : null;
}

export async function deleteUpload(name: string) {
  await (await bucket()).delete(`uploads/${name}`);
}
