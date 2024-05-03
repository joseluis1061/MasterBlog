// import { app } from "./config/ConfigFirebase";
$(() => {
  $('.tooltipped').tooltip({ delay: 50 })
  $('.modal').modal()

  // TODO: Adicionar el service worker

  // Init Firebase nuevamente

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // const app = initializeApp(firebaseConfig);
  // const analytics = getAnalytics(app);

  // TODO: Registrar LLave publica de messaging

  // TODO: Solicitar permisos para las notificaciones

  // TODO: Recibir las notificaciones cuando el usuario esta foreground

  // Recibir las notificaciones cuando el usuario esta background
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
