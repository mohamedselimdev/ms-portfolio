import { notFound } from "next/navigation";
import { Wrench } from "lucide-react";
import { getMessages } from "@/i18n";
import { href, isLocale, tl } from "@/i18n/config";
import { getSiteContent, getViewer, published } from "@/lib/content";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { LogoMark } from "@/components/site/Logo";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { PageTracker } from "@/components/ui/PageTracker";

export default async function SiteLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getMessages(lang);
  const content = await getSiteContent();
  const { admin } = await getViewer();
  const { settings } = content;

  if (!settings.siteVisible && !admin) {
    return (
      <main className="grid min-h-dvh place-items-center px-4 text-center">
        <div className="flex max-w-md flex-col items-center gap-5">
          <LogoMark src={settings.logo} className="h-12 w-auto" />
          <span className="icon-tile">
            <Wrench className="size-6" aria-hidden="true" />
          </span>
          <h1 className="heading-lg">{t.maintenance.title}</h1>
          <p className="text-muted">{tl(settings.maintenanceMessage, lang)}</p>
          {settings.email && (
            <a className="btn btn-outline" href={`mailto:${settings.email}`}>
              {settings.email}
            </a>
          )}
        </div>
      </main>
    );
  }

  const nav = published(content.navigation).map((n) => ({ href: href(lang, n.href), label: tl(n.label, lang) }));

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2">
        {t.common.skipToContent}
      </a>
      <Header nav={nav} logo={settings.logo} name={tl(settings.siteName, lang)} role={tl(settings.role, lang)} />
      <main id="main" className="relative">
        {children}
      </main>
      <Footer content={content} locale={lang} t={t} />
      <RevealObserver />
      {!admin && <PageTracker />}
    </>
  );
}
