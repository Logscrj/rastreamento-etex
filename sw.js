// Service Worker Etex - Funcionamento em segundo plano
const CACHE_NAME = 'etex-tracker-v2025';
const urlsToCache = [
  '/',
  '/index.html',
  '/admin.html',
  '/cliente.html',
  '/manifest.json',
  '/firebase-config.js'
];

// Instalação
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('🚚 Cache Etex criado');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Ativação
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptar requisições
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

console.log('🚚 Service Worker Etex carregado!');
