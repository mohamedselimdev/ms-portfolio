import type { CollectionKey, SingletonKey } from "@/lib/types";

// Declarative CMS schema. Drives the dashboard forms, tables and server-side validation,
// so every section shares the same editor components instead of bespoke pages.

export type FieldType =
  | "text"
  | "textarea"
  | "ltext"
  | "ltextarea"
  | "llines"
  | "url"
  | "email"
  | "image"
  | "gallery"
  | "select"
  | "boolean"
  | "number"
  | "color"
  | "slug"
  | "tags"
  | "icon"
  | "techicon";

export interface FieldDef {
  name: string;
  type: FieldType;
  required?: boolean;
  max?: number;
  min?: number;
  rows?: number;
  /** Static options (value list). Dynamic options come from `optionsFrom`. */
  options?: string[];
  optionsFrom?: "categories" | "projects";
  full?: boolean;
  unique?: boolean;
}

export type SectionGroup = "content" | "portfolio" | "site" | "system";

interface BaseSection {
  key: string;
  group: SectionGroup;
  icon: string;
  /** Public page to open for "preview". */
  preview?: string;
}

export interface CollectionSection extends BaseSection {
  kind: "collection";
  key: CollectionKey;
  fields: FieldDef[];
  titleField: string;
  subtitleField?: string;
  imageField?: string;
  filterField?: string;
}

export interface SingletonSection extends BaseSection {
  kind: "singleton";
  key: SingletonKey;
  fields: FieldDef[];
}

export interface CustomSection extends BaseSection {
  kind: "custom";
  key: "inquiries" | "media";
}

export type Section = CollectionSection | SingletonSection | CustomSection;

const icon: FieldDef = { name: "icon", type: "icon" };

export const SECTIONS: Section[] = [
  {
    kind: "singleton",
    key: "hero",
    group: "content",
    icon: "home",
    preview: "/",
    fields: [
      { name: "badge", type: "ltext", max: 80 },
      { name: "titleLine1", type: "ltext", required: true, max: 60 },
      { name: "titleHighlight", type: "ltext", max: 60 },
      { name: "titleLine2", type: "ltext", max: 60 },
      { name: "subtitle", type: "ltextarea", required: true, max: 400, full: true },
      { name: "techStack", type: "tags", max: 300, full: true },
      { name: "primaryCta", type: "ltext", max: 40 },
      { name: "secondaryCta", type: "ltext", max: 40 },
      { name: "note", type: "ltext", max: 90 },
      { name: "showSignature", type: "boolean" },
      { name: "image", type: "image", full: true },
    ],
  },
  {
    kind: "singleton",
    key: "about",
    group: "content",
    icon: "user",
    preview: "/about",
    fields: [
      { name: "eyebrow", type: "ltext", max: 40 },
      { name: "title", type: "ltext", required: true, max: 80 },
      { name: "highlight", type: "ltext", max: 60 },
      { name: "languages", type: "ltext", max: 160 },
      { name: "degree", type: "ltext", max: 100 },
      { name: "university", type: "ltext", max: 120 },
      { name: "graduationYear", type: "text", max: 20 },
      { name: "intro", type: "ltextarea", required: true, max: 600, full: true },
      { name: "story", type: "ltextarea", rows: 9, max: 4000, full: true },
      { name: "quote", type: "ltextarea", max: 300, full: true },
      { name: "image", type: "image" },
      { name: "secondaryImage", type: "image" },
    ],
  },
  {
    kind: "singleton",
    key: "pages",
    group: "content",
    icon: "file-text",
    fields: [
      { name: "projectsTitle", type: "ltext", required: true, max: 80 },
      { name: "projectsSubtitle", type: "ltextarea", max: 300 },
      { name: "servicesTitle", type: "ltext", required: true, max: 80 },
      { name: "servicesSubtitle", type: "ltextarea", max: 300 },
      { name: "contactTitle", type: "ltext", required: true, max: 100 },
      { name: "contactSubtitle", type: "ltextarea", max: 300 },
      { name: "ctaTitle", type: "ltext", required: true, max: 80 },
      { name: "ctaSubtitle", type: "ltextarea", max: 300 },
    ],
  },
  {
    kind: "collection",
    key: "projects",
    group: "portfolio",
    icon: "layout-grid",
    preview: "/projects",
    titleField: "title",
    subtitleField: "category",
    imageField: "image",
    filterField: "category",
    fields: [
      { name: "title", type: "ltext", required: true, max: 120, full: true },
      { name: "slug", type: "slug", required: true, unique: true, max: 80 },
      { name: "category", type: "select", optionsFrom: "categories", required: true },
      { name: "projectStatus", type: "select", options: ["completed", "in-progress", "archived"], required: true },
      { name: "featured", type: "boolean" },
      { name: "summary", type: "ltextarea", required: true, max: 300, full: true },
      { name: "image", type: "image", full: true },
      { name: "stack", type: "tags", max: 400, full: true },
      { name: "liveUrl", type: "url" },
      { name: "githubUrl", type: "url" },
      { name: "role", type: "ltext", max: 80 },
      { name: "client", type: "ltext", max: 120 },
      { name: "timeline", type: "ltext", max: 60 },
      { name: "year", type: "text", max: 20 },
      { name: "overview", type: "ltextarea", max: 1500, full: true },
      { name: "challenge", type: "ltextarea", max: 1500, full: true },
      { name: "solution", type: "ltextarea", max: 2000, full: true },
      { name: "results", type: "ltextarea", max: 1500, full: true },
      { name: "features", type: "llines", max: 2000, full: true },
      { name: "responsibilities", type: "llines", max: 1500, full: true },
      { name: "gallery", type: "gallery", full: true },
    ],
  },
  {
    kind: "collection",
    key: "categories",
    group: "portfolio",
    icon: "tags",
    titleField: "name",
    subtitleField: "slug",
    fields: [{ name: "name", type: "ltext", required: true, max: 40 }, { name: "slug", type: "slug", required: true, unique: true, max: 40 }, icon],
  },
  {
    kind: "collection",
    key: "services",
    group: "portfolio",
    icon: "briefcase",
    preview: "/services",
    titleField: "title",
    fields: [
      { name: "title", type: "ltext", required: true, max: 80 },
      icon,
      { name: "description", type: "ltextarea", required: true, max: 300, full: true },
      { name: "features", type: "llines", max: 800, full: true },
    ],
  },
  {
    kind: "collection",
    key: "process",
    group: "portfolio",
    icon: "workflow",
    preview: "/services",
    titleField: "title",
    fields: [{ name: "title", type: "ltext", required: true, max: 60 }, icon, { name: "description", type: "ltextarea", max: 300, full: true }],
  },
  {
    kind: "collection",
    key: "benefits",
    group: "portfolio",
    icon: "gem",
    preview: "/services",
    titleField: "title",
    fields: [{ name: "title", type: "ltext", required: true, max: 60 }, icon, { name: "description", type: "ltextarea", max: 200, full: true }],
  },
  {
    kind: "collection",
    key: "testimonials",
    group: "portfolio",
    icon: "star",
    titleField: "name",
    subtitleField: "company",
    imageField: "avatar",
    fields: [
      { name: "name", type: "text", required: true, max: 80 },
      { name: "company", type: "text", max: 80 },
      { name: "role", type: "ltext", max: 80 },
      { name: "rating", type: "number", min: 1, max: 5, required: true },
      { name: "projectSlug", type: "select", optionsFrom: "projects" },
      { name: "quote", type: "ltextarea", required: true, max: 800, full: true },
      { name: "avatar", type: "image", full: true },
    ],
  },
  {
    kind: "collection",
    key: "faqs",
    group: "portfolio",
    icon: "circle-help",
    preview: "/contact",
    titleField: "question",
    subtitleField: "placement",
    filterField: "placement",
    fields: [
      { name: "question", type: "ltext", required: true, max: 200, full: true },
      { name: "answer", type: "ltextarea", required: true, max: 1200, full: true },
      { name: "placement", type: "select", options: ["both", "services", "contact"], required: true },
    ],
  },
  {
    kind: "collection",
    key: "stats",
    group: "content",
    icon: "bar-chart",
    preview: "/",
    titleField: "value",
    subtitleField: "label",
    fields: [{ name: "value", type: "text", required: true, max: 20 }, { name: "label", type: "ltext", required: true, max: 40 }, icon],
  },
  {
    kind: "collection",
    key: "journey",
    group: "content",
    icon: "milestone",
    preview: "/about",
    titleField: "title",
    subtitleField: "period",
    fields: [
      { name: "title", type: "ltext", required: true, max: 80 },
      { name: "period", type: "text", max: 30 },
      icon,
      { name: "description", type: "ltextarea", max: 300, full: true },
    ],
  },
  {
    kind: "collection",
    key: "certificates",
    group: "content",
    icon: "award",
    preview: "/about",
    titleField: "title",
    subtitleField: "year",
    fields: [
      { name: "title", type: "ltext", required: true, max: 140, full: true },
      { name: "issuer", type: "ltext", max: 120 },
      { name: "detail", type: "ltext", max: 80 },
      { name: "year", type: "text", max: 10 },
      { name: "url", type: "url" },
    ],
  },
  {
    kind: "collection",
    key: "skills",
    group: "content",
    icon: "code",
    preview: "/about",
    titleField: "name",
    subtitleField: "group",
    filterField: "group",
    fields: [
      { name: "name", type: "text", required: true, max: 40 },
      { name: "icon", type: "techicon" },
      { name: "group", type: "select", options: ["frontend", "backend", "database", "devops", "other"], required: true },
    ],
  },
  {
    kind: "collection",
    key: "principles",
    group: "content",
    icon: "target",
    preview: "/about",
    titleField: "title",
    fields: [{ name: "title", type: "ltext", required: true, max: 60 }, icon, { name: "description", type: "ltextarea", max: 200, full: true }],
  },
  { kind: "custom", key: "inquiries", group: "system", icon: "inbox" },
  { kind: "custom", key: "media", group: "system", icon: "images" },
  {
    kind: "singleton",
    key: "settings",
    group: "site",
    icon: "settings",
    preview: "/contact",
    fields: [
      { name: "siteName", type: "ltext", required: true, max: 60 },
      { name: "logo", type: "image" },
      { name: "role", type: "ltext", required: true, max: 60 },
      { name: "email", type: "email", max: 120 },
      { name: "whatsapp", type: "text", max: 30 },
      { name: "phone", type: "text", max: 30 },
      { name: "linkedin", type: "url" },
      { name: "github", type: "url" },
      { name: "instagram", type: "url" },
      { name: "calendlyUrl", type: "url" },
      { name: "resumeUrl", type: "url" },
      { name: "location", type: "ltext", max: 120 },
      { name: "responseTime", type: "ltext", max: 80 },
      { name: "availabilityEnabled", type: "boolean" },
      { name: "availabilityText", type: "ltext", max: 80 },
      { name: "siteVisible", type: "boolean" },
      { name: "maintenanceMessage", type: "ltextarea", max: 300, full: true },
    ],
  },
  {
    kind: "collection",
    key: "socials",
    group: "site",
    icon: "share",
    titleField: "label",
    subtitleField: "url",
    fields: [
      { name: "platform", type: "select", options: ["github", "linkedin", "instagram", "email", "whatsapp", "x", "youtube", "telegram", "website"], required: true },
      { name: "label", type: "text", max: 40 },
      { name: "url", type: "url", required: true, full: true },
    ],
  },
  {
    kind: "collection",
    key: "navigation",
    group: "site",
    icon: "navigation",
    titleField: "label",
    subtitleField: "href",
    fields: [
      { name: "label", type: "ltext", required: true, max: 30 },
      { name: "href", type: "url", required: true },
      { name: "key", type: "text", max: 30 },
    ],
  },
  {
    kind: "singleton",
    key: "seo",
    group: "site",
    icon: "search",
    fields: [
      { name: "title", type: "ltext", required: true, max: 70, full: true },
      { name: "description", type: "ltextarea", required: true, max: 170, full: true },
      { name: "keywords", type: "ltextarea", max: 400, full: true },
      { name: "twitterHandle", type: "text", max: 30 },
      { name: "ogImage", type: "image", full: true },
    ],
  },
  {
    kind: "singleton",
    key: "theme",
    group: "site",
    icon: "palette",
    fields: [
      { name: "primary", type: "color", required: true },
      { name: "accent", type: "color", required: true },
      { name: "background", type: "color", required: true },
      { name: "surface", type: "color", required: true },
      { name: "radius", type: "number", min: 0, max: 28 },
      { name: "glow", type: "number", min: 0, max: 100 }
    ],
  },
];

export const findSection = (key: string) => SECTIONS.find((s) => s.key === key);
