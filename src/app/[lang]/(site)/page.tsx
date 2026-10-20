import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getMessages } from "@/i18n";
import { isLocale, tl } from "@/i18n/config";
import { getSiteContent, published } from "@/lib/content";
import { pageMeta } from "@/lib/metadata";
import { siteUrl } from "@/lib/utils";
import { ALL_NAMES, PHOTOS, portraitAlt } from "@/lib/identity";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/ui/PageHero";
import { TechChips } from "@/components/ui/TechChips";
import { StatsBar } from "@/components/ui/StatsBar";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { Credential } from "@/components/ui/Credential";
import { CtaBanner } from "@/components/ui/CtaBanner";

export async function generateMetadata({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  return isLocale(lang) ? pageMeta(lang, "/") : {};
}

// Descriptive, stable portrait file so Google associates the photo with the name (not the logo).
const PORTRAIT = "/images/profile/mohamed-selim-web-developer.png";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getMessages(lang);
  const content = await getSiteContent();
  const { hero, about, settings } = content;
  const categories = published(content.categories);
  const projects = published(content.projects);
  const featured = (projects.some((p) => p.featured) ? projects.filter((p) => p.featured) : projects).slice(0, 3);
  const services = published(content.services);
  const principles = published(content.principles).slice(0, 4);

  // Tells search engines that both name spellings and every profile belong to this site.
  const home = `${siteUrl()}/${lang}`;
  // Every spelling people search for, so Google ties them all to this one person.
  const names = [...new Set([settings.siteName.en, settings.siteName.ar, ...ALL_NAMES].filter(Boolean))].filter((n) => n !== "mohamedselim.dev");
  const siteLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl()}/#website`,
        url: siteUrl(),
        name: tl(settings.siteName, lang),
        alternateName: names,
        inLanguage: lang,
        publisher: { "@id": `${siteUrl()}/#person` },
      },
      {
        "@type": "WebPage",
        "@id": `${home}#webpage`,
        url: home,
        name: tl(content.seo.title, lang),
        isPartOf: { "@id": `${siteUrl()}/#website` },
        about: { "@id": `${siteUrl()}/#person` },
        primaryImageOfPage: { "@id": `${siteUrl()}/#portrait` },
        inLanguage: lang,
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl()}/#brand`,
        name: tl(settings.siteName, lang),
        alternateName: names,
        url: siteUrl(),
        logo: {
          "@type": "ImageObject",
          "@id": `${siteUrl()}/#logo`,
          url: `${siteUrl()}/images/brand/logo.svg`,
          contentUrl: `${siteUrl()}/images/brand/logo.svg`,
          caption: `${settings.siteName.en} logo`,
          width: 1155,
          height: 925,
        },
        founder: { "@id": `${siteUrl()}/#person` },
        sameAs: published(content.socials).map((s) => s.url).filter((u) => u.startsWith("http")),
      },
      {
        "@type": "Person",
        "@id": `${siteUrl()}/#person`,
        name: tl(settings.siteName, lang),
        alternateName: names,
        jobTitle: tl(content.seo.title, lang).split("|").pop()?.trim() || tl(settings.role, lang),
        description: tl(content.seo.description, lang),
        url: home,
        image: [
          {
            "@type": "ImageObject",
            "@id": `${siteUrl()}/#portrait`,
            url: `${siteUrl()}${PORTRAIT}`,
            contentUrl: `${siteUrl()}${PORTRAIT}`,
            caption: `${settings.siteName.en} - Full-Stack Web Developer`,
            width: 537,
            height: 600,
          },
          ...PHOTOS.map((p) => ({ "@type": "ImageObject", url: `${siteUrl()}${p.src}`, caption: p.alt.en, width: p.width, height: p.height })),
        ],
        sameAs: published(content.socials).map((s) => s.url).filter((u) => u.startsWith("http")),
        alumniOf: { "@type": "CollegeOrUniversity", name: "Ural Federal University" },
        knowsLanguage: ["ar", "en", "ru"],
        knowsAbout: published(content.skills).map((s) => s.name),
        email: `mailto:${settings.email}`,
        homeLocation: { "@type": "Place", name: "Yekaterinburg, Russia" },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteLd).replace(/</g, "\\u003c") }} />
      <PageHero
        badge={settings.availabilityEnabled ? tl(settings.availabilityText, lang) : undefined}
        title={tl(hero.titleLine1, lang)}
        highlight={tl(hero.titleHighlight, lang)}
        titleAfter={tl(hero.titleLine2, lang)}
        subtitle={tl(hero.subtitle, lang)}
        image={hero.image}
        imageAlt={portraitAlt(lang)}
        watermark={settings.logo}
        signature={hero.showSignature ? settings.siteName.en : undefined}
        note={tl(hero.note, lang)}
      >
        <div>
          <p className="sr-only">{t.home.techStack}</p>
          <TechChips stack={hero.techStack} />
        </div>
        <Credential about={about} locale={lang} />
        <div className="flex flex-col gap-3 xs:flex-row">
          <Link href={`/${lang}/contact`} className="btn btn-primary px-6">
            {tl(hero.primaryCta, lang) || t.common.startProject}
            <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
          <Link href={`/${lang}/projects`} className="btn btn-outline px-6">
            {tl(hero.secondaryCta, lang) || t.common.viewAllProjects}
          </Link>
        </div>
      </PageHero>

      <StatsBar stats={published(content.stats)} locale={lang} />

      {featured.length > 0 && (
        <section className="container-x py-16 sm:py-20" aria-labelledby="featured-title">
          <SectionHeading
            id="featured-title"
            eyebrow={t.home.featuredEyebrow}
            title={tl(content.pages.projectsTitle, lang)}
            subtitle={t.home.featuredSubtitle}
            action={
              <Link href={`/${lang}/projects`} className="btn btn-outline btn-sm">
                {t.common.viewAllProjects}
                <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
              </Link>
            }
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <ProjectCard key={p.id} project={p} category={categories.find((c) => c.slug === p.category)} locale={lang} t={t} priority={i === 0} />
            ))}
          </div>
        </section>
      )}

      {services.length > 0 && (
        <section className="container-x py-12 sm:py-16" aria-labelledby="services-title">
          <SectionHeading
            id="services-title"
            eyebrow={t.home.servicesEyebrow}
            title={t.home.servicesTitle}
            action={
              <Link href={`/${lang}/services`} className="btn btn-outline btn-sm">
                {t.common.letsWork}
                <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
              </Link>
            }
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <ServiceCard key={s.id} service={s} locale={lang} index={i} cta={t.common.learnMore} />
            ))}
          </div>
        </section>
      )}

      <section className="container-x py-12 sm:py-16" aria-labelledby="about-title">
        <div className="card grid gap-8 overflow-hidden p-4 sm:p-6 lg:grid-cols-[0.8fr_1.2fr_1fr] lg:items-center lg:gap-10 lg:p-8" data-reveal>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-[var(--radius)] lg:max-w-none">
            <Image src={about.image} alt={tl(settings.siteName, lang)} fill sizes="(min-width: 1024px) 26vw, 320px" className="object-cover object-top" />
          </div>
          <div>
            <p className="eyebrow mb-3">{t.home.aboutEyebrow}</p>
            <h2 id="about-title" className="heading-lg">
              {tl(about.title, lang)} <span className="text-highlight">{tl(about.highlight, lang)}</span>
            </h2>
            <p className="mt-4 leading-relaxed text-muted">{tl(about.intro, lang)}</p>
            <Credential about={about} locale={lang} className="mt-4" />
            <Link href={`/${lang}/about`} className="btn btn-primary btn-sm mt-6">
              {t.home.moreAboutMe}
              <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
            </Link>
          </div>
          {principles.length > 0 && (
            <ul className="flex flex-col gap-5 border-line lg:border-s lg:ps-8">
              {principles.map((p) => (
                <li key={p.id} className="flex items-start gap-4">
                  <span className="icon-tile size-11">
                    <Icon name={p.icon} className="size-5" />
                  </span>
                  <span>
                    <span className="block font-semibold">{tl(p.title, lang)}</span>
                    <span className="block text-sm text-muted">{tl(p.description, lang)}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <CtaBanner content={content} locale={lang} t={t} />
    </>
  );
}
