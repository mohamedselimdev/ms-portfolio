"use client";

import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import { useI18n } from "@/i18n/client";

export default function NotFound() {
  const { t, locale } = useI18n();
  return (
    <main className="relative isolate grid min-h-dvh place-items-center overflow-hidden px-4 py-16 text-center">
      <title>{t.meta.notFoundTitle}</title>
      <div aria-hidden="true" className="grid-bg absolute inset-0 -z-10" />
      <div aria-hidden="true" className="absolute top-1/3 left-1/2 -z-10 size-[28rem] -translate-x-1/2 rounded-full bg-primary/25 blur-[120px]" />
      <div className="flex max-w-lg flex-col items-center gap-5">
        {/* eslint-disable-next-line @next/next/no-img-element -- static brand SVG */}
        <img src="/images/brand/logo.svg" alt="" className="h-12 w-auto" />
        <p className="font-display text-[clamp(5rem,20vw,9rem)] leading-none font-extrabold text-highlight">{t.notFound.code}</p>
        <h1 className="heading-lg">{t.notFound.title}</h1>
        <p className="text-muted">{t.notFound.text}</p>
        <div className="mt-2 flex flex-col gap-3 xs:flex-row">
          <Link href={`/${locale}`} className="btn btn-primary">
            <Home className="size-4" aria-hidden="true" />
            {t.notFound.home}
          </Link>
          <Link href={`/${locale}/projects`} className="btn btn-outline">
            {t.notFound.projects}
            <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </main>
  );
}
