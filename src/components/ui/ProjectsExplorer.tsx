"use client";

import { useState } from "react";
import { LayoutGrid } from "lucide-react";
import { Icon } from "@/components/icons";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/utils";

export function ProjectsExplorer({
  categories,
  items,
}: {
  categories: { slug: string; name: string; icon: string }[];
  items: { id: string; category: string; card: React.ReactNode }[];
}) {
  const { t } = useI18n();
  const [active, setActive] = useState("all");
  const counts = Object.fromEntries(categories.map((c) => [c.slug, items.filter((i) => i.category === c.slug).length]));
  const tabs = [{ slug: "all", name: t.projects.all, icon: "" }, ...categories.filter((c) => counts[c.slug] > 0)];
  const visible = active === "all" ? items : items.filter((i) => i.category === active);

  return (
    <div>
      <div role="group" aria-label={t.projects.filterLabel} className="card -mx-1 flex gap-2 overflow-x-auto p-2 [scrollbar-width:none] sm:mx-0">
        {tabs.map((tab) => (
          <button
            key={tab.slug}
            type="button"
            aria-pressed={active === tab.slug}
            onClick={() => setActive(tab.slug)}
            className={cn("btn btn-sm shrink-0 gap-2", active === tab.slug ? "btn-primary" : "btn-ghost border border-line")}
          >
            {tab.icon ? <Icon name={tab.icon} className="size-4" /> : <LayoutGrid className="size-4" aria-hidden="true" />}
            {tab.name}
            <span className="rounded-md bg-black/25 px-1.5 text-xs tabular-nums">{tab.slug === "all" ? items.length : counts[tab.slug]}</span>
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        {visible.map((i) => (
          <div key={i.id}>{i.card}</div>
        ))}
      </div>
      {visible.length === 0 && <p className="py-16 text-center text-muted">{t.projects.empty}</p>}
    </div>
  );
}
