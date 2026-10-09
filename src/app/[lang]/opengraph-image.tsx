import { ImageResponse } from "next/og";
import { headers } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const alt = "Mohamed Selim — Freelance Full-Stack Web Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Read a public asset: via the Workers ASSETS binding in production, via HTTP in dev. */
async function asset(path: string) {
  const { env } = await getCloudflareContext({ async: true });
  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}`;
  // In `next dev` the ASSETS binding serves the last build output, which can be stale; read from the dev server instead.
  const useBinding = process.env.NODE_ENV !== "development" && env.ASSETS;
  let res = useBinding ? await env.ASSETS.fetch(new Request(origin + path)) : null;
  if (!res?.ok) res = await fetch(origin + path);
  return new Uint8Array(await res.arrayBuffer());
}

const toBase64 = (b: Uint8Array) => {
  let s = "";
  for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode(...b.subarray(i, i + 0x8000));
  return btoa(s);
};

// Share card used when no custom OG image is set in the CMS (SEO section).
export default async function OgImage() {
  const [portrait, logo] = await Promise.all([asset("/images/profile/og-portrait.png"), asset("/images/brand/logo.svg")]);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "radial-gradient(circle at 78% 35%, #1f3f8f 0%, #050b18 55%)", color: "white", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 70px", width: 700 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- satori needs plain img */}
          <img src={`data:image/svg+xml;base64,${toBase64(logo)}`} width={104} height={80} alt="" />
          <div style={{ fontSize: 30, color: "#9aa8c3", marginTop: 36, letterSpacing: 4 }}>MOHAMED SELIM</div>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 12, display: "flex", flexDirection: "column" }}>
            <span>Full-Stack</span>
            <span style={{ color: "#3d8bff" }}>Web Developer</span>
          </div>
          <div style={{ fontSize: 28, color: "#c9d3e8", marginTop: 24 }}>Websites · Web apps · E-commerce · APIs — English & Arabic</div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- satori needs plain img */}
        <img src={`data:image/png;base64,${toBase64(portrait)}`} width={537} height={600} style={{ position: "absolute", right: 20, bottom: 0 }} alt="" />
      </div>
    ),
    size,
  );
}
