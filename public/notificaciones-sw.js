// Importa librerias necesarias para ejecutar en background
importScripts('https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize Firebase
firebase.initializeApp({
  projectId: "blogmasterdata",
  messagingSenderId: "311248035282",
})

const messagin = firebase.messagin();

messagin.setBackgroundMessageHandles(payload => {
  const tituloNotificacion = 'Ya tenemos una nueva notificación';
  // Para crear la ventana de la notificación
  const opcionesNotificacion = {
    body: payload.data.titulo,
    icon: 'icons/icon_new_post.png',
    click_action: 'https://blogmasterdata.web.app/'
  }
  // Muestra la tarjeta con la información
  // Esto es un servicio propio del browser
  return self.registration.showNotificacion(
    tituloNotificacion,
    opcionesNotificacion
  )
})
