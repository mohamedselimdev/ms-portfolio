import { cn } from "@/lib/utils";
import { Highlight } from "./Highlight";

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  subtitle,
  action,
  as: Tag = "h2",
  className,
  size = "lg",
  id,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  action?: React.ReactNode;
  as?: "h1" | "h2";
  className?: string;
  size?: "lg" | "xl";
}) {
  return (
    <div className={cn("flex flex-col gap-5 md:flex-row md:items-end md:justify-between", className)} data-reveal>
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <Tag id={id} className={size === "xl" ? "heading-xl" : "heading-lg"}>
          <Highlight text={title} /> {highlight && <span className="text-highlight">{highlight}</span>}
        </Tag>
        {subtitle && <p className="mt-3 text-base text-muted sm:text-lg">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
