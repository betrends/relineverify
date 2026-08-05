"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Non-critical — the site still works fine, it just won't trigger
        // Chrome's automatic "Install app" prompt without it.
      });
    }
  }, []);

  return null;
}
