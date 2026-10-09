import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Activity, ArrowRight, Briefcase, ExternalLink, Eye, FolderKanban, House, ImagePlus, Inbox, Palette, Pencil, Plus, Trash2, Upload, Users,
} from "lucide-react";
import { getMessages } from "@/i18n";
import { isLocale, tl } from "@/i18n/config";
import { getAnalytics, getContent, getInquiries } from "@/lib/store";
import { byOrder } from "@/lib/content";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/ui";
import { TrafficChart } from "@/components/admin/TrafficChart";
import { Signature } from "@/components/ui/Signature";

function relative(iso: string, locale: string) {
  const diff = (new Date(iso).getTime() - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(locale === "ar" ? "ar" : "en", { numeric: "auto" });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [["year", 31536000], ["month", 2592000], ["day", 86400], ["hour", 3600], ["minute", 60]];
  for (const [unit, s] of units) if (Math.abs(diff) >= s) return rtf.format(Math.round(diff / s), unit);
  return rtf.format(Math.round(diff), "second");
}

function lastDays(data: Record<string, { views: number; visitors: number }>, n: number) {
  const now = Date.now();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now - (n - 1 - i) * 86400000).toISOString().slice(0, 10);
    return { date: d, ...(data[d] ?? { views: 0, visitors: 0 }) };
  });
}

export default async function Overview({ params }: PageProps<"/[lang]/admin">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getMessages(lang);
  const [content, inquiries, analytics] = await Promise.all([getContent(), getInquiries(), getAnalytics()]);
  const base = `/${lang}/admin`;

  const projects = byOrder(content.projects);
  const publishedProjects = projects.filter((p) => p.status === "published").length;
  const unread = inquiries.filter((i) => i.status === "new");
  const recentInquiries = [...inquiries].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  const days = lastDays(analytics.days, 30);
  const visitors30 = days.reduce((s, d) => s + d.visitors, 0);
  const views30 = days.reduce((s, d) => s + d.views, 0);
  const topPages = Object.entries(analytics.paths).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topRefs = Object.entries(analytics.referrers).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const statusCounts = (["completed", "in-progress", "archived"] as const).map((s) => ({ key: s, count: projects.filter((p) => p.projectStatus === s).length }));
  const drafts = projects.filter((p) => p.status === "draft").length;
  const statusColors = { completed: "#22c55e", "in-progress": "#3da5ff", archived: "#9aa8c3" };

  const cards = [
    { icon: FolderKanban, label: t.admin.stats.projects, value: projects.length, sub: `${publishedProjects} ${t.admin.stats.published}`, href: `${base}/projects` },
    { icon: Briefcase, label: t.admin.stats.services, value: content.services.length, sub: `${content.services.filter((s) => s.status === "published").length} ${t.admin.stats.published}`, href: `${base}/services` },
    { icon: Inbox, label: t.admin.stats.inquiries, value: inquiries.length, sub: `${unread.length} ${t.admin.stats.unread}`, href: `${base}/inquiries` },
    { icon: Users, label: t.admin.stats.visitors, value: visitors30, sub: `${views30} ${t.admin.stats.views} · ${t.admin.stats.last30}`, href: `${base}` },
  ];

  const quick = [
    { icon: Plus, label: t.admin.overview.addProject, href: `${base}/projects` },
    { icon: House, label: t.admin.overview.editHero, href: `${base}/hero` },
    { icon: Upload, label: t.admin.overview.uploadMedia, href: `${base}/media` },
    { icon: Inbox, label: t.admin.overview.viewInquiries, href: `${base}/inquiries` },
    { icon: Palette, label: t.admin.sections.theme, href: `${base}/theme` },
    { icon: ImagePlus, label: t.admin.sections.seo, href: `${base}/seo` },
  ];

  const actionIcon = { create: Plus, update: Pencil, delete: Trash2, reorder: Activity, publish: Eye, unpublish: Eye, upload: Upload, login: Users };
  const sectionLabel = (s: string) => t.admin.sections[s as keyof typeof t.admin.sections] ?? s;
  const today = new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-GB", { dateStyle: "full" }).format(new Date());

  return (
    <div className="flex flex-col gap-5">
      <section className="card relative overflow-hidden p-5 sm:p-7">
        <div aria-hidden="true" className="grid-bg absolute inset-0 opacity-60" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="eyebrow mb-2">{t.admin.dashboard}</p>
            <h1 className="heading-lg">
              {t.admin.welcome}, <span className="text-highlight">{tl(content.settings.siteName, lang).split(" ")[0]}</span>
            </h1>
            <p className="mt-2 text-muted">{t.admin.welcomeText}</p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <Signature name={content.settings.siteName.en} className="hidden rotate-[-6deg] text-4xl md:flex" />
            <p className="text-sm text-muted">{today}</p>
            <a href={`/${lang}`} target="_blank" rel="noopener" className="btn btn-primary btn-sm">
              {t.admin.viewSite}
              <ExternalLink className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <ul className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {cards.map((c) => (
          <li key={c.label}>
            <Link href={c.href} className="card card-hover flex h-full flex-col gap-3 p-4 sm:p-5">
              <span className="flex items-center justify-between">
                <span className="icon-tile size-10">
                  <c.icon className="size-5" aria-hidden="true" />
                </span>
                <ArrowRight className="size-4 text-accent rtl:-scale-x-100" aria-hidden="true" />
              </span>
              <span className="text-sm text-muted">{c.label}</span>
              <span className="font-display text-3xl font-extrabold tabular-nums">{c.value}</span>
              <span className="text-xs text-subtle">{c.sub}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section className="card p-4 sm:p-5" aria-labelledby="traffic-title">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="traffic-title" className="font-display text-lg font-bold">
              {t.admin.overview.traffic}
            </h2>
            <span className="text-xs text-muted">{t.admin.stats.last30}</span>
          </div>
          {views30 > 0 ? <TrafficChart days={days} locale={lang} labels={{ views: t.admin.stats.views, visitors: t.admin.stats.visitors }} /> : <p className="grid h-48 place-items-center text-center text-sm text-muted">{t.admin.overview.trafficEmpty}</p>}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              { title: t.admin.overview.topPages, rows: topPages },
              { title: t.admin.overview.referrers, rows: topRefs },
            ].map((block) => (
              <div key={block.title}>
                <h3 className="mb-2 text-sm font-semibold">{block.title}</h3>
                {block.rows.length === 0 ? (
                  <p className="text-xs text-subtle">—</p>
                ) : (
                  <ul className="flex flex-col gap-1.5 text-sm">
                    {block.rows.map(([k, v]) => (
                      <li key={k} className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.03] px-3 py-1.5">
                        <span className="truncate" dir="ltr">
                          {k}
                        </span>
                        <span className="text-muted tabular-nums">{v}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="card p-4 sm:p-5" aria-labelledby="quick-title">
          <h2 id="quick-title" className="mb-4 font-display text-lg font-bold">
            {t.admin.overview.quickActions}
          </h2>
          <ul className="grid grid-cols-2 gap-3">
            {quick.map((q) => (
              <li key={q.label}>
                <Link href={q.href} className="flex h-full min-h-24 flex-col items-center justify-center gap-2 rounded-xl border border-line bg-white/[0.02] p-3 text-center text-sm transition-colors hover:border-primary/60 hover:bg-primary/5">
                  <q.icon className="size-6 text-accent" aria-hidden="true" />
                  {q.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-line p-3 text-sm">
            <span className="text-muted">{t.admin.overview.siteStatus}</span>
            <span className={cn("flex items-center gap-2 font-semibold", content.settings.siteVisible ? "text-green-300" : "text-amber-300")}>
              <span className={cn("size-2 rounded-full", content.settings.siteVisible ? "bg-success" : "bg-warning")} />
              {content.settings.siteVisible ? t.admin.overview.siteOnline : t.admin.overview.siteHidden}
            </span>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <section className="card p-4 sm:p-5" aria-labelledby="inq-title">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 id="inq-title" className="flex items-center gap-2 font-display text-lg font-bold">
              {t.admin.overview.recentInquiries}
              {unread.length > 0 && <span className="rounded-full bg-danger px-2 text-xs text-white">{unread.length}</span>}
            </h2>
            <Link href={`${base}/inquiries`} className="btn btn-outline btn-sm">
              {t.common.viewAll}
            </Link>
          </div>
          {recentInquiries.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted">{t.admin.overview.noInquiries}</p>
          ) : (
            <ul className="flex flex-col divide-y divide-line">
              {recentInquiries.map((i) => (
                <li key={i.id}>
                  <Link href={`${base}/inquiries`} className="flex items-center gap-3 py-3 hover:bg-white/[0.02]">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/20 text-sm font-bold text-accent">{i.name.slice(0, 2).toUpperCase()}</span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold">{i.name}</span>
                        <span className="text-[0.7rem] text-subtle">{relative(i.createdAt, lang)}</span>
                      </span>
                      <span className="block truncate text-xs text-muted">{i.message}</span>
                    </span>
                    <StatusBadge status={i.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-4 sm:p-5" aria-labelledby="status-title">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 id="status-title" className="font-display text-lg font-bold">
              {t.admin.overview.projectStatus}
            </h2>
            <Link href={`${base}/projects`} className="btn btn-outline btn-sm">
              {t.common.viewAll}
            </Link>
          </div>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <Donut segments={statusCounts.map((s) => ({ value: s.count, color: statusColors[s.key] }))} total={projects.length} label={t.admin.stats.projects} />
            <ul className="flex flex-1 flex-col gap-2 text-sm">
              {statusCounts.map((s) => (
                <li key={s.key} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full" style={{ background: statusColors[s.key] }} />
                    {t.projects.status[s.key]}
                  </span>
                  <span className="tabular-nums">{s.count}</span>
                </li>
              ))}
              <li className="flex items-center justify-between gap-3 border-t border-line pt-2 text-muted">
                <span>{t.admin.fields.draft}</span>
                <span className="tabular-nums">{drafts}</span>
              </li>
            </ul>
          </div>
          <ul className="mt-5 flex flex-col gap-2">
            {projects.slice(0, 4).map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-2 text-sm">
                <span className="truncate">{tl(p.title, lang)}</span>
                <StatusBadge status={p.status} />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="card p-4 sm:p-5" aria-labelledby="edits-title">
        <h2 id="edits-title" className="mb-4 font-display text-lg font-bold">
          {t.admin.overview.recentEdits}
        </h2>
        {content.activity.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">{t.admin.overview.noEdits}</p>
        ) : (
          <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {content.activity.slice(0, 10).map((a) => {
              const Icon = actionIcon[a.action] ?? Activity;
              return (
                <li key={a.id} className="flex items-center gap-3 rounded-xl border border-line px-3 py-2.5">
                  <span className="icon-tile size-9 rounded-full">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm">{a.label || sectionLabel(a.section)}</span>
                    <span className="block text-xs text-muted">
                      {t.admin.activity[a.action]} · {sectionLabel(a.section)}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-subtle">{relative(a.at, lang)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function Donut({ segments, total, label }: { segments: { value: number; color: string }[]; total: number; label: string }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="relative mx-auto size-36 shrink-0">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="10" />
        {total > 0 &&
          segments.map((s, i) => {
            const len = (s.value / total) * c;
            const el = <circle key={i} cx="50" cy="50" r={r} fill="none" stroke={s.color} strokeWidth="10" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset} />;
            offset += len;
            return el;
          })}
      </svg>
      <span className="absolute inset-0 grid place-items-center text-center">
        <span>
          <span className="block font-display text-3xl font-extrabold">{total}</span>
          <span className="text-xs text-muted">{label}</span>
        </span>
      </span>
    </div>
  );
}
