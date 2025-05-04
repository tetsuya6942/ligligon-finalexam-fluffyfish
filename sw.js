const CACHE_NAME = 'flappy-fish-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/flappyfish.css',
    '/flappyfish.js',
    '/images.png',
    '/toppipe.png',
    '/bottompipe.png',
    '/background.jpg',
    '/bgm_mario.mp3',
    '/jump.mp3',
    '/gameover.mp3',
    '/manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});