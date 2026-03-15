const CACHE_NAME = 'mathlab-v1';
const STATIC_CACHE = 'mathlab-static-v1';
const DATA_CACHE = 'mathlab-data-v1';

// Статические ресурсы для кэширования
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/css/modules.css',
  '/js/config.js',
  '/js/state.js',
  '/js/main-new.js',
  '/js/modules/theme.js',
  '/js/modules/search.js',
  '/js/modules/theorems.js',
  '/js/modules/bookmarks.js',
  '/js/modules/navigation.js',
  '/js/modules/exercises.js',
  '/js/modules/visualization.js',
  '/js/modules/lazy-loader.js',
  '/data/theorems.json',
  '/data/exercises.json'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Кэширование статических ресурсов');
        return cache.addAll(STATIC_RESOURCES);
      })
      .then(() => self.skipWaiting())
  );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DATA_CACHE) {
              console.log('Удаление старого кэша:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Перехват запросов
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Обработка запросов к данным
  if (url.pathname.startsWith('/data/')) {
    event.respondWith(handleDataRequest(event.request));
    return;
  }
  
  // Обработка запросов к статическим ресурсам
  if (url.pathname.startsWith('/css/') || 
      url.pathname.startsWith('/js/') || 
      url.pathname.startsWith('/')) {
    event.respondWith(handleStaticRequest(event.request));
    return;
  }
  
  // Для остальных запросов пробуем сеть, потом кэш
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Обработка запросов к данным
async function handleDataRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Сначала пробуем сеть
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Кэшируем успешный ответ
      const cache = await caches.open(DATA_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    // Если сеть не удалась, пробуем кэш
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw new Error('Данные не найдены в сети и кэше');
    
  } catch (error) {
    console.warn('Ошибка загрузки данных:', error);
    
    // Возвращаем кэшированную версию или ошибку
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Возвращаем базовые данные для теорем и упражнений
    if (url.pathname.includes('theorems.json')) {
      return new Response(JSON.stringify(getBasicTheorems()), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (url.pathname.includes('exercises.json')) {
      return new Response(JSON.stringify(getBasicExercises()), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('{"error": "Данные недоступны"}', {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Обработка запросов к статическим ресурсам
async function handleStaticRequest(request) {
  try {
    // Сначала пробуем сеть
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Кэшируем успешный ответ
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    // Если сеть не удалась, пробуем кэш
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw new Error('Ресурс не найден');
    
  } catch (error) {
    console.warn('Ошибка загрузки статического ресурса:', error);
    
    // Возвращаем кэшированную версию
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Для HTML страниц возвращаем базовую страницу
    if (request.headers.get('accept').includes('text/html')) {
      const cachedIndex = await caches.match('/');
      if (cachedIndex) {
        return cachedIndex;
      }
    }
    
    throw error;
  }
}

// Базовые данные для оффлайн режима
function getBasicTheorems() {
  return {
    theorems: [
      {
        id: "pythagoras",
        title: "Теорема Пифагора",
        url: "theorem-pythagoras.html",
        course: "1",
        difficulty: "basic",
        category: "geometry",
        tags: ["геометрия", "евклидова-геометрия", "треугольники"],
        description: "Фундаментальный результат евклидовой геометрии, связывающий стороны прямоугольного треугольника."
      }
    ],
    metadata: {
      version: "1.0",
      totalTheorems: 1,
      offline: true
    }
  };
}

function getBasicExercises() {
  return {
    exercises: [
      {
        id: "ex-pythagoras-001",
        title: "Нахождение гипотенузы",
        theoremId: "pythagoras",
        category: "geometry",
        difficulty: "easy",
        question: "В прямоугольном треугольнике катеты равны 3 и 4. Найдите длину гипотенузы.",
        answer: "5",
        explanation: "По теореме Пифагора: c = √(3² + 4²) = √(9 + 16) = √25 = 5",
        points: 10
      }
    ],
    metadata: {
      version: "1.0",
      totalExercises: 1,
      offline: true
    }
  };
}

// Обработка сообщений от клиента
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_STATS':
      getCacheStats().then(stats => {
        event.ports[0].postMessage({ type: 'CACHE_STATS', payload: stats });
      });
      break;
      
    case 'CLEAR_CACHE':
      clearCache().then(() => {
        event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
      });
      break;
      
    case 'PRELOAD_RESOURCES':
      preloadResources(payload.urls);
      break;
  }
});

// Получение статистики кэша
async function getCacheStats() {
  const [staticCache, dataCache] = await Promise.all([
    caches.open(STATIC_CACHE),
    caches.open(DATA_CACHE)
  ]);
  
  const staticKeys = await staticCache.keys();
  const dataKeys = await dataCache.keys();
  
  return {
    static: {
      size: staticKeys.length,
      keys: staticKeys.map(req => req.url)
    },
    data: {
      size: dataKeys.length,
      keys: dataKeys.map(req => req.url)
    }
  };
}

// Очистка кэша
async function clearCache() {
  await Promise.all([
    caches.delete(STATIC_CACHE),
    caches.delete(DATA_CACHE)
  ]);
}

// Предзагрузка ресурсов
async function preloadResources(urls) {
  const cache = await caches.open(STATIC_CACHE);
  
  try {
    await cache.addAll(urls);
    console.log('Ресурсы предзагружены:', urls);
  } catch (error) {
    console.warn('Ошибка предзагрузки ресурсов:', error);
  }
}

// Синхронизация данных (периодическая)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  try {
    // Здесь можно реализовать синхронизацию с сервером
    console.log('Синхронизация данных...');
    
    // Обновляем кэш данных
    const response = await fetch('/data/theorems.json');
    if (response.ok) {
      const cache = await caches.open(DATA_CACHE);
      await cache.put('/data/theorems.json', response);
    }
    
  } catch (error) {
    console.warn('Ошибка синхронизации:', error);
  }
}

// Фоновая синхронизация
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'periodic-sync') {
    event.waitUntil(syncData());
  }
});

// Уведомления
self.addEventListener('push', (event) => {
  const options = {
    body: 'Новые материалы доступны в MathLab',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: 'mathlab-update',
    renotify: true,
    actions: [
      {
        action: 'open',
        title: 'Открыть'
      },
      {
        action: 'dismiss',
        title: 'Закрыть'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('MathLab', options)
  );
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('Service Worker загружен');
