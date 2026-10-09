"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Check, Copy, Trash2 } from "lucide-react";
import { deleteMedia } from "@/app/actions/admin";
import { useI18n } from "@/i18n/client";
import { DropZone, MediaThumb, useUpload } from "./fields";
import { PageHeader, useAdminData, useConfirm, useToast } from "./ui";

const kb = (n: number) => (n ? `${Math.max(1, Math.round(n / 1024))} KB` : "");

export function MediaLibrary({ title, description }: { title: string; description: string }) {
  const { t } = useI18n();
  const { media, setMedia } = useAdminData();
  const { upload, busy } = useUpload();
  const { confirm, dialog } = useConfirm();
  const toast = useToast();
  const router = useRouter();
  const [pending, start] = useTransition();
  const [copied, setCopied] = useState<string | null>(null);

  return (
    <div>
      <PageHeader title={title} description={description} />
      <DropZone busy={busy} onFiles={(files) => upload(files).then(() => router.refresh())} />
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" aria-busy={pending}>
        {media.map((m) => (
          <li key={m.id} className="card overflow-hidden p-0">
            <div className="relative aspect-[4/3] bg-black/40">
              <MediaThumb src={m.url} alt={m.name} />
            </div>
            <div className="p-2.5">
              <p className="truncate text-xs font-medium" title={m.name}>
                {m.name}
              </p>
              <p className="truncate text-[0.7rem] text-subtle" dir="ltr">
                {m.url} {kb(m.size)}
              </p>
              <div className="mt-2 flex gap-1">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm flex-1 px-2"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(m.url);
                      setCopied(m.id);
                      setTimeout(() => setCopied(null), 1500);
                    } catch {
                      toast("error", t.validation.generic);
                    }
                  }}
                >
                  {copied === m.id ? <Check className="size-4 text-success" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
                  <span className="text-xs">{copied === m.id ? t.common.copied : t.admin.actions.copyUrl}</span>
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-icon text-red-300"
                  aria-label={`${t.admin.actions.delete}: ${m.name}`}
                  disabled={pending}
                  onClick={async () => {
                    if (!(await confirm(`${t.admin.actions.confirmDelete} — ${m.name}`))) return;
                    start(async () => {
                      const res = await deleteMedia(m.id);
                      if (res.ok) {
                        setMedia((list) => list.filter((x) => x.id !== m.id));
                        toast("success", t.admin.actions.saved);
                        router.refresh();
                      } else toast("error", t.validation.generic);
                    });
                  }}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {media.length === 0 && <p className="card mt-6 p-10 text-center text-muted">{t.admin.fields.noItems}</p>}
      {dialog}
    </div>
  );
}
