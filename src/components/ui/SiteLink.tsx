import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

/** Visible, clickable domain of a live project (e.g. "hema-phone-store.mohamedselim.workers.dev"). */
export function SiteLink({ url, className }: { url: string; className?: string }) {
  if (!url) return null;
  const domain = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      dir="ltr"
      className={cn("relative z-10 inline-flex max-w-full items-center gap-1.5 text-sm text-accent underline-offset-4 hover:underline", className)}
    >
      <Globe className="size-4 shrink-0" aria-hidden="true" />
      <span className="truncate">{domain}</span>
    </a>
  );
}
