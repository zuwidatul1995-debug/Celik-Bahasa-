// Simple service worker: cache app shell for offline use
const CACHE_NAME = 'celik-bahasa-v1';
const FILES_TO_CACHE = [
  '/index.html',
  '/manifest.json',
  '/sw.js',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE).catch(err => console.warn('cache addAll error', err));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => {
        if (k !== CACHE_NAME) return caches.delete(k);
      })
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.match(evt.request).then(resp => {
      return resp || fetch(evt.request).catch(() => {
        // optional: return offline page for navigation requests
        if (evt.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
