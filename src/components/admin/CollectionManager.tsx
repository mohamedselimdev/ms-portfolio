"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, ExternalLink, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { deleteItem, moveItem, saveItem, setItemStatus } from "@/app/actions/admin";
import { useI18n } from "@/i18n/client";
import { FIELD_LABELS, OPTION_LABELS } from "@/i18n/admin-fields";
import type { FieldDef } from "@/lib/admin/schema";
import type { FieldError } from "@/lib/validation";
import type { L, Status } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { FieldInput, MediaThumb, type Option } from "./fields";
import { Modal, PageHeader, StatusBadge, useConfirm, useToast } from "./ui";

type Item = Record<string, unknown> & { id: string; order: number; status: Status; updatedAt: string };

function blank(fields: FieldDef[]) {
  const out: Record<string, unknown> = { status: "published" };
  for (const f of fields) {
    if (["ltext", "ltextarea", "llines"].includes(f.type)) out[f.name] = { en: "", ar: "" };
    else if (f.type === "boolean") out[f.name] = false;
    else if (f.type === "number") out[f.name] = f.max ?? f.min ?? 0;
    else if (f.type === "gallery") out[f.name] = [];
    else if (f.type === "select" && f.options && f.required) out[f.name] = f.options[0];
    else out[f.name] = "";
  }
  return out;
}

export function CollectionManager({
  sectionKey,
  title,
  description,
  fields,
  items,
  titleField,
  subtitleField,
  imageField,
  filterField,
  options,
  itemHrefBase,
  previewHref,
}: {
  sectionKey: string;
  title: string;
  description?: string;
  fields: FieldDef[];
  items: Item[];
  titleField: string;
  subtitleField?: string;
  imageField?: string;
  filterField?: string;
  options: Record<string, Option[]>;
  itemHrefBase?: string;
  previewHref?: string;
}) {
  const { t, locale } = useI18n();
  const toast = useToast();
  const router = useRouter();
  const { confirm, dialog } = useConfirm();
  const [pending, start] = useTransition();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | Status>("all");
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [errors, setErrors] = useState<Record<string, FieldError>>({});

  const text = (v: unknown) => (v && typeof v === "object" ? ((v as L)[locale] || (v as L).en || (v as L).ar || "") : String(v ?? ""));
  const optionLabel = (field: string, value: string) =>
    options[field]?.find((o) => o.value === value)?.label ?? OPTION_LABELS[value]?.[locale] ?? value;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (status !== "all" && i.status !== status) return false;
      if (filter && filterField && i[filterField] !== filter) return false;
      if (!q) return true;
      const hay = [i[titleField], subtitleField && i[subtitleField]].map((v) => (v && typeof v === "object" ? `${(v as L).en} ${(v as L).ar}` : String(v ?? ""))).join(" ");
      return hay.toLowerCase().includes(q);
    });
  }, [items, query, status, filter, filterField, titleField, subtitleField]);

  const filterOptions: Option[] = filterField
    ? (options[filterField] ?? fields.find((f) => f.name === filterField)?.options?.map((o) => ({ value: o, label: OPTION_LABELS[o]?.[locale] ?? o })) ?? [])
    : [];

  const run = (fn: () => Promise<{ ok: boolean }>, success = t.admin.actions.saved) =>
    start(async () => {
      const res = await fn();
      toast(res.ok ? "success" : "error", res.ok ? success : t.validation.generic);
      if (res.ok) router.refresh();
    });

  const save = () =>
    start(async () => {
      if (!editing) return;
      const res = await saveItem(sectionKey, editing);
      if (res.ok) {
        setEditing(null);
        setErrors({});
        toast("success", t.admin.actions.saved);
        router.refresh();
      } else {
        setErrors(res.errors ?? {});
        toast("error", res.errors ? t.validation.fixErrors : t.validation.generic);
      }
    });

  const setField = (name: string, value: unknown) =>
    setEditing((e) => {
      if (!e) return e;
      const next = { ...e, [name]: value };
      // Auto-fill slug from the English title for new items.
      const slugField = fields.find((f) => f.type === "slug");
      if (!e.id && slugField && name === titleField && value && typeof value === "object") {
        const prevAuto = slugify((e[titleField] as L | undefined)?.en ?? "");
        if (!e[slugField.name] || e[slugField.name] === prevAuto) next[slugField.name] = slugify((value as L).en);
      }
      return next;
    });

  const Title = editing?.id ? `${t.admin.actions.edit}: ${text(editing[titleField])}` : `${t.admin.actions.add} — ${title}`;

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        actions={
          <>
            {previewHref && (
              <a href={previewHref} target="_blank" rel="noopener" className="btn btn-outline btn-sm">
                <ExternalLink className="size-4" aria-hidden="true" />
                {t.admin.actions.preview}
              </a>
            )}
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setErrors({});
                setEditing(blank(fields));
              }}
            >
              <Plus className="size-4" aria-hidden="true" />
              {t.admin.actions.add}
            </button>
          </>
        }
      />

      <div className="card mb-4 flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.admin.search} aria-label={t.admin.search} className="field min-h-10 py-2 ps-9" />
        </div>
        <div className="flex gap-2">
          <select value={status} onChange={(e) => setStatus(e.target.value as "all" | Status)} className="field min-h-10 py-2" aria-label={t.admin.fields.status}>
            <option value="all">{t.admin.fields.all}</option>
            <option value="published">{t.admin.fields.published}</option>
            <option value="draft">{t.admin.fields.draft}</option>
          </select>
          {filterField && (
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="field min-h-10 py-2" aria-label={FIELD_LABELS[filterField]?.[locale]}>
              <option value="">{t.admin.fields.all}</option>
              {filterOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="card p-10 text-center text-muted">{items.length ? t.admin.fields.noResults : t.admin.fields.noItems}</p>
      ) : (
        <ul className="flex flex-col gap-2" aria-busy={pending}>
          {visible.map((item) => {
            const idx = items.findIndex((i) => i.id === item.id);
            const sub = subtitleField ? (filterField === subtitleField || fields.find((f) => f.name === subtitleField)?.type === "select" ? optionLabel(subtitleField, String(item[subtitleField] ?? "")) : text(item[subtitleField])) : "";
            return (
              <li key={item.id} className="card flex flex-wrap items-center gap-3 p-3 sm:flex-nowrap sm:gap-4">
                <span className="w-6 text-center text-xs text-subtle tabular-nums">{idx + 1}</span>
                {imageField && (
                  <span className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-line bg-black/30 sm:h-12 sm:w-20">
                    <MediaThumb src={String(item[imageField] ?? "")} />
                  </span>
                )}
                <button type="button" onClick={() => (setErrors({}), setEditing(item))} className="min-w-0 flex-1 text-start">
                  <span className="block truncate font-semibold">{text(item[titleField]) || "—"}</span>
                  {sub && <span className="block truncate text-xs text-muted">{sub}</span>}
                </button>
                <StatusBadge status={item.status} />
                <div className="flex w-full items-center justify-end gap-1 border-t border-line pt-2 sm:w-auto sm:border-0 sm:pt-0">
                  <button type="button" className="btn btn-ghost btn-icon" disabled={pending || idx === 0} onClick={() => run(() => moveItem(sectionKey, item.id, -1))} aria-label={t.admin.actions.moveUp}>
                    <ArrowUp className="size-4" />
                  </button>
                  <button type="button" className="btn btn-ghost btn-icon" disabled={pending || idx === items.length - 1} onClick={() => run(() => moveItem(sectionKey, item.id, 1))} aria-label={t.admin.actions.moveDown}>
                    <ArrowDown className="size-4" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon"
                    disabled={pending}
                    onClick={() => run(() => setItemStatus(sectionKey, item.id, item.status === "published" ? "draft" : "published"))}
                    aria-label={item.status === "published" ? t.admin.actions.unpublish : t.admin.actions.publish}
                    title={item.status === "published" ? t.admin.actions.unpublish : t.admin.actions.publish}
                  >
                    {item.status === "published" ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                  {itemHrefBase && (
                    <a href={`${itemHrefBase}${String(item.slug ?? "")}`} target="_blank" rel="noopener" className="btn btn-ghost btn-icon" aria-label={t.admin.actions.preview} title={t.admin.actions.preview}>
                      <ExternalLink className="size-4" />
                    </a>
                  )}
                  <button type="button" className="btn btn-ghost btn-icon" onClick={() => (setErrors({}), setEditing(item))} aria-label={t.admin.actions.edit} title={t.admin.actions.edit}>
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon text-red-300"
                    disabled={pending}
                    onClick={async () => (await confirm(`${t.admin.actions.confirmDelete} — ${text(item[titleField])}`)) && run(() => deleteItem(sectionKey, item.id))}
                    aria-label={t.admin.actions.delete}
                    title={t.admin.actions.delete}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={Title}
        size="lg"
        footer={
          <>
            <select value={String(editing?.status ?? "published")} onChange={(e) => setField("status", e.target.value)} className="field me-auto min-h-10 w-auto py-2" aria-label={t.admin.fields.status}>
              <option value="published">{t.admin.fields.published}</option>
              <option value="draft">{t.admin.fields.draft}</option>
            </select>
            <button type="button" className="btn btn-ghost" onClick={() => setEditing(null)}>
              {t.admin.actions.cancel}
            </button>
            <button type="button" className="btn btn-primary" onClick={save} disabled={pending}>
              {pending ? t.admin.actions.saving : t.admin.actions.save}
            </button>
          </>
        }
      >
        {editing && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
            noValidate
            className="grid gap-5 md:grid-cols-2"
          >
            {fields.map((f) => (
              <FieldInput key={f.name} field={f} value={editing[f.name]} errors={errors} options={options[f.name]} onChange={(v) => setField(f.name, v)} />
            ))}
            <button type="submit" hidden />
          </form>
        )}
      </Modal>
      {dialog}
    </div>
  );
}
