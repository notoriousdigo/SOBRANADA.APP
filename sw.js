/* SOBRA NADA APP — service worker (offline-first) */
const CACHE = 'sobra-nada-v9';
const LOCAL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];
const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';

// instala: cacheia os arquivos locais (robusto) e o Chart.js (best-effort)
self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.allSettled(LOCAL.map(u => c.add(u)));
    try { await c.add(CDN); } catch (_) {}
    await self.skipWaiting();
  })());
});

// ativa: limpa caches antigos
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

// fetch: cache-first; rede como fallback; cacheia em runtime; offline cai no index
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const res = await fetch(req);
      try {
        const url = new URL(req.url);
        if (url.origin === location.origin || url.host.includes('cdnjs.cloudflare.com')) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
      } catch (_) {}
      return res;
    } catch (_) {
      // offline e não cacheado: navegações caem no app
      if (req.mode === 'navigate') return caches.match('./index.html');
      return new Response('', { status: 504, statusText: 'offline' });
    }
  })());
});
