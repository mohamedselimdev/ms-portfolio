import type { Locale } from "@/lib/types";

/**
 * Every spelling people may type into Google to find Mohamed Selim.
 * Single source of truth: used by the Person/WebSite JSON-LD, page keywords and the
 * visible "also known as" lines, so all spellings stay tied to this one person and site.
 */

// Arabic core names, with and without the hamza (أسامة / اسامة), the way people really type them.
const AR_NAMES = ["محمد سليم", "محمد أسامة سليم", "محمد اسامة سليم"] as const;

// Honorifics, each with and without the definite article "ال" (المهندس / مهندس ...).
const AR_HONORIFICS = ["المهندس", "مهندس", "م.", "الباشمهندس", "باشمهندس"] as const;

// Role words, also with and without "ال" (المطور / مطور ...).
const AR_ROLES = ["مهندس برمجيات", "المهندس البرمجي", "مطور ويب", "المطور", "مطور", "مطور مواقع", "مبرمج", "المبرمج", "مبرمج مواقع"] as const;

const arabicHonorificNames = AR_HONORIFICS.flatMap((h) => AR_NAMES.map((n) => `${h} ${n}`));
const arabicRoleNames = AR_ROLES.flatMap((r) => [`${r} ${AR_NAMES[0]}`, `${AR_NAMES[0]} ${r}`, `${r} ${AR_NAMES[1]}`]);

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
    "Engineer Mohamed Selim",
    "Mohamed Selim Software Engineer",
    "Mohamed Selim Web Developer",
    "mohamedselim.dev",
  ],
  // Arabic names only (used as Person alternateName): core + every honorific, with and without "ال".
  arabic: [...new Set<string>([...AR_NAMES, "محمد أسامة", "محمد اسامة", ...arabicHonorificNames])],
  // Arabic name + role combinations (used as keywords only, they are searches rather than names).
  arabicRoles: [...new Set<string>(arabicRoleNames)],
  // Russian spellings (he lives and studies in Russia, so local clients search in Russian)
  russian: ["Мохамед Селим", "Мохаммед Селим", "Мухаммед Селим", "Мохамед Осама Селим", "Мохамед Селим веб-разработчик"],
} as const;

/** Spellings shown as visible text on the site (footer, About) so people and Google see them on the page itself. */
export const VISIBLE_NAMES = {
  arabic: [
    "محمد سليم",
    "محمد أسامة سليم",
    "المهندس محمد سليم",
    "مهندس محمد سليم",
    "الباشمهندس محمد سليم",
    "باشمهندس محمد سليم",
    "مهندس برمجيات محمد سليم",
    "مطور ويب محمد سليم",
  ],
  latin: ["Mohamed Selim", "Mohamed Osama Selim", "Mohammed Selim", "Eng. Mohamed Selim"],
} as const;

/** Arabic + English name used in image alt text and the page title suffix. */
export const NAME_PAIR = { en: "Mohamed Selim", ar: "محمد سليم" } as const;

/** Descriptive portrait alt text carrying both the Arabic and English name. */
export function portraitAlt(lang: Locale): string {
  return lang === "ar"
    ? "محمد سليم (Mohamed Selim) - الباشمهندس محمد سليم، مهندس برمجيات ومطور ويب Full-Stack"
    : "Mohamed Selim (محمد سليم) - Software Engineer & Full-Stack Web Developer, الباشمهندس محمد سليم";
}

/** Everything that is a *name* of this person (schema alternateName). */
export const ALL_NAMES: string[] = [...NAME_VARIANTS.latin, ...NAME_VARIANTS.arabic, ...NAME_VARIANTS.russian].filter((n) => n !== "mohamedselim.dev");

/** Person `alternateName` list, without the primary name for the current page. */
export function alternateNames(primary: string): string[] {
  return ALL_NAMES.filter((n) => n.toLowerCase() !== primary.toLowerCase());
}

/** Extra keywords, appended to whatever is stored in the CMS so editing there never drops them. */
export function nameKeywords(lang: Locale): string[] {
  return lang === "ar"
    ? [...NAME_VARIANTS.arabic, ...NAME_VARIANTS.arabicRoles, ...NAME_VARIANTS.latin.slice(0, 6)]
    : [...NAME_VARIANTS.latin, ...NAME_VARIANTS.arabic.slice(0, 8), ...NAME_VARIANTS.arabicRoles.slice(0, 6)];
}
