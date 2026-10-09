// Shared (client + server) validation helpers. Return error codes; UI maps them to localized messages.

export type ErrorCode = "required" | "email" | "minLength" | "maxLength" | "url" | "slug" | "slugTaken" | "color" | "number";
export interface FieldError {
  code: ErrorCode;
  n?: number;
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const HEX_RE = /^#[0-9a-fA-F]{6}$/;

export function isSafeUrl(value: string) {
  if (!value) return true;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  if (/^(mailto:|tel:)/.test(value)) return true;
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export interface InquiryInput {
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  timeline: string;
  message: string;
}

export const INQUIRY_LIMITS = { name: 100, email: 200, company: 120, service: 120, message: 3000 };

export function validateInquiry(input: InquiryInput) {
  const errors: Partial<Record<keyof InquiryInput, FieldError>> = {};
  if (!input.name.trim()) errors.name = { code: "required" };
  else if (input.name.length > INQUIRY_LIMITS.name) errors.name = { code: "maxLength", n: INQUIRY_LIMITS.name };
  if (!input.email.trim()) errors.email = { code: "required" };
  else if (!EMAIL_RE.test(input.email.trim()) || input.email.length > INQUIRY_LIMITS.email) errors.email = { code: "email" };
  if (input.company.length > INQUIRY_LIMITS.company) errors.company = { code: "maxLength", n: INQUIRY_LIMITS.company };
  if (!input.service.trim()) errors.service = { code: "required" };
  if (!input.budget) errors.budget = { code: "required" };
  if (!input.timeline) errors.timeline = { code: "required" };
  if (!input.message.trim()) errors.message = { code: "required" };
  else if (input.message.trim().length < 20) errors.message = { code: "minLength", n: 20 };
  else if (input.message.length > INQUIRY_LIMITS.message) errors.message = { code: "maxLength", n: INQUIRY_LIMITS.message };
  return errors;
}
