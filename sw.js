const CACHE = 'markupdown-v1';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first so updates arrive when online; cache keeps it working offline.
// Only successful responses are cached: a mid-deploy 404 must never replace
// a known-good copy of the app.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const fromCache = () =>
    caches.match(e.request, { ignoreSearch: true }).then(hit =>
      hit || (e.request.mode === 'navigate' ? caches.match('./index.html') : undefined)
    );
  e.respondWith(
    fetch(e.request)
      .then(resp => {
        if (!resp.ok) return fromCache().then(hit => hit || resp);
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return resp;
      })
      .catch(() => fromCache())
  );
});
