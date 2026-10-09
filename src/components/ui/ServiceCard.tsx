import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { Locale, Service } from "@/lib/types";
import { lines, tl } from "@/i18n/config";
import { Icon } from "@/components/icons";

export function ServiceCard({ service, locale, index, detailed = false, cta }: { service: Service; locale: Locale; index: number; detailed?: boolean; cta?: string }) {
  const features = lines(service.features, locale);
  return (
    <article className="card card-hover flex h-full flex-col gap-4 p-5 sm:p-6" data-reveal style={{ "--reveal-delay": `${(index % 4) * 60}ms` } as React.CSSProperties}>
      <div className="flex items-start justify-between gap-3">
        <span className="icon-tile">
          <Icon name={service.icon} className="size-6" />
        </span>
        {detailed && <span className="font-mono text-xs text-subtle">{String(index + 1).padStart(2, "0")}</span>}
      </div>
      <div>
        <h3 className="heading-md text-lg">{tl(service.title, locale)}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{tl(service.description, locale)}</p>
      </div>
      {detailed && features.length > 0 && (
        <ul className="flex flex-col gap-2 text-sm">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <span className="text-fg/85">{f}</span>
            </li>
          ))}
        </ul>
      )}
      <Link href={`/${locale}/contact`} className={detailed ? "btn btn-outline btn-sm mt-auto self-start" : "mt-auto grid size-9 place-items-center rounded-full border border-primary/40 text-accent hover:bg-primary/15"} aria-label={cta ? `${cta} — ${tl(service.title, locale)}` : tl(service.title, locale)}>
        {detailed && cta}
        <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
      </Link>
    </article>
  );
}
