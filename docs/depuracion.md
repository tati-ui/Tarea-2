# depuración y rendimiento — parte a

> completar con mediciones y capturas reales al ejecutar la aplicación. no se han inventado resultados.

## error real encontrado

- descripción del error: pendiente de documentar durante la prueba.
- reproducción y ubicación del punto de interrupción: pendiente.
- variables observadas y causa: pendiente.
- corrección y evidencia: pendiente.
- captura: guardar en `docs/capturas/`.

## panel network

1. abrir herramientas del desarrollador (f12) y pestaña network.
2. activar disable cache y recargar la página.
3. registrar número de peticiones y total transferido.
4. realizar una búsqueda y registrar por separado la petición `search.json` y las portadas.

| medición | antes | después |
|---|---|---|
| peticiones | pendiente | pendiente |
| transferencia total | pendiente | pendiente |

## optimización aplicada

la interfaz utiliza portadas de tamaño `-M.jpg` en vez de imágenes de resolución mayor, y carga las imágenes con `loading="lazy"`. para demostrar su efecto, medir una versión sin carga diferida y otra con carga diferida, en condiciones comparables, y adjuntar capturas de network.
