/**
 * Service Worker for Recursive.eco PWA
 * Provides offline caching and helps enforce kiosk mode restrictions
 */

const CACHE_NAME = 'recursive-eco-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache for offline use
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/view.html',
  '/style.css',
  '/assets/css/components.css',
  '/assets/js/components/site-shell-inline.js',
  '/spiral/spiral.js',
  '/spiral/hero-spiral.js',
  '/public/recursive-eco-logo.jpg',
  '/public/favicon.ico',
  '/manifest.json',
  '/offline.html'
];

// Allowed domains for network requests (kiosk security)
const ALLOWED_DOMAINS = [
  // Our domains
  'recursive.eco',
  'channels.recursive.eco',
  // Vercel deployment
  'vercel.app',
  // Supabase
  'supabase.co',
  'supabase.in',
  // YouTube embeds only
  'youtube.com',
  'youtube-nocookie.com',
  'ytimg.com',
  'googlevideo.com',
  'ggpht.com',
  // CDN resources
  'cdn.tailwindcss.com',
  'cdn.jsdelivr.net',
  // Google fonts (if used)
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS.map(url => {
          return new Request(url, { cache: 'reload' });
        })).catch(err => {
          // Don't fail install if some assets can't be cached
          console.warn('[SW] Some assets failed to cache:', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Check if URL is from an allowed domain
function isAllowedDomain(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    // Allow same-origin requests
    if (urlObj.origin === self.location.origin) {
      return true;
    }

    // Check against allowed domains
    return ALLOWED_DOMAINS.some(domain => {
      return hostname === domain || hostname.endsWith('.' + domain);
    });
  } catch (e) {
    return false;
  }
}

// Check if this is a navigation request that should be blocked
function shouldBlockNavigation(request) {
  // Only check navigation requests
  if (request.mode !== 'navigate') {
    return false;
  }

  try {
    const url = new URL(request.url);

    // Allow same-origin navigation
    if (url.origin === self.location.origin) {
      return false;
    }

    // Block external navigation (but allow YouTube embeds which aren't navigation)
    return true;
  } catch (e) {
    return true;
  }
}

// Fetch event - serve from cache, restrict external requests
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Block external navigation attempts (kiosk security)
  if (shouldBlockNavigation(request)) {
    console.log('[SW] Blocked external navigation:', request.url);
    event.respondWith(
      caches.match('/').then(response => response || fetch('/'))
    );
    return;
  }

  // Block requests to non-allowed domains (except for allowed resources)
  if (!isAllowedDomain(request.url)) {
    console.log('[SW] Blocked request to non-allowed domain:', request.url);
    event.respondWith(new Response('Blocked by kiosk mode', { status: 403 }));
    return;
  }

  // For same-origin requests, try cache first then network
  if (new URL(request.url).origin === self.location.origin) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Return cached version but update cache in background
            event.waitUntil(
              fetch(request)
                .then((response) => {
                  if (response && response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME)
                      .then((cache) => cache.put(request, responseClone));
                  }
                })
                .catch(() => {})
            );
            return cachedResponse;
          }

          // Not in cache, fetch from network
          return fetch(request)
            .then((response) => {
              if (response && response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => cache.put(request, responseClone));
              }
              return response;
            })
            .catch(() => {
              // Network failed, return offline page for navigation
              if (request.mode === 'navigate') {
                return caches.match(OFFLINE_URL);
              }
              return new Response('Offline', { status: 503 });
            });
        })
    );
    return;
  }

  // For external allowed requests (Supabase, YouTube embeds, CDNs)
  event.respondWith(
    fetch(request)
      .catch(() => {
        // For images, try to return a placeholder
        if (request.destination === 'image') {
          return new Response('', { status: 503 });
        }
        return new Response('Network error', { status: 503 });
      })
  );
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  // Allow adding domains dynamically (for admin use)
  if (event.data && event.data.type === 'ADD_ALLOWED_DOMAIN') {
    const domain = event.data.domain;
    if (domain && !ALLOWED_DOMAINS.includes(domain)) {
      ALLOWED_DOMAINS.push(domain);
      console.log('[SW] Added allowed domain:', domain);
    }
  }
});
