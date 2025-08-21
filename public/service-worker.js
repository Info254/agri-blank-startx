// Enhanced Service Worker with Offline Support
const CACHE_NAME = 'agri-tender-cache-v2';
const API_CACHE_NAME = 'agri-tender-api-cache-v1';
const OFFLINE_PAGE = '/offline.html';

// Cache these resources on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  // Core assets
  '/assets/logo-192x192.png',
  '/assets/logo-512x512.png',
  // Add other critical assets
];

// Cache these API endpoints
const API_ENDPOINTS = [
  '/api/contracts',
  '/api/market-data',
  '/api/user/profile'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== API_CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event with network-first strategy for API, cache-first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and non-http(s) requests
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Handle API requests with network-first strategy
  if (API_ENDPOINTS.some(api => url.pathname.startsWith(api))) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the API response
          const responseToCache = response.clone();
          caches.open(API_CACHE_NAME)
            .then(cache => cache.put(request, responseToCache));
          return response;
        })
        .catch(() => {
          // If network fails, try to get from cache
          return caches.match(request)
            .then((response) => response || caches.match(OFFLINE_PAGE));
        })
    );
  } else {
    // For static assets, use cache-first strategy
    event.respondWith(
      caches.match(request)
        .then((response) => {
          // Return cached response if found
          if (response) {
            return response;
          }
          // Otherwise fetch from network
          return fetch(request).then((networkResponse) => {
            // Don't cache non-200 responses
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }
            // Cache the new response
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(request, responseToCache));
            return networkResponse;
          });
        })
        .catch(() => {
          // If both cache and network fail, show offline page
          return caches.match(OFFLINE_PAGE);
        })
    );
  }
});

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-requests') {
    event.waitUntil(syncPendingRequests());
  }
});

// Function to sync pending requests when back online
async function syncPendingRequests() {
  // Implement sync logic for failed requests
  // This would typically involve getting pending requests from IndexedDB
  // and retrying them
}

// Push notification event listener
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Agri-Tender Connect';
  const options = {
    body: data.body || 'You have new updates',
    icon: '/assets/logo-192x192.png',
    badge: '/assets/badge.png',
    data: data.data || {},
    vibrate: [100, 50, 100],
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const url = event.notification.data.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // Check if there's an open window with the same URL
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        // If no matching client, open a new one
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
