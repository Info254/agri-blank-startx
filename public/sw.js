const CACHE_NAME = 'agri-tender-connect-v1';
const STATIC_CACHE_NAME = 'agri-tender-static-v1';
const DYNAMIC_CACHE_NAME = 'agri-tender-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/favicon.ico',
  '/images/logo.png',
  '/images/placeholder.jpg'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/markets/,
  /\/api\/products/,
  /\/api\/prices/,
  /\/api\/weather/
];

// Maximum cache size (in MB)
const MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim all clients
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method === 'GET') {
    if (isStaticAsset(url)) {
      event.respondWith(handleStaticAsset(request));
    } else if (isAPIRequest(url)) {
      event.respondWith(handleAPIRequest(request));
    } else if (isImageRequest(url)) {
      event.respondWith(handleImageRequest(request));
    } else {
      event.respondWith(handleNavigationRequest(request));
    }
  }
});

// Handle static assets (CSS, JS, fonts)
async function handleStaticAsset(request) {
  try {
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Return cached version and update in background
      fetchAndCache(request, STATIC_CACHE_NAME);
      return cachedResponse;
    }
    
    // Fetch and cache
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('Static asset fetch failed:', error);
    return new Response('Asset not available offline', { status: 503 });
  }
}

// Handle API requests with cache-first strategy for specific endpoints
async function handleAPIRequest(request) {
  const url = new URL(request.url);
  
  // Cache-first for certain API endpoints
  if (shouldCacheAPIRequest(url)) {
    try {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      const cachedResponse = await cache.match(request);
      
      if (cachedResponse && !isExpired(cachedResponse)) {
        // Return cached version and update in background
        fetchAndCache(request, DYNAMIC_CACHE_NAME);
        return cachedResponse;
      }
      
      // Fetch fresh data
      const response = await fetch(request);
      if (response.ok) {
        const responseToCache = response.clone();
        responseToCache.headers.set('sw-cached-at', Date.now().toString());
        cache.put(request, responseToCache);
      }
      return response;
    } catch (error) {
      // Return cached version if available
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return new Response(JSON.stringify({
        error: 'Data not available offline',
        cached: false
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  // Network-first for real-time data
  try {
    return await fetch(request);
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Network unavailable',
      cached: false
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle image requests with cache-first strategy
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const response = await fetch(request);
    if (response.ok) {
      // Only cache images under 1MB
      const contentLength = response.headers.get('content-length');
      if (!contentLength || parseInt(contentLength) < 1024 * 1024) {
        cache.put(request, response.clone());
      }
    }
    return response;
  } catch (error) {
    // Return placeholder image for offline
    return caches.match('/images/placeholder.jpg') || 
           new Response('Image not available offline', { status: 503 });
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    // Try network first for navigation
    const response = await fetch(request);
    return response;
  } catch (error) {
    // Return cached page or offline page
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page
    return cache.match('/offline.html') || 
           new Response('Page not available offline', { status: 503 });
  }
}

// Utility functions
function isStaticAsset(url) {
  return url.pathname.match(/\.(css|js|woff|woff2|ttf|eot)$/);
}

function isAPIRequest(url) {
  return url.pathname.startsWith('/api/') || 
         url.hostname.includes('supabase') ||
         API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
}

function isImageRequest(url) {
  return url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/);
}

function shouldCacheAPIRequest(url) {
  const cachableEndpoints = [
    '/api/markets',
    '/api/products',
    '/api/prices',
    '/api/weather'
  ];
  
  return cachableEndpoints.some(endpoint => url.pathname.startsWith(endpoint));
}

function isExpired(response) {
  const cachedAt = response.headers.get('sw-cached-at');
  if (!cachedAt) return false;
  
  const age = Date.now() - parseInt(cachedAt);
  return age > MAX_CACHE_AGE;
}

async function fetchAndCache(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      const responseToCache = response.clone();
      responseToCache.headers.set('sw-cached-at', Date.now().toString());
      cache.put(request, responseToCache);
    }
  } catch (error) {
    console.log('Background fetch failed:', error);
  }
}

// Cache management
async function manageCacheSize() {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const requests = await cache.keys();
  
  let totalSize = 0;
  const sizePromises = requests.map(async (request) => {
    const response = await cache.match(request);
    const size = response ? await response.blob().then(blob => blob.size) : 0;
    return { request, size };
  });
  
  const requestSizes = await Promise.all(sizePromises);
  totalSize = requestSizes.reduce((sum, item) => sum + item.size, 0);
  
  if (totalSize > MAX_CACHE_SIZE) {
    // Remove oldest entries
    requestSizes.sort((a, b) => {
      const aTime = a.response?.headers.get('sw-cached-at') || 0;
      const bTime = b.response?.headers.get('sw-cached-at') || 0;
      return parseInt(aTime) - parseInt(bTime);
    });
    
    let removedSize = 0;
    for (const item of requestSizes) {
      if (totalSize - removedSize <= MAX_CACHE_SIZE * 0.8) break;
      
      await cache.delete(item.request);
      removedSize += item.size;
    }
  }
}

// Run cache management periodically
setInterval(manageCacheSize, 60 * 60 * 1000); // Every hour

// Push notification handling
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon || '/favicon.ico',
    badge: '/images/badge.png',
    data: data.data,
    actions: data.actions || [],
    requireInteraction: data.requireInteraction || false,
    tag: data.tag || 'default'
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  let url = '/';
  
  if (action === 'view_market') {
    url = `/markets/${data.marketId}`;
  } else if (action === 'view_order') {
    url = `/orders/${data.orderId}`;
  } else if (action === 'view_product') {
    url = `/products/${data.productId}`;
  } else if (data && data.url) {
    url = data.url;
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Sync offline actions when connection is restored
  try {
    const offlineActions = await getOfflineActions();
    
    for (const action of offlineActions) {
      try {
        await syncAction(action);
        await removeOfflineAction(action.id);
      } catch (error) {
        console.error('Failed to sync action:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function getOfflineActions() {
  // Get offline actions from IndexedDB
  return []; // Placeholder - implement IndexedDB operations
}

async function syncAction(action) {
  // Sync individual action
  console.log('Syncing action:', action);
}

async function removeOfflineAction(actionId) {
  // Remove synced action from IndexedDB
  console.log('Removing offline action:', actionId);
}
