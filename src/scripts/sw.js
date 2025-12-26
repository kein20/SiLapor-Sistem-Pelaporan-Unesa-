const CACHE_NAME = 'silapor-unesa-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/app.webmanifest',
    '/scripts/index.js',
    '/scripts/app.js',
    '/scripts/routes.js',
    '/scripts/sw.js',
    '/scripts/data/data-manager.js',
    '/scripts/views/home.js',
    '/scripts/views/lapor.js',
    '/scripts/views/detail.js',
    '/scripts/views/login.js',
    '/public/images/logo.png',
    '/public/images/hero.jpg',
    '/images/icons/icon-192.png',
    '/images/icons/icon-512.png',
    // CDN Eksternal (Font & Leaflet) agar peta & font jalan offline (opsional, tapi disarankan)
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// 1. Install Service Worker & Cache Aset
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Service Worker: Caching Files');
            return cache.addAll(urlsToCache);
        })
    );
});

// 2. Activate Service Worker & Hapus Cache Lama
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// 3. Fetch Event (Strategi: Cache First, lalu Network)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Jika ada di cache, pakai cache. Jika tidak, ambil dari internet.
            return response || fetch(event.request);
        })
    );
});