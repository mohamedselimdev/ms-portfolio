import type { MetadataRoute } from "next";
import { getContent } from "@/lib/store";
import { siteUrl } from "@/lib/utils";
import { LOCALES } from "@/i18n/config";
import { PHOTOS } from "@/lib/identity";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getContent();
  if (!content.settings.siteVisible) return [];
  const base = siteUrl();
  const paths = ["", "/about", "/projects", "/services", "/contact"];
  const projects = content.projects.filter((p) => p.status === "published");
  // One entry per language, each listing both versions as hreflang alternates.
  const photos = [`${base}/images/profile/mohamed-selim-web-developer.png`, ...PHOTOS.map((ph) => `${base}${ph.src}`)];
  const entry = (p: string, lastModified?: string, priority = 0.7, images: string[] = []) =>
    LOCALES.map((lang) => ({
      url: `${base}/${lang}${p}`,
      lastModified: lastModified ? new Date(lastModified) : new Date(),
      changeFrequency: "monthly" as const,
      priority,
      ...(images.length ? { images } : p === "" || p === "/about" ? { images: photos } : {}),
      alternates: { languages: { en: `${base}/en${p}`, ar: `${base}/ar${p}` } },
    }));
  return [
    ...paths.flatMap((p) => entry(p, undefined, p === "" ? 1 : 0.8)),
    ...projects.flatMap((p) =>
      entry(`/projects/${p.slug}`, p.updatedAt, 0.6, [...new Set([p.image, ...p.gallery.map((g) => g.src)].filter(Boolean))].map((src) => `${base}${src}`)),
    ),
  ];
}
