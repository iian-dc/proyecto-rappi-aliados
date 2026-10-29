let ultimoTotalSW = 0;

self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => {
  self.clients.claim();
  ultimoTotalSW = 0;
});

self.addEventListener('message', event => {
  const data = event.data;
  if(data.type === 'NUEVO_PEDIDO'){
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: 'LOGO-PANEL.PNG',
      badge: 'LOGO-PANEL.PNG',
      vibrate: [600,200,600,200,600],
      requireInteraction: true,
      renotify: true,
      tag: 'pedido-doloya-nuevo',
      silent: false,
      data: {url: 'paneladmin-pedidos.html'}
    });
    ultimoTotalSW = data.total;
  }
  if(data.type === 'CHECK_PEDIDOS'){
    // Si el SW detecta que hay más que antes, notifica aunque app esté minimizada
    if(data.total > ultimoTotalSW && ultimoTotalSW !== 0){
      self.registration.showNotification('🔔 ¡Nuevo pedido DoloYa!', {
        body: `Tienes ${data.total} pedido${data.total>1?'s':''} pendiente${data.total>1?'s':''}.`,
        icon: 'LOGO-PANEL.PNG',
        badge: 'LOGO-PANEL.PNG',
        vibrate: [600,200,600,200,600],
        requireInteraction: true,
        silent: false,
        tag: 'pedido-doloya-nuevo'
      });
    }
    ultimoTotalSW = data.total;
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({type: 'window'}).then(list=>{
      for(const c of list){
        if(c.url.includes('paneladmin')){
          c.focus();
          return;
        }
      }
      return clients.openWindow('paneladmin-pedidos.html');
    })
  );
});
