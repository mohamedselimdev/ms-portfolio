import "server-only";
import en from "./messages/en";
import ar from "./messages/ar";
import type { Messages } from "./messages/en";
import type { Locale } from "./config";

const messages: Record<Locale, Messages> = { en, ar };

export const getMessages = (locale: Locale): Messages => messages[locale];
export type { Messages };
