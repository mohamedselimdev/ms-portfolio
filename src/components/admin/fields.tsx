"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Images, Plus, Trash2, Upload } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { format } from "@/i18n/config";
import { FIELD_LABELS, OPTION_LABELS } from "@/i18n/admin-fields";
import type { FieldDef } from "@/lib/admin/schema";
import type { FieldError } from "@/lib/validation";
import type { L, MediaItem, Screenshot } from "@/lib/types";
import { ICON_NAMES, Icon, TECH_ICON_NAMES, TechIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Modal, useAdminData, useToast } from "./ui";

export type Option = { value: string; label: string };
type Errors = Record<string, FieldError>;

function useFieldText() {
  const { t, locale } = useI18n();
  return {
    t,
    label: (name: string) => FIELD_LABELS[name]?.[locale] ?? name,
    option: (value: string) => OPTION_LABELS[value]?.[locale] ?? value,
    error: (e?: FieldError) => (e ? format(t.validation[e.code as keyof typeof t.validation] as string, { n: e.n ?? "" }) : ""),
  };
}

const emptyL: L = { en: "", ar: "" };

export function FieldInput({
  field,
  value,
  onChange,
  errors,
  options = [],
}: {
  field: FieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
  errors: Errors;
  options?: Option[];
}) {
  const { t, label, option, error } = useFieldText();
  const id = `f-${field.name}`;
  const err = errors[field.name];
  const errText = error(err);
  const common = { id, "aria-invalid": !!err || undefined, "aria-describedby": err ? `${id}-err` : undefined };
  const str = typeof value === "string" ? value : value == null ? "" : String(value);
  const Label = (
    <label htmlFor={field.type === "boolean" ? undefined : id} className="mb-1.5 block text-sm font-semibold">
      {label(field.name)}
      {field.required && <span className="text-red-400"> *</span>}
    </label>
  );
  const Err = errText ? (
    <p id={`${id}-err`} className="mt-1 text-xs text-red-300">
      {errText}
    </p>
  ) : null;

  switch (field.type) {
    case "ltext":
    case "ltextarea":
    case "llines": {
      const v = (value as L) ?? emptyL;
      const multiline = field.type !== "ltext";
      return (
        <div className={cn(field.full && "md:col-span-2")}>
          {Label}
          <div className="grid gap-2 md:grid-cols-2">
            {(["en", "ar"] as const).map((l) => {
              const e = errors[`${field.name}.${l}`] ?? (l === "en" ? err : undefined);
              const props = {
                id: l === "en" ? id : `${id}-ar`,
                dir: l === "ar" ? "rtl" : "ltr",
                lang: l,
                value: v[l] ?? "",
                maxLength: field.max,
                "aria-label": `${label(field.name)} — ${l === "en" ? t.admin.fields.english : t.admin.fields.arabic}`,
                "aria-invalid": !!e || undefined,
                className: cn("field", multiline && "min-h-24 resize-y leading-relaxed"),
                onChange: (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange({ ...v, [l]: ev.target.value }),
              };
              return (
                <div key={l}>
                  <span className="mb-1 flex items-center justify-between text-[0.7rem] font-semibold tracking-wide text-subtle uppercase">
                    {l === "en" ? t.admin.fields.english : t.admin.fields.arabic}
                    {field.max && <span className="tabular-nums">{(v[l] ?? "").length}/{field.max}</span>}
                  </span>
                  {multiline ? <textarea rows={field.rows ?? (field.type === "llines" ? 5 : 3)} {...props} /> : <input {...props} />}
                  {e && <p className="mt-1 text-xs text-red-300">{error(e)}</p>}
                </div>
              );
            })}
          </div>
          {field.type === "llines" && <p className="mt-1 text-xs text-subtle">{t.admin.fields.onePerLine}</p>}
        </div>
      );
    }
    case "textarea":
      return (
        <div className={cn(field.full && "md:col-span-2")}>
          {Label}
          <textarea {...common} rows={field.rows ?? 4} maxLength={field.max} value={str} onChange={(e) => onChange(e.target.value)} className="field resize-y" />
          {Err}
        </div>
      );
    case "boolean":
      return (
        <div className={cn("flex items-center", field.full && "md:col-span-2")}>
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold">
            <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
            <span className="relative h-6 w-11 shrink-0 rounded-full bg-white/15 transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-accent after:absolute after:top-0.5 after:start-0.5 after:size-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5 rtl:peer-checked:after:-translate-x-5" />
            {label(field.name)}
          </label>
        </div>
      );
    case "select": {
      const opts: Option[] = field.options ? field.options.map((o) => ({ value: o, label: option(o) })) : options;
      return (
        <div className={cn(field.full && "md:col-span-2")}>
          {Label}
          <select {...common} value={str} onChange={(e) => onChange(e.target.value)} className="field">
            <option value="">—</option>
            {opts.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {Err}
        </div>
      );
    }
    case "icon":
    case "techicon": {
      const names = field.type === "icon" ? ICON_NAMES : TECH_ICON_NAMES;
      return (
        <div className={cn(field.full && "md:col-span-2")}>
          {Label}
          <div className="flex items-center gap-2">
            <span className="icon-tile size-11">{field.type === "icon" ? <Icon name={str} className="size-5" /> : <TechIcon name={str} icon={str} className="size-5" />}</span>
            <select {...common} value={str} onChange={(e) => onChange(e.target.value)} className="field">
              <option value="">—</option>
              {names.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      );
    }
    case "color":
      return (
        <div>
          {Label}
          <div className="flex items-center gap-2">
            <input type="color" value={/^#[0-9a-f]{6}$/i.test(str) ? str : "#000000"} onChange={(e) => onChange(e.target.value)} className="h-11 w-14 cursor-pointer rounded-lg border border-line-strong bg-transparent p-1" aria-label={label(field.name)} />
            <input {...common} value={str} dir="ltr" onChange={(e) => onChange(e.target.value)} className="field font-mono uppercase" maxLength={7} />
          </div>
          {Err}
        </div>
      );
    case "number":
      return (
        <div>
          {Label}
          <input {...common} type="number" inputMode="numeric" min={field.min} max={field.max} value={str} onChange={(e) => onChange(e.target.value)} className="field" />
          {Err}
        </div>
      );
    case "image":
      return (
        <div className={cn(field.full && "md:col-span-2")}>
          {Label}
          <ImageField id={id} value={str} onChange={onChange} />
          {Err}
        </div>
      );
    case "gallery":
      return (
        <div className="md:col-span-2">
          {Label}
          <GalleryField value={(value as Screenshot[]) ?? []} onChange={onChange} />
        </div>
      );
    default:
      return (
        <div className={cn(field.full && "md:col-span-2")}>
          {Label}
          <input
            {...common}
            type={field.type === "email" ? "email" : field.type === "url" ? "text" : "text"}
            inputMode={field.type === "email" ? "email" : field.type === "url" ? "url" : undefined}
            dir={["url", "email", "slug", "tags"].includes(field.type) ? "ltr" : undefined}
            maxLength={field.type === "url" ? 500 : field.max}
            value={str}
            onChange={(e) => onChange(field.type === "slug" ? e.target.value.toLowerCase().replace(/\s+/g, "-") : e.target.value)}
            className="field"
          />
          {field.type === "tags" && <p className="mt-1 text-xs text-subtle">{t.admin.fields.commaSeparated}</p>}
          {Err}
        </div>
      );
  }
}

/* ---------- Upload ---------- */

export function useUpload() {
  const { setMedia } = useAdminData();
  const toast = useToast();
  const { t } = useI18n();
  const [busy, setBusy] = useState(false);
  const upload = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (!list.length) return [] as MediaItem[];
    setBusy(true);
    try {
      const fd = new FormData();
      list.forEach((f) => fd.append("files", f));
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error(String(res.status));
      const { saved, rejected } = (await res.json()) as { saved: MediaItem[]; rejected: string[] };
      if (saved.length) {
        setMedia((m) => [...saved, ...m]);
        toast("success", `${t.admin.actions.saved} (${saved.length})`);
      }
      if (rejected.length) toast("error", `${t.admin.fields.allowedTypes}: ${rejected.join(", ")}`);
      return saved;
    } catch {
      toast("error", t.validation.generic);
      return [];
    } finally {
      setBusy(false);
    }
  };
  return { upload, busy };
}

export function DropZone({ onFiles, busy, compact }: { onFiles: (files: FileList) => void; busy: boolean; compact?: boolean }) {
  const { t } = useI18n();
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files);
      }}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-[var(--radius)] border-2 border-dashed p-5 text-center transition-colors",
        over ? "border-primary bg-primary/10" : "border-line-strong",
        compact ? "min-h-28" : "min-h-40",
      )}
    >
      <Upload className="size-6 text-accent" aria-hidden="true" />
      <button type="button" className="btn btn-outline btn-sm" onClick={() => input.current?.click()} disabled={busy}>
        {busy ? t.admin.actions.uploading : t.admin.actions.upload}
      </button>
      <p className="text-xs text-muted">{t.admin.fields.dropHere}</p>
      <p className="text-[0.7rem] text-subtle">{t.admin.fields.allowedTypes}</p>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" multiple hidden onChange={(e) => e.target.files && onFiles(e.target.files)} />
    </div>
  );
}

export function MediaThumb({ src, alt = "", className }: { src: string; alt?: string; className?: string }) {
  if (!src) return null;
  // SVG and absolute URLs are shown as-is; everything else goes through next/image.
  if (src.endsWith(".svg") || /^https?:/.test(src)) {
    // eslint-disable-next-line @next/next/no-img-element -- arbitrary CMS image
    return <img src={src} alt={alt} className={cn("h-full w-full object-cover", className)} />;
  }
  return <Image src={src} alt={alt} fill sizes="240px" className={cn("object-cover", className)} />;
}

function MediaPicker({ open, onClose, onPick }: { open: boolean; onClose: () => void; onPick: (url: string) => void }) {
  const { t } = useI18n();
  const { media } = useAdminData();
  const { upload, busy } = useUpload();
  return (
    <Modal open={open} onClose={onClose} title={t.admin.sections.media} size="lg">
      <DropZone
        compact
        busy={busy}
        onFiles={async (files) => {
          const saved = await upload(files);
          if (saved[0]) onPick(saved[0].url);
        }}
      />
      <ul className="mt-5 grid grid-cols-2 gap-3 xs:grid-cols-3 md:grid-cols-4">
        {media
          .filter((m) => m.type.startsWith("image/"))
          .map((m) => (
            <li key={m.id}>
              <button type="button" onClick={() => onPick(m.url)} className="group block w-full overflow-hidden rounded-xl border border-line text-start hover:border-primary">
                <span className="relative block aspect-[4/3] bg-black/40">
                  <MediaThumb src={m.url} alt={m.name} />
                </span>
                <span className="block truncate px-2 py-1.5 text-xs text-muted group-hover:text-fg">{m.name}</span>
              </button>
            </li>
          ))}
      </ul>
    </Modal>
  );
}

export function ImageField({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  const { t } = useI18n();
  const [picking, setPicking] = useState(false);
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl border border-line bg-black/30 sm:w-44">
        {value ? <MediaThumb src={value} /> : <ImagePlus className="absolute inset-0 m-auto size-8 text-subtle" aria-hidden="true" />}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <input id={id} value={value} dir="ltr" onChange={(e) => onChange(e.target.value)} placeholder="/images/… or /media/…" className="field" />
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-outline btn-sm" onClick={() => setPicking(true)}>
            <Images className="size-4" aria-hidden="true" />
            {t.admin.actions.choose}
          </button>
          {value && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange("")}>
              <Trash2 className="size-4" aria-hidden="true" />
              {t.admin.actions.remove}
            </button>
          )}
        </div>
      </div>
      <MediaPicker
        open={picking}
        onClose={() => setPicking(false)}
        onPick={(url) => {
          onChange(url);
          setPicking(false);
        }}
      />
    </div>
  );
}

function GalleryField({ value, onChange }: { value: Screenshot[]; onChange: (v: Screenshot[]) => void }) {
  const { t } = useI18n();
  const [picking, setPicking] = useState(false);
  const update = (i: number, patch: Partial<Screenshot>) => onChange(value.map((g, j) => (j === i ? { ...g, ...patch } : g)));
  const move = (i: number, d: number) => {
    const next = [...value];
    const [item] = next.splice(i, 1);
    next.splice(i + d, 0, item);
    onChange(next);
  };
  return (
    <div className="flex flex-col gap-3">
      {value.map((g, i) => (
        <div key={g.src + i} className="flex flex-col gap-3 rounded-xl border border-line p-3 sm:flex-row">
          <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg bg-black/40 sm:w-40">
            <MediaThumb src={g.src} />
          </div>
          <div className="grid flex-1 gap-2 md:grid-cols-2">
            <input value={g.caption?.en ?? ""} onChange={(e) => update(i, { caption: { ...g.caption, en: e.target.value } })} placeholder={t.admin.fields.english} className="field" dir="ltr" maxLength={140} />
            <input value={g.caption?.ar ?? ""} onChange={(e) => update(i, { caption: { ...g.caption, ar: e.target.value } })} placeholder={t.admin.fields.arabic} className="field" dir="rtl" maxLength={140} />
          </div>
          <div className="flex gap-1 sm:flex-col">
            <button type="button" className="btn btn-ghost btn-icon" disabled={i === 0} onClick={() => move(i, -1)} aria-label={t.admin.actions.moveUp}>
              <ArrowUp className="size-4" />
            </button>
            <button type="button" className="btn btn-ghost btn-icon" disabled={i === value.length - 1} onClick={() => move(i, 1)} aria-label={t.admin.actions.moveDown}>
              <ArrowDown className="size-4" />
            </button>
            <button type="button" className="btn btn-ghost btn-icon text-red-300" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label={t.admin.actions.remove}>
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-outline btn-sm self-start" onClick={() => setPicking(true)}>
        <Plus className="size-4" aria-hidden="true" />
        {t.admin.actions.addItem}
      </button>
      <MediaPicker
        open={picking}
        onClose={() => setPicking(false)}
        onPick={(src) => {
          onChange([...value, { src, caption: { en: "", ar: "" } }]);
          setPicking(false);
        }}
      />
    </div>
  );
}
