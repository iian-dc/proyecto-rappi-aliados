self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => self.clients.claim());

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({type: 'window'}).then(clientList => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('paneladmin-pedidos.html');
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).catch(()=> caches.match(e.request)));
});
