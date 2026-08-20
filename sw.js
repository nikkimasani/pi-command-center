const CACHE_NAME = 'pi-command-v49';
const V16_SCRIPT = '/smart-mirror-v16-hires.js?v=16.1';
const V16_SPRITE_SCRIPT = '/smart-mirror-v16-sprite.js?v=16.1';

const STATIC_ASSETS = [
  '/', '/index.html', '/manifest.json', '/icon-192.svg', '/icon-512.svg', '/icon-maskable.svg',
  '/smart-mirror-v16-hires.js', '/smart-mirror-v16-sprite.js',
  '/assets/projects/smart-mirror/v16/visual-sprite.b64',
  '/assets/generic/pi5-board.jpg', '/assets/generic/breadboard.jpg', '/assets/generic/gpio-diagram.png'
];

const OFFLINE_HTML = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pi Command Center — Offline</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#070b12;color:#f4f7fb;font:16px/1.5 Inter,system-ui,sans-serif;padding:24px}.card{max-width:420px;background:#0d131d;border:1px solid #243044;border-radius:20px;padding:24px;text-align:center}</style></head><body><div class="card"><h1>Offline</h1><p>Your saved Pi Command Center shell is available, but this screen needs a cached page or network connection.</p></div></body></html>`;

function injectV16(html) {
  let out = html;
  if (!out.includes('smart-mirror-v16-hires.js')) out = out.replace('</body>', `<script src="${V16_SCRIPT}"></script></body>`);
  if (!out.includes('smart-mirror-v16-sprite.js')) out = out.replace('</body>', `<script src="${V16_SPRITE_SCRIPT}"></script></body>`);
  return out;
}

async function htmlResponse(response) {
  const html = await response.text();
  const headers = new Headers(response.headers);
  headers.set('Content-Type', 'text/html; charset=utf-8');
  headers.set('Cache-Control', 'no-store, max-age=0');
  return new Response(injectV16(html), { status: response.status, statusText: response.statusText, headers });
}

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
    event.respondWith((async () => {
      try {
        const network = await fetch(event.request, { cache: 'no-store' });
        return await htmlResponse(network);
      } catch (error) {
        const cached = await caches.match('/index.html');
        if (cached) return await htmlResponse(cached);
        return new Response(OFFLINE_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      }
    })());
    return;
  }

  if (url.pathname.startsWith('/smart-mirror-v16-') || url.pathname === '/assets/projects/smart-mirror/v16/visual-sprite.b64') {
    event.respondWith(fetch(event.request, { cache: 'no-store' }).then(response => response.ok ? response : Promise.reject(new Error('V16 asset unavailable'))).catch(() => caches.match(event.request) || caches.match(url.pathname)));
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
