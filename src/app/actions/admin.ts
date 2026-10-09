"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkCredentials, clientIp, createSession, destroySession, getSession, isAuthConfigured, rateLimit } from "@/lib/auth";
import { deleteInquiryById, deleteUpload, getContent, setInquiryStatusById, updateContent } from "@/lib/store";
import { findSection, type CollectionSection, type SingletonSection } from "@/lib/admin/schema";
import { sanitize, type Errors } from "@/lib/admin/validate";
import { isLocale, tl } from "@/i18n/config";
import { newId } from "@/lib/utils";
import type { BaseItem, CollectionKey, Content, InquiryStatus, L, Status } from "@/lib/types";

export type ActionResult = { ok: true; id?: string } | { ok: false; errors?: Errors; message?: string };

async function guard() {
  if (!(await getSession())) throw new Error("Unauthorized");
}

function done() {
  revalidatePath("/", "layout");
}

const labelOf = (item: Record<string, unknown>, field: string) => {
  const v = item[field];
  return (typeof v === "object" && v ? tl(v as L, "en") : String(v ?? "")).slice(0, 80);
};

/* ---------- Auth ---------- */

export type LoginState = { error?: "invalid" | "tooMany" | "notConfigured" };

export async function login(_prev: LoginState, fd: FormData): Promise<LoginState> {
  if (!isAuthConfigured()) return { error: "notConfigured" };
  const ip = await clientIp();
  if (!rateLimit(`login:${ip}`, 8, 15 * 60_000)) return { error: "tooMany" };
  const email = String(fd.get("email") ?? "");
  const password = String(fd.get("password") ?? "");
  if (!(await checkCredentials(email, password))) return { error: "invalid" };
  await createSession(email);
  await updateContent((c) => c, { action: "login", section: "auth", label: email });
  const locale = String(fd.get("locale") ?? "en");
  redirect(`/${isLocale(locale) ? locale : "en"}/admin`);
}

export async function logout(locale: string) {
  await destroySession();
  redirect(`/${isLocale(locale) ? locale : "en"}/admin/login`);
}

/* ---------- Singletons ---------- */

export async function saveSingleton(key: string, input: Record<string, unknown>): Promise<ActionResult> {
  await guard();
  const section = findSection(key);
  if (!section || section.kind !== "singleton") return { ok: false, message: "generic" };
  const { data, errors } = sanitize((section as SingletonSection).fields, input);
  if (Object.keys(errors).length) return { ok: false, errors };
  await updateContent(
    (c) => {
      (c as unknown as Record<string, unknown>)[key] = { ...(c[section.key] as object), ...data };
    },
    { action: "update", section: key, label: key },
  );
  done();
  return { ok: true };
}

/* ---------- Collections ---------- */

function collectionSection(key: string) {
  const section = findSection(key);
  return section && section.kind === "collection" ? (section as CollectionSection) : null;
}

export async function saveItem(key: string, input: Record<string, unknown>): Promise<ActionResult> {
  await guard();
  const section = collectionSection(key);
  if (!section) return { ok: false, message: "generic" };
  const content = await getContent();
  const list = content[section.key] as unknown as (BaseItem & Record<string, unknown>)[];
  const id = typeof input.id === "string" && list.some((i) => i.id === input.id) ? input.id : null;
  const slugs = list.filter((i) => i.id !== id).map((i) => String(i.slug ?? ""));
  const { data, errors } = sanitize(section.fields, input, { slugs });
  if (Object.keys(errors).length) return { ok: false, errors };

  const status: Status = input.status === "draft" ? "draft" : "published";
  const newItemId = id ?? newId(key.slice(0, 3));
  await updateContent(
    (c) => {
      const items = c[section.key] as unknown as (BaseItem & Record<string, unknown>)[];
      const now = new Date().toISOString();
      if (id) {
        const idx = items.findIndex((i) => i.id === id);
        items[idx] = { ...items[idx], ...data, status, updatedAt: now };
      } else {
        const order = items.reduce((m, i) => Math.max(m, i.order), 0) + 1;
        items.push({ ...data, id: newItemId, order, status, updatedAt: now } as BaseItem & Record<string, unknown>);
      }
      // Renaming a category slug keeps its projects attached.
      if (section.key === "categories" && id) {
        const old = list.find((i) => i.id === id)?.slug;
        if (old && old !== data.slug) c.projects.forEach((p) => p.category === old && (p.category = String(data.slug)));
      }
    },
    { action: id ? "update" : "create", section: key, label: labelOf(data, section.titleField) },
  );
  done();
  return { ok: true, id: newItemId };
}

type Items = (BaseItem & Record<string, unknown>)[];
const itemsOf = (c: Content, key: CollectionKey) => c[key] as unknown as Items;

export async function deleteItem(key: string, id: string): Promise<ActionResult> {
  await guard();
  const section = collectionSection(key);
  if (!section) return { ok: false, message: "generic" };
  const target = itemsOf(await getContent(), section.key).find((i) => i.id === id);
  if (!target) return { ok: false, message: "generic" };
  await updateContent(
    (c) => {
      (c as unknown as Record<string, unknown>)[section.key] = itemsOf(c, section.key).filter((i) => i.id !== id);
    },
    { action: "delete", section: key, label: labelOf(target, section.titleField) },
  );
  done();
  return { ok: true };
}

export async function setItemStatus(key: string, id: string, status: Status): Promise<ActionResult> {
  await guard();
  const section = collectionSection(key);
  if (!section) return { ok: false, message: "generic" };
  let label = id;
  await updateContent(
    (c) => {
      const item = itemsOf(c, section.key).find((i) => i.id === id);
      if (item) {
        item.status = status === "draft" ? "draft" : "published";
        item.updatedAt = new Date().toISOString();
        label = labelOf(item, section.titleField);
      }
    },
    { action: status === "draft" ? "unpublish" : "publish", section: key, label },
  );
  done();
  return { ok: true };
}

export async function moveItem(key: string, id: string, direction: -1 | 1): Promise<ActionResult> {
  await guard();
  const section = collectionSection(key);
  if (!section) return { ok: false, message: "generic" };
  await updateContent(
    (c) => {
      const sorted = [...itemsOf(c, section.key)].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((i) => i.id === id);
      const swap = sorted[idx + direction];
      if (idx < 0 || !swap) return;
      sorted.splice(idx, 1);
      sorted.splice(idx + direction, 0, itemsOf(c, section.key).find((i) => i.id === id)!);
      sorted.forEach((item, i) => (item.order = i + 1));
    },
    { action: "reorder", section: key, label: id },
  );
  done();
  return { ok: true };
}

/* ---------- Inquiries ---------- */

export async function setInquiryStatus(id: string, status: InquiryStatus): Promise<ActionResult> {
  await guard();
  if (!["new", "read", "replied", "archived"].includes(status)) return { ok: false };
  await setInquiryStatusById(id, status);
  done();
  return { ok: true };
}

export async function deleteInquiry(id: string): Promise<ActionResult> {
  await guard();
  await deleteInquiryById(id);
  await updateContent((c) => c, { action: "delete", section: "inquiries", label: id });
  done();
  return { ok: true };
}

/* ---------- Media ---------- */

export async function deleteMedia(id: string): Promise<ActionResult> {
  await guard();
  const content = await getContent();
  const item = content.media.find((m) => m.id === id);
  if (!item) return { ok: false };
  // Uploaded files live in R2; bundled /images files are only removed from the library list.
  const match = /^\/media\/([0-9a-f-]{36}\.(jpg|png|gif|webp|avif))$/.exec(item.url);
  if (match) await deleteUpload(match[1]);
  await updateContent(
    (c) => {
      c.media = c.media.filter((m) => m.id !== id);
    },
    { action: "delete", section: "media", label: item.name },
  );
  done();
  return { ok: true };
}
