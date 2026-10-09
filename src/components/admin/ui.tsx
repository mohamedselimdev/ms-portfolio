"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import { useI18n } from "@/i18n/client";
import type { MediaItem } from "@/lib/types";
import { cn } from "@/lib/utils";

/* ---------- Toasts ---------- */

type Toast = { id: number; tone: "success" | "error"; text: string };
const ToastCtx = createContext<(tone: Toast["tone"], text: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

/* ---------- Shared admin data (media library) ---------- */

interface AdminData {
  media: MediaItem[];
  setMedia: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}
const DataCtx = createContext<AdminData | null>(null);
export const useAdminData = () => {
  const ctx = useContext(DataCtx);
  if (!ctx) throw new Error("useAdminData outside provider");
  return ctx;
};

export function AdminProviders({ media: initial, children }: { media: MediaItem[]; children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [media, setMedia] = useState(initial);
  const [source, setSource] = useState(initial);
  // Sync with fresh server data after router.refresh() (render-time update, no effect).
  if (source !== initial) {
    setSource(initial);
    setMedia(initial);
  }
  const push = useCallback((tone: Toast["tone"], text: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, tone, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      <DataCtx.Provider value={{ media, setMedia }}>
        {children}
        <div className="pointer-events-none fixed inset-x-3 bottom-4 z-[70] flex flex-col items-center gap-2 sm:inset-x-auto sm:end-6" aria-live="polite">
          {toasts.map((t) => (
            <p
              key={t.id}
              role={t.tone === "error" ? "alert" : "status"}
              className={cn(
                "pointer-events-auto flex items-center gap-2 rounded-xl border px-4 py-3 text-sm shadow-2xl backdrop-blur",
                t.tone === "success" ? "border-success/40 bg-success/15 text-green-100" : "border-danger/40 bg-danger/15 text-red-100",
              )}
            >
              {t.tone === "success" ? <CheckCircle2 className="size-4" aria-hidden="true" /> : <AlertTriangle className="size-4" aria-hidden="true" />}
              {t.text}
            </p>
          ))}
        </div>
      </DataCtx.Provider>
    </ToastCtx.Provider>
  );
}

/* ---------- Modal (native dialog) ---------- */

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const { t } = useI18n();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  const width = { sm: "max-w-md", md: "max-w-2xl", lg: "max-w-4xl", xl: "max-w-6xl" }[size];
  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className={cn("m-auto max-h-[92dvh] w-[calc(100%-1.5rem)] overflow-hidden rounded-[var(--radius)] border border-line-strong bg-surface p-0 text-fg backdrop:bg-black/70 backdrop:backdrop-blur-sm", width)}
    >
      {open && (
        <div className="flex max-h-[92dvh] flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
            <h2 className="font-display text-lg font-bold">{title}</h2>
            <button type="button" className="btn btn-ghost btn-icon" onClick={onClose} aria-label={t.admin.actions.close}>
              <X className="size-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
          {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-4">{footer}</div>}
        </div>
      )}
    </dialog>
  );
}

/* ---------- Confirm ---------- */

export function useConfirm() {
  const { t } = useI18n();
  const [state, setState] = useState<{ text: string; resolve: (v: boolean) => void } | null>(null);
  const confirm = (text: string) => new Promise<boolean>((resolve) => setState({ text, resolve }));
  const close = (v: boolean) => {
    state?.resolve(v);
    setState(null);
  };
  const dialog = (
    <Modal
      open={!!state}
      onClose={() => close(false)}
      title={t.admin.actions.confirmTitle}
      size="sm"
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={() => close(false)}>
            {t.admin.actions.cancel}
          </button>
          <button type="button" className="btn btn-danger" onClick={() => close(true)} autoFocus>
            {t.admin.actions.confirm}
          </button>
        </>
      }
    >
      <p className="text-muted">{state?.text}</p>
    </Modal>
  );
  return { confirm, dialog };
}

/* ---------- Misc ---------- */

export function StatusBadge({ status }: { status: string }) {
  const { t } = useI18n();
  const map: Record<string, [string, string]> = {
    published: [t.admin.fields.published, "border-success/40 bg-success/10 text-green-300"],
    draft: [t.admin.fields.draft, "border-warning/40 bg-warning/10 text-amber-300"],
    new: [t.admin.inquiry.new, "border-primary/50 bg-primary/15 text-sky-300"],
    read: [t.admin.inquiry.read, "border-success/40 bg-success/10 text-green-300"],
    replied: [t.admin.inquiry.replied, "border-violet-400/40 bg-violet-400/10 text-violet-300"],
    archived: [t.admin.inquiry.archived, "border-line-strong bg-white/5 text-muted"],
  };
  const [label, cls] = map[status] ?? [status, "border-line-strong text-muted"];
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap", cls)}>{label}</span>;
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  const { t } = useI18n();
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="eyebrow mb-2">{t.admin.dashboard}</p>
        <h1 className="heading-lg text-2xl sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
