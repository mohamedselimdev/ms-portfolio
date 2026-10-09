import { cn } from "@/lib/utils";
import { Signature } from "./Signature";
import { Highlight } from "./Highlight";

export function PageHero({
  badge,
  title,
  highlight,
  titleAfter,
  subtitle,
  image,
  imageAlt,
  signature,
  note,
  watermark,
  children,
  compact = false,
}: {
  badge?: string;
  title: string;
  highlight?: string;
  titleAfter?: string;
  subtitle?: string;
  image?: string;
  imageAlt: string;
  signature?: string;
  note?: string;
  watermark?: string;
  children?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <section className="hero-bg relative isolate overflow-hidden">
      <div aria-hidden="true" className="grid-bg absolute inset-0 -z-20 opacity-60" />

      <div className={cn("container-x relative grid lg:min-h-[38rem] lg:grid-cols-[1.05fr_0.95fr]", compact ? "lg:min-h-[30rem]" : "")}>
        <div className="relative z-10 order-2 flex flex-col gap-6 pt-2 pb-12 lg:order-1 lg:self-center lg:py-16">
          {badge && (
            <p className="pill self-start border-primary/30 bg-primary/5 text-[0.7rem] font-bold tracking-[0.14em] text-fg/90 uppercase rtl:tracking-normal rtl:normal-case">
              <span className="status-dot bg-primary!" aria-hidden="true" />
              {badge}
            </p>
          )}
          <h1 className="heading-xl text-balance">
            <Highlight text={title} />
            {(highlight || titleAfter) && <br />}
            {highlight && <span className="text-highlight">{highlight}</span>} {titleAfter}
          </h1>
          {subtitle && <p className="max-w-xl text-base leading-relaxed text-fg/80 sm:text-lg">{subtitle}</p>}
          {children}
        </div>

        {image && (
          <div className="relative order-1 -mx-4 h-[19rem] xs:h-[22rem] sm:-mx-6 sm:h-[28rem] lg:order-2 lg:mx-0 lg:-ms-[14%] lg:-me-10 lg:h-auto lg:min-h-[38rem] lg:self-stretch">
            {watermark && (
              // eslint-disable-next-line @next/next/no-img-element -- decorative SVG watermark
              <img src={watermark} alt="" aria-hidden="true" className="absolute top-[12%] start-[-6%] -z-10 w-[62%] opacity-[0.07] blur-[1px] lg:start-[-18%]" />
            )}
            <div aria-hidden="true" className="hero-glow absolute start-1/2 top-[6%] -z-10 aspect-square w-[80%] -translate-x-1/2 rtl:translate-x-1/2" />
            <div className="hero-portrait absolute inset-0 flex items-end justify-center">
              {/* Plain img keeps the intrinsic aspect ratio, so the mask box around it lines up with the photo itself. */}
              <div className="hero-portrait-mask flex h-full max-w-full items-end">
                {/* eslint-disable-next-line @next/next/no-img-element -- CMS image of unknown size, already pre-optimized */}
                <img src={image} alt={imageAlt} fetchPriority="high" decoding="async" className="hero-portrait-img max-h-full w-auto max-w-full" />
              </div>
            </div>
            {(signature || note) && (
              <div className="absolute top-2 end-4 z-10 flex flex-col items-end gap-5 lg:top-6 lg:end-2">
                {signature && <Signature name={signature} className="me-2 text-[2.5rem] sm:text-5xl lg:text-[3.5rem]" />}
                {note && (
                  <div className="hidden flex-col items-start sm:flex">
                    <p className="w-48 rounded-2xl border border-primary/45 bg-[#0a1733]/70 px-5 py-4 text-[0.95rem] leading-snug text-white/90 shadow-[inset_0_0_24px_rgba(31,107,255,0.12)] backdrop-blur-sm">{note}</p>
                    <svg viewBox="0 0 64 64" className="ms-5 mt-3 size-14 text-white/80 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M8 56C30 52 44 36 48 10" />
                      <path d="M40 17L48 10L53 19" />
                      <path d="M15 49L8 56L17 58" />
                    </svg>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
