import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";
import { putUpload, updateContent } from "@/lib/store";
import { MAX_UPLOAD_BYTES, MIME, sniffImage } from "@/lib/media";
import type { MediaItem } from "@/lib/types";

export async function POST(request: NextRequest) {
  if (!(await verifySession(request.cookies.get(SESSION_COOKIE)?.value))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  // Same-origin check as CSRF defense for this cookie-authenticated endpoint.
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  if (!files.length) return NextResponse.json({ error: "empty" }, { status: 400 });

  const saved: MediaItem[] = [];
  const rejected: string[] = [];

  for (const file of files.slice(0, 20)) {
    if (file.size > MAX_UPLOAD_BYTES) {
      rejected.push(file.name);
      continue;
    }
    const data = await file.arrayBuffer();
    const ext = sniffImage(new Uint8Array(data));
    if (!ext) {
      rejected.push(file.name);
      continue;
    }
    const id = crypto.randomUUID();
    const name = `${id}.${ext}`;
    await putUpload(name, data, MIME[ext]);
    saved.push({
      id,
      url: `/media/${name}`,
      name: file.name.replace(/[^\w.\- ]+/g, "").slice(0, 120) || name,
      type: MIME[ext],
      size: data.byteLength,
      createdAt: new Date().toISOString(),
    });
  }

  if (saved.length) {
    await updateContent(
      (c) => {
        c.media = [...saved, ...c.media];
      },
      { action: "upload", section: "media", label: saved.map((s) => s.name).join(", ").slice(0, 120) },
    );
  }
  return NextResponse.json({ saved, rejected });
}
