self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => self.clients.claim());

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({type: 'window', includeUncontrolled: true}).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('paneladmin')) {
          return client.focus();
        }
      }
      return clients.openWindow('paneladmin-pedidos.html');
    })
  );
});

// Sonido y vibracion incluso bloqueado
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {title:'Nuevo pedido DoloYa', body:'Tienes un pedido nuevo'};
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: 'LOGO-PANEL.PNG',
      badge: 'LOGO-PANEL.PNG',
      vibrate: [500,200,500],
      requireInteraction: true,
      silent: false
    })
  );
});
