import { notFound } from "next/navigation";
import { getMessages } from "@/i18n";
import { href, isLocale, tl } from "@/i18n/config";
import { getContent, getInquiries } from "@/lib/store";
import { byOrder } from "@/lib/content";
import { findSection } from "@/lib/admin/schema";
import { CollectionManager } from "@/components/admin/CollectionManager";
import { SingletonEditor } from "@/components/admin/SingletonEditor";
import { InquiriesManager } from "@/components/admin/InquiriesManager";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export async function generateMetadata({ params }: PageProps<"/[lang]/admin/[section]">) {
  const { lang, section } = await params;
  const t = getMessages(isLocale(lang) ? lang : "en");
  return { title: t.admin.sections[section as keyof typeof t.admin.sections] ?? t.meta.adminTitle };
}

export default async function SectionPage({ params }: PageProps<"/[lang]/admin/[section]">) {
  const { lang, section: key } = await params;
  if (!isLocale(lang)) notFound();
  const section = findSection(key);
  if (!section) notFound();
  const t = getMessages(lang);
  const title = t.admin.sections[section.key as keyof typeof t.admin.sections];
  const description = t.admin.descriptions[section.key as keyof typeof t.admin.descriptions];
  const content = await getContent();
  const preview = section.preview ? href(lang, section.preview) : undefined;

  if (section.kind === "custom") {
    if (section.key === "inquiries") {
      const inquiries = (await getInquiries()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return <InquiriesManager inquiries={inquiries} title={title} description={description} />;
    }
    return <MediaLibrary title={title} description={description} />;
  }

  if (section.kind === "singleton") {
    return (
      <SingletonEditor
        key={section.key}
        sectionKey={section.key}
        title={title}
        description={description}
        fields={section.fields}
        initial={content[section.key] as unknown as Record<string, unknown>}
        previewHref={preview}
      />
    );
  }

  const options = {
    category: byOrder(content.categories).map((c) => ({ value: c.slug, label: tl(c.name, lang) })),
    projectSlug: byOrder(content.projects).map((p) => ({ value: p.slug, label: tl(p.title, lang) })),
  };
  const items = byOrder(content[section.key] as unknown as { order: number }[]) as unknown as Parameters<typeof CollectionManager>[0]["items"];

  return (
    <CollectionManager
      key={section.key}
      sectionKey={section.key}
      title={title}
      description={description}
      fields={section.fields}
      items={items}
      titleField={section.titleField}
      subtitleField={section.subtitleField}
      imageField={section.imageField}
      filterField={section.filterField}
      options={options}
      itemHrefBase={section.key === "projects" ? `/${lang}/projects/` : undefined}
      previewHref={preview}
    />
  );
}
