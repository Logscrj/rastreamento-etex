// ✅ SERVICE WORKER SIMPLES PARA PWA

const CACHE_NAME = 'etex-v1';
const urlsToCache = [
  './',
  './index.html',
  './cliente.html',
  './admin.html',
  './manifest.json',
  './firebase-config.js'
];

// Instalar
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Ativar
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

console.log('🚚 Service Worker Etex ativo!');
