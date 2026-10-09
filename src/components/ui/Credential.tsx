import { GraduationCap } from "lucide-react";
import type { About, Locale } from "@/lib/types";
import { hasText, tl } from "@/i18n/config";
import { cn } from "@/lib/utils";

/** Degree badge, e.g. "BSc in Software Engineering · Ural Federal University · 2025". Hidden when empty. */
export function Credential({ about, locale, className }: { about: About; locale: Locale; className?: string }) {
  if (!hasText(about.degree)) return null;
  return (
    <p className={cn("flex items-start gap-2.5 text-sm text-fg/90", className)}>
      <GraduationCap className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
      <span>
        <span className="font-semibold">{tl(about.degree, locale)}</span>
        {hasText(about.university) && <span className="text-muted"> · {tl(about.university, locale)}</span>}
        {about.graduationYear && <span className="text-muted"> · {about.graduationYear}</span>}
      </span>
    </p>
  );
}

/** Large education card for the About page. */
export function EducationCard({ about, locale, title, graduated }: { about: About; locale: Locale; title: string; graduated: string }) {
  if (!hasText(about.degree)) return null;
  return (
    <div className="card glow-ring flex items-center gap-5 p-5 sm:p-6" data-reveal>
      <span className="icon-tile size-16 shrink-0">
        <GraduationCap className="size-8" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="eyebrow mb-1">{title}</p>
        <p className="heading-md text-xl">{tl(about.degree, locale)}</p>
        <p className="mt-1 text-sm text-muted">
          {tl(about.university, locale)}
          {about.graduationYear && ` · ${graduated.replace("{year}", about.graduationYear)}`}
        </p>
      </div>
    </div>
  );
}
