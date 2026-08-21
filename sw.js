const CACHE_NAME='pi-command-course-v2';
const STATIC_ASSETS=['/course-v2.html','/course-v2.css?v=2.0.0','/course-v2-data.js?v=2.0.0','/course-v2.js?v=2.0.0','/manifest.json','/icon-192.svg','/icon-512.svg','/icon-maskable.svg','/assets/setup/imager-ssh-generated.jpg','/assets/boot-screen.jpg','/assets/pi5-port-map-reference.jpg','/assets/smart-mirror-finished-reference.jpg','/assets/smart-mirror/dsi-align.jpg','/assets/smart-mirror/dsi-seated.jpg'];
const OFFLINE='<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pi Command Center Offline</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#070b12;color:#f4f7fb;font:16px/1.5 system-ui;padding:24px}.c{max-width:430px;background:#0d1520;border:1px solid #27364a;border-radius:18px;padding:24px}h1{margin-top:0}p{color:#9eafc4}</style><div class="c"><h1>Offline</h1><p>The full course shell is not available from the network right now. Reconnect and refresh. Previously cached course assets will continue to be used when available.</p></div>';
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(STATIC_ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const url=new URL(e.request.url);
 if(e.request.mode==='navigate'||url.pathname==='/'||url.pathname==='/course-v2.html'){
   e.respondWith(fetch(e.request,{cache:'no-store'}).then(res=>{if(res.ok){const clone=res.clone();caches.open(CACHE_NAME).then(c=>c.put('/course-v2.html',clone));}return res;}).catch(()=>caches.match('/course-v2.html').then(r=>r||new Response(OFFLINE,{headers:{'Content-Type':'text/html; charset=utf-8'}}))));
   return;
 }
 e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(res=>{if(res.ok){const clone=res.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,clone));}return res;})));
});
