const CACHE = 'pharmacalc-v5';
 
const ASSETS = [
  './',
  'index.html',
  'guia.html',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'calculadoras/meropenem.html',
  'calculadoras/amicacina.html',
  'calculadoras/vancomicina.html',
  '/calculadoras/peso.html'
];
 
// Instalação: cacheia todos os assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(
        ASSETS.map(u => c.add(u).catch(() => {}))
      ))
      .then(() => self.skipWaiting())
  );
});
 
// Ativação: remove caches antigos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => k !== CACHE)
          .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});
 
// Interceptação de requisições: cache-first, fallback para rede
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(cached => {
        if (cached) return cached;
 
        return fetch(e.request)
          .then(res => {
            // Só cacheia respostas válidas
            if (res && res.status === 200 && res.type !== 'opaque') {
              const clone = res.clone();
              caches.open(CACHE).then(c => c.put(e.request, clone));
            }
            return res;
          })
          .catch(() => {
            // Fallback offline: corrigido para GitHub Pages
            if (e.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          });
      })
  );
});
