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
    this.db
      .collection("posts")
      .orderBy("fecha", "asc")
      .orderBy("titulo", "asc")
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

  consultarPostxUsuario(emailUser) {
    // Es el mismo observador que traer posts pero
    // se agrega una comparación
    this.db
      .collection("posts")
      .orderBy("fecha", "asc")
      .where("autor", "==", emailUser)
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

  subirImagenPost(file, uid){
    console.log(`File => ${file} uid ${uid}`)
		// Initialize Cloud Storage and get a reference to the service
		const refStorage = firebase.storage().ref(`imgsPosts/${uid}/${file.name}`);
    const task = refStorage.put(file);
    // Observador de estado de subida de información
    task.on('state-changed', 
    // Copia del estado del archivo
    snapShot => {
      // Deseamos ver el tamaño del archivo y cuanto % ha subido y mostrarle al usuario
      const porcentaje = snapShot.bytesTransferred / snapShot.totalBytes * 100;
      $('.determinate').attr('style', `width: ${porcentaje}%`);
    },
    error => {
      Materialize.toast(`Error subiendo el archivo => ${error.message}`, 4000);
    },
    () => {
      //Al finalizar muestro la url del archivo al usuario
      task.snapShot.getDownloadURL()
      .then(url => {
        console.log(url);
        // Almacenar la url en el storage
        sessionStorage.setItem('imgNewPost', url);
      }).catch(error => {
        Materialize.toast(`Error subiendo el archivo => ${error.message}`, 4000);
      })
    })
  }

  subirImagenPost (file, uid) {
    // Initialize Cloud Storage and get a reference to the service
    // Create a storage reference from our storage service
    const storageRef = firebase.storage().ref();
    // Child references can also take paths delimited by '/'
    let spaceRef = storageRef.child(`imgsPosts/${uid}/${file.name}`);

    // 'file' comes from the Blob or File API
    let task = spaceRef.put(file)
    .then((snapshot) => {
      console.log('Uploaded a blob or file!', snapshot);
    });

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    task.on('state_changed', 
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        $('.determinate').attr('style', `width: ${progress}%`)
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        // Handle unsuccessful uploads
        Materialize.toast(`Error subiendo archivo = > ${err.message}`, 4000)
      }, 
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        task.snapshot.ref
        .getDownloadURL()
        .then((downloadURL) => {
          console.log('File available at', downloadURL);
          sessionStorage.setItem('imgNewPost', downloadURL);
        }).catch(err => {
          Materialize.toast(`Error obteniendo downloadURL = > ${err}`, 4000)
        });
      }
    );

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

  crearComentario(uid, emailUser, nombreContacto, emailContacto, comentarioTipo, reclamoTipo, mejoraTipo, otroTipo, comentariosContacto) {
    return this.db
      .collection("comentarios")
      .add({
        uid: uid,
        autor: emailUser,
        nombreContacto: nombreContacto, 
        emailContacto: emailContacto, 
        comentarioTipo: comentarioTipo, 
        reclamoTipo: reclamoTipo, 
        mejoraTipo: mejoraTipo, 
        otroTipo: otroTipo, 
        comentariosContacto: comentariosContacto,
        fecha: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((docRef) => {
        console.log("Comentario creado ID: ", docRef.id);
        Materialize.toast(`Comentario creado con exito por ${docRef.autor}`, 4000);
      })
      .catch((error) => {
        console.error("Error creando el error: ", error);
        Materialize.toast(`Error al crear el comentario ${error}`, 4000);
      });
  }
}
