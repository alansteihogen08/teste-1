const CACHE='pharmacalc-v1';
const ASSETS=['/','/index.html','/manifest.json','/icons/icon-192.png','/icons/icon-512.png','/calculadoras/meropenem.html','/calculadoras/amicacina.html'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>Promise.allSettled(ASSETS.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{if(res&&res.status===200){const c=res.clone();caches.open(CACHE).then(cache=>cache.put(e.request,c));}return res;}).catch(()=>caches.match('/index.html')))));
