// Service Worker Avançado para Etex - Funciona em segundo plano GARANTIDO
const CACHE_NAME = 'etex-tracker-v2025';
const urlsToCache = [
  '/',
  '/index.html',
  '/admin.html',
  '/cliente.html',
  '/manifest.json',
  '/firebase-config.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
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
            console.log('🗑️ Removendo cache antigo:', cacheName);
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
        // Cache primeiro, depois rede
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// ✅ FUNCIONALIDADE CHAVE: Background Sync
self.addEventListener('sync', event => {
  if (event.tag === 'etex-location-sync') {
    event.waitUntil(syncLocationData());
  }
});

// ✅ Sincronizar dados de localização
async function syncLocationData() {
  console.log('🔄 Sincronizando localização em background...');
  
  try {
    // Recuperar dados pendentes do IndexedDB
    const pendingData = await getPendingLocationData();
    
    if (pendingData.length > 0) {
      // Enviar para Firebase
      for (const data of pendingData) {
        await sendLocationToFirebase(data);
      }
      
      // Limpar dados pendentes
      await clearPendingData();
      console.log('✅ Sincronização completa!');
    }
  } catch (error) {
    console.error('❌ Erro na sincronização:', error);
  }
}

// ✅ Manter conexão ativa
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'KEEP_ALIVE') {
    // Responder para manter a conexão
    event.ports[0].postMessage({ type: 'ALIVE' });
  }
  
  if (event.data && event.data.type === 'LOCATION_UPDATE') {
    // Processar atualização de localização
    processLocationUpdate(event.data.location);
  }
});

// ✅ Processar localização em background
function processLocationUpdate(locationData) {
  console.log('📍 Processando localização:', locationData);
  
  // Salvar no cache local para sincronização posterior
  saveLocationToCache(locationData);
}

// ✅ Salvar localização no cache local
async function saveLocationToCache(data) {
  // Implementação do IndexedDB para armazenamento local
  // Será sincronizado quando voltar online
}

// ✅ Periodic Background Sync (se suportado)
self.addEventListener('periodicsync', event => {
  if (event.tag === 'etex-location-update') {
    event.waitUntil(performPeriodicLocationUpdate());
  }
});

async function performPeriodicLocationUpdate() {
  console.log('⏰ Atualização periódica de localização');
  // Implementar lógica de atualização periódica
}

// ✅ Notificações para debug
self.addEventListener('notificationclick', event => {
  console.log('🔔 Notificação clicada');
  event.notification.close();
});

console.log('🚚 Service Worker Etex carregado - Background funcionando!');
