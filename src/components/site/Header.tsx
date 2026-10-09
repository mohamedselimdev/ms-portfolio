"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";

export interface HeaderProps {
  nav: { href: string; label: string }[];
  logo: string;
  name: string;
  role: string;
}

export function Header({ nav, logo, name, role }: HeaderProps) {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  // Menu is open only for the path it was opened on, so navigation closes it without an effect.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === pathname;
  const setOpen = (v: boolean | ((o: boolean) => boolean)) => setOpenedAt((typeof v === "function" ? v(open) : v) ? pathname : null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenedAt(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === `/${locale}` ? pathname === href : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 px-2 pt-2 sm:px-4 sm:pt-3">
      <div
        className={cn(
          "container-x flex h-16 items-center justify-between gap-3 rounded-2xl border transition-colors duration-300 lg:h-[4.75rem]",
          scrolled || open ? "border-line-strong bg-bg/85 shadow-[0_10px_40px_-20px_rgba(0,0,0,.8)] backdrop-blur-xl" : "border-line bg-bg/40 backdrop-blur-md",
        )}
      >
        <Logo locale={locale} src={logo} name={name} role={role} />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors xl:px-5 xl:text-[0.95rem]",
                    isActive(item.href) ? "text-accent" : "text-muted hover:text-fg",
                  )}
                >
                  {item.label}
                  {isActive(item.href) && <span className="absolute inset-x-3.5 -bottom-1 h-0.5 rounded-full bg-primary xl:inset-x-5" />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Suspense>
            <LanguageSwitcher className="hidden sm:inline-flex" />
            <LanguageSwitcher className="sm:hidden" compact />
          </Suspense>
          <Link href={`/${locale}/contact`} className="btn btn-primary btn-sm hidden md:inline-flex lg:min-h-11 lg:px-5">
            {t.common.hireMe}
            <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="btn btn-ghost btn-icon border border-line-strong lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t.common.closeMenu : t.common.menu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="container-x fixed inset-x-0 top-[5.25rem] lg:top-24 bottom-0 z-40 overflow-y-auto lg:hidden"
      >
        <nav aria-label="Mobile" className="card mt-2 p-3">
          <ul className="flex flex-col">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "flex min-h-12 items-center rounded-xl px-4 text-base font-medium",
                    isActive(item.href) ? "bg-primary/15 text-accent" : "text-fg hover:bg-white/5",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href={`/${locale}/contact`} className="btn btn-primary mt-3 w-full">
            {t.common.startProject}
            <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
