"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { ExternalLink, Save } from "lucide-react";
import { saveSingleton } from "@/app/actions/admin";
import { useI18n } from "@/i18n/client";
import type { FieldDef } from "@/lib/admin/schema";
import type { FieldError } from "@/lib/validation";
import { FieldInput } from "./fields";
import { PageHeader, useToast } from "./ui";

export function SingletonEditor({
  sectionKey,
  title,
  description,
  fields,
  initial,
  previewHref,
}: {
  sectionKey: string;
  title: string;
  description?: string;
  fields: FieldDef[];
  initial: Record<string, unknown>;
  previewHref?: string;
}) {
  const { t } = useI18n();
  const toast = useToast();
  const router = useRouter();
  const [data, setData] = useState(initial);
  const [errors, setErrors] = useState<Record<string, FieldError>>({});
  const [dirty, setDirty] = useState(false);
  const [pending, start] = useTransition();

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const save = () =>
    start(async () => {
      const res = await saveSingleton(sectionKey, data);
      if (res.ok) {
        setErrors({});
        setDirty(false);
        toast("success", t.admin.actions.saved);
        router.refresh();
      } else {
        setErrors(res.errors ?? {});
        toast("error", res.errors ? t.validation.fixErrors : t.validation.generic);
      }
    });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      noValidate
    >
      <PageHeader
        title={title}
        description={description}
        actions={
          previewHref && (
            <a href={previewHref} target="_blank" rel="noopener" className="btn btn-outline btn-sm">
              <ExternalLink className="size-4" aria-hidden="true" />
              {t.admin.actions.preview}
            </a>
          )
        }
      />
      <div className="card grid gap-6 p-4 sm:p-6 md:grid-cols-2">
        {fields.map((f) => (
          <FieldInput
            key={f.name}
            field={f}
            value={data[f.name]}
            errors={errors}
            onChange={(v) => {
              setData((d) => ({ ...d, [f.name]: v }));
              setDirty(true);
            }}
          />
        ))}
      </div>
      <div className="sticky bottom-0 z-30 -mx-3 mt-6 flex items-center justify-end gap-3 border-t border-line bg-bg/90 px-3 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        {dirty && <p className="me-auto text-sm text-amber-300">{t.admin.fields.unsaved}</p>}
        <button type="submit" className="btn btn-primary" disabled={pending}>
          <Save className="size-4" aria-hidden="true" />
          {pending ? t.admin.actions.saving : t.admin.actions.save}
        </button>
      </div>
    </form>
  );
}
