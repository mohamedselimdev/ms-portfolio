"use client";

import { createContext, useContext } from "react";
import type { Messages } from "./messages/en";
import { tl, type Locale } from "./config";
import type { L } from "@/lib/types";

interface I18nValue {
  locale: Locale;
  t: Messages;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ locale, messages, children }: { locale: Locale; messages: Messages; children: React.ReactNode }) {
  return <I18nContext.Provider value={{ locale, t: messages }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return { ...ctx, tl: (value: L | undefined) => tl(value, ctx.locale) };
}
