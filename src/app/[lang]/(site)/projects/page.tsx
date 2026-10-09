import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getMessages } from "@/i18n";
import { isLocale, tl } from "@/i18n/config";
import { getSiteContent, published } from "@/lib/content";
import { pageMeta } from "@/lib/metadata";
import { GithubIcon } from "@/components/icons";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ProjectCover } from "@/components/ui/ProjectCover";
import { ProjectsExplorer } from "@/components/ui/ProjectsExplorer";
import { TechChips } from "@/components/ui/TechChips";
import { CtaBanner } from "@/components/ui/CtaBanner";

export async function generateMetadata({ params }: PageProps<"/[lang]/projects">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { pages } = await getSiteContent();
  return pageMeta(lang, "/projects", tl(pages.projectsTitle, lang), tl(pages.projectsSubtitle, lang));
}

export default async function ProjectsPage({ params }: PageProps<"/[lang]/projects">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getMessages(lang);
  const content = await getSiteContent();
  const categories = published(content.categories);
  const projects = published(content.projects);
  const spotlight = projects.find((p) => p.featured) ?? projects[0];
  const spotCat = spotlight && categories.find((c) => c.slug === spotlight.category);

  return (
    <>
      <PageHero
        compact
        badge={t.projects.eyebrow}
        title={tl(content.pages.projectsTitle, lang)}
        subtitle={tl(content.pages.projectsSubtitle, lang)}
        image={content.hero.image}
        imageAlt={tl(content.settings.siteName, lang)}
        watermark={content.settings.logo}
        signature={content.hero.showSignature ? content.settings.siteName.en : undefined}
      />

      {spotlight && (
        <section className="container-x py-10" aria-labelledby="spotlight-title">
          <SectionHeading eyebrow={t.projects.featuredEyebrow} title={tl(spotlight.title, lang).split("—")[0].trim()} id="spotlight-title" />
          <article className="card glow-ring mt-8 grid gap-6 overflow-hidden p-3 sm:p-4 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-10" data-reveal>
            <Link href={`/${lang}/projects/${spotlight.slug}`} className="group block overflow-hidden rounded-[var(--radius)]" tabIndex={-1} aria-hidden="true">
              <ProjectCover image={spotlight.image} title={tl(spotlight.title, lang)} icon={spotCat?.icon} className="aspect-[16/10]" sizes="(min-width: 1024px) 55vw, 100vw" priority />
            </Link>
            <div className="flex flex-col gap-4 p-2 sm:p-4 lg:p-0 lg:pe-6">
              {spotCat && <p className="eyebrow">{tl(spotCat.name, lang)}</p>}
              <h3 className="heading-md text-2xl">{tl(spotlight.title, lang)}</h3>
              <p className="leading-relaxed text-muted">{tl(spotlight.summary, lang)}</p>
              <TechChips stack={spotlight.stack} />
              <div className="flex flex-wrap gap-3 pt-2">
                {spotlight.liveUrl && (
                  <a href={spotlight.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    {t.common.liveDemo}
                    <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
                  </a>
                )}
                <Link href={`/${lang}/projects/${spotlight.slug}`} className="btn btn-outline">
                  {t.common.caseStudy}
                  <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
                </Link>
                {spotlight.githubUrl && (
                  <a href={spotlight.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost border border-line-strong">
                    <GithubIcon className="size-4" />
                    {t.common.viewCode}
                  </a>
                )}
              </div>
            </div>
          </article>
        </section>
      )}

      <section className="container-x py-10 sm:py-14" aria-labelledby="all-projects-title">
        <SectionHeading eyebrow={t.projects.moreEyebrow} title={t.projects.all} id="all-projects-title" className="mb-8" />
        <ProjectsExplorer
          categories={categories.map((c) => ({ slug: c.slug, name: tl(c.name, lang), icon: c.icon }))}
          items={projects.map((p) => ({
            id: p.id,
            category: p.category,
            card: <ProjectCard project={p} category={categories.find((c) => c.slug === p.category)} locale={lang} t={t} />,
          }))}
        />
      </section>

      <CtaBanner content={content} locale={lang} t={t} />
    </>
  );
}
