// import { app } from "./config/ConfigFirebase";
$(() => {
  $('.tooltipped').tooltip({ delay: 50 })
  $('.modal').modal()

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Adicionar el service worker
  navigator.serviceWorker.register('notificaciones-sw.js')
  .then(registro => {
    console.log(`Service worker registrado: ${registro}`);
    firebase.messaging().useServiceWorker(registro)
  })
  .catch(error => {
    console.error(`Error al registrar service worker: ${error}`)
  });

  // Conectar con el proyecto de firebase para comunicar cambios
  const messaging = firebase.messaging();
  // Registrar LLave publica de messaging se genera con el proyecto
  messaging.usePublicVapidKey(
    'BOQ3tM61A8IhSvL4mzXypiFMFCsqy5GGxWlD5xy1oq1D8zWoC8JlFYz2nTTX7UiMCAvtzh3tk6DbSHE6-_0UKDg'
  )
  // Solicitar permisos para las notificaciones
  messaging.requestPermission()
  .then(() => {
    // Si el usuario da permisos se resuelve esta promesa
    // y me retorna un token de solicitud
    console.log('Permisos de message otorgado');
    return messaging.getToken()
  })
  .then(token => {
    // Me suscribo a firestore
    const db = firebase.firestore();
    // Recibir datos en formato de fecha
    //db.settings({timestampsInSnapshots: true})

    // Vamos a la colección tokens, si no existe la crea
    // y agregaremos el token que nos envian a la cola de tokens
    // de esta manera se registra nuestro token para que al haber un
    // un cambio nos de un mensaje de aviso
    db.collection('tokens').doc(token).set({
      token: token
    }).catch(error => {
      console.error(`Error al registrar el token: ${error}`);
    });

  })

  // Refrescar el token
  messaging.onTokenRefresh(()=> {
    messaging.getToken()
    .then((token) => {
      console.log(`Token renovado`);
      // Me suscribo a firestore
      const db = firebase.firestore();
      //Suscribo el token
      db.collection('tokens').doc(token).set({
        token: token
      }).catch(error => {
        console.error(`Error al registrar el token: ${error}`);
      });
    })
  })
  
  // TODO: Recibir las notificaciones cuando el usuario esta foreground
  messaging.onMessage(payload => {
    Materialize.toast(`Tenemos un nuevo Post ${payload.data.titulo}`, 6000);
  })
  
  // Recibir las notificaciones cuando el usuario esta background
  // const analytics = getAnalytics(app);
  // Este es un observador para detectar cambios en los post
  const post = new Post();
  post.consultarTodosPost();

  // Listening real time
  // Firebase observador del cambio de estado
  firebase.auth().onAuthStateChanged(user => {
    if(user){
      $('#btnInicioSesion').text('Salir');
      if(user.photoUrl){
        $('#avatar').attr('src', user.photoUrl );
      }else{
        $('#avatar').attr('src', 'imagenes/usuario_auth.png');
        
      }
    }else{
      $('#btnInicioSesion').text('Iniciar Sesión')
      $('#avatar').attr('src', 'imagenes/usuario.png')
    }
  })

  // TODO: Evento boton inicio sesion
  $('#btnInicioSesion').click(() => {
    const user = firebase.auth().currentUser;
    if(user){
      $('#btnInicioSesion').text('Iniciar Sesión');
      return firebase.auth()
        .signOut()
        .then(()=> {
          $('#avatar').attr('src', 'imagenes/usuario.png');
          Materialize.toast(`Error al realizar SignOut => ${error}`, 4000);
        })
    }

    $('#emailSesion').val('');
    $('#passwordSesion').val('');
    $('#modalSesion').modal('open');
  })

  $('#avatar').click(() => {
    firebase.auth().signOut()
    .then(()=> {
      $('#avatar').attr('src', 'imagenes/usuario.png')
      Materialize.toast(`SignOut correcto`, 4000)
    })
    .catch((error)=> {
      Materialize.toast(`Error en el SignOut ${error}`, 4000)
    })
  })

  $('#btnTodoPost').click(() => {
    $('#tituloPost').text('Posts de la Comunidad')   
    const post = new Post;
    post.consultarTodosPost(); // Trae todos los posts
  })

  $('#btnMisPost').click(() => {
    const user = firebase.auth().currentUser;
    if(user === null){
      Materialize.toast(`Debes estar autenticado para ver tus posts`, 4000);
      return
    }
    const post = new Post();
    post.consultarPostxUsuario(user.email);
    $('#tituloPost').text('Mis Posts')
  })
})
