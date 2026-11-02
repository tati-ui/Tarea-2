
/* ==========================================
   pura lectura
   archivo: js/render.js

   responsabilidad:
   crear y actualizar los elementos visuales
   de la aplicación mediante métodos del dom.

   este módulo no modifica el arreglo de libros.
   solamente representa los datos recibidos.
   ========================================== */


/* ==========================================
   1. IMPORTACIONES
   ========================================== */

// Importamos únicamente el componente modal
// de Bootstrap, en lugar de toda su librería.
import Modal from 'bootstrap/js/dist/modal';


/* ==========================================
   2. REFERENCIAS DEL DOM
   ========================================== */

const resultados = document.getElementById('resultados');

const tabla = document.getElementById('tabla-lecturas');

const mensaje = document.getElementById('mensaje-busqueda');

const mensajeSinLecturas = document.getElementById(
  'sin-lecturas'
);

const tituloModal = document.getElementById(
  'modal-titulo'
);

const contenidoModal = document.getElementById(
  'modal-contenido'
);

// Creamos una instancia del modal de Bootstrap.
const modal = new Modal(
  document.getElementById('modal-libro')
);

// Imagen alternativa cuando no hay portada.
const respaldo = './assets/sin-portada.svg';


/* ==========================================
   3. FUNCIONES AUXILIARES
   ========================================== */

/*
  crea un elemento html de forma segura.

  utilizamos textContent para colocar texto,
  evitando interpretar datos externos como html.
*/
function elemento(tipo, clase = '', texto) {
  const nodo = document.createElement(tipo);

  if (clase) {
    nodo.className = clase;
  }

  if (texto !== undefined) {
    nodo.textContent = String(texto);
  }

  return nodo;
}


/*
  crea la imagen de portada de un libro.

  si la imagen falla, utiliza el svg alternativo.
*/
function imagen(libro) {
  const img = elemento('img', 'portada');

  img.src = libro.portada || respaldo;

  img.alt = `portada de ${libro.titulo}`;

  // carga diferida para mejorar el rendimiento.
  img.loading = 'lazy';

  img.addEventListener('error', () => {
    if (!img.src.endsWith('sin-portada.svg')) {
      img.src = respaldo;
    }
  });

  return img;
}


/* ==========================================
   4. MENSAJES DE BÚSQUEDA
   ========================================== */

/*
  muestra mensajes de carga, éxito o error.

  el tipo corresponde a las clases de alerta
  de Bootstrap: info, success, warning, danger.
*/
export function mostrarMensaje(texto, tipo = 'info') {
  mensaje.className = `alert alert-${tipo}`;

  mensaje.textContent = texto;

  mensaje.hidden = false;
}


/* ==========================================
   5. RESULTADOS DE OPEN LIBRARY
   ========================================== */

/*
  recibe un arreglo de libros y una función
  que se ejecutará al presionar "agregar".

  los resultados se generan utilizando
  métodos del dom, sin innerHTML.
*/
export function mostrarResultados(libros, alAgregar) {

  // elimina los resultados de la búsqueda anterior.
  resultados.replaceChildren();

  // muestra un mensaje cuando no hay coincidencias.
  if (libros.length === 0) {
    mostrarMensaje(
      'no se encontraron libros. prueba con otro título o autor.',
      'warning'
    );
    return;
  }

  mostrarMensaje(
    `${libros.length} resultados encontrados.`,
    'success'
  );

  // el fragmento permite agrupar las tarjetas
  // antes de agregarlas al documento.
  const fragmento = document.createDocumentFragment();

  libros.forEach((libro) => {

    const tarjeta = elemento('article', 'libro-card');

    const portada = imagen(libro);

    const titulo = elemento('h3', '', libro.titulo);

    const autores = elemento(
      'p',
      'mb-0 texto-suave',
      libro.autores.join(', ')
    );

    const anio = elemento(
      'p',
      'mb-0',
      `primera publicación: ${libro.anio}`
    );

    // contenedor de los botones de la tarjeta.
    const acciones = elemento('div', 'acciones');

    // botón para abrir el detalle del libro.
    const detalle = elemento(
      'button',
      'btn btn-outline-primary btn-sm',
      'ver detalle'
    );

    detalle.type = 'button';

    detalle.addEventListener('click', () => {
      mostrarDetalle(libro);
    });

    // botón para agregar el libro a la lista.
    const agregar = elemento(
      'button',
      'btn btn-primary btn-sm',
      'agregar a lecturas'
    );

    agregar.type = 'button';

    agregar.addEventListener('click', () => {
      alAgregar(libro);
    });

    acciones.append(detalle, agregar);

    tarjeta.append(
      portada,
      titulo,
      autores,
      anio,
      acciones
    );

    fragmento.append(tarjeta);
  });

  // inserta todas las tarjetas en una operación.
  resultados.append(fragmento);
}


/* ==========================================
   6. MODAL DE DETALLES
   ========================================== */

/*
  muestra información adicional del libro
  utilizando el modal de Bootstrap.
*/
function mostrarDetalle(libro) {

  tituloModal.textContent = libro.titulo;

  // limpia el contenido anterior del modal.
  contenidoModal.replaceChildren();

  const portada = imagen(libro);

  const autores = elemento(
    'p',
    'mt-3',
    `autores: ${libro.autores.join(', ')}`
  );

  const anio = elemento(
    'p',
    '',
    `primera publicación: ${libro.anio}`
  );

  const ediciones = elemento(
    'p',
    '',
    `ediciones registradas: ${libro.ediciones}`
  );

  contenidoModal.append(
    portada,
    autores,
    anio,
    ediciones
  );

  // abre el modal.
  modal.show();
}


/* ==========================================
   7. CREACIÓN DE FILAS DE LECTURA
   ========================================== */

/*
  crea una fila para representar un libro.

  cada botón utiliza data-accion para que
  main.js pueda gestionar sus clics mediante
  una sola escucha en la tabla.
*/
function crearFilaLectura(libro, animar = false) {

  const fila = elemento('tr', 'fila-lectura');

  // identificador estable del libro.
  fila.dataset.id = libro.id;

  if (animar) {
    fila.classList.add('entrando');
  }

  const titulo = elemento('td', '', libro.titulo);

  const estado = elemento(
    'td',
    'estado-lectura',
    libro.estado
  );

  const acciones = elemento('td');

  // botón para cambiar el estado.
  const cambiar = elemento(
    'button',
    'btn btn-outline-primary btn-sm me-2',
    'cambiar estado'
  );

  cambiar.type = 'button';
  cambiar.dataset.accion = 'cambiar';

  cambiar.setAttribute(
    'aria-label',
    `cambiar estado de ${libro.titulo}`
  );

  // botón para quitar el libro.
  const quitar = elemento(
    'button',
    'btn btn-outline-danger btn-sm',
    'quitar'
  );

  quitar.type = 'button';
  quitar.dataset.accion = 'quitar';

  quitar.setAttribute(
    'aria-label',
    `quitar ${libro.titulo}`
  );

  acciones.append(cambiar, quitar);

  fila.append(titulo, estado, acciones);

  return fila;
}


/* ==========================================
   8. RENDERIZADO DE LA LISTA
   ========================================== */

/*
  actualiza la tabla de lecturas.

  cuando se agrega un libro nuevo, solamente
  crea su fila y conserva las existentes.

  cuando se inicializa la aplicación,
  construye la tabla a partir del arreglo.
*/
export function mostrarLecturas(
  lecturas,
  idAnimado = null
) {

  // si hay un libro recién agregado, buscamos
  // sus datos y comprobamos si ya tiene fila.
  if (idAnimado !== null) {

    const libroNuevo = lecturas.find(
      (libro) => libro.id === idAnimado
    );

    const filaExistente = Array.from(
      tabla.children
    ).find(
      (fila) => fila.dataset.id === String(idAnimado)
    );

    // agrega únicamente la nueva fila.
    if (libroNuevo && !filaExistente) {
      const fila = crearFilaLectura(libroNuevo, true);

      tabla.append(fila);
    }

  } else {

    // renderizado inicial de la tabla.
    const fragmento = document.createDocumentFragment();

    lecturas.forEach((libro) => {
      fragmento.append(crearFilaLectura(libro));
    });

    tabla.replaceChildren(fragmento);
  }

  // controla el mensaje de lista vacía.
  mensajeSinLecturas.hidden = lecturas.length > 0;
}


/* ==========================================
   9. ANIMACIÓN DE CAMBIO DE ESTADO
   ========================================== */

/*
  actualiza únicamente el texto del estado
  y activa la transición de color de la fila.
*/
export function animarCambio(fila, nuevoEstado) {

  const celdaEstado = fila.querySelector(
    '.estado-lectura'
  );

  celdaEstado.textContent = nuevoEstado;

  // reinicia la clase para permitir que la
  // animación se active en cambios consecutivos.
  fila.classList.remove('cambiando');

  void fila.offsetWidth;

  fila.classList.add('cambiando');

  const limpiarAnimacion = (evento) => {
    if (
      evento.target === fila &&
      evento.propertyName === 'background-color'
    ) {
      fila.classList.remove('cambiando');

      fila.removeEventListener(
        'transitionend',
        limpiarAnimacion
      );
    }
  };

  fila.addEventListener(
    'transitionend',
    limpiarAnimacion
  );
}


/* ==========================================
   10. ANIMACIÓN DE SALIDA
   ========================================== */

/*
  al quitar un libro:

  1. se activa la clase css "saliendo".
  2. se espera a que termine la transición.
  3. se retira la fila del dom.
  4. se ejecuta la función recibida de main.js.
*/
export function animarSalida(fila, alTerminar) {

  let terminado = false;

  const terminar = () => {

    // evita ejecutar la eliminación dos veces.
    if (terminado) {
      return;
    }

    terminado = true;

    fila.remove();

    alTerminar();
  };

  const escucharFin = (evento) => {
    if (
      evento.target === fila &&
      evento.propertyName === 'opacity'
    ) {
      terminar();
    }
  };

  fila.addEventListener(
    'transitionend',
    escucharFin
  );

  fila.classList.add('saliendo');

  // respaldo si la transición no se ejecuta,
  // por ejemplo, al reducir las animaciones.
  setTimeout(terminar, 450);
}


/* ==========================================
   fin del archivo render.js
   ========================================== */
