import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Award, Download, Languages, Quote } from "lucide-react";
import { getMessages } from "@/i18n";
import { hasText, isLocale, tl } from "@/i18n/config";
import { getSiteContent, published } from "@/lib/content";
import { pageMeta } from "@/lib/metadata";
import { siteUrl } from "@/lib/utils";
import { Icon, TechIcon } from "@/components/icons";
import { PageHero } from "@/components/ui/PageHero";
import { StatsBar } from "@/components/ui/StatsBar";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Signature } from "@/components/ui/Signature";
import { Credential, EducationCard } from "@/components/ui/Credential";
import { CtaBanner } from "@/components/ui/CtaBanner";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { about } = await getSiteContent();
  return pageMeta(lang, "/about", tl(about.eyebrow, lang), tl(about.intro, lang));
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getMessages(lang);
  const content = await getSiteContent();
  const { about, settings } = content;
  const principles = published(content.principles);
  const journey = published(content.journey);
  const skills = published(content.skills);
  const certificates = published(content.certificates);
  const paragraphs = tl(about.story, lang).split(/\n{2,}/).filter(Boolean);
  const sameAs = published(content.socials).map((s) => s.url).filter((u) => u.startsWith("http"));

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings.siteName.en,
    jobTitle: settings.role.en,
    url: `${siteUrl()}/${lang}`,
    image: `${siteUrl()}${about.image}`,
    sameAs,
    knowsLanguage: ["ar", "en", "ru"],
    alumniOf: { "@type": "CollegeOrUniversity", name: "Ural Federal University" },
    knowsAbout: skills.map((s) => s.name),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd).replace(/</g, "\\u003c") }} />
      <PageHero
        badge={tl(about.eyebrow, lang)}
        title={tl(about.title, lang)}
        highlight={tl(about.highlight, lang)}
        subtitle={tl(about.intro, lang)}
        image={content.hero.image}
        imageAlt={tl(settings.siteName, lang)}
        watermark={settings.logo}
        signature={content.hero.showSignature ? settings.siteName.en : undefined}
        note={tl(content.hero.note, lang)}
      >
        <Credential about={about} locale={lang} />
        <div className="flex flex-col gap-3 xs:flex-row">
          <Link href={`/${lang}/contact`} className="btn btn-primary px-6">
            {t.common.hireMe}
            <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
          {settings.resumeUrl && (
            <a href={settings.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline px-6">
              <Download className="size-4" aria-hidden="true" />
              {t.about.downloadResume}
            </a>
          )}
        </div>
      </PageHero>

      <StatsBar stats={published(content.stats)} locale={lang} />

      <section className="container-x grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.15fr_1fr]" aria-labelledby="story-title">
        <div data-reveal>
          <EducationCard about={about} locale={lang} title={t.about.educationTitle} graduated={t.about.graduated} />
          <p className="eyebrow mt-10 mb-3">{t.about.storyEyebrow}</p>
          <h2 id="story-title" className="heading-lg">
            {t.about.storyTitle}
          </h2>
          <div className="prose-body mt-5 leading-relaxed text-muted sm:text-lg">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          {hasText(about.quote) && (
            <figure className="mt-8 border-s-2 border-primary ps-5">
              <Quote className="mb-2 size-7 text-primary" aria-hidden="true" />
              <blockquote className="text-fg/90 italic">“{tl(about.quote, lang)}”</blockquote>
              <figcaption className="mt-3 flex justify-end">
                <Signature name={settings.siteName.en} className="rotate-0 text-4xl text-muted" />
              </figcaption>
            </figure>
          )}
          {hasText(about.languages) && (
            <p className="mt-8 flex items-start gap-3 text-sm">
              <Languages className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
              <span>
                <span className="font-semibold">{t.about.languages}: </span>
                <span className="text-muted">{tl(about.languages, lang)}</span>
              </span>
            </p>
          )}
        </div>
        {principles.length > 0 && (
          <ul className="flex flex-col gap-4" aria-label={t.about.principlesEyebrow}>
            {principles.map((p, i) => (
              <li key={p.id} className="card card-hover flex items-center gap-4 p-5" data-reveal style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}>
                <span className="icon-tile size-14">
                  <Icon name={p.icon} className="size-6" />
                </span>
                <span>
                  <span className="block font-semibold">{tl(p.title, lang)}</span>
                  <span className="block text-sm text-muted">{tl(p.description, lang)}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {journey.length > 0 && (
        <section className="container-x py-10 sm:py-14" aria-labelledby="journey-title">
          <SectionHeading eyebrow={t.about.journeyEyebrow} title={t.about.journeyTitle} id="journey-title" />
          <ol className="relative mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <span aria-hidden="true" className="absolute inset-x-6 top-[1.1rem] hidden h-px bg-gradient-to-r from-primary/10 via-primary to-primary/10 xl:block" />
            {journey.map((j, i) => (
              <li key={j.id} className="relative flex flex-col gap-4" data-reveal style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}>
                <span aria-hidden="true" className="relative mx-auto hidden size-4 rounded-full border-2 border-primary bg-bg ring-4 ring-primary/20 xl:block" />
                <div className="card card-hover flex h-full gap-4 p-5">
                  <span className="icon-tile size-11">
                    <Icon name={j.icon} className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-accent">{j.period || t.about.present}</p>
                    <h3 className="mt-1 font-semibold">{tl(j.title, lang)}</h3>
                    <p className="mt-1 text-sm text-muted">{tl(j.description, lang)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {skills.length > 0 && (
        <section className="container-x py-10 sm:py-14" aria-labelledby="skills-title">
          <SectionHeading eyebrow={t.about.skillsEyebrow} title={t.about.skillsTitle} subtitle={t.about.skillsSubtitle} id="skills-title" />
          <ul className="mt-10 grid grid-cols-3 gap-3 xs:grid-cols-4 sm:grid-cols-6 lg:grid-cols-9">
            {skills.map((s, i) => (
              <li key={s.id} className="card card-hover flex flex-col items-center gap-2 px-2 py-4 text-center" data-reveal style={{ "--reveal-delay": `${(i % 9) * 30}ms` } as React.CSSProperties}>
                <TechIcon name={s.name} icon={s.icon} className="size-8" />
                <span className="text-xs leading-tight font-medium">{s.name}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {certificates.length > 0 && (
        <section className="container-x py-10 sm:py-14" aria-labelledby="certs-title">
          <SectionHeading eyebrow={t.about.certsEyebrow} title={t.about.certsTitle} id="certs-title" />
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {certificates.map((c, i) => (
              <li key={c.id} className="card card-hover flex gap-4 p-5" data-reveal style={{ "--reveal-delay": `${(i % 2) * 60}ms` } as React.CSSProperties}>
                <span className="icon-tile">
                  <Award className="size-6" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold">{tl(c.title, lang)}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {tl(c.issuer, lang)}
                    {c.year && ` · ${c.year}`}
                  </p>
                  {hasText(c.detail) && <p className="mt-1 text-xs text-accent">{tl(c.detail, lang)}</p>}
                  {c.url && (
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm text-fg/90 hover:text-accent">
                      {t.about.viewCertificate}
                      <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <CtaBanner content={content} locale={lang} t={t} />
    </>
  );
}
