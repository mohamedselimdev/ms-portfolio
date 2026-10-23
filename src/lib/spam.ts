// Server-side heuristics for contact-form spam.
// Detected spam is NOT dropped: it is stored with status "spam" (own tab in the inbox, no email
// notification), so a false positive can still be recovered from the dashboard.

import type { InquiryInput } from "./validation";

/** Strong signals: phrasing typical of cold sales pitches (SEO / marketing agencies). */
const STRONG: RegExp[] = [
  /\b(hello|hi|hey|dear)\s+(team\s+)?(https?:\/\/)?(www\.)?mohamedselim\.dev/i, // greeting the domain, mail-merge style
  /\bcame across your (business|website|site|company)/i,
  /\bwe (specialize|specialise) in helping/i,
  /\bwe help (businesses|companies|brands)/i,
  /\b(quote|quotation) (&|and) price list/i,
  /\bprice list\b/i,
  /\b(AEO|GEO)\b/,
  /\b(answer|generative) engine optimi[sz]ation/i,
  /\byour (online visibility|online presence|website'?s? ranking|search rankings?)/i,
  /\b(target keywords|guest post|backlinks?|link building|first page of google)\b/i,
  /\b(may|can) i send you (a|our) (quote|proposal|price)/i,
  /\bshare your target keywords/i,
];

/** Weak signals: fine alone (a real client may ask for SEO), suspicious together. */
const WEAK: RegExp[] = [
  /\bSEO\b/i,
  /\bsearch engines?\b/i,
  /\b(qualified )?traffic\b/i,
  /\bleads?\b/i,
  /\brank(ing)?\b/i,
  /\bdigital marketing\b/i,
  /\bunsubscribe\b/i,
  /https?:\/\//i,
];

export function spamScore(input: Pick<InquiryInput, "name" | "company" | "message">) {
  const text = `${input.name}\n${input.company}\n${input.message}`;
  let score = 0;
  for (const re of STRONG) if (re.test(text)) score += 2;
  for (const re of WEAK) if (re.test(text)) score += 1;
  return score;
}

export const SPAM_THRESHOLD = 4;

export const isLikelySpam = (input: Pick<InquiryInput, "name" | "company" | "message">) => spamScore(input) >= SPAM_THRESHOLD;

/** Cloudflare Turnstile server-side check. Returns true when not configured. */
export async function verifyTurnstile(token: string, secret: string, ip: string) {
  if (!secret) return true;
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip && ip !== "unknown") body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("Turnstile verification failed", err);
    return false;
  }
}

/** Minimum time (ms) a human needs to fill the form. Faster submissions are bots. */
export const MIN_FILL_MS = 4000;
