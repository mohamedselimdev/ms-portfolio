export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const newId = (prefix = "id") => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export const whatsappLink = (phone: string) => `https://wa.me/${phone.replace(/[^\d]/g, "")}`;

export const isExternal = (url: string) => /^https?:\/\//.test(url);
