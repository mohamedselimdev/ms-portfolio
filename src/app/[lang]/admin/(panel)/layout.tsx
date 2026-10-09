import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages } from "@/i18n";
import { isLocale, tl } from "@/i18n/config";
import { requireAdmin } from "@/lib/auth";
import { getContent, getInquiries } from "@/lib/store";
import { SECTIONS, type SectionGroup } from "@/lib/admin/schema";
import { AdminShell, type NavGroup } from "@/components/admin/AdminShell";
import { AdminProviders } from "@/components/admin/ui";

export async function generateMetadata({ params }: LayoutProps<"/[lang]/admin">): Promise<Metadata> {
  const { lang } = await params;
  const t = getMessages(isLocale(lang) ? lang : "en");
  return { title: t.meta.adminTitle, robots: { index: false, follow: false } };
}

export default async function PanelLayout({ children, params }: LayoutProps<"/[lang]/admin">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  await requireAdmin(lang);
  const t = getMessages(lang);
  const [content, inquiries] = await Promise.all([getContent(), getInquiries()]);
  const unread = inquiries.filter((i) => i.status === "new").length;
  const base = `/${lang}/admin`;

  const order: SectionGroup[] = ["content", "portfolio", "site", "system"];
  const groups: NavGroup[] = [
    { label: t.admin.dashboard, items: [{ key: "overview", label: t.admin.sections.overview, icon: "overview", href: base }] },
    ...order.map((g) => ({
      label: t.admin.groups[g],
      items: SECTIONS.filter((s) => s.group === g).map((s) => ({
        key: s.key,
        label: t.admin.sections[s.key as keyof typeof t.admin.sections],
        icon: s.icon,
        href: `${base}/${s.key}`,
        badge: s.key === "inquiries" ? unread : undefined,
      })),
    })),
  ];

  return (
    <AdminShell groups={groups} logo={content.settings.logo} name={tl(content.settings.siteName, lang)} avatar={content.about.image}>
      <AdminProviders media={content.media}>{children}</AdminProviders>
    </AdminShell>
  );
}
