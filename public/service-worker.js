const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/index.js",
    "/indexDb.js",
    "/manifest.webmanifest",
    "/styles.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
];

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

elf.addEventListener("install", event => {
    event.waitUntil(
        caches
            .open(STATIC_CACHE)
            .then(cache => cache.addAll(FILES_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("Removing old cache data", key);
                        return caches.delete(key);
                    }
                })
            );
        }),
    )
}
)

self.addEventListener('fetch', function (event) {
    event.respondWith(
      // Try the cache
      caches
        .match(event.request)
        .then(function (response) {
          // Fall back to network
          return response || fetch(event.request);
        })
        .catch(function () {
          // If both fail, show a generic fallback:
          return caches.match('/offline.html');
        }),
    );
  });

  event.respondWith(
    fetch(evt.request).catch(function () {
      return caches.match(evt.request).then(function (response) {
        if (response) {
          return response;
        } else if (evt.request.headers.get("accept").includes("text/html")) {
          return caches.match("/");
        }
      });
    })
  );
