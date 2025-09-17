/*
  COOP/COEP Service Worker
  - Makes your site cross-origin isolated when possible so SharedArrayBuffer & Threads work
  - See https://developer.chrome.com/docs/cross-origin/isolation
*/

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Only modify top-level document and same-origin requests
  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;

  // Pass through cross-origin requests untouched
  if (!isSameOrigin) return;

  event.respondWith((async () => {
    try {
      const res = await fetch(req);
      // Clone to modify headers
      const newHeaders = new Headers(res.headers);
      newHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');
      newHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp');

      return new Response(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers: newHeaders
      });
    } catch (e) {
      return fetch(req);
    }
  })());
});
