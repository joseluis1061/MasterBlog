$(() => {
  $('#btnModalPost').click(() => {
    $('#tituloNewPost').val('')
    $('#descripcionNewPost').val('')
    $('#linkVideoNewPost').val('')
    $('#btnUploadFile').val('')
    $('.determinate').attr('style', `width: 0%`)
    sessionStorage.setItem('imgNewPost', null)

    // Validar que el usuario esta autenticado
    const user = firebase.auth().currentUser;
    if(user === null){
      Materialize.toast(`Para crear el post debes estar autenticado`, 4000);
      return
    }
    $('#modalPost').modal('open')
  })

  $('#btnRegistroPost').click(() => {
    const post = new Post();
    // Validar que el usuario esta autenticado
    const user = firebase.auth().currentUser;
    if(user.uid === null){
      Materialize.toast(`Para crear el post debes estar autenticado`, 4000);
      return;
    }

    const titulo = $('#tituloNewPost').val()
    const descripcion = $('#descripcionNewPost').val()
    const videoLink = $('#linkVideoNewPost').val()
    const imagenLink = sessionStorage.getItem('imgNewPost') == 'null'
      ? null
      : sessionStorage.getItem('imgNewPost')

    post
      .crearPost(
        user.uid,
        user.email,
        titulo,
        descripcion,
        imagenLink,
        videoLink
      )
      .then(resp => {
        Materialize.toast(`Post creado correctamente`, 4000)
        $('.modal').modal('close')
      })
      .catch(err => {
        Materialize.toast(`Error => ${err}`, 4000)
      })
  })

  $('#btnUploadFile').on('change', e => {
    const file = e.target.files[0]
    const user = firebase.auth().currentUser;
    if(user === null){
      Materialize.toast(`Para crear el post debes estar autenticado`, 4000)
      return
    }
    // Referencia al storage
    const post = new Post()
    post.subirImagenPost(file, user.uid)
  })

  $('#btnComentarios').click(() => {
    // Validar que el usuario esta autenticado
    const user = firebase.auth().currentUser;
    if(user.uid === null){
      Materialize.toast(`Para crear el post debes estar autenticado`, 4000);
      return;
    }
    
    const nombreContacto = $('#nombreContacto').val();
    const emailContacto = $('#emailContacto').val();
    const comentarioTipo = $('#comentarioTipo').prop('checked');
    const reclamoTipo = $('#reclamoTipo').prop('checked');
    const mejoraTipo = $('#mejoraTipo').prop('checked');
    const otroTipo = $('#otroTipo').prop('checked');
    const comentariosContacto = $('#comentariosContacto').val();
    
    const post = new Post();
    post.crearComentario(
      user.uid, 
      user.email,
      nombreContacto,
      emailContacto,
      comentarioTipo,
      reclamoTipo,
      mejoraTipo,
      otroTipo,
      comentariosContacto
    )

  })

})
