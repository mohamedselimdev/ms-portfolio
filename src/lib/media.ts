export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
};

const ascii = (b: Uint8Array, start: number, end: number) => String.fromCharCode(...b.subarray(start, end));

/** Detect image type from magic bytes (never trust the client-provided type). SVG is rejected on purpose. */
export function sniffImage(b: Uint8Array): keyof typeof MIME | null {
  if (b.length < 12) return null;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpg";
  if ([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((v, i) => b[i] === v)) return "png";
  if (ascii(b, 0, 4) === "GIF8") return "gif";
  if (ascii(b, 0, 4) === "RIFF" && ascii(b, 8, 12) === "WEBP") return "webp";
  if (ascii(b, 4, 8) === "ftyp" && /avi[fs]/.test(ascii(b, 8, 12))) return "avif";
  return null;
}
