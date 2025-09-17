/*
  COOP/COEP Service Worker (root scope)
  - Adds the headers required for cross-origin isolation on same-origin responses.
*/
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // only touch same-origin

  event.respondWith((async () => {
    const res = await fetch(req);
    const newHeaders = new Headers(res.headers);
    newHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');
    newHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp');
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers: newHeaders });
  })());
});
