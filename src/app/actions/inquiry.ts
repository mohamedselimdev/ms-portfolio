"use server";

import { clientIp, rateLimit } from "@/lib/auth";
import { addInquiry, getContent, updateContent } from "@/lib/store";
import { validateInquiry, type FieldError, type InquiryInput } from "@/lib/validation";
import { isLikelySpam, MIN_FILL_MS, verifyTurnstile } from "@/lib/spam";
import { isLocale } from "@/i18n/config";
import { readEnv } from "@/lib/env";
import en from "@/i18n/messages/en";
import type { Inquiry } from "@/lib/types";

export type InquiryState = { status: "idle" | "success" | "error"; errors?: Partial<Record<keyof InquiryInput, FieldError>>; message?: "tooMany" | "generic" | "captcha" };

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

export async function submitInquiry(_prev: InquiryState, fd: FormData): Promise<InquiryState> {
  // Honeypot: bots fill hidden fields. Pretend success.
  if (str(fd, "website")) return { status: "success" };

  // Time trap: the form stamps its render time; instant submissions are scripts. Pretend success.
  // A missing stamp (no JavaScript) is not dropped, only filed under Spam for review.
  const startedAt = Number(str(fd, "ts"));
  if (startedAt && Date.now() - startedAt < MIN_FILL_MS) return { status: "success" };

  const ip = await clientIp();
  if (!rateLimit(`inquiry:${ip}`, 5, 10 * 60_000)) return { status: "error", message: "tooMany" };

  // Cloudflare Turnstile (active only when both keys are configured).
  if (readEnv("TURNSTILE_SITE_KEY") && readEnv("TURNSTILE_SECRET_KEY")) {
    const ok = await verifyTurnstile(str(fd, "cf-turnstile-response"), readEnv("TURNSTILE_SECRET_KEY"), ip);
    if (!ok) return { status: "error", message: "captcha" };
  }

  // An unselected radio is "", and Number("") is 0 which silently became "< $500" / "ASAP".
  const pick = (list: readonly string[], key: string) => {
    const raw = str(fd, key);
    return /^\d+$/.test(raw) ? (list[Number(raw)] ?? "") : "";
  };
  const input: InquiryInput = {
    name: str(fd, "name"),
    email: str(fd, "email"),
    company: str(fd, "company"),
    service: str(fd, "service"),
    // Store budget/timeline in English so the dashboard stays consistent.
    budget: pick(en.contact.budgets, "budget"),
    timeline: pick(en.contact.timelines, "timeline"),
    message: str(fd, "message"),
  };
  const errors = validateInquiry(input);
  if (Object.keys(errors).length) return { status: "error", errors };

  const locale = str(fd, "locale");
  const inquiry: Inquiry = {
    id: crypto.randomUUID(),
    ...input,
    locale: isLocale(locale) ? locale : "en",
    // Sales pitches (SEO agencies etc.) go to the Spam tab instead of the inbox.
    status: !startedAt || isLikelySpam(input) ? "spam" : "new",
    createdAt: new Date().toISOString(),
  };

  try {
    await addInquiry(inquiry);
    await updateContent((c) => c, { action: "create", section: "inquiries", label: `${inquiry.name} <${inquiry.email}>` });
    if (inquiry.status !== "spam") await notify(inquiry);
  } catch (err) {
    console.error("Failed to store inquiry", err);
    return { status: "error", message: "generic" };
  }
  return { status: "success" };
}

/** Optional email notification through Resend's HTTP API (no SDK needed). */
async function notify(inquiry: Inquiry) {
  const key = readEnv("RESEND_API_KEY");
  const from = readEnv("CONTACT_NOTIFY_FROM");
  const to = readEnv("CONTACT_NOTIFY_TO") || (await getContent()).settings.email;
  if (!key || !from || !to) return;
  const text = [
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Company: ${inquiry.company || "-"}`,
    `Service: ${inquiry.service}`,
    `Budget: ${inquiry.budget}`,
    `Timeline: ${inquiry.timeline}`,
    "",
    inquiry.message,
  ].join("\n");
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, reply_to: inquiry.email, subject: `New project inquiry — ${inquiry.name}`, text }),
      signal: AbortSignal.timeout(8000),
    });
  } catch (err) {
    console.error("Inquiry notification failed", err);
  }
}
