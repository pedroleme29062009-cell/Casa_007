/* Bagunça Organizada — network first, cache fallback */
const CACHE = 'bagunca-static-v3';
const STATIC = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // never cache API
  if (url.hostname.includes('supabase')) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        // cache only same-origin static
        if (url.origin === self.location.origin && res.ok) {
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match('/index.html')))
  );
});
