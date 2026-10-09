"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Languages } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { LOCALE_COOKIE } from "@/i18n/config";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className, compact = false }: { className?: string; compact?: boolean }) {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const other = locale === "en" ? "ar" : "en";
  const target = `${pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${other}`)}${search ? `?${search}` : ""}`;

  return (
    <a
      href={target}
      hrefLang={other}
      lang={other}
      onClick={() => {
        document.cookie = `${LOCALE_COOKIE}=${other};path=/;max-age=31536000;samesite=lax`;
      }}
      className={cn("btn btn-ghost btn-sm border border-line-strong", className)}
      aria-label={`${t.common.language}: ${t.common.switchTo}`}
    >
      <Languages className="size-4" aria-hidden="true" />
      {!compact && <span>{t.common.switchTo}</span>}
    </a>
  );
}
