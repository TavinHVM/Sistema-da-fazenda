const CACHE_NAME = 'fazenda-static-cache-v1.0.4';

const urlsToCache = [
    '/pwa/favicon.ico',
    '/pwa/icon-192x192.png',
    '/pwa/icon-512x512.png',
    '/pwa/index.html',
    '/pwa/manifest.json',
    '/pwa/offline.html'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match('/pwa/offline.html');
        })
    );
});
