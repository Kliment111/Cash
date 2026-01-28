const CACHE_VERSION = '2.0.0';
const CACHE_NAME = `cashflow-v${CACHE_VERSION}`;
const STATIC_CACHE = `cashflow-static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE = `cashflow-dynamic-v${CACHE_VERSION}`;

// Файлы для кэширования
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './main.js',
  './manifest.json',
  './icon.svg',
  './splashScreen.html',
  './monthEndModal.html',
  './withdrawAssetModal.html',
  './google-auth.js'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log(`[SW] Installing version ${CACHE_VERSION}`);
  
  // Принудительно активируем новый service worker
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log(`[SW] Caching static assets for version ${CACHE_VERSION}`);
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      console.log(`[SW] Static assets cached successfully`);
      return self.skipWaiting();
    }).catch(error => {
      console.error(`[SW] Failed to cache static assets:`, error);
    })
  );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log(`[SW] Activating version ${CACHE_VERSION}`);
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Удаляем старые кэши
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log(`[SW] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log(`[SW] Activation complete for version ${CACHE_VERSION}`);
      return self.clients.claim();
    })
  );
});

// Обработка запросов
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Пропускаем chrome-extension и другие не-http запросы
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Стратегия: Cache First для статических файлов, Network First для динамических
  if (STATIC_ASSETS.some(asset => url.pathname === new URL(asset, self.location.origin).pathname)) {
    // Статические файлы - сначала из кэша, потом проверка сети
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          // Проверяем, не устарел ли кэш
          return fetch(request).then((response) => {
            if (response.ok) {
              // Обновляем кэш свежей версией
              caches.open(STATIC_CACHE).then((cache) => {
                cache.put(request, response.clone());
              });
            }
            return response;
          }).catch(() => {
            // Если сеть недоступна, возвращаем кэш
            return cached;
          });
        }
        
        // Если в кэше нет, загружаем из сети
        return fetch(request).then((response) => {
          if (response.ok) {
            // Сохраняем в кэш
            const responseClone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
  } else {
    // Динамические запросы - сначала сеть, потом кэш
    event.respondWith(
      fetch(request).then((response) => {
        if (response.ok) {
          // Кэшируем успешные ответы
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // Если сеть недоступна, пробуем из кэша
        return caches.match(request);
      })
    );
  }
});

// Обработка сообщений от клиента
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
  
  if (event.data && event.data.type === 'FORCE_UPDATE') {
    // Принудительное обновление всех кэшей
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => {
      console.log('[SW] All caches cleared due to force update');
      self.skipWaiting();
    });
  }
});

// Периодическая очистка старых кэшей
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cleanup-cache') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE];
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!currentCaches.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  }
});
