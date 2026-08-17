// ponytail: stale-while-revalidate → cache-first for offline-first PWA. Add runtime asset caching if user reports missing resources after deploy.
const CACHE_NAME = 'zen-kana-v5';
const appUrl = (path) => new URL(path, self.registration.scope).toString();

// Install Event - App Shell first, then critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      const appShell = [appUrl('index.html'), appUrl('manifest.json')];
      return Promise.all([
        ...appShell.map(url => cache.put(url, fetch(url))),
        ...['icons/icon-192x192.png', 'icons/icon-512x512.png'].map(url => {
          const absoluteUrl = appUrl(url);
          return cache.put(absoluteUrl, fetch(absoluteUrl));
        })
      ]).then(() => self.skipWaiting())
    })
  );
});

// Activate Event - Claim clients and clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Cache-first strategy for offline support
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const { pathname } = event.request.url;
  
  // Exclude external requests from caching
  if (!pathname.startsWith('/') || pathname.includes('://')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached immediately, then try network in background
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.ok && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => 
              cache.put(event.request, responseToCache)
            );
          }
          return networkResponse;
        });

      // Return cached OR fetch result
      return cachedResponse || fetchPromise.catch(() => null);
    })
  );
});
