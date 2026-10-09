import Link from "next/link";
import type { Content, Locale } from "@/lib/types";
import type { Messages } from "@/i18n";
import { href, tl } from "@/i18n/config";
import { published } from "@/lib/content";
import { SocialIcon } from "@/components/icons";
import { LogoMark } from "./Logo";

export function Footer({ content, locale, t }: { content: Content; locale: Locale; t: Messages }) {
  const { settings } = content;
  const nav = published(content.navigation);
  const socials = published(content.socials).filter((s) => s.url);
  return (
    <footer className="border-t border-line bg-bg/60">
      <div className="container-x flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <LogoMark src={settings.logo} className="h-9 w-auto" />
          <span className="flex flex-col leading-tight">
            <span className="font-display font-extrabold uppercase tracking-wide rtl:normal-case">{tl(settings.siteName, locale)}</span>
            <span className="text-xs text-muted">{tl(settings.role, locale)}</span>
          </span>
        </Link>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            {nav.map((item) => (
              <li key={item.id}>
                <Link href={href(locale, item.href)} className="hover:text-fg">
                  {tl(item.label, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {socials.length > 0 && (
          <ul className="flex items-center gap-2">
            {socials.map((s) => (
              <li key={s.id}>
                <a
                  href={s.url}
                  target={s.url.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={s.label || s.platform}
                  className="btn btn-ghost btn-icon"
                >
                  <SocialIcon platform={s.platform} className="size-5" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="border-t border-line">
        <p className="container-x py-5 text-center text-xs text-subtle">
          © {new Date().getFullYear()} {tl(settings.siteName, locale)}. {t.common.rightsReserved}
        </p>
      </div>
    </footer>
  );
}
