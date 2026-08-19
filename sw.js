const CACHE_NAME = 'pi-command-v46';

const STATIC_ASSETS = [
  '/', '/index.html', '/manifest.json', '/icon-192.svg', '/icon-512.svg', '/icon-maskable.svg',
  '/assets/boot-screen.jpg', '/assets/pi5-port-map-reference.jpg',
  '/assets/setup/imager-ssh-generated.jpg', '/assets/smart-mirror-finished-reference.jpg',
  '/assets/smart-mirror/dsi-align.jpg', '/assets/smart-mirror/dsi-seated.jpg',
  '/assets/smart-mirror/p7/s3-closed-back.jpg', '/assets/projects/smart-mirror/v15/step-01-parts.jpg'
];

const OFFLINE_HTML = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pi Command Center — Offline</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#070b12;color:#f4f7fb;font:16px/1.5 Inter,system-ui,sans-serif;padding:24px}.card{max-width:420px;background:#0d131d;border:1px solid #243044;border-radius:20px;padding:24px;text-align:center}</style></head><body><div class="card"><h1>Offline</h1><p>Your saved Pi Command Center shell is available, but this screen needs a cached page or network connection.</p></div></body></html>`;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(STATIC_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (e.request.mode === 'navigate' || url.pathname === '/' || url.pathname === '/index.html') {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' })
        .catch(() => caches.match('/index.html').then(r => r || new Response(OFFLINE_HTML, { headers: { 'Content-Type': 'text/html' } })))
    );
    return;
  }
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok) {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      }
      return res;
    }).catch(() => caches.match(e.request))
  );
});
