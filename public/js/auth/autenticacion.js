class Autenticacion {
  autEmailPass (email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      // Si el usuario verifico su cuenta permite el login
      if( user.emailVerified ){
        $('#avatar').attr('src', 'imagenes/usuario_auth.png');
        Materialize.toast(`Bienvenido ${user.displayName}`, 5000);
        $('.modal').modal('close');
      }else{
        // Si no, no permite que pase, cierra la sesión en caso que sea valido
        //email y password y muestra mensaje
        firebase.auth().signOut();
        Materialize.toast(`Aun no creas tu cuenta o confirmas tu correo`, 5000);
        $('.modal').modal('close');

      }
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      Materialize.toast(error.message, 4000);
      $('.modal').modal('close');
    });
  }

  crearCuentaEmailPass (email, password, nombres) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {

        // Agregar nombres al usuario
        userCredential.user.updateProfile({
          displayName: nombres
        })

        // Cambio de url del boton de redireccionar al confirmar el correo
        const configuration = {
          url: 'http://127.0.0.1:5500/public/'
        }

        firebase.auth().currentUser.sendEmailVerification(configuration)
        .catch(error => {
          // En caso de error mostrar en pantalla
          console.error(error);
          Materialize.toast(error.message, 4000);
        })

        // Cerrar la sesión de usuario para que verifique el correo antes de continuar
        firebase.auth().signOut();

        // Mensaje de bienvenida
        Materialize.toast(
          `Bienvenido ${nombres}, debes realizar el proceso de verificación`,
          4000
        )
    
        $('.modal').modal('close')
        // const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;;
        Materialize.toast(error.message, 4000);
      });
  }

  authCuentaGoogle () {
    //AUTH con GOOGLE
    // Instanciar google
    var provider = new firebase.auth.GoogleAuthProvider();
    // Paso de idioma a español
    firebase.auth().languageCode = "it";

    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // IdP data available in result.additionalUserInfo.profile.
        $('#avatar').attr('src', result.user.photoURL);
        $('.modal').modal('close');
        Materialize.toast(`Bienvenido ${result.user.displayName} !! `, 4000);
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        $('.modal').modal('close');
        Materialize.toast(`Error de autenticación ${error} !! `, 4000);
      });
  }

  authCuentaFacebook () {
    //$('#avatar').attr('src', result.user.photoURL)
    //$('.modal').modal('close')
    //Materialize.toast(`Bienvenido ${result.user.displayName} !! `, 4000)
  }

  authTwitter () {
    // TODO: Crear auth con twitter
  }
}
