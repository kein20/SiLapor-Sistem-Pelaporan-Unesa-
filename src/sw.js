const CACHE_NAME = 'silapor-unesa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.webmanifest',
  '/images/logo.png',
  '/images/hero.jpg',
  '/images/icons/icon-192.png',
  '/images/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  console.log('SW: Installing');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('SW: Activating');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
