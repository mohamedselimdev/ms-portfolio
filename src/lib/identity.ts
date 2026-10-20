import type { Locale } from "@/lib/types";

/**
 * Real spellings of Mohamed Selim's name, so searches in Arabic, English or Russian
 * all point at this one person and site. Used by the Person JSON-LD, page keywords and
 * the About page. Only actual names belong here, not job titles or search phrases.
 */
export const NAME_VARIANTS = {
  latin: ["Mohamed Selim", "Mohamed Osama Selim", "Mohammed Selim", "Mohammad Selim", "Muhammad Selim"],
  arabic: ["محمد سليم", "محمد أسامة سليم"],
  russian: ["Мохамед Селим", "Мохамед Осама Селим"],
} as const;

/** Real name spellings shown once on the About page. */
export const VISIBLE_NAMES = {
  arabic: ["محمد أسامة سليم"],
  latin: ["Mohamed Osama Selim", "Mohammed Selim"],
} as const;

/** Arabic + English name used in the page title suffix. */
export const NAME_PAIR = { en: "Mohamed Selim", ar: "محمد سليم" } as const;

/** Portrait alt text: who is in the photo and what he does. */
export function portraitAlt(lang: Locale): string {
  return lang === "ar"
    ? "محمد سليم، مهندس برمجيات ومطوّر ويب متكامل"
    : "Mohamed Selim, software engineer and full-stack web developer";
}

/** Every name of this person (schema alternateName). */
export const ALL_NAMES: string[] = [...NAME_VARIANTS.latin, ...NAME_VARIANTS.arabic, ...NAME_VARIANTS.russian];

/** Person `alternateName` list, without the primary name for the current page. */
export function alternateNames(primary: string): string[] {
  return ALL_NAMES.filter((n) => n.toLowerCase() !== primary.toLowerCase());
}

/** Name keywords, appended to whatever is stored in the CMS so editing there never drops them. */
export function nameKeywords(lang: Locale): string[] {
  return lang === "ar" ? [...NAME_VARIANTS.arabic, NAME_PAIR.en] : [...NAME_VARIANTS.latin, NAME_PAIR.ar];
}

/** Photos of Mohamed Selim, shown on the About page and listed for image search. */
export const PHOTOS = [
  {
    src: "/images/profile/gallery/mohamed-selim-graduation.webp",
    width: 900,
    height: 1200,
    alt: { en: "Mohamed Selim at his graduation", ar: "محمد سليم في حفل تخرجه" },
  },
  {
    src: "/images/profile/gallery/mohamed-selim-ural-federal-university.webp",
    width: 900,
    height: 1200,
    alt: { en: "Mohamed Selim with his diploma at Ural Federal University", ar: "محمد سليم بشهادته أمام جامعة الأورال الفيدرالية" },
  },
  {
    src: "/images/profile/gallery/mohamed-selim-campus.webp",
    width: 900,
    height: 939,
    alt: { en: "Mohamed Selim on campus", ar: "محمد سليم في الحرم الجامعي" },
  },
  {
    src: "/images/profile/gallery/mohamed-selim-blue-suit.webp",
    width: 900,
    height: 1127,
    alt: { en: "Mohamed Selim in a blue suit", ar: "محمد سليم ببدلة زرقاء" },
  },
  {
    src: "/images/profile/gallery/mohamed-selim-speaking.webp",
    width: 900,
    height: 1600,
    alt: { en: "Mohamed Selim speaking at a university event", ar: "محمد سليم يتحدث في فعالية جامعية" },
  },
  {
    src: "/images/profile/gallery/mohamed-selim-media-team.webp",
    width: 900,
    height: 1200,
    alt: { en: "Mohamed Selim covering a student event with his camera", ar: "محمد سليم يغطي فعالية طلابية بالكاميرا" },
  },
] as const;
