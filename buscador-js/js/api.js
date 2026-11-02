
/* ==========================================
   pura lectura
   archivo: js/api.js

   responsabilidad:
   comunicarse con servicios externos.

   1. buscar libros en open library.
   2. enviar propuestas a jsonplaceholder.

   este módulo no manipula el dom.
   ========================================== */


/* ==========================================
   1. BÚSQUEDA DE LIBROS
   ========================================== */

/*
  recibe el texto escrito por el usuario.

  realiza una petición GET a open library
  y devuelve un arreglo de libros con una
  estructura uniforme para la aplicación.
*/
export async function buscarLibros(consulta) {

  // convierte caracteres especiales y espacios
  // en un formato seguro para incluir en la url.
  const textoSeguro = encodeURIComponent(consulta);

  // construye la dirección de la api.
  // se solicitan como máximo 12 resultados.
  const url =
    `https://openlibrary.org/search.json?q=${textoSeguro}&limit=12`;

  // realiza la petición y espera la respuesta.
  // si falla la red, fetch lanza un error que
  // será capturado por el try/catch de main.js.
  const respuesta = await fetch(url);

  // fetch no considera automáticamente un
  // código 404 o 500 como una excepción.
  // por eso comprobamos response.ok.
  if (!respuesta.ok) {
    throw new Error(
      `error del servidor: ${respuesta.status}`
    );
  }

  // transforma la respuesta json en un objeto.
  const datos = await respuesta.json();

  // comprueba que la api haya devuelto
  // un arreglo de resultados válido.
  if (!Array.isArray(datos.docs)) {
    throw new Error(
      'respuesta inesperada del catálogo'
    );
  }

  // convierte cada resultado externo en un
  // objeto con los campos que utiliza el sitio.
  return datos.docs.map((libro) => {

    // utiliza la portada oficial cuando existe.
    // en caso contrario, muestra una imagen local.
    const portada = libro.cover_i
      ? `https://covers.openlibrary.org/b/id/${libro.cover_i}-M.jpg`
      : './assets/sin-portada.svg';

    // algunos libros no incluyen autores.
    // utilizamos un texto alternativo.
    const autores =
      Array.isArray(libro.author_name) &&
      libro.author_name.length > 0
        ? libro.author_name
        : ['autor desconocido'];

    return {
      // identificador utilizado para evitar duplicados.
      id: libro.key,

      // título del libro.
      titulo: libro.title || 'sin título',

      // arreglo de autores.
      autores: autores,

      // año de primera publicación.
      anio: libro.first_publish_year ?? 'sin dato',

      // dirección de la imagen.
      portada: portada,

      // cantidad de ediciones registradas.
      ediciones: libro.edition_count ?? 'sin dato'
    };

  });
}


/* ==========================================
   2. ENVÍO DE PROPUESTAS
   ========================================== */

/*
  recibe los datos del formulario de propuesta.

  utiliza una petición POST a jsonplaceholder,
  un servicio de pruebas que simula el registro.

  el servicio responde con datos de ejemplo,
  pero no almacena realmente la propuesta.
*/
export async function enviarPropuesta(datos) {

  const url =
    'https://jsonplaceholder.typicode.com/posts';

  // realiza una petición POST con los datos
  // convertidos a formato json.
  const respuesta = await fetch(url, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify(datos)
  });

  // verifica que el servidor haya respondido
  // con un código http satisfactorio.
  if (!respuesta.ok) {
    throw new Error(
      `no se pudo enviar: ${respuesta.status}`
    );
  }

  // devuelve la respuesta del servicio.
  return await respuesta.json();
}


/* ==========================================
   fin del archivo api.js
   ========================================== */
