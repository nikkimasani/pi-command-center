const CACHE_NAME = 'pi-command-v53';

const STATIC_ASSETS = [
  '/', '/index.html', '/manifest.json', '/icon-192.svg', '/icon-512.svg', '/icon-maskable.svg',
  '/smart-mirror-v17.js'
];

const OFFLINE_HTML = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pi Command Center — Offline</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#070b12;color:#f4f7fb;font:16px/1.5 Inter,system-ui,sans-serif;padding:24px}.card{max-width:420px;background:#0d131d;border:1px solid #243044;border-radius:20px;padding:24px;text-align:center}</style></head><body><div class="card"><h1>Offline</h1><p>Your saved Pi Command Center shell is available, but this screen needs a cached page or network connection.</p></div></body></html>`;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  if (event.request.mode === 'navigate' || url.pathname === '/' || url.pathname === '/index.html') {
    event.respondWith(fetch(event.request, { cache: 'no-store' }).catch(async () => {
      const cached = await caches.match('/index.html');
      if (cached) return cached;
      return new Response(OFFLINE_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }));
    return;
  }

  if (url.pathname === '/smart-mirror-v17.js' || url.pathname.startsWith('/icon-')) {
    event.respondWith(fetch(event.request, { cache: 'no-store' }).then(response => response.ok ? response : Promise.reject(new Error('V17 asset unavailable'))).catch(() => caches.match(event.request) || caches.match(url.pathname)));
    return;
  }

  event.respondWith(fetch(event.request).then(response => {
    if (response.ok) {
      const clone = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
    }
    return response;
  }).catch(() => caches.match(event.request)));
});
