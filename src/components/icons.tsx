import {
  AppWindow, Award, BarChart3, BadgeCheck, Brain, Briefcase, Cloud, Code, CodeXml, Cpu, Database, FileText, Gem, Globe,
  GraduationCap, Heart, Languages, Layers, LayoutGrid, Lock, Mail, MessageCircle, MessageSquare, Monitor, Palette, Phone,
  Rocket, Search, Server, Settings, ShieldCheck, ShoppingCart, Smartphone, Sparkles, Star, Target, Users, Workflow, Wrench, Zap,
  type LucideIcon,
} from "lucide-react";
import * as si from "simple-icons";

/** Icons selectable from the CMS for services, steps, stats, etc. */
export const ICONS: Record<string, LucideIcon> = {
  "app-window": AppWindow, award: Award, "bar-chart": BarChart3, "badge-check": BadgeCheck, brain: Brain, briefcase: Briefcase,
  cloud: Cloud, code: Code, "code-xml": CodeXml, cpu: Cpu, database: Database, "file-text": FileText, gem: Gem, globe: Globe,
  "graduation-cap": GraduationCap, heart: Heart, languages: Languages, layers: Layers, "layout-grid": LayoutGrid, lock: Lock,
  mail: Mail, "message-circle": MessageCircle, "message-square": MessageSquare, monitor: Monitor, palette: Palette, phone: Phone,
  rocket: Rocket, search: Search, server: Server, settings: Settings, "shield-check": ShieldCheck, "shopping-cart": ShoppingCart,
  smartphone: Smartphone, sparkles: Sparkles, star: Star, target: Target, users: Users, workflow: Workflow, wrench: Wrench, zap: Zap,
};

export const ICON_NAMES = Object.keys(ICONS);

export function Icon({ name, className = "size-5" }: { name: string; className?: string }) {
  const Cmp = ICONS[name] ?? Sparkles;
  return <Cmp className={className} aria-hidden="true" />;
}

type SimpleIcon = { path: string; hex: string; title: string };

const TECH: Record<string, SimpleIcon> = {
  react: si.siReact, nextdotjs: si.siNextdotjs, typescript: si.siTypescript, javascript: si.siJavascript,
  tailwindcss: si.siTailwindcss, html5: si.siHtml5, css: si.siCss, nodedotjs: si.siNodedotjs, dotnet: si.siDotnet,
  python: si.siPython, postgresql: si.siPostgresql, sqlite: si.siSqlite, drizzle: si.siDrizzle, docker: si.siDocker,
  cloudflare: si.siCloudflare, cloudflareworkers: si.siCloudflareworkers, linux: si.siLinux, git: si.siGit, github: si.siGithub,
  mongodb: si.siMongodb, express: si.siExpress, prisma: si.siPrisma, stripe: si.siStripe, vercel: si.siVercel, redis: si.siRedis,
  framer: si.siFramer, figma: si.siFigma, mysql: si.siMysql, jsonwebtokens: si.siJsonwebtokens, socketdotio: si.siSocketdotio,
  chartdotjs: si.siChartdotjs, sanity: si.siSanity, vuedotjs: si.siVuedotjs, laravel: si.siLaravel, php: si.siPhp,
  firebase: si.siFirebase, supabase: si.siSupabase,
};

export const TECH_ICON_NAMES = Object.keys(TECH);

// Map free-text technology names (e.g. "Next.js", "ASP.NET Core 9") to an icon key.
const ALIASES: [RegExp, string][] = [
  [/next/i, "nextdotjs"], [/react/i, "react"], [/typescript|^ts$/i, "typescript"], [/javascript|^js$/i, "javascript"],
  [/tailwind/i, "tailwindcss"], [/html/i, "html5"], [/^css/i, "css"], [/node/i, "nodedotjs"],
  [/asp\.?net|\.net|dotnet|entity framework|ef core|c#/i, "dotnet"], [/python/i, "python"], [/postgres/i, "postgresql"],
  [/sqlite|\bd1\b/i, "sqlite"], [/drizzle/i, "drizzle"], [/docker/i, "docker"], [/workers/i, "cloudflareworkers"],
  [/cloudflare/i, "cloudflare"], [/linux/i, "linux"], [/github/i, "github"], [/\bgit\b/i, "git"], [/mongo/i, "mongodb"],
  [/express/i, "express"], [/prisma/i, "prisma"], [/stripe/i, "stripe"], [/vercel/i, "vercel"], [/redis/i, "redis"],
  [/framer/i, "framer"], [/figma/i, "figma"], [/mysql/i, "mysql"], [/jwt|json web/i, "jsonwebtokens"],
  [/socket/i, "socketdotio"], [/chart\.?js/i, "chartdotjs"], [/sanity/i, "sanity"], [/vue/i, "vuedotjs"],
  [/laravel/i, "laravel"], [/php/i, "php"], [/firebase/i, "firebase"], [/supabase/i, "supabase"],
];

export function techKey(name: string) {
  const direct = name.toLowerCase();
  if (TECH[direct]) return direct;
  return ALIASES.find(([re]) => re.test(name))?.[1];
}

/** Brand logo for a technology; falls back to a monogram. Dark brand colors are lifted for contrast. */
export function TechIcon({ name, icon, className = "size-4" }: { name: string; icon?: string; className?: string }) {
  const key = icon && TECH[icon] ? icon : techKey(name);
  const data = key ? TECH[key] : undefined;
  if (!data) {
    return (
      <span aria-hidden="true" className={`${className} grid place-items-center rounded bg-white/10 text-[0.6em] font-bold text-white`}>
        {name.replace(/[^A-Za-z0-9#]/g, "").slice(0, 2).toUpperCase()}
      </span>
    );
  }
  const hex = parseInt(data.hex, 16);
  const luminance = 0.299 * ((hex >> 16) & 255) + 0.587 * ((hex >> 8) & 255) + 0.114 * (hex & 255);
  const fill = luminance < 60 ? "#e8edf7" : `#${data.hex}`;
  return (
    <svg viewBox="0 0 24 24" className={className} fill={fill} aria-hidden="true">
      <path d={data.path} />
    </svg>
  );
}

export function GithubIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d={si.siGithub.path} />
    </svg>
  );
}

export function LinkedinIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

export function SocialIcon({ platform, className = "size-5" }: { platform: string; className?: string }) {
  switch (platform) {
    case "github":
      return <GithubIcon className={className} />;
    case "linkedin":
      return <LinkedinIcon className={className} />;
    case "email":
      return <Mail className={className} aria-hidden="true" />;
    case "whatsapp":
      return <Brand icon={si.siWhatsapp} className={className} />;
    case "x":
      return <Brand icon={si.siX} className={className} />;
    case "instagram":
      return <Brand icon={si.siInstagram} className={className} />;
    case "youtube":
      return <Brand icon={si.siYoutube} className={className} />;
    case "telegram":
      return <Brand icon={si.siTelegram} className={className} />;
    default:
      return <Globe className={className} aria-hidden="true" />;
  }
}

function Brand({ icon, className }: { icon: SimpleIcon; className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}

export function WhatsappIcon({ className = "size-5" }: { className?: string }) {
  return <Brand icon={si.siWhatsapp} className={className} />;
}
