// ✅ SERVICE WORKER ETEX - VERSÃO FINAL

const CACHE_NAME = 'etex-rastreamento-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/cliente.html', 
  '/admin.html',
  '/manifest.json',
  '/firebase-config.js',
  '/icon-192.png',
  '/icon-512.png'
];

// ✅ INSTALAR SERVICE WORKER
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker instalado com sucesso');
        self.skipWaiting(); // Ativar imediatamente
      })
  );
});

// ✅ ATIVAR SERVICE WORKER
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Ativando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('🚀 Service Worker ativo');
      self.clients.claim(); // Controlar todas as páginas imediatamente
    })
  );
});

// ✅ INTERCEPTAR REQUISIÇÕES (FETCH)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - retorna resposta do cache
        if (response) {
          return response;
        }
        
        // Clone da requisição
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then((response) => {
          // Verifica se é uma resposta válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone da resposta
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
  );
});

// ✅ BACKGROUND SYNC (para rastreamento offline)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-tracking') {
    console.log('🔄 Background sync: Tentando sincronizar dados...');
    event.waitUntil(
      syncTrackingData()
    );
  }
});

// ✅ PUSH NOTIFICATIONS
self.addEventListener('push', (event) => {
  console.log('🔔 Push notification recebida');
  
  const options = {
    body: event.data ? event.data.text() : 'Etex Rastreamento',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'open',
        title: 'Abrir App',
        icon: '/icon-192.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icon-192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('🚚 Etex Rastreamento', options)
  );
});

// ✅ CLIQUE EM NOTIFICAÇÃO
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notificação clicada:', event.action);
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// ✅ FUNÇÃO DE SINCRONIZAÇÃO OFFLINE
async function syncTrackingData() {
  try {
    console.log('📡 Tentando sincronizar dados offline...');
    // Implementar lógica de sync quando necessário
    return Promise.resolve();
  } catch (error) {
    console.log('❌ Erro na sincronização:', error);
    return Promise.reject(error);
  }
}

// ✅ MESSAGE HANDLER
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('🚚 Service Worker Etex carregado e pronto!');
