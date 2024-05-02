// import { getAuth } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth-compat.js";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
class Autenticacion {
  autEmailPass (email, password) {
    //$('#avatar').attr('src', 'imagenes/usuario_auth.png')
    //Materialize.toast(`Bienvenido ${result.user.displayName}`, 5000)
    //$('.modal').modal('close')
   
  }

  crearCuentaEmailPass (email, password, nombres) {
    console.log("FUncion crear cuenta..")
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
          url: 'http://127.0.0.1:5500/'
        }

        // Envio de correo de verificacion
        userCredential.user.sendEmailVerfication(configuration)
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
    //$('#avatar').attr('src', result.user.photoURL)
    //$('.modal').modal('close')
    //Materialize.toast(`Bienvenido ${result.user.displayName} !! `, 4000)
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
