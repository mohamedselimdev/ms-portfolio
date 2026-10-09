"use server";

import { clientIp, rateLimit } from "@/lib/auth";
import { addInquiry, getContent, updateContent } from "@/lib/store";
import { validateInquiry, type FieldError, type InquiryInput } from "@/lib/validation";
import { isLocale } from "@/i18n/config";
import { readEnv } from "@/lib/env";
import en from "@/i18n/messages/en";
import type { Inquiry } from "@/lib/types";

export type InquiryState = { status: "idle" | "success" | "error"; errors?: Partial<Record<keyof InquiryInput, FieldError>>; message?: "tooMany" | "generic" };

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

export async function submitInquiry(_prev: InquiryState, fd: FormData): Promise<InquiryState> {
  // Honeypot: bots fill hidden fields. Pretend success.
  if (str(fd, "website")) return { status: "success" };

  const ip = await clientIp();
  if (!rateLimit(`inquiry:${ip}`, 5, 10 * 60_000)) return { status: "error", message: "tooMany" };

  const budgetIdx = Number(str(fd, "budget"));
  const timelineIdx = Number(str(fd, "timeline"));
  const input: InquiryInput = {
    name: str(fd, "name"),
    email: str(fd, "email"),
    company: str(fd, "company"),
    service: str(fd, "service"),
    // Store budget/timeline in English so the dashboard stays consistent.
    budget: en.contact.budgets[budgetIdx] ?? "",
    timeline: en.contact.timelines[timelineIdx] ?? "",
    message: str(fd, "message"),
  };
  const errors = validateInquiry(input);
  if (Object.keys(errors).length) return { status: "error", errors };

  const locale = str(fd, "locale");
  const inquiry: Inquiry = {
    id: crypto.randomUUID(),
    ...input,
    locale: isLocale(locale) ? locale : "en",
    status: "new",
    createdAt: new Date().toISOString(),
  };

  try {
    await addInquiry(inquiry);
    await updateContent((c) => c, { action: "create", section: "inquiries", label: `${inquiry.name} <${inquiry.email}>` });
    await notify(inquiry);
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
