// Service Worker para Rastreamento Etex
const CACHE_NAME = 'etex-tracker-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar requisições
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - retornar resposta do cache
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Background Sync para enviar localização quando voltar online
self.addEventListener('sync', event => {
  if (event.tag === 'send-location') {
    event.waitUntil(sendPendingLocations());
  }
});

// Função para enviar localizações pendentes
async function sendPendingLocations() {
  // Implementação para enviar localizações armazenadas localmente
  // quando o dispositivo voltar a ficar online
  console.log('Enviando localizações pendentes...');
}

// Manter o Service Worker ativo
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'KEEP_ALIVE') {
    // Responder para manter a conexão ativa
    event.ports[0].postMessage({ type: 'ALIVE' });
  }
});

// Periodic Background Sync (se disponível)
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-location') {
    event.waitUntil(updateLocation());
  }
});

async function updateLocation() {
  // Esta função seria chamada periodicamente em background
  // Note: Periodic Background Sync ainda tem suporte limitado
  console.log('Atualizando localização em background...');
}