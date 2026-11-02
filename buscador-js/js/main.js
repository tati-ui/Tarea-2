
/* ==========================================
   pura lectura
   archivo: js/main.js

   función principal:
   conectar los módulos de la aplicación,
   gestionar la búsqueda de libros y
   controlar las acciones de la lista.
   ========================================== */


/* ==========================================
   1. IMPORTACIÓN DE MÓDULOS
   ========================================== */

// Activa el menú desplegable de Bootstrap.
import 'bootstrap/js/dist/collapse';

// Función que consulta la API de Open Library.
import { buscarLibros } from './api.js';

// Funciones que administran la lista de lecturas.
import {
  agregarLectura,
  cambiarEstado,
  quitarLectura,
  obtenerLecturas
} from './estado.js';

// Funciones que actualizan la interfaz.
import {
  mostrarMensaje,
  mostrarResultados,
  mostrarLecturas,
  animarCambio,
  animarSalida
} from './render.js';

// Inicializa el formulario de propuesta de lectura.
import { iniciarFormulario } from './formulario.js';


/* ==========================================
   2. ELEMENTOS DEL DOM
   ========================================== */

// Formulario donde el usuario escribe su búsqueda.
const formularioBusqueda = document.getElementById(
  'form-busqueda'
);

// Contenedor donde aparecen los libros encontrados.
const resultados = document.getElementById(
  'resultados'
);

// Contenedor de las filas de la lista de lecturas.
const tabla = document.getElementById(
  'tabla-lecturas'
);

// Mensaje que aparece cuando no hay lecturas.
const mensajeSinLecturas = document.getElementById(
  'sin-lecturas'
);


/* ==========================================
   3. BÚSQUEDA DE LIBROS
   ========================================== */

// Escuchamos el envío del formulario.
// La búsqueda no se ejecuta con cada tecla.
formularioBusqueda.addEventListener(
  'submit',
  async (evento) => {

    // Evita que el navegador recargue la página.
    evento.preventDefault();

    // Obtiene el texto y elimina espacios sobrantes.
    const consulta = document
      .getElementById('consulta')
      .value
      .trim();

    // Comprueba que la búsqueda tenga contenido.
    if (consulta.length < 2) {
      mostrarMensaje(
        'escribe al menos dos caracteres.',
        'warning'
      );
      return;
    }

    // Identifica el botón utilizado para buscar.
    const boton = formularioBusqueda.querySelector(
      'button[type="submit"]'
    );

    // Desactiva el botón para evitar búsquedas repetidas.
    boton.disabled = true;
    boton.textContent = 'buscando...';

    // Limpia los resultados anteriores.
    resultados.replaceChildren();

    // Informa que la petición está en proceso.
    mostrarMensaje(
      'buscando libros, espera un momento...',
      'info'
    );

    try {

      // Espera la respuesta de Open Library.
      // La petición fetch se realiza en api.js.
      const libros = await buscarLibros(consulta);

      // Dibuja las tarjetas de los libros encontrados.
      // Cada tarjeta recibe una función para agregarla.
      mostrarResultados(libros, (libro) => {

        // Intenta agregar el libro a la lista.
        const agregado = agregarLectura(libro);

        // Si ya existe, evita duplicarlo.
        if (!agregado) {
          mostrarMensaje(
            'ese libro ya está en tu lista de lecturas.',
            'warning'
          );
          return;
        }

        // Actualiza la tabla de lecturas.
        // El identificador permite animar el nuevo libro.
        mostrarLecturas(
          obtenerLecturas(),
          libro.id
        );

        // Confirma que se agregó correctamente.
        mostrarMensaje(
          `agregaste «${libro.titulo}» a tu lista.`,
          'success'
        );

      });

    } catch (error) {

      // Captura los errores de la consulta.
      // Evita que la aplicación quede sin respuesta.
      console.error(
        'error al buscar libros:',
        error
      );

      mostrarMensaje(
        'ocurrió un error al consultar open library. intenta nuevamente.',
        'danger'
      );

    } finally {

      // Se ejecuta tanto si la búsqueda funciona
      // como si ocurre un error.
      boton.disabled = false;
      boton.textContent = 'buscar libros';

    }
  }
);


/* ==========================================
   4. LISTA DE LECTURAS
   ========================================== */

/*
  delegación de eventos:

  en lugar de colocar un addEventListener
  en cada botón, utilizamos una sola escucha
  en el contenedor de la tabla.

  esto permite gestionar botones generados
  dinámicamente mediante javascript.
*/

tabla.addEventListener('click', (evento) => {

  // Busca el botón de acción más cercano al clic.
  const boton = evento.target.closest(
    'button[data-accion]'
  );

  // Ignora los clics fuera de los botones válidos.
  if (!boton || !tabla.contains(boton)) {
    return;
  }

  // Evita que el clic active acciones de contenedores.
  evento.stopPropagation();

  // Identifica la fila que contiene el botón.
  const fila = boton.closest('tr');

  // Obtiene el identificador del libro.
  const id = fila.dataset.id;


  /* ------------------------------------------
     4.1 CAMBIAR ESTADO DEL LIBRO
     ------------------------------------------ */

  if (boton.dataset.accion === 'cambiar') {

    // Modifica el estado en el módulo estado.js.
    const libro = cambiarEstado(id);

    // Si el libro existe, actualiza la interfaz
    // y activa la animación correspondiente.
    if (libro) {
      animarCambio(fila, libro.estado);
    }

  }


  /* ------------------------------------------
     4.2 QUITAR LIBRO DE LA LISTA
     ------------------------------------------ */

  else if (boton.dataset.accion === 'quitar') {

    // Desactiva los botones de esta fila para
    // impedir acciones repetidas durante la salida.
    fila.querySelectorAll('button').forEach(
      (control) => {
        control.disabled = true;
      }
    );

    // Inicia la animación de salida.
    animarSalida(fila, () => {

      // Quita el libro del arreglo de lecturas.
      quitarLectura(id);

      // Muestra el mensaje si la lista queda vacía.
      mensajeSinLecturas.hidden =
        obtenerLecturas().length > 0;

    });

  }

});


/* ==========================================
   5. INICIALIZACIÓN DE LA APLICACIÓN
   ========================================== */

// Muestra las lecturas disponibles al iniciar.
// La lista se mantiene en memoria durante la sesión.
mostrarLecturas(obtenerLecturas());

// Prepara los campos, validaciones y eventos
// del formulario de propuesta de lectura.
iniciarFormulario();


/* ==========================================
   FIN DEL ARCHIVO MAIN.JS
   ========================================== */
