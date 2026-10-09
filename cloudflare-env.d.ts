// Minimal typings for the Cloudflare bindings this app uses (see wrangler.jsonc).
// Kept hand-written on purpose: the full workers runtime types clash with DOM types used by client components.

interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
}
interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<D1Result<T>>;
  run(): Promise<D1Result>;
}
interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<D1Result[]>;
}

interface R2ObjectBody {
  body: ReadableStream;
  httpEtag: string;
  httpMetadata?: { contentType?: string; cacheControl?: string };
}
interface R2Bucket {
  get(key: string): Promise<R2ObjectBody | null>;
  put(key: string, value: ArrayBuffer | ReadableStream, options?: { httpMetadata?: { contentType?: string; cacheControl?: string } }): Promise<unknown>;
  delete(key: string): Promise<void>;
}

interface CloudflareEnv {
  DB: D1Database;
  MEDIA: R2Bucket;
  ASSETS: { fetch(request: Request): Promise<Response> };
  WORKER_SELF_REFERENCE: { fetch(request: Request): Promise<Response> };
}
