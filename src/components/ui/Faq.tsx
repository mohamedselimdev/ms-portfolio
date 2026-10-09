import { ChevronDown, CircleHelp } from "lucide-react";

export function FaqList({ items }: { items: { id: string; question: string; answer: string }[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 md:items-start">
      {items.map((item, i) => (
        <details key={item.id} className="card group p-0 open:border-primary/40" data-reveal style={{ "--reveal-delay": `${(i % 2) * 60}ms` } as React.CSSProperties}>
          <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 px-4 py-3 text-start font-semibold sm:px-5 [&::-webkit-details-marker]:hidden">
            <CircleHelp className="size-5 shrink-0 text-accent" aria-hidden="true" />
            <span className="flex-1">{item.question}</span>
            <ChevronDown className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <p className="px-4 pb-4 ps-12 text-sm leading-relaxed text-muted sm:px-5 sm:ps-13">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
