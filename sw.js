/* Service worker شبكة فقط: يخلّي التطبيق قابل للتثبيت، لكنه ما بيخزّن أي شي
   ولا بيشتغل بدون نت (حسب الطلب: دربك أونلاين فقط). */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request));   /* دايماً من الشبكة */
});
