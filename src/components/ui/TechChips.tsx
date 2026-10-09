import { list } from "@/i18n/config";
import { TechIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function TechChips({ stack, max, className }: { stack: string; max?: number; className?: string }) {
  const items = list(stack);
  const shown = max ? items.slice(0, max) : items;
  if (!items.length) return null;
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {shown.map((name) => (
        <li key={name} className="chip">
          <TechIcon name={name} className="size-3.5" />
          {name}
        </li>
      ))}
      {max && items.length > max && <li className="chip text-muted">+{items.length - max}</li>}
    </ul>
  );
}
