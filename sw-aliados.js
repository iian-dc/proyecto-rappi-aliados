importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDLKngPyi_SWAXEQwdrHO5h8L8OufulAR4",
  authDomain: "doloya-confirmacion.firebaseapp.com",
  databaseURL: "https://doloya-confirmacion-default-rtdb.firebaseio.com",
  projectId: "doloya-confirmacion",
  storageBucket: "doloya-confirmacion.firebasestorage.app",
  messagingSenderId: "832228761099",
  appId: "1:832228761099:web:ddd4b6a0ee0d7f0494b10e"
});

const messaging = firebase.messaging();

// ESTO ES LO QUE HACE QUE SUENE AUNQUE ESTE MINIMIZADO Y BLOQUEADO
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Pedido recibido en segundo plano', payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: 'LOGO-PANEL.PNG',
    badge: 'LOGO-PANEL.PNG',
    vibrate: [600,200,600,200,600],
    requireInteraction: true,
    silent: false,
    tag: 'pedido-doloya'
  });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('pedidos.html')
  );
});

self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => self.clients.claim());
