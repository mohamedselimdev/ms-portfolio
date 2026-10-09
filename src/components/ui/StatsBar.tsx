import type { Locale, Stat } from "@/lib/types";
import { tl } from "@/i18n/config";
import { Icon } from "@/components/icons";

/** Renders only when real stats were added from the dashboard. */
export function StatsBar({ stats, locale }: { stats: Stat[]; locale: Locale }) {
  const items = stats.filter((s) => s.value.trim());
  if (!items.length) return null;
  return (
    <section className="container-x relative z-10" aria-label="Stats">
      <ul className="card grid grid-cols-2 gap-px overflow-hidden bg-line p-0 lg:grid-flow-col lg:auto-cols-fr lg:grid-cols-none" data-reveal>
        {items.map((s) => (
          <li key={s.id} className="flex items-center gap-3 bg-surface px-4 py-5 sm:gap-4 sm:px-6">
            <span className="icon-tile size-11 rounded-full sm:size-12">
              <Icon name={s.icon} className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-xl font-extrabold sm:text-2xl">{s.value}</span>
              <span className="block text-xs text-muted sm:text-sm">{tl(s.label, locale)}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
