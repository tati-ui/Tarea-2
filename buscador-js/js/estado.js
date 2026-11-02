
/* ==========================================
   pura lectura
   archivo: js/estado.js

   responsabilidad:
   administrar los datos de la lista de lecturas.

   este módulo permite:
   1. obtener las lecturas.
   2. agregar libros sin duplicados.
   3. cambiar el estado de un libro.
   4. quitar libros de la lista.

   los datos se mantienen en memoria.
   no se utiliza localStorage ni una base de datos.
   ========================================== */


/* ==========================================
   1. DATOS DE LA LISTA
   ========================================== */

// Arreglo que almacena los libros agregados.
// Se inicia vacío cada vez que se carga la página.
const lecturas = [];

// Estados disponibles para cada libro.
// El orden determina cómo cambian al hacer clic.
const estados = [
  'Pendiente',
  'Leyendo',
  'Leído'
];


/* ==========================================
   2. OBTENER LECTURAS
   ========================================== */

/*
  devuelve una copia superficial del arreglo.

  esto evita que otros módulos puedan agregar
  o eliminar elementos directamente del arreglo
  original mediante métodos como push o splice.
*/
export function obtenerLecturas() {
  return [...lecturas];
}


/* ==========================================
   3. AGREGAR UN LIBRO
   ========================================== */

/*
  recibe un libro obtenido desde open library.

  comprueba si ya existe un libro con el mismo id.

  devuelve:
  true  = se agregó correctamente.
  false = el libro ya estaba registrado.
*/
export function agregarLectura(libro) {

  // comprueba si el identificador ya existe.
  const existe = lecturas.some(
    (item) => item.id === libro.id
  );

  // evita agregar el mismo libro dos veces.
  if (existe) {
    return false;
  }

  // agrega una copia del libro y asigna
  // el estado inicial "Pendiente".
  lecturas.push({
    ...libro,
    estado: 'Pendiente'
  });

  return true;
}


/* ==========================================
   4. CAMBIAR ESTADO DE UN LIBRO
   ========================================== */

/*
  los estados cambian de forma circular:

  Pendiente → Leyendo → Leído → Pendiente

  devuelve el libro actualizado o null
  cuando el identificador no existe.
*/
export function cambiarEstado(id) {

  // busca el libro dentro de la lista.
  const libro = lecturas.find(
    (item) => item.id === id
  );

  if (!libro) {
    return null;
  }

  // obtiene la posición del estado actual.
  const indiceActual = estados.indexOf(
    libro.estado
  );

  // calcula la siguiente posición.
  // el operador % permite volver al inicio
  // después del último estado.
  const siguienteIndice =
    (indiceActual + 1) % estados.length;

  // actualiza el estado del libro.
  libro.estado = estados[siguienteIndice];

  return libro;
}


/* ==========================================
   5. QUITAR UN LIBRO
   ========================================== */

/*
  busca el libro por su identificador
  y lo elimina del arreglo.

  devuelve:
  true  = el libro fue eliminado.
  false = el libro no existía.
*/
export function quitarLectura(id) {

  // identifica la posición del libro.
  const indice = lecturas.findIndex(
    (item) => item.id === id
  );

  if (indice < 0) {
    return false;
  }

  // elimina únicamente el libro encontrado.
  lecturas.splice(indice, 1);

  return true;
}


/* ==========================================
   fin del archivo estado.js
   ========================================== */
