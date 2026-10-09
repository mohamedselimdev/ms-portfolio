"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Archive, CheckCheck, Mail, MailOpen, Reply, Search, Trash2 } from "lucide-react";
import { deleteInquiry, setInquiryStatus } from "@/app/actions/admin";
import { useI18n } from "@/i18n/client";
import type { Inquiry, InquiryStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PageHeader, StatusBadge, useConfirm, useToast } from "./ui";

export function InquiriesManager({ inquiries, title, description }: { inquiries: Inquiry[]; title: string; description: string }) {
  const { t, locale } = useI18n();
  const toast = useToast();
  const router = useRouter();
  const { confirm, dialog } = useConfirm();
  const [pending, start] = useTransition();
  const [status, setStatus] = useState<"all" | InquiryStatus>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const fmt = new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", { dateStyle: "medium", timeStyle: "short" });

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inquiries.filter(
      (i) => (status === "all" ? i.status !== "archived" : i.status === status) && (!q || `${i.name} ${i.email} ${i.company} ${i.message}`.toLowerCase().includes(q)),
    );
  }, [inquiries, status, query]);
  const selected = inquiries.find((i) => i.id === selectedId) ?? null;

  const act = (fn: () => Promise<{ ok: boolean }>, quiet = false) =>
    start(async () => {
      const res = await fn();
      if (!quiet || !res.ok) toast(res.ok ? "success" : "error", res.ok ? t.admin.actions.saved : t.validation.generic);
      if (res.ok) router.refresh();
    });

  const open = (i: Inquiry) => {
    setSelectedId(i.id);
    if (i.status === "new") act(() => setInquiryStatus(i.id, "read"), true);
  };

  const statuses: ("all" | InquiryStatus)[] = ["all", "new", "read", "replied", "archived"];

  return (
    <div>
      <PageHeader title={title} description={description} />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex gap-1 overflow-x-auto rounded-xl border border-line p-1">
          {statuses.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={status === s}
              onClick={() => setStatus(s)}
              className={cn("btn btn-sm shrink-0", status === s ? "btn-primary" : "btn-ghost")}
            >
              {s === "all" ? t.admin.fields.all : t.admin.inquiry[s]}
              <span className="tabular-nums opacity-70">{s === "all" ? inquiries.filter((i) => i.status !== "archived").length : inquiries.filter((i) => i.status === s).length}</span>
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.admin.search} aria-label={t.admin.search} className="field min-h-10 py-2 ps-9" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <ul className="flex flex-col gap-2" aria-busy={pending}>
          {list.length === 0 && <li className="card p-10 text-center text-muted">{t.admin.overview.noInquiries}</li>}
          {list.map((i) => (
            <li key={i.id}>
              <button
                type="button"
                onClick={() => open(i)}
                className={cn("card flex w-full items-start gap-3 p-3 text-start transition-colors hover:border-primary/50", selectedId === i.id && "border-primary/70 bg-primary/5")}
              >
                <span className={cn("grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold", i.status === "new" ? "bg-primary text-white" : "bg-white/10 text-muted")}>
                  {i.name.trim().slice(0, 2).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className={cn("truncate text-sm", i.status === "new" ? "font-bold" : "font-medium")}>{i.name}</span>
                    <StatusBadge status={i.status} />
                  </span>
                  <span className="block truncate text-xs text-muted" dir="ltr">
                    {i.email}
                  </span>
                  <span className="mt-1 line-clamp-1 text-xs text-fg/70">{i.message}</span>
                  <span className="mt-1 block text-[0.7rem] text-subtle">{fmt.format(new Date(i.createdAt))}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="lg:sticky lg:top-24 lg:self-start">
          {selected ? (
            <article className="card p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-bold">{selected.name}</h2>
                  <a href={`mailto:${selected.email}`} className="text-sm text-accent hover:underline" dir="ltr">
                    {selected.email}
                  </a>
                </div>
                <StatusBadge status={selected.status} />
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                {[
                  [t.admin.inquiry.service, selected.service],
                  [t.admin.inquiry.company, selected.company || "—"],
                  [t.admin.inquiry.budget, selected.budget],
                  [t.admin.inquiry.timeline, selected.timeline],
                  [t.admin.inquiry.received, fmt.format(new Date(selected.createdAt))],
                  [t.common.language, selected.locale.toUpperCase()],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-line p-3">
                    <dt className="text-xs text-muted">{k}</dt>
                    <dd className="mt-0.5 font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              <h3 className="mt-5 mb-2 text-sm font-semibold">{t.admin.inquiry.message}</h3>
              <p className="rounded-xl border border-line bg-white/[0.02] p-4 text-sm leading-relaxed whitespace-pre-wrap" dir="auto">
                {selected.message}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.service}`)}`}
                  onClick={() => act(() => setInquiryStatus(selected.id, "replied"), true)}
                  className="btn btn-primary btn-sm"
                >
                  <Reply className="size-4 rtl:-scale-x-100" aria-hidden="true" />
                  {t.admin.actions.reply}
                </a>
                <button type="button" className="btn btn-outline btn-sm" disabled={pending} onClick={() => act(() => setInquiryStatus(selected.id, "replied"))}>
                  <CheckCheck className="size-4" aria-hidden="true" />
                  {t.admin.actions.markReplied}
                </button>
                <button type="button" className="btn btn-ghost btn-sm" disabled={pending} onClick={() => act(() => setInquiryStatus(selected.id, selected.status === "new" ? "read" : "new"))}>
                  {selected.status === "new" ? <MailOpen className="size-4" aria-hidden="true" /> : <Mail className="size-4" aria-hidden="true" />}
                  {selected.status === "new" ? t.admin.actions.markRead : t.admin.inquiry.new}
                </button>
                <button type="button" className="btn btn-ghost btn-sm" disabled={pending} onClick={() => act(() => setInquiryStatus(selected.id, "archived"))}>
                  <Archive className="size-4" aria-hidden="true" />
                  {t.admin.actions.archive}
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  disabled={pending}
                  onClick={async () => {
                    if (await confirm(t.admin.actions.confirmDelete)) {
                      act(() => deleteInquiry(selected.id));
                      setSelectedId(null);
                    }
                  }}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                  {t.admin.actions.delete}
                </button>
              </div>
            </article>
          ) : (
            <p className="card grid min-h-60 place-items-center p-10 text-center text-muted">{t.admin.inquiry.select}</p>
          )}
        </div>
      </div>
      {dialog}
    </div>
  );
}
