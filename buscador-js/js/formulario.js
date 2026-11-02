
/* ==========================================
   pura lectura
   archivo: js/formulario.js

   responsabilidad:
   administrar el formulario de propuestas.

   funciones principales:
   1. agregar y quitar autores.
   2. validar los campos.
   3. mostrar errores individuales.
   4. enviar los datos mediante una petición POST.
   5. mostrar el resultado sin recargar la página.
   ========================================== */


/* ==========================================
   1. IMPORTACIONES
   ========================================== */

// Función encargada de enviar la propuesta.
import { enviarPropuesta } from './api.js';


/* ==========================================
   2. ELEMENTOS DEL DOM
   ========================================== */

const form = document.getElementById('form-propuesta');

const autores = document.getElementById('autores');

const botonAutor = document.getElementById(
  'agregar-autor'
);

const botonEnviar = document.getElementById(
  'enviar-propuesta'
);

const alerta = document.getElementById(
  'alerta-propuesta'
);

const fecha = document.getElementById('fecha');

const anio = document.getElementById('anio');

// Permite crear identificadores únicos para autores.
let siguienteAutor = 0;


/* ==========================================
   3. OBTENER LA FECHA ACTUAL
   ========================================== */

/*
  devuelve la fecha local en formato yyyy-mm-dd.

  utilizamos la fecha local para evitar errores
  de zona horaria al validar las sesiones.
*/
function hoyLocal() {

  const actual = new Date();

  const anioActual = actual.getFullYear();

  const mes = String(
    actual.getMonth() + 1
  ).padStart(2, '0');

  const dia = String(
    actual.getDate()
  ).padStart(2, '0');

  return `${anioActual}-${mes}-${dia}`;
}


/* ==========================================
   4. ACTUALIZAR LÍMITES DE FECHA Y AÑO
   ========================================== */

/*
  impide seleccionar fechas anteriores a hoy
  y años de publicación posteriores al actual.
*/
function actualizarLimites() {

  fecha.min = hoyLocal();

  anio.max = new Date().getFullYear();
}


/* ==========================================
   5. CREAR CAMPOS DE AUTORES
   ========================================== */

/*
  agrega un campo para escribir un autor.

  el formulario permite entre uno y cinco
  autores, según las reglas de la tarea.
*/
function crearAutor() {

  // impide superar cinco autores.
  if (autores.children.length >= 5) {
    return;
  }

  // crea un identificador único.
  const id = `autor-${++siguienteAutor}`;

  // contenedor principal del autor.
  const fila = document.createElement('div');
  fila.className = 'campo-autor';

  // contenedor del campo y su mensaje de error.
  const grupo = document.createElement('div');
  grupo.className = 'campo-con-error';

  // etiqueta asociada al campo.
  const etiqueta = document.createElement('label');
  etiqueta.className = 'form-label';
  etiqueta.htmlFor = id;
  etiqueta.textContent =
    `autor ${autores.children.length + 1}`;

  // campo de texto.
  const input = document.createElement('input');

  input.type = 'text';
  input.id = id;
  input.name = 'autor';
  input.required = true;
  input.minLength = 2;
  input.maxLength = 100;
  input.pattern = '.*\\S.*';
  input.className = 'form-control';

  // espacio para mostrar el error individual.
  const error = document.createElement('div');
  error.className = 'invalid-feedback';

  grupo.append(etiqueta, input, error);

  // botón para quitar el campo.
  const quitar = document.createElement('button');

  quitar.type = 'button';
  quitar.className =
    'btn btn-outline-danger btn-sm mt-4';
  quitar.textContent = 'quitar';

  quitar.addEventListener('click', () => {

    // siempre debe permanecer al menos un autor.
    if (autores.children.length <= 1) {
      return;
    }

    fila.remove();

    actualizarAutores();
  });

  fila.append(grupo, quitar);

  autores.append(fila);

  actualizarAutores();
}


/* ==========================================
   6. ACTUALIZAR CONTROLES DE AUTORES
   ========================================== */

/*
  actualiza la numeración de los autores
  y habilita o deshabilita los botones.
*/
function actualizarAutores() {

  const cantidad = autores.children.length;

  // desactiva "agregar autor" al llegar a cinco.
  botonAutor.disabled = cantidad >= 5;

  [...autores.children].forEach(
    (fila, indice) => {

      const etiqueta = fila.querySelector('label');

      const botonQuitar = fila.querySelector(
        'button'
      );

      etiqueta.textContent = `autor ${indice + 1}`;

      // evita eliminar el único autor disponible.
      botonQuitar.disabled = cantidad <= 1;
    }
  );
}


/* ==========================================
   7. VALIDACIÓN DE CAMPOS
   ========================================== */

/*
  combina las validaciones nativas de html5
  con reglas adicionales de javascript.

  utiliza setCustomValidity para comunicar
  errores personalizados al navegador.

  devuelve true si el campo es válido.
*/
function validar(campo) {

  // elimina errores personalizados anteriores.
  campo.setCustomValidity('');

  // no permite años de publicación futuros.
  if (
    campo.id === 'anio' &&
    campo.value &&
    Number(campo.value) > new Date().getFullYear()
  ) {
    campo.setCustomValidity(
      'el año no puede ser futuro.'
    );
  }

  // no permite sesiones en fechas pasadas.
  if (
    campo.id === 'fecha' &&
    campo.value &&
    campo.value < hoyLocal()
  ) {
    campo.setCustomValidity(
      'la fecha no puede ser anterior a hoy.'
    );
  }

  // busca el contenedor del mensaje de error.
  const error = campo.parentElement.querySelector(
    '.invalid-feedback'
  );

  // verifica las restricciones del campo.
  if (!campo.validity.valid) {

    let mensaje = campo.validationMessage;

    if (campo.validity.valueMissing) {
      mensaje = 'este campo es obligatorio.';
    }

    else if (campo.validity.tooShort) {
      mensaje =
        `escribe al menos ${campo.minLength} caracteres.`;
    }

    else if (campo.validity.typeMismatch) {
      mensaje = 'ingresa un correo válido.';
    }

    else if (campo.validity.rangeUnderflow) {
      mensaje = `el mínimo permitido es ${campo.min}.`;
    }

    else if (campo.validity.rangeOverflow) {
      mensaje = `el máximo permitido es ${campo.max}.`;
    }

    else if (campo.validity.patternMismatch) {
      mensaje = 'escribe un valor válido.';
    }

    // presenta el mensaje junto al campo.
    if (error) {
      error.textContent = mensaje;
    }

    campo.classList.add('is-invalid');
    campo.classList.remove('is-valid');

    return false;
  }

  // elimina mensajes y estilos de error.
  if (error) {
    error.textContent = '';
  }

  campo.classList.remove('is-invalid');
  campo.classList.add('is-valid');

  return true;
}


/* ==========================================
   8. MOSTRAR ALERTAS DEL FORMULARIO
   ========================================== */

/*
  presenta mensajes de éxito o error
  mediante las clases de Bootstrap.
*/
function mostrarAlerta(texto, tipo) {

  alerta.className = `alert alert-${tipo}`;

  alerta.textContent = texto;

  alerta.hidden = false;
}


/* ==========================================
   9. LIMPIAR FORMULARIO
   ========================================== */

/*
  restaura los campos después de un envío
  satisfactorio y crea un único autor vacío.
*/
function limpiarFormulario() {

  form.reset();

  // elimina todos los campos de autor anteriores.
  autores.replaceChildren();

  // crea nuevamente el primer autor.
  crearAutor();

  // elimina las clases visuales de validación.
  form.querySelectorAll(
    '.is-valid, .is-invalid'
  ).forEach((campo) => {

    campo.classList.remove(
      'is-valid',
      'is-invalid'
    );

    campo.setCustomValidity('');
  });

  // limpia los mensajes de error anteriores.
  form.querySelectorAll(
    '.invalid-feedback'
  ).forEach((error) => {

    error.textContent = '';
  });

  actualizarLimites();
}


/* ==========================================
   10. INICIALIZAR FORMULARIO
   ========================================== */

/*
  conecta los eventos del formulario.

  esta función se ejecuta desde main.js
  cuando inicia la aplicación.
*/
export function iniciarFormulario() {

  // crea el primer campo de autor.
  crearAutor();

  // configura los límites iniciales.
  actualizarLimites();

  // permite agregar nuevos autores.
  botonAutor.addEventListener(
    'click',
    crearAutor
  );

  // validación en tiempo real.
  // la delegación permite validar también
  // los autores agregados dinámicamente.
  form.addEventListener('input', (evento) => {

    if (
      evento.target.matches(
        'input, select, textarea'
      )
    ) {
      validar(evento.target);
    }
  });

  // valida cambios en selectores y fechas.
  form.addEventListener('change', (evento) => {

    if (
      evento.target.matches(
        'input, select, textarea'
      )
    ) {
      validar(evento.target);
    }
  });


  /* ------------------------------------------
     10.1 ENVÍO DEL FORMULARIO
     ------------------------------------------ */

  form.addEventListener('submit', async (evento) => {

    // evita que se recargue la página.
    evento.preventDefault();

    // actualiza límites por si cambió el día.
    actualizarLimites();

    // obtiene todos los campos del formulario.
    const campos = [
      ...form.querySelectorAll(
        'input, select, textarea'
      )
    ];

    // valida cada campo.
    const formularioValido = campos
      .map(validar)
      .every(Boolean);

    // detiene el envío si existen errores.
    if (!formularioValido) {

      mostrarAlerta(
        'revisa los campos marcados antes de enviar.',
        'danger'
      );

      // dirige al usuario al primer campo inválido.
      const primerError = campos.find(
        (campo) => !campo.validity.valid
      );

      primerError?.focus();

      return;
    }

    /* ----------------------------------------
       10.2 PREPARAR DATOS
       ---------------------------------------- */

    // convierte los campos en un objeto.
    const datos = Object.fromEntries(
      new FormData(form)
    );

    // reúne todos los autores en un arreglo.
    datos.autores = [
      ...autores.querySelectorAll('input')
    ].map((input) => input.value.trim());

    // elimina el campo individual de autor.
    delete datos.autor;

    // bloquea el botón durante la petición.
    botonEnviar.disabled = true;
    botonEnviar.textContent = 'enviando...';


    /* ----------------------------------------
       10.3 PETICIÓN ASINCRÓNICA
       ---------------------------------------- */

    try {

      // envía la propuesta mediante api.js.
      await enviarPropuesta(datos);

      // informa que el servicio respondió bien.
      mostrarAlerta(
        'propuesta enviada correctamente al servicio de pruebas.',
        'success'
      );

      // restaura los campos.
      limpiarFormulario();

    } catch (error) {

      // muestra un error sin perder los datos.
      console.error(
        'error al enviar la propuesta:',
        error
      );

      mostrarAlerta(
        'no se pudo enviar la propuesta. intenta de nuevo.',
        'danger'
      );

    } finally {

      // restaura el botón en todos los casos.
      botonEnviar.disabled = false;
      botonEnviar.textContent = 'enviar propuesta';

    }
  });
}


/* ==========================================
   fin del archivo formulario.js
   ========================================== */
