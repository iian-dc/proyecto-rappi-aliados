let ultimoTotalSW = 0;
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => {
  self.clients.claim();
  ultimoTotalSW = parseInt(localStorage?.getItem?.('doloya_ultimo_total')||'0') || 0;
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
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('paneladmin-pedidos.html'));
});
