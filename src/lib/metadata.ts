import "server-only";
import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import { plain, tl } from "@/i18n/config";
import { getSiteContent } from "@/lib/content";

/**
 * Per-page metadata with canonical + hreflang alternates.
 * Page-level openGraph replaces the layout's object, so the shared fields are repeated here.
 */
export async function pageMeta(lang: Locale, path: string, title?: string, description?: string, image?: string): Promise<Metadata> {
  const { seo, settings } = await getSiteContent();
  title = title && plain(title);
  description = description && plain(description);
  const suffix = path === "/" ? "" : path;
  const ogImage = image || seo.ogImage || `/${lang}/opengraph-image`;
  const ogTitle = title || tl(seo.title, lang);
  const ogDescription = description || tl(seo.description, lang);
  return {
    ...(title && { title }),
    ...(description && { description }),
    alternates: {
      canonical: `/${lang}${suffix}`,
      languages: { en: `/en${suffix}`, ar: `/ar${suffix}`, "x-default": `/en${suffix}` },
    },
    openGraph: {
      type: "website",
      url: `/${lang}${suffix}`,
      siteName: tl(settings.siteName, lang),
      locale: lang === "ar" ? "ar_EG" : "en_US",
      alternateLocale: lang === "ar" ? "en_US" : "ar_EG",
      title: ogTitle,
      description: ogDescription,
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: { card: "summary_large_image", title: ogTitle, description: ogDescription, images: [ogImage] },
  };
}
