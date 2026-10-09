import type { MetadataRoute } from "next";
import { getContent } from "@/lib/store";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getContent();
  if (!content.settings.siteVisible) return [];
  const base = siteUrl();
  const paths = ["", "/about", "/projects", "/services", "/contact"];
  const projects = content.projects.filter((p) => p.status === "published");
  const entry = (p: string, lastModified?: string, priority = 0.7) => ({
    url: `${base}/en${p}`,
    lastModified: lastModified ? new Date(lastModified) : new Date(),
    changeFrequency: "monthly" as const,
    priority,
    alternates: { languages: { en: `${base}/en${p}`, ar: `${base}/ar${p}` } },
  });
  return [
    ...paths.map((p) => entry(p, undefined, p === "" ? 1 : 0.8)),
    ...projects.map((p) => entry(`/projects/${p.slug}`, p.updatedAt, 0.6)),
  ];
}
