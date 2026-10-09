"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useI18n } from "@/i18n/client";

export function Gallery({ images }: { images: { src: string; caption: string }[] }) {
  const { t, locale } = useI18n();
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);

  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  };
  const step = useCallback((d: number) => setIndex((i) => (i + d + images.length) % images.length), [images.length]);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (!el.open) return;
      const forward = locale === "ar" ? "ArrowLeft" : "ArrowRight";
      const back = locale === "ar" ? "ArrowRight" : "ArrowLeft";
      if (e.key === forward) step(1);
      if (e.key === back) step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, locale]);

  const current = images[index];

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, i) => (
          <li key={img.src + i} data-reveal>
            <button type="button" onClick={() => open(i)} className="card card-hover group block w-full overflow-hidden p-2 text-start" aria-label={`${t.projects.openImage}: ${img.caption}`}>
              <span className="relative block aspect-[16/10] overflow-hidden rounded-[calc(var(--radius)*0.6)] bg-black/40">
                <Image src={img.src} alt={img.caption} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />
                <span className="absolute end-2 top-2 grid size-8 place-items-center rounded-lg bg-bg/80 opacity-0 transition-opacity group-hover:opacity-100">
                  <Expand className="size-4" aria-hidden="true" />
                </span>
              </span>
              {img.caption && <span className="block px-2 pt-3 pb-1 text-sm font-medium">{img.caption}</span>}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        className="m-auto h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-black/85 backdrop:backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        aria-label={current?.caption}
      >
        {current && (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-3 sm:p-8" onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}>
            <div className="relative h-[75dvh] w-full max-w-6xl">
              <Image src={current.src} alt={current.caption} fill sizes="100vw" className="object-contain" />
            </div>
            <p className="text-center text-sm text-fg/90">
              {current.caption} <span className="text-muted">· {index + 1} / {images.length}</span>
            </p>
            <div className="flex gap-2">
              {images.length > 1 && (
                <button type="button" className="btn btn-outline btn-icon" onClick={() => step(-1)} aria-label={t.projects.previousImage}>
                  <ChevronLeft className="size-5 rtl:-scale-x-100" />
                </button>
              )}
              <button type="button" className="btn btn-outline btn-icon" onClick={() => dialog.current?.close()} aria-label={t.projects.closeImage} autoFocus>
                <X className="size-5" />
              </button>
              {images.length > 1 && (
                <button type="button" className="btn btn-outline btn-icon" onClick={() => step(1)} aria-label={t.projects.nextImage}>
                  <ChevronRight className="size-5 rtl:-scale-x-100" />
                </button>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
