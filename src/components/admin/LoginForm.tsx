"use client";

import { useActionState } from "react";
import { Lock, LogIn, Mail } from "lucide-react";
import { login, type LoginState } from "@/app/actions/admin";
import { useI18n } from "@/i18n/client";

export function LoginForm({ configured }: { configured: boolean }) {
  const { t, locale } = useI18n();
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  const error =
    state.error === "invalid" ? t.admin.login.invalid : state.error === "tooMany" ? t.validation.tooMany : state.error === "notConfigured" || !configured ? t.admin.login.notConfigured : "";

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="locale" value={locale} />
      <label className="flex flex-col gap-2 text-sm font-semibold">
        {t.admin.login.email}
        <span className="relative">
          <Mail className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-accent" aria-hidden="true" />
          <input name="email" type="email" dir="ltr" autoComplete="username" required className="field ps-10 rtl:text-right" />
        </span>
      </label>
      <label className="flex flex-col gap-2 text-sm font-semibold">
        {t.admin.login.password}
        <span className="relative">
          <Lock className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-accent" aria-hidden="true" />
          <input name="password" type="password" dir="ltr" autoComplete="current-password" required className="field ps-10 rtl:text-right" />
        </span>
      </label>
      {error && (
        <p role="alert" className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn-primary mt-2 w-full" disabled={pending || !configured}>
        <LogIn className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        {pending ? t.common.loading : t.admin.login.submit}
      </button>
    </form>
  );
}
