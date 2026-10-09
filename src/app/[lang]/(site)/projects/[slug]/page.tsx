import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Briefcase, CalendarDays, CheckCircle2, CircleDot, Clock, Eye, Info, Layers, Lightbulb, ListChecks, Quote, Star, Target, TrendingUp, User } from "lucide-react";
import { getMessages } from "@/i18n";
import { hasText, isLocale, lines, list, plain, tl } from "@/i18n/config";
import { Highlight } from "@/components/ui/Highlight";
import { getProjectBySlug, published } from "@/lib/content";
import { pageMeta } from "@/lib/metadata";
import { siteUrl } from "@/lib/utils";
import { GithubIcon, Icon, TechIcon } from "@/components/icons";
import { ProjectCover } from "@/components/ui/ProjectCover";
import { Gallery } from "@/components/ui/Gallery";
import { SiteLink } from "@/components/ui/SiteLink";

export async function generateMetadata({ params }: PageProps<"/[lang]/projects/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const data = await getProjectBySlug(slug);
  if (!data) return {};
  const { project } = data;
  return {
    ...(await pageMeta(lang, `/projects/${slug}`, tl(project.title, lang), tl(project.summary, lang), project.image || undefined)),
    ...(project.status !== "published" && { robots: { index: false, follow: false } }),
  };
}

export default async function ProjectPage({ params }: PageProps<"/[lang]/projects/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const data = await getProjectBySlug(slug);
  if (!data) notFound();
  const { project, next, content } = data;
  const t = getMessages(lang);
  const category = content.categories.find((c) => c.slug === project.category);
  const title = tl(project.title, lang);
  const [name, tagline] = title.split("—").map((s) => s.trim());
  const features = lines(project.features, lang);
  const responsibilities = lines(project.responsibilities, lang);
  const stack = list(project.stack);
  const testimonial = published(content.testimonials).find((x) => x.projectSlug === project.slug);

  const story = [
    { key: "challenge", icon: Target, title: t.projects.challenge, text: tl(project.challenge, lang) },
    { key: "solution", icon: Lightbulb, title: t.projects.solution, text: tl(project.solution, lang) },
    { key: "results", icon: TrendingUp, title: t.projects.results, text: tl(project.results, lang) },
  ].filter((s) => s.text);

  const facts = [
    { icon: CircleDot, label: t.projects.statusLabel, value: t.projects.status[project.projectStatus] },
    { icon: User, label: t.projects.role, value: tl(project.role, lang) },
    { icon: Briefcase, label: t.projects.client, value: tl(project.client, lang) },
    { icon: Clock, label: t.projects.timeline, value: tl(project.timeline, lang) },
    { icon: CalendarDays, label: t.projects.year, value: project.year },
    { icon: Layers, label: t.projects.projectType, value: category ? tl(category.name, lang) : "" },
  ].filter((f) => f.value);

  const gallery = project.gallery.filter((g) => g.src).map((g) => ({ src: g.src, caption: tl(g.caption, lang) }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    description: tl(project.summary, lang),
    url: `${siteUrl()}/${lang}/projects/${project.slug}`,
    inLanguage: lang,
    author: { "@type": "Person", name: content.settings.siteName.en },
    ...(project.image && { image: `${siteUrl()}${project.image}` }),
    ...(stack.length && { keywords: stack.join(", ") }),
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {project.status !== "published" && (
        <p className="container-x mt-3">
          <span className="flex items-center gap-2 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-amber-200">
            <Eye className="size-4 shrink-0" aria-hidden="true" />
            {t.common.previewMode}
          </span>
        </p>
      )}

      <header className="relative isolate overflow-hidden">
        <div aria-hidden="true" className="grid-bg absolute inset-0 -z-10 opacity-70" />
        <div aria-hidden="true" className="absolute -top-40 end-0 -z-10 size-[32rem] rounded-full bg-primary/20 blur-[120px]" />
        <div className="container-x grid items-center gap-10 pt-8 pb-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col gap-5">
            <Link href={`/${lang}/projects`} className="inline-flex items-center gap-2 self-start text-sm text-muted hover:text-fg">
              <ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden="true" />
              {t.common.backToProjects}
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              {category && (
                <span className="pill text-xs">
                  <Icon name={category.icon} className="size-3.5 text-accent" />
                  {tl(category.name, lang)}
                </span>
              )}
              {project.featured && <span className="eyebrow">{t.projects.featuredEyebrow}</span>}
            </div>
            <h1 className="heading-xl text-balance">
              {name}
              {tagline && (
                <>
                  <br />
                  <span className="text-highlight text-[0.62em] leading-tight">{tagline}</span>
                </>
              )}
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">{tl(project.summary, lang)}</p>
            <SiteLink url={project.liveUrl} className="self-start text-base" />
            <div className="flex flex-wrap gap-3">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  {t.common.liveDemo}
                  <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  <GithubIcon className="size-4" />
                  {t.common.viewCode}
                </a>
              )}
            </div>
          </div>
          <div className="glow-ring overflow-hidden rounded-[calc(var(--radius)*1.25)] border border-line bg-surface p-2">
            <ProjectCover image={project.image} title={title} icon={category?.icon} className="aspect-[16/10] rounded-[var(--radius)]" sizes="(min-width: 1024px) 55vw, 100vw" priority />
          </div>
        </div>
      </header>

      {facts.length > 0 && (
        <section className="container-x" aria-label={t.projects.details}>
          <dl className="card grid grid-cols-2 gap-px overflow-hidden bg-line p-0 md:grid-cols-3 xl:grid-flow-col xl:auto-cols-fr xl:grid-cols-none" data-reveal>
            {facts.map((f) => (
              <div key={f.label} className="flex items-center gap-3 bg-surface p-4 sm:p-5">
                <span className="icon-tile size-10 rounded-full">
                  <f.icon className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <dt className="text-xs text-muted">{f.label}</dt>
                  <dd className="text-sm font-semibold">{f.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </section>
      )}

      {hasText(project.overview) && (
        <section className="container-x pt-14" aria-labelledby="overview-title">
          <div className="max-w-3xl" data-reveal>
            <p className="eyebrow mb-3">{t.projects.overview}</p>
            <h2 id="overview-title" className="sr-only">
              {t.projects.overview}
            </h2>
            <p className="text-lg leading-relaxed text-fg/90">{tl(project.overview, lang)}</p>
          </div>
        </section>
      )}

      {story.length > 0 && (
        <section className="container-x pt-10" aria-label={t.projects.overview}>
          <div className={`grid gap-4 ${story.length === 3 ? "lg:grid-cols-3" : "md:grid-cols-2"}`}>
            {story.map((s, i) => (
              <div key={s.key} className="card p-5 sm:p-6" data-reveal style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}>
                <div className="mb-4 flex items-center gap-3">
                  <span className="icon-tile size-11">
                    <s.icon className="size-5" aria-hidden="true" />
                  </span>
                  <h2 className="heading-md">{s.title}</h2>
                </div>
                <p className="text-sm leading-relaxed text-muted">{s.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {features.length > 0 && (
        <section className="container-x pt-14" aria-labelledby="features-title">
          <h2 id="features-title" className="heading-lg mb-6" data-reveal>
            {t.projects.features}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <li key={f} className="card flex items-start gap-3 p-4 text-sm" data-reveal>
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="container-x pt-14" aria-labelledby="shots-title">
          <div className="mb-6" data-reveal>
            <h2 id="shots-title" className="heading-lg">
              {t.projects.screenshots}
            </h2>
            <p className="mt-2 text-muted">{t.projects.screenshotsSubtitle}</p>
          </div>
          <Gallery images={gallery} />
        </section>
      )}

      <section className="container-x grid gap-4 pt-14 lg:grid-cols-3" aria-label={t.projects.details}>
        {stack.length > 0 && (
          <div className="card p-5 sm:p-6" data-reveal>
            <h2 className="heading-md">{t.projects.techStack}</h2>
            <p className="mb-5 text-sm text-muted">{t.projects.techStackSubtitle}</p>
            <ul className="grid grid-cols-3 gap-3 xs:grid-cols-4 lg:grid-cols-3">
              {stack.map((s) => (
                <li key={s} className="flex flex-col items-center gap-2 rounded-xl border border-line bg-white/[0.02] p-3 text-center text-xs">
                  <TechIcon name={s} className="size-7" />
                  <span className="leading-tight">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {facts.length > 0 && (
          <div className="card p-5 sm:p-6" data-reveal>
            <h2 className="heading-md">{t.projects.details}</h2>
            <p className="mb-5 text-sm text-muted">{t.projects.detailsSubtitle}</p>
            <dl className="flex flex-col divide-y divide-line text-sm">
              {facts.map((f) => (
                <div key={f.label} className="flex items-start justify-between gap-4 py-3">
                  <dt className="flex items-center gap-2 text-muted">
                    <f.icon className="size-4 text-accent" aria-hidden="true" />
                    {f.label}
                  </dt>
                  <dd className="text-end font-medium">{f.value}</dd>
                </div>
              ))}
              {project.liveUrl && (
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="text-muted">{t.projects.links}</dt>
                  <dd className="min-w-0 text-end">
                    <SiteLink url={project.liveUrl} className="text-xs" />
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}
        {responsibilities.length > 0 && (
          <div className="card p-5 sm:p-6" data-reveal>
            <h2 className="heading-md">{t.projects.responsibilities}</h2>
            <p className="mb-5 text-sm text-muted">{t.projects.responsibilitiesSubtitle}</p>
            <ul className="flex flex-col gap-3 text-sm">
              {responsibilities.map((r) => (
                <li key={r} className="flex items-start gap-3">
                  <ListChecks className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {testimonial && (
        <section className="container-x pt-14" aria-label={t.projects.testimonial}>
          <figure className="card flex flex-col gap-5 p-6 sm:p-8 md:flex-row md:items-center" data-reveal>
            <Quote className="size-10 shrink-0 text-primary" aria-hidden="true" />
            <blockquote className="flex-1 text-lg leading-relaxed">“{tl(testimonial.quote, lang)}”</blockquote>
            <figcaption className="shrink-0 text-sm">
              <div className="mb-1 flex gap-0.5 text-amber-400" aria-label={`${testimonial.rating}/5`}>
                {Array.from({ length: testimonial.rating }, (_, i) => (
                  <Star key={i} className="size-4 fill-current" aria-hidden="true" />
                ))}
              </div>
              <span className="block font-semibold">{testimonial.name}</span>
              <span className="text-muted">
                {tl(testimonial.role, lang)}
                {testimonial.company && `, ${testimonial.company}`}
              </span>
            </figcaption>
          </figure>
        </section>
      )}

      <section className="container-x py-14">
        <div className="card glow-ring flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8" data-reveal>
          <div>
            <p className="eyebrow mb-2">{next ? t.projects.nextProject : t.home.ctaEyebrow}</p>
            <h2 className="heading-md text-2xl">{next ? tl(next.title, lang) : <Highlight text={tl(content.pages.ctaTitle, lang)} />}</h2>
          </div>
          {next ? (
            <Link href={`/${lang}/projects/${next.slug}`} className="btn btn-primary">
              {t.projects.nextProject}
              <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
            </Link>
          ) : (
            <Link href={`/${lang}/contact`} className="btn btn-primary">
              {t.common.startProject}
              <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
            </Link>
          )}
        </div>
        {next && (
          <p className="mt-6 flex items-center justify-center gap-2 text-sm text-muted">
            <Info className="size-4" aria-hidden="true" />
            <Link href={`/${lang}/contact`} className="underline-offset-4 hover:text-fg hover:underline">
              {plain(tl(content.pages.ctaTitle, lang))}
            </Link>
          </p>
        )}
      </section>
    </article>
  );
}
