import { cn } from "@/lib/utils";

/** Handwritten two-line signature, e.g. "Mohamed" / "Selim". */
export function Signature({ name, className }: { name: string; className?: string }) {
  const [first, ...rest] = name.trim().split(/\s+/);
  return (
    <span aria-hidden="true" dir="ltr" className={cn("pointer-events-none flex -rotate-[8deg] flex-col signature-text font-script leading-[0.8] select-none", className)}>
      <span>{first}</span>
      {rest.length > 0 && <span className="ps-[0.9em]">{rest.join(" ")}</span>}
    </span>
  );
}
