import type { FieldDef } from "./schema";
import { EMAIL_RE, HEX_RE, SLUG_RE, isSafeUrl, type FieldError } from "@/lib/validation";
import { LOCALES, type L } from "@/lib/types";

export type Errors = Record<string, FieldError>;

const str = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v));
const loc = (v: unknown): L => {
  const o = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
  return { en: str(o.en).trim(), ar: str(o.ar).trim() };
};

/**
 * Coerce untrusted form data into the shape the schema expects and collect validation errors.
 * Unknown keys are dropped, so clients can't inject arbitrary properties.
 */
export function sanitize(fields: FieldDef[], input: Record<string, unknown>, ctx: { slugs?: string[] } = {}) {
  const out: Record<string, unknown> = {};
  const errors: Errors = {};

  for (const f of fields) {
    const raw = input[f.name];
    switch (f.type) {
      case "ltext":
      case "ltextarea":
      case "llines": {
        const v = loc(raw);
        out[f.name] = v;
        if (f.required && !v.en && !v.ar) errors[f.name] = { code: "required" };
        for (const l of LOCALES) if (f.max && v[l].length > f.max) errors[`${f.name}.${l}`] = { code: "maxLength", n: f.max };
        break;
      }
      case "boolean":
        out[f.name] = raw === true || raw === "true" || raw === "on";
        break;
      case "number": {
        const n = Number(raw);
        if (raw === "" || raw == null || Number.isNaN(n)) {
          if (f.required) errors[f.name] = { code: "number" };
          out[f.name] = f.min ?? 0;
        } else {
          out[f.name] = Math.min(f.max ?? Infinity, Math.max(f.min ?? -Infinity, n));
        }
        break;
      }
      case "gallery": {
        const list = Array.isArray(raw) ? raw : [];
        out[f.name] = list
          .map((g) => ({ src: str((g as Record<string, unknown>)?.src).trim(), caption: loc((g as Record<string, unknown>)?.caption) }))
          .filter((g) => g.src && isSafeUrl(g.src))
          .slice(0, 40);
        break;
      }
      default: {
        const v = str(raw).trim();
        out[f.name] = v;
        if (f.required && !v) errors[f.name] = { code: "required" };
        else if (f.max && v.length > f.max && f.type !== "url" && f.type !== "image") errors[f.name] = { code: "maxLength", n: f.max };
        else if (v && (f.type === "url" || f.type === "image") && (!isSafeUrl(v) || v.length > 500)) errors[f.name] = { code: "url" };
        else if (v && f.type === "email" && !EMAIL_RE.test(v)) errors[f.name] = { code: "email" };
        else if (v && f.type === "color" && !HEX_RE.test(v)) errors[f.name] = { code: "color" };
        else if (f.type === "slug" && v) {
          if (!SLUG_RE.test(v)) errors[f.name] = { code: "slug" };
          else if (f.unique && ctx.slugs?.includes(v)) errors[f.name] = { code: "slugTaken" };
        } else if (v && f.type === "select" && f.options && !f.options.includes(v)) errors[f.name] = { code: "required" };
      }
    }
  }
  return { data: out, errors };
}
