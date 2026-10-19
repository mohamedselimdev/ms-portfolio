import type { Locale } from "@/lib/types";

/**
 * Every spelling people may type into Google to find Mohamed Selim.
 * Single source of truth: used by the Person/WebSite JSON-LD and the page keywords,
 * so all spellings stay tied to this one person and this one website.
 */
export const NAME_VARIANTS = {
  // English / Latin spellings (Mohamed / Mohammed / Mohamad / Mohammad / Muhammad + Selim)
  latin: [
    "Mohamed Selim",
    "Mohamed Osama Selim",
    "Mohamed Osama",
    "Mohammed Selim",
    "Mohammad Selim",
    "Mohamad Selim",
    "Muhammad Selim",
    "Mohammed Osama Selim",
    "Muhammad Osama Selim",
    "Eng. Mohamed Selim",
    "Eng Mohamed Selim",
    "Mohamed Selim Software Engineer",
    "Mohamed Selim Web Developer",
    "mohamedselim.dev",
  ],
  // Arabic spellings, with and without hamza, plus the honorifics Egyptians actually search with
  arabic: [
    "محمد سليم",
    "محمد أسامة سليم",
    "محمد اسامة سليم",
    "محمد أسامة",
    "محمد اسامة",
    "المهندس محمد سليم",
    "مهندس محمد سليم",
    "م. محمد سليم",
    "الباشمهندس محمد سليم",
    "باشمهندس محمد سليم",
    "مهندس برمجيات محمد سليم",
    "مطور ويب محمد سليم",
    "محمد سليم مطور مواقع",
    "محمد سليم مبرمج",
  ],
  // Russian spellings (he lives and studies in Russia, so local clients search in Russian)
  russian: [
    "Мохамед Селим",
    "Мохаммед Селим",
    "Мухаммед Селим",
    "Мохамед Осама Селим",
    "Мохамед Селим веб-разработчик",
  ],
} as const;

export const ALL_NAMES: string[] = [...NAME_VARIANTS.latin, ...NAME_VARIANTS.arabic, ...NAME_VARIANTS.russian];

/** Person `alternateName` list, without the primary name for the current page. */
export function alternateNames(primary: string): string[] {
  return ALL_NAMES.filter((n) => n.toLowerCase() !== primary.toLowerCase() && n !== "mohamedselim.dev");
}

/** Extra keywords, appended to whatever is stored in the CMS so editing there never drops them. */
export function nameKeywords(lang: Locale): string[] {
  return lang === "ar"
    ? [...NAME_VARIANTS.arabic, ...NAME_VARIANTS.latin.slice(0, 6)]
    : [...NAME_VARIANTS.latin, ...NAME_VARIANTS.arabic.slice(0, 5)];
}
