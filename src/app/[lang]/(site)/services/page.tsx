import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Boxes, CheckCircle2 } from "lucide-react";
import { getMessages } from "@/i18n";
import { isLocale, tl } from "@/i18n/config";
import { getSiteContent, published } from "@/lib/content";
import { pageMeta } from "@/lib/metadata";
import { siteUrl } from "@/lib/utils";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { FaqList } from "@/components/ui/Faq";
import { CtaBanner } from "@/components/ui/CtaBanner";

export async function generateMetadata({ params }: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { pages } = await getSiteContent();
  return pageMeta(lang, "/services", tl(pages.servicesTitle, lang), tl(pages.servicesSubtitle, lang));
}

export default async function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getMessages(lang);
  const content = await getSiteContent();
  const services = published(content.services);
  const steps = published(content.process);
  const benefits = published(content.benefits);
  const faqs = published(content.faqs).filter((f) => f.placement !== "contact");

  const faqLd = faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: tl(f.question, lang), acceptedAnswer: { "@type": "Answer", text: tl(f.answer, lang) } })),
      }
    : null;
  const servicesLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `${content.settings.siteName.en} — ${content.settings.role.en}`,
    url: `${siteUrl()}/${lang}/services`,
    areaServed: "Worldwide",
    hasOfferCatalog: { "@type": "OfferCatalog", name: "Web development services", itemListElement: services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: tl(s.title, lang), description: tl(s.description, lang) } })) },
  };

  return (
    <>
      {[servicesLd, faqLd].filter(Boolean).map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      ))}
      <PageHero
        badge={t.services.eyebrow}
        title={tl(content.pages.servicesTitle, lang)}
        subtitle={tl(content.pages.servicesSubtitle, lang)}
        image={content.hero.image}
        imageAlt={tl(content.settings.siteName, lang)}
        watermark={content.settings.logo}
        signature={content.hero.showSignature ? content.settings.siteName.en : undefined}
        note={tl(content.hero.note, lang)}
      >
        {benefits.length > 0 && (
          <ul className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-5">
            {benefits.map((b) => (
              <li key={b.id} className="flex items-center gap-2 text-sm">
                <Icon name={b.icon} className="size-5 shrink-0 text-accent" />
                <span className="font-medium">{tl(b.title, lang)}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-col gap-3 xs:flex-row">
          <Link href={`/${lang}/contact`} className="btn btn-primary px-6">
            {t.common.startProject}
            <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
          <Link href={`/${lang}/projects`} className="btn btn-outline px-6">
            {t.common.viewAllProjects}
          </Link>
        </div>
      </PageHero>

      <section className="container-x py-14 sm:py-20" aria-labelledby="list-title">
        <SectionHeading eyebrow={t.services.listEyebrow} title={t.services.listTitle} subtitle={t.services.listSubtitle} id="list-title" />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <ServiceCard key={s.id} service={s} locale={lang} index={i} detailed cta={t.common.startProject} />
          ))}
          <article className="card glow-ring relative flex flex-col gap-4 overflow-hidden border-primary/50 p-5 sm:p-6" data-reveal>
            <div aria-hidden="true" className="absolute -end-16 -bottom-16 size-56 rounded-full bg-primary/30 blur-3xl" />
            <span className="icon-tile">
              <Boxes className="size-6" aria-hidden="true" />
            </span>
            <h3 className="heading-md text-xl">{t.services.customTitle}</h3>
            <p className="text-sm text-muted">{t.services.customText}</p>
            <ul className="flex flex-col gap-2 text-sm">
              {t.services.customPoints.split("\n").map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-accent" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
            <Link href={`/${lang}/contact`} className="btn btn-primary relative mt-auto self-start">
              {t.common.startProject}
              <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
            </Link>
          </article>
        </div>
      </section>

      {steps.length > 0 && (
        <section className="container-x py-10 sm:py-14" aria-labelledby="process-title">
          <SectionHeading eyebrow={t.services.processEyebrow} title={t.services.processTitle} subtitle={t.services.processSubtitle} id="process-title" />
          <ol className="relative mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <span aria-hidden="true" className="absolute inset-x-[12%] top-5 hidden h-px border-t border-dashed border-primary/50 lg:block" />
            {steps.map((s, i) => (
              <li key={s.id} className="relative flex flex-col items-center gap-3 text-center" data-reveal style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}>
                <span className="relative grid size-10 place-items-center rounded-full border border-primary bg-bg text-sm font-bold text-accent ring-4 ring-bg">{String(i + 1).padStart(2, "0")}</span>
                <Icon name={s.icon} className="size-7 text-accent" />
                <h3 className="heading-md">{tl(s.title, lang)}</h3>
                <p className="max-w-64 text-sm text-muted">{tl(s.description, lang)}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {benefits.length > 0 && (
        <section className="container-x py-10 sm:py-14" aria-labelledby="benefits-title">
          <SectionHeading eyebrow={t.services.benefitsEyebrow} title={t.services.benefitsTitle} subtitle={t.services.benefitsSubtitle} id="benefits-title" />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, i) => (
              <li key={b.id} className="card card-hover flex items-start gap-4 p-5" data-reveal style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}>
                <span className="icon-tile size-11">
                  <Icon name={b.icon} className="size-5" />
                </span>
                <span>
                  <span className="block font-semibold">{tl(b.title, lang)}</span>
                  <span className="block text-sm text-muted">{tl(b.description, lang)}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="container-x py-10 sm:py-14" aria-labelledby="faq-title">
          <SectionHeading eyebrow={t.services.faqEyebrow} title={t.services.faqTitle} subtitle={t.services.faqSubtitle} id="faq-title" className="mb-8" />
          <FaqList items={faqs.map((f) => ({ id: f.id, question: tl(f.question, lang), answer: tl(f.answer, lang) }))} />
        </section>
      )}

      <CtaBanner content={content} locale={lang} t={t} />
    </>
  );
}
