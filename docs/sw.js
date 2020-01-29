// Cache name
const CACHE_NAME = 'version1.0';
// Cache targets
const urlsToCache = [
  './',
  './index.html',
  './scripts/com.js',
  './styles/import.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        return response ? response : fetch(event.request);
      })
  );
});
