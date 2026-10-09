"use client";

import { useActionState, useState } from "react";
import { Briefcase, Building2, CheckCircle2, Lock, Mail, Send, User } from "lucide-react";
import { submitInquiry, type InquiryState } from "@/app/actions/inquiry";
import { useI18n } from "@/i18n/client";
import { format } from "@/i18n/config";
import { INQUIRY_LIMITS, validateInquiry, type FieldError, type InquiryInput } from "@/lib/validation";
import { cn } from "@/lib/utils";

type Field = keyof InquiryInput;

export function ContactForm({ services }: { services: string[] }) {
  const { t, locale } = useI18n();
  const [state, action, pending] = useActionState<InquiryState, FormData>(submitInquiry, { status: "idle" });
  const [clientErrors, setClientErrors] = useState<Partial<Record<Field, FieldError>>>({});
  const [length, setLength] = useState(0);
  const [formKey, setFormKey] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const errors = { ...state.errors, ...clientErrors };
  const message = (e?: FieldError) =>
    e && format(t.validation[e.code as keyof typeof t.validation] as string, { n: e.n ?? "" });

  if (state.status === "success" && !dismissed) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center" role="status">
        <span className="grid size-16 place-items-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="size-8" aria-hidden="true" />
        </span>
        <h3 className="heading-md text-2xl">{t.contact.successTitle}</h3>
        <p className="max-w-md text-muted">{t.contact.successText}</p>
        <button
          type="button"
          className="btn btn-outline mt-2"
          onClick={() => {
            setDismissed(true);
            setFormKey((k) => k + 1);
            setLength(0);
          }}
        >
          {t.contact.sendAnother}
        </button>
      </div>
    );
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "");
    const found = validateInquiry({
      name: get("name"),
      email: get("email"),
      company: get("company"),
      service: get("service"),
      budget: get("budget"),
      timeline: get("timeline"),
      message: get("message"),
    });
    setClientErrors(found);
    setDismissed(false);
    if (Object.keys(found).length) {
      e.preventDefault();
      const first = e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(found)[0]}"]`);
      first?.focus();
    }
  }

  const clear = (field: Field) =>
    clientErrors[field] &&
    setClientErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });

  const errorId = (f: Field) => (errors[f] ? `${f}-error` : undefined);
  const ErrorText = ({ field }: { field: Field }) =>
    errors[field] ? (
      <p id={`${field}-error`} className="mt-1.5 text-xs text-red-300">
        {message(errors[field])}
      </p>
    ) : null;


  const PillGroup = ({ name, legend, options }: { name: Field; legend: string; options: string[] }) => (
    <fieldset aria-describedby={errorId(name)}>
      <legend className="mb-2 block text-sm font-semibold">
        {legend} <span className="text-red-400" aria-hidden="true">*</span>
      </legend>
      <div className="grid grid-cols-2 gap-2 xs:grid-cols-3">
        {options.map((opt, i) => (
          <label key={opt} className="relative">
            <input type="radio" name={name} value={i} className="peer sr-only" onChange={() => clear(name)} required />
            <span className="flex min-h-11 cursor-pointer items-center justify-center rounded-[calc(var(--radius)*0.6)] border border-line-strong bg-white/[0.02] px-2 text-center text-sm transition-colors peer-checked:border-primary peer-checked:bg-primary/15 peer-checked:text-fg peer-focus-visible:ring-2 peer-focus-visible:ring-accent hover:border-primary/60">
              {opt}
            </span>
          </label>
        ))}
      </div>
      {ErrorText({ field: name })}
    </fieldset>
  );

  return (
    <form key={formKey} action={action} onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <input type="hidden" name="locale" value={locale} />
      <div aria-hidden="true" className="absolute -start-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name" required>
            {t.contact.name}
          </Label>
          <div className="relative">
            <User className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-accent" aria-hidden="true" />
            <input id="name" name="name" autoComplete="name" maxLength={INQUIRY_LIMITS.name} placeholder={t.contact.namePlaceholder} className="field ps-10" aria-invalid={!!errors.name} aria-describedby={errorId("name")} onInput={() => clear("name")} required />
          </div>
          {ErrorText({ field: "name" })}
        </div>
        <div>
          <Label htmlFor="email" required>
            {t.contact.email}
          </Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-accent" aria-hidden="true" />
            <input id="email" name="email" type="email" dir="ltr" autoComplete="email" inputMode="email" maxLength={INQUIRY_LIMITS.email} placeholder={t.contact.emailPlaceholder} className="field ps-10 rtl:text-right" aria-invalid={!!errors.email} aria-describedby={errorId("email")} onInput={() => clear("email")} required />
          </div>
          {ErrorText({ field: "email" })}
        </div>
        <div>
          <Label htmlFor="company">
            {t.contact.company} <span className="font-normal text-muted">{t.contact.optional}</span>
          </Label>
          <div className="relative">
            <Building2 className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-accent" aria-hidden="true" />
            <input id="company" name="company" autoComplete="organization" maxLength={INQUIRY_LIMITS.company} placeholder={t.contact.companyPlaceholder} className="field ps-10" />
          </div>
        </div>
        <div>
          <Label htmlFor="service" required>
            {t.contact.service}
          </Label>
          <div className="relative">
            <Briefcase className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-accent" aria-hidden="true" />
            <select id="service" name="service" defaultValue="" className="field ps-10" aria-invalid={!!errors.service} aria-describedby={errorId("service")} onChange={() => clear("service")} required>
              <option value="" disabled>
                {t.contact.servicePlaceholder}
              </option>
              {services.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
              <option value={t.contact.serviceOther}>{t.contact.serviceOther}</option>
            </select>
          </div>
          {ErrorText({ field: "service" })}
        </div>
      </div>

      {PillGroup({ name: "budget", legend: t.contact.budget, options: t.contact.budgets })}
      {PillGroup({ name: "timeline", legend: t.contact.timeline, options: t.contact.timelines })}

      <div>
        <Label htmlFor="message" required>
          {t.contact.message}
        </Label>
        <textarea
          id="message"
          name="message"
          rows={6}
          maxLength={INQUIRY_LIMITS.message}
          placeholder={t.contact.messagePlaceholder}
          className="field resize-y"
          aria-invalid={!!errors.message}
          aria-describedby={cn(errorId("message"), "message-count")}
          onInput={(e) => {
            setLength(e.currentTarget.value.length);
            clear("message");
          }}
          required
        />
        <div className="mt-1.5 flex justify-between gap-4">
          {ErrorText({ field: "message" })}
          <p id="message-count" className="ms-auto text-xs text-subtle tabular-nums">
            {length} / {INQUIRY_LIMITS.message}
          </p>
        </div>
      </div>

      {state.status === "error" && (state.message || Object.keys(errors).length > 0) && (
        <p role="alert" className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-red-200">
          {state.message ? t.validation[state.message] : t.validation.fixErrors}
        </p>
      )}

      <button type="submit" className="btn btn-primary min-h-13 w-full text-base" disabled={pending}>
        <Send className="size-5 rtl:-scale-x-100" aria-hidden="true" />
        {pending ? t.contact.sending : t.contact.submit}
      </button>
      <p className="flex items-center justify-center gap-2 text-center text-xs text-muted">
        <Lock className="size-3.5" aria-hidden="true" />
        {t.contact.privacy}
      </p>
    </form>
  );
}

function Label({ htmlFor, children, required }: { htmlFor?: string; children: React.ReactNode; required?: boolean }) {
  return (
  <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold">
    {children}
    {required && (
      <span className="text-red-400" aria-hidden="true">
        {" "}
        *
      </span>
    )}
  </label>
  );
}
