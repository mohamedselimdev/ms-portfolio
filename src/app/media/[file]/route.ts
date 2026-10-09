import { getUpload } from "@/lib/store";
import { MIME } from "@/lib/media";

/** Serves CMS uploads from R2. */
export async function GET(_request: Request, { params }: RouteContext<"/media/[file]">) {
  const { file } = await params;
  const match = /^([0-9a-f-]{36})\.(jpg|png|gif|webp|avif)$/.exec(file);
  if (!match) return new Response("Not found", { status: 404 });
  const obj = await getUpload(file);
  if (!obj) return new Response("Not found", { status: 404 });
  return new Response(obj.body, {
    headers: {
      "Content-Type": MIME[match[2]],
      "Cache-Control": "public, max-age=31536000, immutable",
      ETag: obj.etag,
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'",
    },
  });
}
