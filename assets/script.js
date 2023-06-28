$(document).ready(function() {
  //variable global para poder acceder en las funciones necesarias
  let conjuntoDeLibros;
  $('#buscar').click(function() {
      let libroNombre = $('#libroInput').val();
      buscarLibro(libroNombre);
  });

  $('#limpiar').click(function() {
      $('#contenidoGerenal').empty();//vaciar
  });
});

function buscarLibro(libro){
 $.ajax({
      type: 'GET',
      url: 'https://www.googleapis.com/books/v1/volumes',
      data: {
          q: libro, // Inserta los términos de búsqueda
          langRestrict: 'es', // Filtra los resultados para que sean en español
          maxResults: 15 // Define el número máximo de resultados que se desa obtener
      },
      
      dataType: 'json',
      async: true,
      success: function(data) {
        console.log(data);
        conjuntoDeLibros=data;
      //    console.log(data.items[0].volumeInfo.categories[0]);
          mostrarLibro(data);
      },
      error: function() {
           alert('Error al obtener los datos');
      }
  });

  
}


function mostrarLibro(libro) {
  let libroContenedor = $('#contenidoGerenal');
  libroContenedor.empty();

  libro.items.forEach(function(item) {

    let divLibro = $('<div>').addClass('libro');  

    //verifica si tiene imagen
    if (item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.thumbnail) {
      let imagen = $('<img>').attr('src', item.volumeInfo.imageLinks.thumbnail);
      divLibro.append(imagen);
    }

    let nombre = $('<h2>').text( item.volumeInfo.title);
    divLibro.append(nombre);

    //verifica si tiene categoria
    if (item.volumeInfo.categories && item.volumeInfo.categories.length > 0) {
      item.volumeInfo.categories.forEach(function(categoria) {
        let categoriaElemento = $('<p>').text('Categoría: ' + categoria);
        divLibro.append(categoriaElemento);
      });
    }

    libroContenedor.append(divLibro);

  });

}

$(document).on('click','.libro',function(){

  let indice = $('.libro').index(this);
  let libroSeleccionado = conjuntoDeLibros.items[indice];
  console.log(libroSeleccionado);

  let info = $('<div>').addClass('libroUnico');

  let imagen = $('<img>').attr('src',libroSeleccionado.volumeInfo.imageLinks.thumbnail);
  info.append(imagen);

  let titulo = $('<h2>').text(libroSeleccionado.volumeInfo.title);
  info.append(titulo);

  if(libroSeleccionado.volumeInfo.subtitle){
    let subtitulo = $('<p>').addClass('subtitulo').text(libroSeleccionado.volumeInfo.subtitle);
      info.append(subtitulo);
  }

  if(libroSeleccionado.volumeInfo.categories){
    let categoria = $('<p>').addClass('centrado').text('Categoria: '+ libroSeleccionado.volumeInfo.categories);
    info.append(categoria);

  }

  if(libroSeleccionado.volumeInfo.authors && libroSeleccionado.volumeInfo.authors.length > 0){
    let autorLibro = $('<p>').addClass('centrado').text('Autor: '+  libroSeleccionado.volumeInfo.authors[0]);
    if (libroSeleccionado.volumeInfo.authors.length > 1 ){
    //  autorLibro = (autorLibro + libroSeleccionado.volumeInfo.authors[0]);
      info.append(autorLibro);  
    //  console.log(autorLibro);
      libroSeleccionado.volumeInfo.authors.slice(1).forEach(function(autor){
        let autorLinea = $('<p>').addClass('centrado').text(autor);
    //    console.log(autorLibro);
        info.append(autorLinea);      
      })
    }
  }

  if(libroSeleccionado.volumeInfo.description){
      let descripcion = $('<p>').text('Descripcion: '+ libroSeleccionado.volumeInfo.description);
      info.append(descripcion);
  }
  
  $('body').append(info);
});

$('body').on('click', function(event) {
if (!$(event.target).closest('.libroUnico').length) {
  $('.libroUnico').remove();
}
});