import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, CalendarDays, Mail, Phone } from "lucide-react";
import { getMessages } from "@/i18n";
import { isLocale, tl } from "@/i18n/config";
import { getSiteContent, published } from "@/lib/content";
import { pageMeta } from "@/lib/metadata";
import { whatsappLink } from "@/lib/utils";
import { GithubIcon, Icon, LinkedinIcon, SocialIcon, WhatsappIcon } from "@/components/icons";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/ui/ContactForm";
import { CopyButton } from "@/components/ui/CopyButton";
import { FaqList } from "@/components/ui/Faq";
import { StatsBar } from "@/components/ui/StatsBar";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { pages } = await getSiteContent();
  return pageMeta(lang, "/contact", tl(pages.contactTitle, lang), tl(pages.contactSubtitle, lang));
}

interface Channel {
  key: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  copy: boolean;
  tone: string;
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getMessages(lang);
  const content = await getSiteContent();
  const { settings, about, hero } = content;
  const benefits = published(content.benefits);
  const faqs = published(content.faqs).filter((f) => f.placement !== "services");
  const services = published(content.services).map((s) => tl(s.title, lang));
  const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

  const channels: Channel[] = [];
  if (settings.email) channels.push({ key: "email", icon: <Mail className="size-5" />, label: t.contact.emailLabel, value: settings.email, href: `mailto:${settings.email}`, copy: true, tone: "text-accent" });
  if (settings.whatsapp) channels.push({ key: "wa", icon: <WhatsappIcon className="size-5" />, label: t.contact.whatsappLabel, value: settings.whatsapp, href: whatsappLink(settings.whatsapp), copy: true, tone: "text-green-400" });
  if (settings.phone) channels.push({ key: "phone", icon: <Phone className="size-5" />, label: t.contact.phoneLabel, value: settings.phone, href: `tel:${settings.phone.replace(/[^\d+]/g, "")}`, copy: true, tone: "text-accent" });
  if (settings.linkedin) channels.push({ key: "in", icon: <LinkedinIcon className="size-5" />, label: t.contact.linkedinLabel, value: bare(settings.linkedin), href: settings.linkedin, copy: false, tone: "text-sky-400" });
  if (settings.instagram) channels.push({ key: "ig", icon: <SocialIcon platform="instagram" className="size-5" />, label: t.contact.instagramLabel, value: "@" + bare(settings.instagram).split("/").pop(), href: settings.instagram, copy: false, tone: "text-pink-400" });
  if (settings.github) channels.push({ key: "gh", icon: <GithubIcon className="size-5" />, label: t.contact.githubLabel, value: bare(settings.github), href: settings.github, copy: false, tone: "text-fg" });

  return (
    <>
      <PageHero
        badge={t.contact.eyebrow}
        title={tl(content.pages.contactTitle, lang)}
        subtitle={tl(content.pages.contactSubtitle, lang)}
        image={hero.image}
        imageAlt={tl(settings.siteName, lang)}
        watermark={settings.logo}
        signature={hero.showSignature ? settings.siteName.en : undefined}
        note={tl(hero.note, lang)}
      >
        {benefits.length > 0 && (
          <ul className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:gap-6">
            {benefits.map((b) => (
              <li key={b.id} className="flex items-center gap-2.5 text-sm">
                <span className="icon-tile size-10 rounded-full">
                  <Icon name={b.icon} className="size-4" />
                </span>
                <span className="leading-tight font-medium">{tl(b.title, lang)}</span>
              </li>
            ))}
          </ul>
        )}
      </PageHero>

      <section className="container-x grid grid-cols-1 gap-5 pb-14 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]" aria-labelledby="form-title">
        <div className="card p-5 sm:p-8" data-reveal>
          <p className="eyebrow mb-3">{t.contact.formEyebrow}</p>
          <h2 id="form-title" className="heading-lg">
            {t.contact.formTitle}
          </h2>
          <p className="mt-2 mb-8 text-muted">{t.contact.formSubtitle}</p>
          <ContactForm services={services} />
        </div>

        <aside className="flex flex-col gap-5">
          <div className="card p-5" data-reveal>
            <div className="flex gap-4">
              <div className="relative size-24 shrink-0 overflow-hidden rounded-xl sm:size-28">
                <Image src={about.image} alt={tl(settings.siteName, lang)} fill sizes="112px" className="object-cover object-top" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-lg font-bold">{tl(settings.siteName, lang)}</p>
                {settings.availabilityEnabled && (
                  <p className="mt-1 flex items-center gap-2 text-xs text-muted">
                    <span className="status-dot" aria-hidden="true" />
                    {tl(settings.availabilityText, lang)}
                  </p>
                )}
                <p className="mt-2 text-sm font-semibold">{tl(settings.role, lang)}</p>
                <p className="mt-1 line-clamp-4 text-xs leading-relaxed text-muted">{tl(hero.subtitle, lang)}</p>
              </div>
            </div>
          </div>

          <div className="card p-5 sm:p-6" data-reveal>
            <h2 className="heading-md text-xl">{t.contact.directTitle}</h2>
            <p className="mt-1 mb-5 text-sm text-muted">{t.contact.directSubtitle}</p>
            <ul className="flex flex-col gap-3">
              {channels.map((c) => (
                <li key={c.key} className="relative flex items-center gap-3 rounded-xl border border-line bg-white/[0.02] p-3 transition-colors hover:border-primary/50">
                  <span className={`icon-tile size-11 ${c.tone}`} aria-hidden="true">
                    {c.icon}
                  </span>
                  <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="min-w-0 flex-1 after:absolute after:inset-0">
                    <span className="block text-sm font-semibold">{c.label}</span>
                    <span className="block truncate text-xs text-muted" dir="ltr">
                      {c.value}
                    </span>
                  </a>
                  {c.copy ? <CopyButton value={c.value} label={c.label} /> : <ArrowUpRight className="me-2 size-4 text-muted rtl:-scale-x-100" aria-hidden="true" />}
                </li>
              ))}
            </ul>

            {settings.calendlyUrl && (
              <div className="mt-4 rounded-xl border border-primary/40 bg-primary/5 p-4">
                <div className="flex items-start gap-3">
                  <span className="icon-tile size-11 rounded-full">
                    <CalendarDays className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-semibold">{t.contact.bookCall}</p>
                    <p className="text-xs text-muted">{t.contact.bookCallText}</p>
                  </div>
                </div>
                <a href={settings.calendlyUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm mt-4 w-full">
                  {t.contact.bookCallCta}
                  <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
                </a>
              </div>
            )}
          </div>
        </aside>
      </section>

      <StatsBar stats={published(content.stats)} locale={lang} />

      {faqs.length > 0 && (
        <section className="container-x py-12 sm:py-16" aria-labelledby="faq-title">
          <SectionHeading eyebrow={t.contact.faqEyebrow} title={t.contact.faqTitle} subtitle={t.contact.faqSubtitle} id="faq-title" className="mb-8" />
          <FaqList items={faqs.map((f) => ({ id: f.id, question: tl(f.question, lang), answer: tl(f.answer, lang) }))} />
        </section>
      )}
    </>
  );
}
