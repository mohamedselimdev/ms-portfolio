import { cn } from "@/lib/utils";

const ARABIC = /[؀-ۿ]/;

/** Handwritten signature: "Mohamed" / "Selim" in script, or an Arabic name in Ruqaa with a pen swash under it. */
export function Signature({ name, className }: { name: string; className?: string }) {
  if (ARABIC.test(name)) {
    return (
      <span aria-hidden="true" dir="rtl" className={cn("pointer-events-none inline-flex rotate-[-4deg] flex-col items-center signature-text signature-ar select-none", className)}>
        <span className="whitespace-nowrap leading-none">{name.trim()}</span>
        <svg viewBox="0 0 200 24" className="-mt-[0.12em] h-[0.32em] w-[1.15em] min-w-full" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M196 6C150 20 70 22 4 12C40 15 90 14 128 9" />
        </svg>
      </span>
    );
  }
  const [first, ...rest] = name.trim().split(/\s+/);
  return (
    <span aria-hidden="true" dir="ltr" className={cn("pointer-events-none flex -rotate-[8deg] flex-col signature-text font-script leading-[0.8] select-none", className)}>
      <span>{first}</span>
      {rest.length > 0 && <span className="ps-[0.9em]">{rest.join(" ")}</span>}
    </span>
  );
}
