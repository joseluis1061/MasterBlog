$(() => {
  //$("#authFB").click(() => );

  $("#btnRegistroEmail").click(() => {
    console.log("Crear usuario: btnRegistroEmail");
    const email = $("#emailContactoReg").val();
    const password = $("#passwordReg").val();
    const nombres = $("#nombreContactoReg").val();
    // TODO : LLamar crear cuenta con email
    const modalSesion = $("#modalSesion").modal("open");
    const autenticacion = new Autenticacion();
    autenticacion.crearCuentaEmailPass(email, password, nombres);
  });

  $("#btnInicioEmail").click(() => {
    const email = $("#emailSesion").val();
    const password = $("#passwordSesion").val();
    // TODO : LLamar auth cuenta con email
    const autenticacion = new Autenticacion();
    autenticacion.autEmailPass(email, password);
  });

  $("#authGoogle").click(() => {
    //AUTH con GOOGLE
    const autenticacion = new Autenticacion();
    autenticacion.authCuentaGoogle();
  });

  //$("#authTwitter").click(() => //AUTH con Twitter);

  $("#btnRegistrarse").click(() => {
    $("#modalSesion").modal("close");
    $("#modalRegistro").modal("open");
  });

  $("#btnIniciarSesion").click(() => {
    $("#modalRegistro").modal("close");
    $("#modalSesion").modal("open");
  });
});
