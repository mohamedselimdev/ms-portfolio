"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Slide = { src: string; alt: string; width: number; height: number };

/** One framed slideshow that crossfades through the photos on its own, pausing on hover or focus. */
export function PhotoCarousel({
  slides,
  label,
  prevLabel = "Previous photo",
  nextLabel = "Next photo",
  interval = 4500,
}: {
  slides: Slide[];
  label: string;
  prevLabel?: string;
  nextLabel?: string;
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (paused || count < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), interval);
    return () => window.clearInterval(id);
  }, [paused, count, interval]);

  return (
    <div
      className="relative mx-auto max-w-md"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_30px_80px_-30px_rgba(31,107,255,0.45)]">
        {slides.map((s, i) => (
          <figure
            key={s.src}
            aria-hidden={i !== index}
            className={cn("absolute inset-0 transition-opacity duration-1000 ease-in-out", i === index ? "opacity-100" : "opacity-0")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} alt={s.alt} width={s.width} height={s.height} loading="lazy" className="h-full w-full object-contain" />
          </figure>
        ))}

        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label={prevLabel}
          className="absolute start-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
        >
          <ChevronLeft className="size-5 rtl:-scale-x-100" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label={nextLabel}
          className="absolute end-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
        >
          <ChevronRight className="size-5 rtl:-scale-x-100" aria-hidden="true" />
        </button>

        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => go(i)}
              aria-label={`${i + 1} / ${count}`}
              aria-current={i === index}
              className={cn("h-2 rounded-full shadow-[0_0_6px_rgba(0,0,0,0.6)] transition-all", i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
