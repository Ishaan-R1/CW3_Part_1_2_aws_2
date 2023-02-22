let cache = "webstore-v1";
// Storing all relevant files to cache in an array to work offline
var cacheFiles = [
  "index.html",
  "JavaScript/lessons.js",
  "Images/cart.png",
  // Two copies of icon image
  "Images/shop-icon-512.png",
  "Images/shop-icon-192.png",
];
self.addEventListener("install", function (event) {
  console.log("[Service Worker] Install");
  event.waitUntil(
    // Caches local files stored in array
    caches.open(cache).then(function (cache) {
      console.log("[Service Worker] Caching Relevant Files");
      return cache.addAll(cacheFiles);
    })
  );
});
self.addEventListener("fetch", function (event) {
  // Fetch external files from the cache to use the files from the cache, when online or offline
  event.respondWith(
    caches.match(event.request).then(function (cachedFile) {
      if (cachedFile) {
        console.log(
          "[Service Worker] " + event.request.url + " fetched from cache."
        );
        return cachedFile;
      } else {
        // If file is not already in cache, then automatically add file
        return fetch(event.request).then(function (response) {
          return caches.open(cache).then(function (cache) {
            // Add the file to cache
            cache.put(event.request, response.clone());
            console.log(
              "[Service Worker] " +
                event.request.url +
                " fetched and saved from cache."
            );
            return response;
          });
        });
      }
    })
  );
});
