var cacheName = "webstore-v1";
// Storing all relevant files to cache in an array
var cacheFiles = [
  "index.html", 
  "JavaScript/lessons.js", 
  "Images/cart.png",
  "Images/shop-icon-512.png",
  "Images/shop-icon-192.png"
];
self.addEventListener("install", function (e) {
  console.log("[Service Worker] Install");
  e.waitUntil(
    // Uses the files from the cache, when online or offline
    caches.open(cacheName).then(function (cache) {
      console.log("[Service Worker] Caching files");
      return cache.addAll(cacheFiles);
    })
  );
});
self.addEventListener("fetch", function (e) {
  // Add relevant external files to the cache
  e.respondWith(
    caches.match(e.request).then(function (cachedFile) {
      if (cachedFile) {
        console.log(
          "[Service Worker] "+e.request.url+" fetched from cache."
        );
        return cachedFile;
      } else {
        //download file not in the cache already
        return fetch(e.request).then(function (response) {
          return caches.open(cacheName).then(function (cache) {
            //add a file to cache
            cache.put(e.request, response.clone());
            console.log(
              "[Service Worker] "+e.request.url+" fetched and saved from cache."
            );
            return response;
          });
        });
      }
    })
  );
});
