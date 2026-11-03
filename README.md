# Pura Lectura — Tarea 2: Estantería Común

Proyecto académico de desarrollo web que implementa un club de lectura mediante dos aplicaciones: una con JavaScript y manipulación directa del DOM, y otra con React y manejo declarativo del estado.

## Requisitos

- Node.js y npm.
- Navegador web moderno.
- Visual Studio Code (recomendado).

## Parte A — Buscador JavaScript

Aplicación que permite buscar libros en Open Library, consultar sus detalles, administrar una lista de lecturas en memoria y enviar propuestas mediante un formulario.

### Funcionalidades

- Búsqueda asíncrona de libros utilizando `fetch`.
- Visualización dinámica de resultados y detalles en un modal.
- Lista de lecturas con estados: Pendiente, Leyendo y Leído.
- Prevención de libros duplicados.
- Cambio de estado y eliminación con transiciones.
- Formulario de propuestas con autores dinámicos y validación.
- Envío de prueba a JSONPlaceholder.
- Diseño adaptable con Bootstrap y Sass.

### Instalación y ejecución

Desde la carpeta principal del repositorio:

```bash
cd buscador-js
npm install
npm run build:css
npm run dev
```

Abrir la dirección local que indique Vite.

Para recompilar Sass durante el desarrollo:

```bash
npm run watch:css
```

### Organización del código

- `js/api.js`: solicitudes a Open Library y JSONPlaceholder.
- `js/estado.js`: administración de la lista de lecturas.
- `js/render.js`: construcción y actualización del DOM.
- `js/formulario.js`: validación y gestión del formulario.
- `js/main.js`: eventos y coordinación de módulos.
- `scss/`: estilos personalizados, variables, mixins y componentes.

## Parte B — Tablero React

Aplicación construida con React y Vite para administrar las lecturas de un club utilizando datos locales.

### Funcionalidades

- Visualización de seis libros iniciales.
- Filtros por estado de lectura y miembro del club.
- Resumen dinámico de libros por estado.
- Cambio de estado y eliminación de libros.
- Formulario controlado para proponer lecturas.
- Validación de campos y mensajes de error.
- Componentes reutilizables mediante props y `children`.
- Administración del estado mediante `useState`.
- Actualizaciones inmutables y renderizado declarativo.
- Diseño adaptable a escritorio y dispositivos móviles.

### Instalación y ejecución

Desde la carpeta principal del repositorio:

```bash
cd tablero-react
npm install
npm run dev
```

Abrir la dirección local que indique Vite.

### Compilación de producción

```bash
npm run build
npm run preview
```

### Organización del código

- `src/App.jsx`: componentes, estado, filtros, formularios y eventos.
- `src/data/libros.js`: datos iniciales y constantes.
- `src/App.css`: estilos de los componentes.
- `src/index.css`: estilos generales.
- `src/main.jsx`: punto de entrada de React.

## Del DOM manual a React

En la parte A, JavaScript administra directamente los elementos de la interfaz. Por ejemplo, `main.js` escucha los clics delegados de la tabla y llama a `cambiarEstado()` en `estado.js`. Después, `animarCambio()` en `render.js` modifica manualmente el contenido de la fila y aplica una clase CSS para mostrar la transición.

En la parte B, React administra los libros mediante `useState`. Cuando se ejecuta `cambiarEstadoLibro(id)`, se utiliza `map()` para crear un nuevo arreglo y el operador de propagación para actualizar el libro correspondiente sin modificar el objeto original. React detecta el cambio de estado y vuelve a renderizar la interfaz.

Los filtros y el resumen se calculan a partir del estado compartido en el componente principal, lo que mantiene sincronizados los componentes sin manipular manualmente el DOM.

La diferencia fundamental es que, en JavaScript tradicional, el desarrollador controla directamente las actualizaciones visuales, mientras que en React describe cómo debe verse la interfaz según el estado actual.

## Depuración y rendimiento

Las pruebas se documentan en `docs/depuracion.md`.

Se incluyen capturas de Chrome DevTools en `docs/capturas/`, correspondientes a:

- Punto de interrupción en la función de cambio de estado de React.
- Medición de solicitudes en el servidor de desarrollo.
- Medición de solicitudes en la compilación de producción.
- Detalle de los recursos descargados.

## Repositorio

https://github.com/tati-ui/Tarea-2

Etiqueta de entrega: `tarea-2`.