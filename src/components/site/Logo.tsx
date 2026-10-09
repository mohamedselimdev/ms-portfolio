import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/types";

export function LogoMark({ src, className = "h-9 w-auto" }: { src: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- SVG/uploaded logos of unknown aspect ratio
  if (src.endsWith(".svg")) return <img src={src} alt="" className={className} width={48} height={36} />;
  return <Image src={src} alt="" width={96} height={72} className={className} />;
}

export function Logo({ locale, src, name, role }: { locale: Locale; src: string; name: string; role: string }) {
  return (
    <Link href={`/${locale}`} className="group flex min-w-0 items-center gap-3" aria-label={name}>
      <LogoMark src={src} className="h-8 w-auto shrink-0 sm:h-9 lg:h-11" />
      <span className="hidden min-w-0 flex-col leading-tight min-[22rem]:flex">
        <span className="truncate font-display text-[0.95rem] font-extrabold tracking-wide uppercase lg:text-lg rtl:normal-case">{name}</span>
        <span className="truncate text-xs text-muted lg:text-sm">{role}</span>
      </span>
    </Link>
  );
}
