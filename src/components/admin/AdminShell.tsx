"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  Award, BarChart3, Briefcase, CircleHelp, Code, ExternalLink, FileText, Gem, House, Images, Inbox, LayoutDashboard, LayoutGrid,
  LogOut, Menu, Milestone, Navigation, Palette, Search, Settings, Share2, Star, Tags, Target, User, Workflow, type LucideIcon,
} from "lucide-react";
import { logout } from "@/app/actions/admin";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import { LogoMark } from "@/components/site/Logo";

const ICONS: Record<string, LucideIcon> = {
  overview: LayoutDashboard, home: House, user: User, "file-text": FileText, "layout-grid": LayoutGrid, tags: Tags, briefcase: Briefcase,
  workflow: Workflow, gem: Gem, star: Star, "circle-help": CircleHelp, "bar-chart": BarChart3, milestone: Milestone, award: Award,
  code: Code, target: Target, inbox: Inbox, images: Images, settings: Settings, share: Share2, navigation: Navigation,
  search: Search, palette: Palette,
};

export interface NavGroup {
  label: string;
  items: { key: string; label: string; icon: string; href: string; badge?: number }[];
}

export function AdminShell({ groups, logo, name, avatar, children }: { groups: NavGroup[]; logo: string; name: string; avatar: string; children: React.ReactNode }) {
  const { t, locale } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  // Menu is open only for the path it was opened on, so navigation closes it without an effect.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === pathname;
  const setOpen = (v: boolean | ((o: boolean) => boolean)) => setOpenedAt((typeof v === "function" ? v(open) : v) ? pathname : null);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const all = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const results = query.trim() ? all.filter((i) => i.label.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 8) : [];
  const isActive = (href: string) => (href === `/${locale}/admin` ? pathname === href : pathname.startsWith(href));

  const sidebar = (
    <nav aria-label={t.admin.dashboard} className="flex h-full flex-col gap-5 overflow-y-auto p-4">
      <Link href={`/${locale}/admin`} className="flex items-center gap-3 px-2 py-1">
        <LogoMark src={logo} className="h-9 w-auto" />
        <span className="leading-tight">
          <span className="block font-display text-sm font-extrabold uppercase rtl:normal-case">{name}</span>
          <span className="block text-xs text-muted">{t.admin.brandSub}</span>
        </span>
      </Link>
      {groups.map((g) => (
        <div key={g.label}>
          <p className="mb-1.5 px-3 text-[0.7rem] font-semibold tracking-wider text-accent uppercase rtl:tracking-normal">{g.label}</p>
          <ul className="flex flex-col gap-0.5">
            {g.items.map((item) => {
              const Icon = ICONS[item.icon] ?? LayoutGrid;
              const active = isActive(item.href);
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-10 items-center gap-3 rounded-xl px-3 text-sm transition-colors",
                      active ? "bg-primary/15 font-semibold text-fg ring-1 ring-primary/40" : "text-muted hover:bg-white/5 hover:text-fg",
                    )}
                  >
                    <Icon className={cn("size-[1.1rem] shrink-0", active && "text-accent")} aria-hidden="true" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {!!item.badge && <span className="rounded-full bg-danger px-1.5 text-xs font-bold text-white tabular-nums">{item.badge}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <div className="mt-auto flex flex-col gap-2 border-t border-line pt-4">
        <a href={`/${locale}`} target="_blank" rel="noopener" className="btn btn-outline btn-sm w-full">
          {t.admin.viewSite}
          <ExternalLink className="size-4" aria-hidden="true" />
        </a>
        <form action={logout.bind(null, locale)}>
          <button type="submit" className="btn btn-ghost btn-sm w-full justify-start">
            <LogOut className="size-4 rtl:-scale-x-100" aria-hidden="true" />
            {t.admin.logout}
          </button>
        </form>
      </div>
    </nav>
  );

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-dvh border-e border-line bg-surface/60 lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button type="button" className="absolute inset-0 bg-black/60" aria-label={t.common.closeMenu} onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 start-0 w-[85%] max-w-72 border-e border-line bg-surface">{sidebar}</aside>
        </div>
      )}

      <div className="min-w-0">
        <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-3 sm:px-6">
            <button type="button" className="btn btn-ghost btn-icon border border-line-strong lg:hidden" onClick={() => setOpen(true)} aria-label={t.common.menu} aria-expanded={open}>
              <Menu className="size-5" />
            </button>
            <div className="relative max-w-md flex-1">
              <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && results[0]) {
                    router.push(results[0].href);
                    setQuery("");
                  }
                  if (e.key === "Escape") setQuery("");
                }}
                placeholder={t.admin.search}
                aria-label={t.admin.search}
                className="field min-h-10 py-2 ps-9 pe-14"
              />
              <kbd className="pointer-events-none absolute end-3 top-1/2 hidden -translate-y-1/2 rounded border border-line-strong px-1.5 text-[0.65rem] text-muted sm:block">Ctrl K</kbd>
              {results.length > 0 && (
                <ul className="card absolute inset-x-0 top-full z-50 mt-2 p-1.5" role="listbox">
                  {results.map((r) => (
                    <li key={r.key}>
                      <Link href={r.href} onClick={() => setQuery("")} className="flex min-h-10 items-center rounded-lg px-3 text-sm hover:bg-white/5">
                        {r.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="ms-auto flex items-center gap-2">
              <Suspense>
                <LanguageSwitcher compact />
              </Suspense>
              <span className="hidden items-center gap-2.5 sm:flex">
                {/* eslint-disable-next-line @next/next/no-img-element -- small avatar */}
                <img src={avatar} alt="" className="size-9 rounded-full object-cover object-top ring-2 ring-primary/40" />
                <span className="leading-tight">
                  <span className="block text-sm font-semibold">{name}</span>
                  <span className="block text-xs text-muted">{t.admin.administrator}</span>
                </span>
              </span>
            </div>
          </div>
        </header>
        <main id="main" className="px-3 py-6 sm:px-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
