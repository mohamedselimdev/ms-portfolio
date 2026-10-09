import { LOCALES, type L, type Locale } from "@/lib/types";

export { LOCALES };
export type { Locale };

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "ms_locale";

export const isLocale = (value: string | undefined | null): value is Locale =>
  !!value && (LOCALES as readonly string[]).includes(value);

export const dirOf = (locale: Locale) => (locale === "ar" ? "rtl" : "ltr");

/** Pick the value for a locale, falling back to the other language when empty. */
export function tl(value: L | undefined | null, locale: Locale): string {
  if (!value) return "";
  return value[locale]?.trim() ? value[locale] : value[locale === "ar" ? "en" : "ar"] || "";
}

/** True when the localized value has content in at least one language. */
export const hasText = (value: L | undefined | null) => !!value && !!(value.en?.trim() || value.ar?.trim());

/** Remove *highlight* markers for plain-text contexts (metadata, alt text). */
export const plain = (value: string) => value.replace(/\*/g, "");

/** Split a localized multi-line value into trimmed, non-empty lines. */
export const lines = (value: L | undefined, locale: Locale) =>
  tl(value, locale)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

export const list = (csv: string | undefined) =>
  (csv || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export const format = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));

/** Prefix an internal path with the locale. */
export const href = (locale: Locale, path: string) => {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
};
