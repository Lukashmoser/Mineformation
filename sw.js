const version = 'v1';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(version).then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/script.js',
        '/notfound.txt',
        '/images/minecraft_stone.jpg',
        '/images/oak-plank.png',
        '/images/bedwars-practice-logo.png',
        '/images/fallen-kingdom-logo.png',
        '/images/hypixel-logo.png',
        '/images/purple-prison-logo.png',
        '/images/pvp-land-logo.png',
        '/images/TheKrazySheep.png',
        '/images/Mineformation-logo.png',
        '/manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  //console.log("[Service Worker] Fetch (url)", event.request.url);
  event.respondWith(caches.match(event.request).then(function(response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      return response;
    } else {
      //console.log("[Service Worker] Caching (data)", event.request.url);
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();

        caches.open(version).then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        return caches.match('/notfound.txt');
      });
    }
  }));
});