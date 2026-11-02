# estantería común — tarea 2

## parte a — buscador javascript

aplicación de búsqueda en open library, lista de lecturas en memoria y formulario de propuesta con envío de prueba.

### ejecución

```bash
cd buscador-js
npm install
npm run build:css
npm run dev
```

abrir la dirección local indicada por vite. para modificar sass en tiempo real, ejecutar `npm run watch:css` en otra terminal.

### estructura

- `js/api.js`: comunicación asincrónica con open library y jsonplaceholder.
- `js/estado.js`: lista de lecturas y cambios de estado.
- `js/render.js`: creación y actualización manual de elementos del dom.
- `js/formulario.js`: autores dinámicos, validación y envío.
- `js/main.js`: eventos y coordinación de módulos.
- `scss/`: variables, mixins, función, componentes y compilación bootstrap.

## parte b — react

pendiente de desarrollo.

## del dom manual a react

pendiente hasta implementar la parte b. en la parte a, `js/main.js` recibe el clic delegado de la tabla y llama a `cambiarEstado()` de `js/estado.js`; después `animarCambio()` en `js/render.js` actualiza manualmente el texto de la celda y aplica la clase css para la transición. en react, esta sincronización se resolverá mediante estado y renderizado declarativo.
