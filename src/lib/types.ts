export const LOCALES = ["en", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

/** A string translated into every supported locale. */
export type L = Record<Locale, string>;

export type Status = "published" | "draft";

export interface BaseItem {
  id: string;
  order: number;
  status: Status;
  updatedAt: string;
}

export interface Settings {
  siteName: L;
  role: L;
  logo: string;
  email: string;
  whatsapp: string;
  phone: string;
  linkedin: string;
  github: string;
  instagram: string;
  calendlyUrl: string;
  location: L;
  availabilityEnabled: boolean;
  availabilityText: L;
  responseTime: L;
  siteVisible: boolean;
  maintenanceMessage: L;
  resumeUrl: string;
}

export interface Theme {
  primary: string;
  accent: string;
  background: string;
  surface: string;
  radius: number;
  glow: number;
}

export interface Seo {
  title: L;
  description: L;
  keywords: L;
  ogImage: string;
  twitterHandle: string;
}

export interface Hero {
  badge: L;
  titleLine1: L;
  titleHighlight: L;
  titleLine2: L;
  subtitle: L;
  techStack: string;
  primaryCta: L;
  secondaryCta: L;
  image: string;
  note: L;
  showSignature: boolean;
}

export interface About {
  eyebrow: L;
  title: L;
  highlight: L;
  intro: L;
  story: L;
  quote: L;
  image: string;
  secondaryImage: string;
  languages: L;
  degree: L;
  university: L;
  graduationYear: string;
}

export interface PageCopy {
  projectsTitle: L;
  projectsSubtitle: L;
  servicesTitle: L;
  servicesSubtitle: L;
  contactTitle: L;
  contactSubtitle: L;
  ctaTitle: L;
  ctaSubtitle: L;
}

export interface Stat extends BaseItem {
  value: string;
  label: L;
  icon: string;
}

export interface Category extends BaseItem {
  slug: string;
  name: L;
  icon: string;
}

export interface Screenshot {
  src: string;
  caption: L;
}

export interface Project extends BaseItem {
  slug: string;
  title: L;
  summary: L;
  category: string;
  image: string;
  gallery: Screenshot[];
  stack: string;
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  projectStatus: "completed" | "in-progress" | "archived";
  year: string;
  role: L;
  client: L;
  timeline: L;
  overview: L;
  challenge: L;
  solution: L;
  features: L;
  responsibilities: L;
  results: L;
}

export interface Service extends BaseItem {
  title: L;
  description: L;
  icon: string;
  features: L;
}

export interface ProcessStep extends BaseItem {
  title: L;
  description: L;
  icon: string;
}

export interface Benefit extends BaseItem {
  title: L;
  description: L;
  icon: string;
}

export interface Faq extends BaseItem {
  question: L;
  answer: L;
  placement: "services" | "contact" | "both";
}

export interface Testimonial extends BaseItem {
  name: string;
  role: L;
  company: string;
  quote: L;
  rating: number;
  avatar: string;
  projectSlug: string;
}

export interface JourneyItem extends BaseItem {
  period: string;
  title: L;
  description: L;
  icon: string;
}

export interface Certificate extends BaseItem {
  title: L;
  issuer: L;
  year: string;
  detail: L;
  url: string;
}

export interface Skill extends BaseItem {
  name: string;
  icon: string;
  group: "frontend" | "backend" | "database" | "devops" | "other";
}

export interface Principle extends BaseItem {
  title: L;
  description: L;
  icon: string;
}

export interface NavItem extends BaseItem {
  key: string;
  label: L;
  href: string;
}

export interface SocialLink extends BaseItem {
  platform: "github" | "linkedin" | "email" | "whatsapp" | "x" | "instagram" | "youtube" | "telegram" | "website";
  url: string;
  label: string;
}

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
}

export interface ActivityEntry {
  id: string;
  action: "create" | "update" | "delete" | "reorder" | "publish" | "unpublish" | "upload" | "login";
  section: string;
  label: string;
  at: string;
}

export interface Collections {
  stats: Stat[];
  categories: Category[];
  projects: Project[];
  services: Service[];
  process: ProcessStep[];
  benefits: Benefit[];
  faqs: Faq[];
  testimonials: Testimonial[];
  journey: JourneyItem[];
  certificates: Certificate[];
  skills: Skill[];
  principles: Principle[];
  navigation: NavItem[];
  socials: SocialLink[];
}

export interface Singletons {
  settings: Settings;
  theme: Theme;
  seo: Seo;
  hero: Hero;
  about: About;
  pages: PageCopy;
}

export type CollectionKey = keyof Collections;
export type SingletonKey = keyof Singletons;

export interface Content extends Collections, Singletons {
  version: number;
  media: MediaItem[];
  activity: ActivityEntry[];
}

export type InquiryStatus = "new" | "read" | "replied" | "archived";

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  timeline: string;
  message: string;
  locale: Locale;
  status: InquiryStatus;
  createdAt: string;
}

export interface Analytics {
  days: Record<string, { views: number; visitors: number }>;
  paths: Record<string, number>;
  referrers: Record<string, number>;
  locales: Record<string, number>;
}
