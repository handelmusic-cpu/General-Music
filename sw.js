/* ==========================================================================
   sw.js — service worker for offline play.
   Precaches the whole app shell on install so Music Playground keeps working
   with zero wifi (great for spotty school networks). Bump CACHE_NAME on any
   deploy that changes file contents so old caches are cleared out.
   ========================================================================== */

var CACHE_NAME = "music-playground-v1";

var PRECACHE_URLS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css",
  "./js/app.js",
  "./js/data.js",
  "./js/sound.js",
  "./js/library.js",
  "./js/beatboxes.js",
  "./js/staff.js",
  "./js/clefdraw.js",
  "./js/steadybeat.js",
  "./js/majorminor.js",
  "./js/piano.js",
  "./js/rhythmcards.js",
  "./js/ukulele.js",
  "./js/terms.js",
  "./js/orchestra.js",
  "./js/composers.js",
  "./js/songmaker.js",
  "./js/beatmaker.js",
  "./js/bells.js",
  "./icons/favicon-32.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-192.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) { return cache.addAll(PRECACHE_URLS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names.filter(function (n) { return n !== CACHE_NAME; })
             .map(function (n) { return caches.delete(n); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;

  var url = new URL(req.url);
  var sameOrigin = url.origin === self.location.origin;

  if (sameOrigin) {
    // App files: cache-first (instant + offline), refresh the cache in the
    // background so the next load picks up any update.
    event.respondWith(
      caches.match(req).then(function (cached) {
        var networkFetch = fetch(req).then(function (res) {
          if (res && res.ok) {
            var copy = res.clone();
            caches.open(CACHE_NAME).then(function (c) { c.put(req, copy); });
          }
          return res;
        }).catch(function () { return cached; });
        return cached || networkFetch;
      })
    );
  } else {
    // Cross-origin (Google Fonts): stale-while-revalidate, so once a font
    // has loaded once, it also works offline next time.
    event.respondWith(
      caches.open(CACHE_NAME).then(function (cache) {
        return cache.match(req).then(function (cached) {
          var networkFetch = fetch(req).then(function (res) {
            cache.put(req, res.clone());
            return res;
          }).catch(function () { return cached; });
          return cached || networkFetch;
        });
      })
    );
  }
});
