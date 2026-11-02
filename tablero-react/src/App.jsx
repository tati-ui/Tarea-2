
import { useState } from 'react';
import { ESTADOS, MIEMBROS, LIBROS_INICIALES } from './data/libros.js';
import './App.css';

/*
=========================================================
PURA LECTURA — TABLERO REACT
=========================================================

Esta aplicación permite:
1. Consultar los libros propuestos por el club.
2. Filtrar libros por estado y miembro.
3. Cambiar el estado de lectura.
4. Eliminar libros.
5. Agregar nuevas propuestas mediante un formulario.
6. Actualizar automáticamente las estadísticas.

Concepto principal:
React actualiza la interfaz cuando cambia el estado,
sin que tengamos que modificar manualmente el DOM.

Los datos iniciales están en:
src/data/libros.js
=========================================================
*/


/*
=========================================================
1. COMPONENTE PANEL
=========================================================

Este componente es reutilizable.

Recibe tres propiedades (props):
- titulo: encabezado del panel.
- descripcion: texto opcional.
- children: contenido que colocamos dentro del panel.

Para la exposición:
"Utilicé children para reutilizar una misma estructura
visual en diferentes secciones de la aplicación".
*/

function Panel({ titulo, descripcion, children }) {
  return (
    <section className="panel">
      <div className="panel-encabezado">
        <h2>{titulo}</h2>

        {/* solo mostramos la descripción si existe */}
        {descripcion && <p>{descripcion}</p>}
      </div>

      {/* contenido recibido desde el componente padre */}
      {children}
    </section>
  );
}


/*
=========================================================
2. COMPONENTE FILTROS
=========================================================

Este componente muestra dos listas desplegables:
- estado de lectura.
- miembro del club.

Los filtros son controlados porque sus valores vienen
del estado del componente principal App.

Cuando el usuario cambia un filtro, se ejecuta una
función recibida mediante props.

Para la exposición:
"Elevé el estado al componente App para que los filtros
y la lista de libros compartan la misma información".
*/

function Filtros({
  filtroEstado,
  filtroMiembro,
  alCambiarEstado,
  alCambiarMiembro
}) {
  return (
    <div className="filtros">

      {/* filtro por estado */}
      <label htmlFor="filtro-estado">
        Estado de lectura

        <select
          id="filtro-estado"
          value={filtroEstado}
          onChange={(evento) =>
            alCambiarEstado(evento.target.value)
          }
        >
          <option value="Todos">
            Todos los estados
          </option>

          {/* map genera una opción por cada estado */}
          {ESTADOS.map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>
      </label>

      {/* filtro por miembro */}
      <label htmlFor="filtro-miembro">
        Miembro del club

        <select
          id="filtro-miembro"
          value={filtroMiembro}
          onChange={(evento) =>
            alCambiarMiembro(evento.target.value)
          }
        >
          <option value="Todos">
            Todos los miembros
          </option>

          {/* las opciones se obtienen del archivo libros.js */}
          {MIEMBROS.map((miembro) => (
            <option key={miembro} value={miembro}>
              {miembro}
            </option>
          ))}
        </select>
      </label>

    </div>
  );
}


/*
=========================================================
3. COMPONENTE RESUMEN
=========================================================

Calcula las estadísticas del club.

No utilizamos un useState adicional para los contadores,
porque podemos calcularlos directamente a partir de libros.

Esto se conoce como estado derivado.

Cuando se agrega, elimina o cambia un libro, App vuelve
a renderizar y las estadísticas se recalculan.

Para la exposición:
"Evité duplicar el estado porque los contadores se pueden
obtener directamente con filter y length".
*/

function Resumen({ libros }) {

  // construimos un arreglo con las estadísticas.
  const indicadores = [
    {
      nombre: 'Total de libros',
      cantidad: libros.length
    },
    {
      nombre: 'Pendientes',
      cantidad: libros.filter(
        (libro) => libro.estado === 'Pendiente'
      ).length
    },
    {
      nombre: 'Leyendo',
      cantidad: libros.filter(
        (libro) => libro.estado === 'Leyendo'
      ).length
    },
    {
      nombre: 'Leídos',
      cantidad: libros.filter(
        (libro) => libro.estado === 'Leído'
      ).length
    }
  ];

  return (
    <div className="resumen">

      {/* cada indicador se convierte en una tarjeta */}
      {indicadores.map((indicador) => (
        <div
          className="estadistica"
          key={indicador.nombre}
        >
          <strong>{indicador.cantidad}</strong>
          <span>{indicador.nombre}</span>
        </div>
      ))}

    </div>
  );
}


/*
=========================================================
4. COMPONENTE TARJETA LIBRO
=========================================================

Representa visualmente un libro.

Recibe:
- libro: objeto con la información del libro.
- alCambiarEstado: función para actualizar su estado.
- alEliminar: función para quitarlo.

Este componente no modifica directamente el arreglo.
Solicita los cambios al componente App mediante funciones
que recibe como props.

Para la exposición:
"Cada tarjeta es independiente visualmente, pero el
estado compartido se administra desde App".
*/

function TarjetaLibro({
  libro,
  alCambiarEstado,
  alEliminar
}) {

  /*
  Seleccionamos una clase CSS según el estado.

  Esto permite que cada estado tenga una apariencia
  diferente sin modificar directamente el DOM.
  */
  const claseEstado =
    libro.estado === 'Leído'
      ? 'estado-leido'
      : libro.estado === 'Leyendo'
        ? 'estado-leyendo'
        : 'estado-pendiente';

  return (
    <article className="tarjeta-libro">

      <div className="tarjeta-informacion">

        <span className="etiqueta-miembro">
          Propuesto por {libro.miembro}
        </span>

        <h3>{libro.titulo}</h3>

        <p className="autor-libro">
          {libro.autor}
        </p>

        {/* clase visual según el estado del libro */}
        <span
          className={`etiqueta-estado ${claseEstado}`}
        >
          {libro.estado}
        </span>

      </div>

      <div className="tarjeta-acciones">

        {/* enviamos el identificador del libro a App */}
        <button
          type="button"
          className="boton-secundario"
          onClick={() => alCambiarEstado(libro.id)}
          aria-label={`Cambiar estado de ${libro.titulo}`}
        >
          Cambiar estado
        </button>

        {/* solicitamos la eliminación del libro */}
        <button
          type="button"
          className="boton-peligro"
          onClick={() => alEliminar(libro.id)}
          aria-label={`Quitar ${libro.titulo}`}
        >
          Quitar
        </button>

      </div>
    </article>
  );
}


/*
=========================================================
5. COMPONENTE LISTA LIBROS
=========================================================

Recibe el arreglo de libros que debe mostrar.

Utiliza renderizado condicional:
- si no hay libros, muestra un mensaje.
- si hay libros, genera las tarjetas.

Cada tarjeta tiene una propiedad key con un identificador
estable. Esto ayuda a React a reconocer los elementos
cuando la lista cambia.

Para la exposición:
"Utilicé renderizado condicional para manejar los
resultados vacíos y key para identificar cada libro".
*/

function ListaLibros({
  libros,
  alCambiarEstado,
  alEliminar
}) {

  // si no hay resultados, mostramos un mensaje.
  if (libros.length === 0) {
    return (
      <div className="mensaje-vacio" role="status">
        <h3>No encontramos lecturas</h3>
        <p>
          Prueba con otros filtros o agrega una propuesta.
        </p>
      </div>
    );
  }

  return (
    <div className="lista-libros">

      {/* map convierte cada libro en una tarjeta */}
      {libros.map((libro) => (
        <TarjetaLibro
          key={libro.id}
          libro={libro}
          alCambiarEstado={alCambiarEstado}
          alEliminar={alEliminar}
        />
      ))}

    </div>
  );
}


/*
=========================================================
6. VALORES INICIALES DEL FORMULARIO
=========================================================

Este objeto define cómo comienza el formulario.

El estado inicial es Pendiente y los demás campos
comienzan vacíos.

Importante:
Los valores internos Pendiente, Leyendo y Leído deben
coincidir con los definidos en libros.js.
*/

const FORMULARIO_INICIAL = {
  titulo: '',
  autor: '',
  miembro: '',
  estado: 'Pendiente'
};


/*
=========================================================
7. COMPONENTE FORMULARIO PROPUESTA
=========================================================

Es un formulario controlado.

Esto significa que React administra los valores de
los campos mediante useState.

Utilizamos tres estados:
- datos: valores escritos por el usuario.
- errores: mensajes de validación.
- enviado: indica si la propuesta se agregó.

Para la exposición:
"El formulario es controlado porque cada campo utiliza
value y onChange para sincronizarse con el estado".
*/

function FormularioPropuesta({
  libros,
  alAgregar
}) {

  // estado de los valores del formulario.
  const [datos, setDatos] = useState({
    ...FORMULARIO_INICIAL
  });

  // estado de los errores de validación.
  const [errores, setErrores] = useState({});

  // controla el mensaje de envío exitoso.
  const [enviado, setEnviado] = useState(false);


  /*
  -------------------------------------------------------
  7.1. ACTUALIZAR CAMPOS
  -------------------------------------------------------

  Se ejecuta cada vez que el usuario escribe o selecciona
  un valor.

  Usamos el atributo name para saber qué campo cambió.

  La expresión ...actuales copia los datos anteriores.
  [name]: value actualiza solamente el campo modificado.

  Esto evita modificar directamente el estado.
  */

  function actualizarCampo(evento) {
    const { name, value } = evento.target;

    setDatos((actuales) => ({
      ...actuales,
      [name]: value
    }));

    // limpiamos el error del campo que se está corrigiendo.
    setErrores((actuales) => ({
      ...actuales,
      [name]: ''
    }));

    // ocultamos el mensaje de éxito al editar nuevamente.
    setEnviado(false);
  }


  /*
  -------------------------------------------------------
  7.2. VALIDAR FORMULARIO
  -------------------------------------------------------

  Comprueba:
  - longitud del título.
  - longitud del nombre del autor.
  - miembro seleccionado.
  - estado válido.
  - libros duplicados.

  Devuelve un objeto con los errores encontrados.

  Si el objeto está vacío, el formulario es válido.
  */

  function validarFormulario() {
    const nuevosErrores = {};

    // trim elimina espacios al principio y al final.
    const titulo = datos.titulo.trim();
    const autor = datos.autor.trim();

    // validación del título.
    if (titulo.length < 3) {
      nuevosErrores.titulo =
        'Escribe un título de al menos 3 caracteres.';
    } else if (titulo.length > 120) {
      nuevosErrores.titulo =
        'El título no puede superar 120 caracteres.';
    }

    // validación del autor.
    if (autor.length < 2) {
      nuevosErrores.autor =
        'Escribe un autor de al menos 2 caracteres.';
    } else if (autor.length > 100) {
      nuevosErrores.autor =
        'El nombre no puede superar 100 caracteres.';
    }

    // verificamos que el miembro exista en la lista.
    if (!MIEMBROS.includes(datos.miembro)) {
      nuevosErrores.miembro =
        'Selecciona un miembro del club.';
    }

    // verificamos que el estado sea válido.
    if (!ESTADOS.includes(datos.estado)) {
      nuevosErrores.estado =
        'Selecciona un estado válido.';
    }

    /*
    some devuelve true si encuentra un libro
    con el mismo título.

    toLocaleLowerCase permite comparar sin distinguir
    entre letras mayúsculas y minúsculas.
    */
    const duplicado = libros.some(
      (libro) =>
        libro.titulo.trim().toLocaleLowerCase() ===
        titulo.toLocaleLowerCase()
    );

    if (titulo && duplicado) {
      nuevosErrores.titulo =
        'Este libro ya está registrado en el tablero.';
    }

    return nuevosErrores;
  }


  /*
  -------------------------------------------------------
  7.3. ENVIAR FORMULARIO
  -------------------------------------------------------

  preventDefault evita recargar la página.

  Primero validamos los datos.
  Si existen errores, detenemos el proceso.

  Si todo está correcto, enviamos los datos al componente
  principal mediante la función alAgregar.

  Finalmente, limpiamos el formulario y mostramos
  un mensaje de confirmación.
  */

  function manejarEnvio(evento) {
    evento.preventDefault();

    const nuevosErrores = validarFormulario();

    // guardamos los errores para mostrarlos en pantalla.
    setErrores(nuevosErrores);

    // si hay errores, no agregamos el libro.
    if (Object.keys(nuevosErrores).length > 0) {
      setEnviado(false);
      return;
    }

    // enviamos los datos válidos al componente App.
    alAgregar({
      titulo: datos.titulo.trim(),
      autor: datos.autor.trim(),
      miembro: datos.miembro,
      estado: datos.estado
    });

    // restauramos el formulario.
    setDatos({ ...FORMULARIO_INICIAL });

    // eliminamos los errores anteriores.
    setErrores({});

    // activamos el mensaje de éxito.
    setEnviado(true);
  }


  /*
  -------------------------------------------------------
  7.4. INTERFAZ DEL FORMULARIO
  -------------------------------------------------------

  Cada campo utiliza:
  - value: valor actual almacenado en React.
  - onChange: función que actualiza ese valor.
  - aria-invalid: indica si el campo tiene errores.

  Los mensajes de error se muestran condicionalmente.
  */

  return (
    <form
      className="formulario-propuesta"
      onSubmit={manejarEnvio}
      noValidate
    >

      <div className="formulario-grid">

        {/* campo del título */}
        <div className="campo">
          <label htmlFor="nuevo-titulo">
            Título del libro
          </label>

          <input
            id="nuevo-titulo"
            name="titulo"
            type="text"
            value={datos.titulo}
            onChange={actualizarCampo}
            maxLength={120}
            placeholder="Escribe el título"
            aria-invalid={Boolean(errores.titulo)}
          />

          {errores.titulo && (
            <small className="error-campo">
              {errores.titulo}
            </small>
          )}
        </div>

        {/* campo del autor */}
        <div className="campo">
          <label htmlFor="nuevo-autor">
            Autor o autora
          </label>

          <input
            id="nuevo-autor"
            name="autor"
            type="text"
            value={datos.autor}
            onChange={actualizarCampo}
            maxLength={100}
            placeholder="Nombre del autor"
            aria-invalid={Boolean(errores.autor)}
          />

          {errores.autor && (
            <small className="error-campo">
              {errores.autor}
            </small>
          )}
        </div>

        {/* selección del miembro */}
        <div className="campo">
          <label htmlFor="nuevo-miembro">
            Miembro que propone
          </label>

          <select
            id="nuevo-miembro"
            name="miembro"
            value={datos.miembro}
            onChange={actualizarCampo}
            aria-invalid={Boolean(errores.miembro)}
          >
            <option value="">
              Selecciona un miembro
            </option>

            {MIEMBROS.map((miembro) => (
              <option key={miembro} value={miembro}>
                {miembro}
              </option>
            ))}
          </select>

          {errores.miembro && (
            <small className="error-campo">
              {errores.miembro}
            </small>
          )}
        </div>

        {/* selección del estado inicial */}
        <div className="campo">
          <label htmlFor="nuevo-estado">
            Estado inicial
          </label>

          <select
            id="nuevo-estado"
            name="estado"
            value={datos.estado}
            onChange={actualizarCampo}
            aria-invalid={Boolean(errores.estado)}
          >
            {ESTADOS.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>

          {errores.estado && (
            <small className="error-campo">
              {errores.estado}
            </small>
          )}
        </div>

      </div>

      {/* botón para procesar el formulario */}
      <div className="formulario-pie">
        <button
          type="submit"
          className="boton-principal"
        >
          Agregar propuesta
        </button>

        <span className="nota-formulario">
          Los cambios permanecen mientras la aplicación
          está abierta.
        </span>
      </div>

      {/* mensaje visible únicamente después de agregar */}
      {enviado && (
        <p className="mensaje-exito" role="status">
          ¡La propuesta se agregó correctamente!
        </p>
      )}

    </form>
  );
}


/*
=========================================================
8. COMPONENTE PRINCIPAL APP
=========================================================

App es el componente principal de la aplicación.

Aquí administramos el estado compartido.

Utilizamos useState para almacenar:
- libros: lista actual de lecturas.
- filtroEstado: estado seleccionado.
- filtroMiembro: miembro seleccionado.

Los componentes secundarios reciben información y
funciones desde App mediante props.

Para la exposición:
"App es la fuente principal de información. Cuando
cambia el estado, React actualiza los componentes
que dependen de esos datos".
*/

export default function App() {

  /*
  -------------------------------------------------------
  8.1. ESTADO PRINCIPAL
  -------------------------------------------------------

  LIBROS_INICIALES se importa desde libros.js.

  useState devuelve:
  - el valor actual.
  - una función para actualizarlo.
  */

  const [libros, setLibros] = useState(
    LIBROS_INICIALES
  );

  const [filtroEstado, setFiltroEstado] = useState(
    'Todos'
  );

  const [filtroMiembro, setFiltroMiembro] = useState(
    'Todos'
  );


  /*
  -------------------------------------------------------
  8.2. FILTRAR LIBROS
  -------------------------------------------------------

  filter crea un nuevo arreglo con los libros que
  cumplen las condiciones seleccionadas.

  Si el filtro es Todos, no restringimos ese criterio.

  Los dos filtros se combinan con &&:
  el libro debe cumplir ambas condiciones.

  No guardamos librosFiltrados en otro useState porque
  podemos calcularlo directamente.
  */

  const librosFiltrados = libros.filter((libro) => {

    const coincideEstado =
      filtroEstado === 'Todos' ||
      libro.estado === filtroEstado;

    const coincideMiembro =
      filtroMiembro === 'Todos' ||
      libro.miembro === filtroMiembro;

    return coincideEstado && coincideMiembro;
  });


  /*
  -------------------------------------------------------
  8.3. CAMBIAR ESTADO DE LECTURA
  -------------------------------------------------------

  Esta función cambia el estado de un libro.

  Los estados siguen un ciclo:
  Pendiente -> Leyendo -> Leído -> Pendiente.

  map crea un nuevo arreglo.

  Cuando encontramos el libro solicitado, creamos
  un nuevo objeto con el estado actualizado.

  No modificamos directamente el arreglo original.

  Para la exposición:
  "Utilicé una actualización inmutable para que React
  detecte el cambio y vuelva a renderizar la interfaz".
  */

  function cambiarEstadoLibro(id) {
    setLibros((actuales) =>
      actuales.map((libro) => {

        // los demás libros permanecen iguales.
        if (libro.id !== id) {
          return libro;
        }

        // encontramos la posición del estado actual.
        const indice = ESTADOS.indexOf(libro.estado);

        // calculamos el siguiente estado del ciclo.
        const siguienteEstado =
          ESTADOS[(indice + 1) % ESTADOS.length];

        // devolvemos un nuevo objeto actualizado.
        return {
          ...libro,
          estado: siguienteEstado
        };
      })
    );
  }


  /*
  -------------------------------------------------------
  8.4. ELIMINAR LIBRO
  -------------------------------------------------------

  filter genera un arreglo sin el libro seleccionado.

  No utilizamos splice porque modificaría directamente
  el arreglo existente.

  Para la exposición:
  "La eliminación se realiza de manera inmutable".
  */

  function eliminarLibro(id) {
    setLibros((actuales) =>
      actuales.filter((libro) => libro.id !== id)
    );
  }


  /*
  -------------------------------------------------------
  8.5. AGREGAR LIBRO
  -------------------------------------------------------

  Recibe los datos enviados desde el formulario.

  crypto.randomUUID genera un identificador único
  para cada propuesta nueva.

  El operador ...actuales conserva los libros existentes
  y agrega el nuevo objeto al final.

  No modificamos directamente el arreglo original.
  */

  function agregarLibro(datos) {
    setLibros((actuales) => [
      ...actuales,
      {
        id: crypto.randomUUID(),
        ...datos
      }
    ]);
  }


  /*
  -------------------------------------------------------
  8.6. INTERFAZ PRINCIPAL
  -------------------------------------------------------

  Aquí conectamos todos los componentes.

  Resumen recibe la lista completa de libros.

  Filtros recibe los valores actuales y las funciones
  que permiten modificarlos.

  ListaLibros recibe únicamente los libros filtrados.

  FormularioPropuesta recibe la función agregarLibro.

  Así mantenemos una sola fuente de información
  y todos los componentes permanecen sincronizados.
  */

  return (
    <div className="aplicacion">

      {/* encabezado principal */}
      <header className="encabezado">
        <div className="contenedor">
          <a className="marca" href="#inicio">
            Pura Lectura
          </a>

          <span>Tablero del club</span>
        </div>
      </header>


      <main className="contenedor" id="inicio">

        {/* presentación del proyecto */}
        <section className="hero-tablero">

          <p className="sobre-titulo">
            Comunidad lectora · Costa Rica
          </p>

          <h1>
            Nuestras historias,
            <br />
            nuestro club.
          </h1>

          <p>
            Organiza las lecturas propuestas por los miembros
            y acompaña el progreso de cada libro.
          </p>

          <a className="enlace-hero" href="#proponer">
            Proponer una lectura
          </a>

        </section>


        {/* estadísticas generales del club */}
        <Panel
          titulo="Resumen del club"
          descripcion="Una mirada al progreso de nuestras lecturas."
        >
          <Resumen libros={libros} />
        </Panel>


        {/* filtros y listado de libros */}
        <Panel
          titulo="Explorar lecturas"
          descripcion="Filtra los libros por miembro o estado de lectura."
        >

          <Filtros
            filtroEstado={filtroEstado}
            filtroMiembro={filtroMiembro}
            alCambiarEstado={setFiltroEstado}
            alCambiarMiembro={setFiltroMiembro}
          />

          {/* cantidad de resultados visibles */}
          <p className="contador-resultados">
            Mostrando {librosFiltrados.length} de{' '}
            {libros.length} libros
          </p>

          <ListaLibros
            libros={librosFiltrados}
            alCambiarEstado={cambiarEstadoLibro}
            alEliminar={eliminarLibro}
          />

        </Panel>


        {/* formulario de nuevas propuestas */}
        <div id="proponer">
          <Panel
            titulo="Proponer una lectura"
            descripcion="Comparte una nueva historia con nuestra comunidad."
          >
            <FormularioPropuesta
              libros={libros}
              alAgregar={agregarLibro}
            />
          </Panel>
        </div>

      </main>


      {/* pie de página */}
      <footer className="pie-pagina">
        Pura Lectura · Un espacio para compartir historias
      </footer>

    </div>
  );
}
