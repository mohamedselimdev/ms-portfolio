"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useI18n } from "@/i18n/client";

export function CopyButton({ value, label }: { value: string; label: string }) {
  const { t } = useI18n();
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-ghost btn-icon relative z-10"
      aria-label={`${t.common.copy}: ${label}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          setTimeout(() => setDone(false), 1800);
        } catch {
          // Clipboard unavailable (insecure context or denied permission).
        }
      }}
    >
      {done ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
      <span className="sr-only" aria-live="polite">
        {done ? t.common.copied : ""}
      </span>
    </button>
  );
}
