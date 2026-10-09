import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { IBM_Plex_Sans_Arabic, Mrs_Saint_Delafield, Inter, Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { I18nProvider } from "@/i18n/client";
import { getMessages } from "@/i18n";
import { LOCALES, dirOf, isLocale, list, tl } from "@/i18n/config";
import { getSiteContent } from "@/lib/content";
import { siteUrl } from "@/lib/utils";
import type { Theme } from "@/lib/types";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-jakarta", display: "swap" });
const plexArabic = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "500", "600", "700"], variable: "--font-plex-ar", display: "swap" });
const signature = Mrs_Saint_Delafield({ subsets: ["latin"], weight: "400", variable: "--font-signature", display: "swap" });

// Content is edited from the CMS at runtime, so pages render per request.
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#050b18",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { seo, settings } = await getSiteContent();
  const title = tl(seo.title, lang);
  const description = tl(seo.description, lang);
  const images = seo.ogImage ? [{ url: seo.ogImage }] : undefined;
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: title, template: `%s | ${tl(settings.siteName, lang)}` },
    description,
    keywords: list(tl(seo.keywords, lang)),
    applicationName: tl(settings.siteName, lang),
    authors: [{ name: settings.siteName.en }],
    creator: settings.siteName.en,
    alternates: {
      canonical: `/${lang}`,
      languages: { en: "/en", ar: "/ar", "x-default": "/en" },
    },
    openGraph: {
      type: "website",
      siteName: tl(settings.siteName, lang),
      title,
      description,
      locale: lang === "ar" ? "ar_EG" : "en_US",
      alternateLocale: lang === "ar" ? "en_US" : "ar_EG",
      ...(images && { images }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(seo.twitterHandle && { creator: seo.twitterHandle }),
      ...(images && { images }),
    },
    robots: settings.siteVisible ? { index: true, follow: true } : { index: false, follow: false },
  };
}

const hex = (value: string, fallback: string) => (/^#[0-9a-f]{6}$/i.test(value) ? value : fallback);

function themeStyle(theme: Theme) {
  return {
    "--primary": hex(theme.primary, "#1f6bff"),
    "--accent": hex(theme.accent, "#3da5ff"),
    "--bg": hex(theme.background, "#050b18"),
    "--surface": hex(theme.surface, "#0b1428"),
    "--radius": `${Math.min(28, Math.max(0, Number(theme.radius) || 16))}px`,
    "--glow": String(Math.min(100, Math.max(0, Number(theme.glow) || 0)) / 100),
  } as React.CSSProperties;
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { theme } = await getSiteContent();
  const fontVars =
    lang === "ar"
      ? { "--font-body": "var(--font-plex-ar)", "--font-heading": "var(--font-plex-ar)" }
      : { "--font-body": "var(--font-inter)", "--font-heading": "var(--font-jakarta)" };

  return (
    <html
      lang={lang}
      dir={dirOf(lang)}
      className={`${inter.variable} ${jakarta.variable} ${plexArabic.variable} ${signature.variable}`}
      style={{ ...themeStyle(theme), ...(fontVars as React.CSSProperties) }}
      suppressHydrationWarning
    >
      <head>
        {/* Enables scroll-reveal styles only when JS runs, so content never stays hidden. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-dvh bg-bg text-fg antialiased" suppressHydrationWarning>
        <I18nProvider locale={lang} messages={getMessages(lang)}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
