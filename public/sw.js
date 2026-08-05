// Minimal service worker — Chrome still wants one registered for the
// automatic PWA install prompt to appear, even though it dropped the
// requirement for manual installs via the browser menu.
//
// Deliberately does no caching: this app shows live data (wallet balance,
// order/email status) that must never be served stale, so every request
// just passes straight through to the network.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
