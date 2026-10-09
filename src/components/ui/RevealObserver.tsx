"use client";

import { useEffect } from "react";

/** Adds `.is-visible` to [data-reveal] elements as they scroll into view, including ones mounted later. */
export function RevealObserver() {
  useEffect(() => {
    const selector = "[data-reveal]:not(.is-visible)";
    if (!("IntersectionObserver" in window)) {
      document.documentElement.classList.remove("js");
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }),
      { rootMargin: "0px 0px -6% 0px", threshold: 0.05 },
    );
    const scan = (root: ParentNode) => {
      if (root instanceof Element && root.matches(selector)) io.observe(root);
      root.querySelectorAll(selector).forEach((el) => io.observe(el));
    };
    scan(document);
    const mo = new MutationObserver((mutations) =>
      mutations.forEach((m) => m.addedNodes.forEach((n) => n instanceof Element && scan(n))),
    );
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
