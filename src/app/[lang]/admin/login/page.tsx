import Link from "next/link";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getMessages } from "@/i18n";
import { isLocale } from "@/i18n/config";
import { getSession, isAuthConfigured } from "@/lib/auth";
import { getSiteContent } from "@/lib/content";
import { LogoMark } from "@/components/site/Logo";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import { LoginForm } from "@/components/admin/LoginForm";

export async function generateMetadata({ params }: PageProps<"/[lang]/admin/login">): Promise<Metadata> {
  const { lang } = await params;
  return { title: isLocale(lang) ? getMessages(lang).meta.loginTitle : "Sign in", robots: { index: false, follow: false } };
}

export default async function LoginPage({ params }: PageProps<"/[lang]/admin/login">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  if (await getSession()) redirect(`/${lang}/admin`);
  const t = getMessages(lang);
  const { settings } = await getSiteContent();

  return (
    <main className="relative isolate grid min-h-dvh place-items-center px-4 py-10">
      <div aria-hidden="true" className="grid-bg absolute inset-0 -z-10" />
      <div className="card w-full max-w-md p-6 sm:p-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <LogoMark src={settings.logo} className="h-10 w-auto" />
          <Suspense>
            <LanguageSwitcher />
          </Suspense>
        </div>
        <h1 className="heading-md text-2xl">{t.admin.login.title}</h1>
        <p className="mt-1 mb-6 text-sm text-muted">{t.admin.login.subtitle}</p>
        <LoginForm configured={isAuthConfigured()} />
        <Link href={`/${lang}`} className="mt-6 block text-center text-sm text-muted hover:text-fg">
          {t.admin.login.back}
        </Link>
      </div>
    </main>
  );
}
