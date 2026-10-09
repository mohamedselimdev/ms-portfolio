import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Category, Locale, Project } from "@/lib/types";
import type { Messages } from "@/i18n";
import { tl } from "@/i18n/config";
import { GithubIcon, Icon } from "@/components/icons";
import { ProjectCover } from "./ProjectCover";
import { TechChips } from "./TechChips";
import { SiteLink } from "./SiteLink";

export function ProjectCard({ project, category, locale, t, priority }: { project: Project; category?: Category; locale: Locale; t: Messages; priority?: boolean }) {
  const title = tl(project.title, locale);
  const detail = `/${locale}/projects/${project.slug}`;
  return (
    <article className="card card-hover group flex h-full flex-col overflow-hidden p-2.5" data-reveal>
      <Link href={detail} className="relative block overflow-hidden rounded-[calc(var(--radius)*0.75)]" tabIndex={-1} aria-hidden="true">
        <ProjectCover image={project.image} title={title} icon={category?.icon} className="aspect-[16/10]" priority={priority} />
        {category && (
          <span className="pill absolute top-3 start-3 bg-bg/80 py-1 text-xs backdrop-blur">
            <Icon name={category.icon} className="size-3.5 text-accent" />
            {tl(category.name, locale)}
          </span>
        )}
        <span className="absolute top-3 end-3 grid size-8 place-items-center rounded-lg bg-bg/80 backdrop-blur">
          <ArrowUpRight className="size-4 rtl:-scale-x-100" />
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-3 pt-4">
        <h3 className="heading-md text-lg">
          <Link href={detail} className="hover:text-accent">
            {title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted">{tl(project.summary, locale)}</p>
        <SiteLink url={project.liveUrl} className="self-start text-xs" />
        <TechChips stack={project.stack} max={4} className="mt-auto pt-1" />
        <div className="flex flex-wrap gap-2 pt-2">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm flex-1">
              {t.common.liveDemo}
              <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
            </a>
          )}
          <Link href={detail} className="btn btn-outline btn-sm flex-1">
            {t.common.caseStudy}
            <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-icon border border-line-strong" aria-label={`${t.common.viewCode}: ${title}`}>
              <GithubIcon className="size-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
