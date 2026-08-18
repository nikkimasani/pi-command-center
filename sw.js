const CACHE_NAME = 'pi-command-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg',
  '/icon-maskable.svg'
];

const OFFLINE_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Pi Command Center — Offline</title>
  <style>
    body{margin:0;min-height:100vh;display:grid;place-items:center;background:#070b12;color:#f4f7fb;font:16px/1.5 Inter,system-ui,sans-serif;padding:24px}
    .card{max-width:420px;background:#0d131d;border:1px solid #243044;border-radius:20px;padding:24px;text-align:center}
    h1{margin:0 0 10px;font-size:28px}
    p{margin:0;color:#97a5b8}
  </style>
</head>
<body><div class="card"><h1>Offline</h1><p>Pi Command Center needs a network connection. Please reconnect and refresh.</p></div></body>
</html>`;

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetched = fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached || new Response(OFFLINE_HTML, { headers: { 'Content-Type': 'text/html' } }));
      return cached || fetched;
    })
  );
});
