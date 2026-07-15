const CACHE = "noeli-malta-v2-1-0-dev";
const FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./css/dev-features.css",
  "./js/app.js",
  "./js/dev-features.js",
  "./js/dev-ui.js",
  "./js/dev-orders.js",
  "./js/dev-production.js",
  "./js/dev-notifications.js",
  "./assets/logo.png",
  "./assets/favicon.png",
  "./assets/splash.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match(event.request).then(cached => cached || caches.match("./index.html")))
  );
});