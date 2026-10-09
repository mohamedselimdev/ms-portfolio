"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Privacy-friendly page-view beacon: no cookies with personal data, no third parties. */
export function PageTracker() {
  const pathname = usePathname();
  useEffect(() => {
    const body = JSON.stringify({ path: pathname, referrer: document.referrer });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    else fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "content-type": "application/json" } }).catch(() => {});
  }, [pathname]);
  return null;
}
