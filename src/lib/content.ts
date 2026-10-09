import "server-only";
import { cache } from "react";
import { getContent } from "./store";
import { isAdmin } from "./auth";
import type { BaseItem, Content } from "./types";

export const byOrder = <T extends { order: number }>(items: T[]) => [...items].sort((a, b) => a.order - b.order);
export const published = <T extends BaseItem>(items: T[]) => byOrder(items.filter((i) => i.status === "published"));

/** Content for public pages, cached per request. */
export const getSiteContent = cache(async (): Promise<Content> => getContent());

export const getViewer = cache(async () => ({ admin: await isAdmin() }));

export async function getProjectBySlug(slug: string) {
  const content = await getSiteContent();
  const all = byOrder(content.projects);
  const project = all.find((p) => p.slug === slug);
  if (!project) return null;
  if (project.status !== "published" && !(await getViewer()).admin) return null;
  const visible = all.filter((p) => p.status === "published");
  const idx = visible.findIndex((p) => p.id === project.id);
  const next = visible.length > 1 ? visible[(idx + 1) % visible.length] : null;
  return { project, next: next && next.id !== project.id ? next : null, content };
}
