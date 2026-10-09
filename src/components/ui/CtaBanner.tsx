import Link from "next/link";
import { ArrowRight, Mail, Zap } from "lucide-react";
import type { Content, Locale } from "@/lib/types";
import type { Messages } from "@/i18n";
import { hasText, tl } from "@/i18n/config";
import { Highlight } from "./Highlight";

export function CtaBanner({ content, locale, t }: { content: Content; locale: Locale; t: Messages }) {
  const { pages, settings } = content;
  return (
    <section className="container-x py-12 sm:py-16" aria-labelledby="cta-title">
      <div className="card glow-ring relative overflow-hidden px-5 py-9 sm:px-10 sm:py-12" data-reveal>
        <div aria-hidden="true" className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 end-0 size-80 rounded-full bg-primary/25 blur-3xl" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow mb-3">{t.home.ctaEyebrow}</p>
            <h2 id="cta-title" className="heading-lg">
              <Highlight text={tl(pages.ctaTitle, locale)} />
            </h2>
            <p className="mt-3 text-muted sm:text-lg">{tl(pages.ctaSubtitle, locale)}</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 xs:flex-row">
              <Link href={`/${locale}/contact`} className="btn btn-primary">
                {t.common.startProject}
                <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
              </Link>
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="btn btn-outline">
                  <Mail className="size-4" aria-hidden="true" />
                  {t.common.sendMessage}
                </a>
              )}
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
              {hasText(settings.responseTime) && (
                <li className="flex items-center gap-1.5">
                  <Zap className="size-3.5 text-accent" aria-hidden="true" />
                  {tl(settings.responseTime, locale)}
                </li>
              )}
              {settings.availabilityEnabled && (
                <li className="flex items-center gap-2">
                  <span className="status-dot" aria-hidden="true" />
                  {t.common.availableNow}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
