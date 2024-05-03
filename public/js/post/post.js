class Post {
  constructor() {
    // TODO inicializar firestore y settings
    this.db = firebase.firestore();
  }

  crearPost(uid, emailUser, titulo, descripcion, imagenLink, videoLink) {
    return this.db
      .collection("posts")
      .add({
        uid: uid,
        autor: emailUser,
        titulo: titulo,
        descripcion: descripcion,
        imagenLink: imagenLink,
        videoLink: videoLink,
        fecha: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((docRef) => {
        console.log("Post creado ID: ", docRef.id);
        Materialize.toast(`Post creado con exito ${docRef.titulo}`, 4000);
      })
      .catch((error) => {
        console.error("Error creando el post: ", error);
      });
  }

  consultarTodosPost() {
    // Escuchar cambios en la BD mediante un observador
    // Este esta definido en firebase en el metodo onSnapshot
    // Se activa cada vez que hay un cambio en la colección posts
    // Al llamar este método támbien llama los posts como si fuese un get
    this.db.collection("posts").onSnapshot((querySnapshot) => {
      $("#posts").empty(); //Borra todos los post
      // Verifica si la colección detectada esta vacia
      if (querySnapshot.empty) {
        // Si lo esta agrega un componente que indica que no hay posts
        $("#posts").append(this.obtenerPostTemplate());
      } else {
        // Si detectamos que no esta vacia recorremos todos los items
        // de la colección posts
        querySnapshot.forEach((post) => {
          // Para cada posts recibido desde la bd creamos su tempalte
          let postHtml = this.obtenerPostTemplate(
            post.data().autor,
            post.data().titulo,
            post.data().descripcion,
            post.data().videoLink,
            post.data().imagenLink,
            Utilidad.obtenerFecha(post.data().fecha.toDate()) // La útilidad tiene una función para formatear la fecha
          );
          $("#posts").append(postHtml); // Agrega cada post detectado al html
        });
      }
    });
  }

  consultarPostxUsuario(emailUser) {
    // Es el mismo observador que traer posts pero
    // se agrega una comparación
    this.db.collection("posts")
    .where('autor', '==', emailUser)
    .onSnapshot((querySnapshot) => {
      $("#posts").empty(); //Borra todos los post
      // Verifica si la colección detectada esta vacia
      if (querySnapshot.empty) {
        // Si lo esta agrega un componente que indica que no hay posts
        $("#posts").append(this.obtenerPostTemplate());
      } else {
        // Si detectamos que no esta vacia recorremos todos los items
        // de la colección posts
        querySnapshot.forEach((post) => {
          // Para cada posts recibido desde la bd creamos su tempalte
          let postHtml = this.obtenerPostTemplate(
            post.data().autor,
            post.data().titulo,
            post.data().descripcion,
            post.data().videoLink,
            post.data().imagenLink,
            Utilidad.obtenerFecha(post.data().fecha.toDate()) // La útilidad tiene una función para formatear la fecha
          );
          $("#posts").append(postHtml); // Agrega cada post detectado al html
        });
      }
    });

  }

  obtenerTemplatePostVacio() {
    return `<article class="post">
      <div class="post-titulo">
          <h5>Crea el primer Post a la comunidad</h5>
      </div>
      <div class="post-calificacion">
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-vacia" href="*"></a>
      </div>
      <div class="post-video">
          <iframe type="text/html" width="500" height="385" src='https://www.youtube.com/embed/bTSWzddyL7E?ecver=2'
              frameborder="0"></iframe>
          </figure>
      </div>
      <div class="post-videolink">
          Video
      </div>
      <div class="post-descripcion">
          <p>Crea el primer Post a la comunidad</p>
      </div>
      <div class="post-footer container">         
      </div>
  </article>`;
  }

  obtenerPostTemplate(
    autor,
    titulo,
    descripcion,
    videoLink,
    imagenLink,
    fecha
  ) {
    if (imagenLink) {
      return `<article class="post">
            <div class="post-titulo">
                <h5>${titulo}</h5>
            </div>
            <div class="post-calificacion">
                <a class="post-estrellita-llena" href="*"></a>
                <a class="post-estrellita-llena" href="*"></a>
                <a class="post-estrellita-llena" href="*"></a>
                <a class="post-estrellita-llena" href="*"></a>
                <a class="post-estrellita-vacia" href="*"></a>
            </div>
            <div class="post-video">                
              <img id="imgVideo" src='${imagenLink}' class="post-imagen-video" 
                alt="Imagen Video">     
            </div>
            <div class="post-videolink">
              <a href="${videoLink}" target="blank">Ver Video</a>                            
            </div>            
            <div class="post-descripcion">
                <p>${descripcion}</p>
            </div>
            <div class="post-footer container">
                <div class="row">
                    <div class="col m6">
                        Fecha: ${fecha}
                    </div>
                    <div class="col m6">
                        Autor: ${autor}
                    </div>        
                </div>
            </div>
        </article>`;
    }

    return `<article class="post">
                <div class="post-titulo">
                    <h5>${titulo}</h5>
                </div>
                <div class="post-calificacion">
                    <a class="post-estrellita-llena" href="*"></a>
                    <a class="post-estrellita-llena" href="*"></a>
                    <a class="post-estrellita-llena" href="*"></a>
                    <a class="post-estrellita-llena" href="*"></a>
                    <a class="post-estrellita-vacia" href="*"></a>
                </div>
                <div class="post-video">


                    <iframe 
                      width="500" height="385" 
                      src='${videoLink}'
                      frameborder="0" allow="accelerometer; 
                      autoplay; clipboard-write; encrypted-media; 
                      gyroscope; picture-in-picture" 
                      allowfullscreen
                    >
                    </iframe>
                </div>
                <div class="post-videolink">
                    Video
                </div>
                <div class="post-descripcion">
                    <p>${descripcion}</p>
                </div>
                <div class="post-footer container">
                    <div class="row">
                        <div class="col m6">
                            Fecha: ${fecha}
                        </div>
                        <div class="col m6">
                            Autor: ${autor}
                        </div>        
                    </div>
                </div>
            </article>`;
  }
}
