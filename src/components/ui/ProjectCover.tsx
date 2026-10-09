import Image from "next/image";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";

/** Project image, or a branded placeholder when no screenshot exists yet. */
export function ProjectCover({
  image,
  title,
  icon = "code-xml",
  className,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
}: {
  image: string;
  title: string;
  icon?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (image) {
    return (
      <div className={cn("relative overflow-hidden bg-black/40", className)}>
        <Image src={image} alt={title} fill sizes={sizes} priority={priority} className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />
      </div>
    );
  }
  return (
    <div className={cn("relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/25 via-surface to-bg", className)} role="img" aria-label={title}>
      <div aria-hidden="true" className="grid-bg absolute inset-0" />
      <div aria-hidden="true" className="absolute -bottom-10 -end-10 size-48 rounded-full bg-primary/30 blur-3xl" />
      <div className="relative flex flex-col items-center gap-3 px-6 text-center">
        <span className="icon-tile size-14">
          <Icon name={icon} className="size-7" />
        </span>
        <span className="line-clamp-2 max-w-xs font-display text-lg font-bold text-fg/90">{title.split("—")[0]}</span>
      </div>
    </div>
  );
}
