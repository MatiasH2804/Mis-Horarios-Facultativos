# Horarios Académicos 2026

## Descripción general

Horarios Académicos 2026 es una app web local para gestionar horarios académicos semanales. Permite cargar, editar y visualizar una grilla de cursado desde el navegador, con materias, tipos de clase, aulas, colores y contactos docentes.

La app está pensada como una herramienta simple y rápida para uso personal o académico. No requiere servidor, instalación ni conexión a internet: alcanza con abrir `index.html` en el navegador.

Los datos se guardan localmente mediante `localStorage`, por lo que los cambios quedan disponibles al recargar la página en el mismo navegador.

## Regla principal del proyecto

Esta app no debe rehacerse desde cero ante cada cambio. La estructura actual funciona y debe conservarse.

Los cambios futuros deben ser quirúrgicos: modificar sólo los archivos y las partes necesarias para cumplir el objetivo puntual, evitando refactors grandes, rediseños completos o cambios de modelo de datos sin necesidad real.

Reglas técnicas principales:

- No agregar frameworks.
- No agregar dependencias externas.
- No agregar backend.
- No usar Bootstrap, React, Tailwind ni librerías similares.
- Mantener la app como HTML + CSS + JavaScript vanilla.
- Mantener `localStorage` como persistencia principal.
- Mantener la tabla editable y el modelo de datos actual salvo que se pida explícitamente lo contrario.
- Mantener el modo claro/oscuro existente salvo pedidos específicos.
- Mantener la impresión/PDF mediante CSS print y `window.print()`.
- Priorizar cambios pequeños, legibles y fáciles de revisar.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript vanilla
- localStorage
- CSS print para impresión/PDF desde navegador

## Archivos principales

### index.html

Define la estructura general de la app:

- Header principal con título, modo claro/oscuro e impresión/PDF.
- Tabla semanal de horarios.
- Panel lateral para editar celdas y cargar bloques horarios.
- Catálogo de materias.
- Catálogo de docentes/contactos.
- Opciones avanzadas.

Este archivo contiene la estructura semántica y los controles visibles, pero la mayoría del contenido dinámico se completa desde `app.js`.

### styles.css

Define la presentación visual de la app:

- Paleta visual.
- Modo claro.
- Modo oscuro.
- Diseño brutalista controlado.
- Tabla semanal.
- Panel lateral.
- Catálogos editables.
- Estados responsive.
- Estilos de impresión horizontal.

También contiene el bloque `@media print`, que adapta la app para impresión/PDF sin modificar la lógica JavaScript.

### app.js

Contiene la lógica principal:

- Modelo de datos inicial.
- Migración simple desde versiones anteriores.
- Renderizado dinámico del horario.
- Renderizado de materias y docentes.
- Edición de celdas.
- Carga de bloques horarios.
- Gestión de materias.
- Gestión de contactos docentes.
- Guardado y lectura desde `localStorage`.
- Persistencia del modo claro/oscuro.

## Historial de cambios realizados

### Cambio 1 — Creación de la tabla editable de horarios

- Se creó una tabla semanal con días de lunes a viernes.
- Se cargaron franjas horarias desde `8:00-9:00` hasta `20:00-21:00`.
- Se agregó una estructura de grilla tipo planilla académica.
- Se agregó edición de celdas.
- Se agregó guardado local para conservar los cambios en el navegador.

### Cambio 2 — Carga inicial basada en captura

- Se precargó el horario de ejemplo del primer cuatrimestre 2026.
- Se cargaron materias iniciales relacionadas con Matemática Básica, Álgebra y CDD1.
- Se cargaron docentes/mails iniciales.
- Se respetó la estructura visual de horario por hora.
- Se cuidó que los rangos horarios se vieran en una sola línea.

### Cambio 3 — Paleta visual y estilo brutalista

- Se aplicó un estilo visual con bordes fuertes, sombras y botones marcados.
- Luego se ajustó la paleta hacia rojo, azul, blanco y negro.
- Se eliminó la estética amarilla inicial como color dominante.
- Se eliminó el header dinámico/animado para dejarlo fijo y estable.
- Se priorizó un brutalismo más ordenado y usable.

### Cambio 4 — Modo claro y modo oscuro

- Se agregó alternancia entre modo claro y modo oscuro.
- El tema elegido se guarda en `localStorage`.
- Al recargar la página, la app conserva el tema seleccionado.
- Se ajustó el modo oscuro para hacerlo más sobrio y menos agresivo visualmente.
- Se evitó que el modo oscuro afecte negativamente la impresión/PDF.

### Cambio 5 — Modelo correcto de materias y tipo de clase

- Se corrigió el error conceptual de tratar “Teoría” y “Práctica” como materias distintas.
- Se separó la materia del tipo de clase.
- La materia representa una asignatura real.
- El tipo de clase representa cómo se dicta esa materia en una celda o bloque horario.

La celda del horario pasó a guardar:

- `materiaId`
- `tipoClase`
- `aula`

Las materias pasaron a tener:

- `id`
- `nombre`
- `aulaDefault`
- `color`

### Cambio 6 — Tipos de clase

Se agregó un enum/lista de tipos de clase:

- Teoría
- Práctica
- Teórico-Práctica
- Coloquio
- Consulta
- Laboratorio
- Parcial
- Otro

También se agregaron badges visuales para mostrar el tipo de clase dentro de cada celda ocupada.

### Cambio 7 — Editor de celda

Al hacer clic en una celda del horario se puede editar:

- materia
- tipo de clase
- aula específica

Si el campo de aula específica queda vacío, la app muestra automáticamente el aula predeterminada de la materia.

El editor permite:

- guardar cambios
- limpiar la celda
- cambiar materia
- cambiar tipo de clase
- sobreescribir el aula sólo para esa celda

### Cambio 8 — Carga de bloques horarios

Se agregó una herramienta para cargar varias horas seguidas.

Permite elegir:

- materia
- tipo de clase
- día
- desde
- hasta
- aula específica opcional

Al cargar un bloque, la app completa automáticamente todas las celdas incluidas en el rango horario elegido.

### Cambio 9 — Catálogo de materias

Se agregó una tabla editable de materias.

Cada materia tiene:

- nombre
- aula predeterminada
- color

Se puede:

- agregar materias
- editar el nombre
- editar el aula predeterminada
- cambiar el color
- borrar materias

Cuando se cambia el aula predeterminada de una materia, las celdas que no tengan aula específica muestran automáticamente el nuevo valor.

### Cambio 10 — Catálogo de docentes y mails

Se agregó una tabla editable de contactos docentes.

Permite guardar:

- mails
- aulas
- detalles o comentarios

Se puede:

- agregar contactos
- editar contactos
- borrar contactos

### Cambio 11 — Reorganización de botones y formularios

- Se movió “+ Materia” junto al catálogo de materias.
- Se movió “+ Contacto” junto al catálogo de docentes.
- Se eliminó la toolbar superior innecesaria.
- Se reorganizó el panel lateral para distinguir mejor:
  - edición de celda
  - carga de bloque horario

El objetivo fue que el usuario entienda mejor qué controles pertenecen al catálogo y cuáles afectan directamente al horario.

### Cambio 12 — Impresión / PDF horizontal

- Se mejoró el botón Imprimir / PDF.
- La impresión usa `window.print()`.
- Se configuró CSS de impresión con:
  - A4 horizontal
  - márgenes reducidos
  - tabla adaptada al ancho de hoja
  - ocultamiento de formularios y botones
  - conservación de colores de materias
  - fondo claro aunque la app esté en modo oscuro
  - eliminación de sombras y fondos decorativos

La app no genera un PDF por código. Abre el diálogo de impresión del navegador y desde ahí el usuario puede elegir “Guardar como PDF”.

## Modelo de datos actual

### Materia

Cada materia representa una asignatura real. No debe confundirse con el tipo de clase.

Ejemplo conceptual:

- `Mate Básica` es la materia.
- `Teoría` o `Práctica` son tipos de clase.

Estructura:

```js
{
  id: "mate-basica",
  nombre: "Mate Básica",
  aulaDefault: "Aula 9",
  color: "#6aa58a"
}
```

Campos:

- `id`: identificador interno estable de la materia.
- `nombre`: nombre visible de la asignatura.
- `aulaDefault`: aula predeterminada que se usa cuando una celda no tiene aula específica.
- `color`: color visual usado para pintar las celdas de esa materia.

Notas importantes:

- No crear materias separadas para “Teoría” y “Práctica”.
- El color pertenece a la materia, no al tipo de clase.
- El aula predeterminada pertenece a la materia.
- Una celda puede sobreescribir el aula predeterminada usando el campo `aula`.

### Celda de horario

Cada celda representa una materia ubicada en un día y rango horario específico.

Estructura:

```js
{
  materiaId: "mate-basica",
  tipoClase: "Práctica",
  aula: "Aula 9"
}
```

Campos:

- `materiaId`: referencia al `id` de una materia existente.
- `tipoClase`: clasificación de la clase en esa celda.
- `aula`: aula específica para esa celda.

Regla de aula:

- Si `aula` tiene valor, se muestra ese valor.
- Si `aula` está vacío, se muestra `aulaDefault` de la materia.
- Esto permite cambiar el aula predeterminada de una materia y que las celdas sin aula específica se actualicen visualmente.

### Horario

El horario se guarda como un objeto indexado por clave de celda.

La clave combina hora y día:

```js
"14:00-15:00__Lunes"
```

Ejemplo:

```js
{
  "14:00-15:00__Lunes": {
    materiaId: "mate-basica",
    tipoClase: "Teoría",
    aula: ""
  }
}
```

### Tipo de clase

Los tipos de clase salen de un único array global en `app.js`.

Tipos disponibles:

- Sin especificar
- Teoría
- Práctica
- Teórico-Práctica
- Coloquio
- Consulta
- Laboratorio
- Parcial
- Otro

Este array alimenta tanto el editor de celda como la herramienta de carga de bloques. No conviene duplicarlo.

### Docente/contacto

Los contactos docentes se guardan como filas editables.

Estructura conceptual:

```js
{
  id: "doc-1",
  contacto: "mail@dominio.com",
  detalle: "Aula 10"
}
```

Campos:

- `id`: identificador interno.
- `contacto`: mail o lista de mails.
- `detalle`: aula, comentario o información adicional.

## Persistencia

La app guarda los datos en `localStorage`, incluyendo:

- materias
- docentes/contactos
- horario
- tipo de clase por celda
- aula específica por celda
- tema claro/oscuro

La clave principal actual del estado es:

```js
horarios_facultad_2026_v3
```

También se contempló compatibilidad con datos previos de:

```js
horarios_facultad_2026_v2
```

El tema se guarda por separado para que la elección de modo claro/oscuro persista entre recargas.

## Funcionamiento de la edición

### Editar una celda

Flujo esperado:

1. El usuario hace clic en una celda de la tabla.
2. El panel lateral muestra el día y horario seleccionados.
3. El usuario elige materia, tipo de clase y aula específica.
4. Al guardar, se actualiza la celda en memoria y en `localStorage`.
5. Si se limpia la celda, se elimina esa entrada del horario.

### Cargar un bloque horario

Flujo esperado:

1. El usuario elige materia.
2. Elige tipo de clase.
3. Elige día.
4. Elige rango desde/hasta.
5. Opcionalmente define un aula específica.
6. La app completa todas las celdas del rango.
7. El resultado se guarda en `localStorage`.

## Funcionamiento visual

Cada celda ocupada muestra hasta tres datos:

- nombre de materia
- tipo de clase
- aula

Si no hay tipo de clase, no se muestra una línea vacía.

Si no hay aula específica, se usa el aula predeterminada de la materia.

Cada materia usa su color asignado. El texto se ajusta para mantener contraste legible según el color de fondo.

## Impresión / PDF

La impresión está resuelta mediante CSS print y `window.print()`.

Puntos importantes:

- El botón “Imprimir / PDF” llama a `window.print()`.
- El CSS define hoja A4 horizontal.
- Se ocultan botones, formularios, inputs, selects y paneles de edición.
- Se conserva la tabla de horarios.
- Se conservan los colores de materias.
- La impresión sale clara aunque la app esté en modo oscuro.
- No se debe agregar una librería de generación de PDF para este flujo.

## Funcionalidades actuales

- Tabla semanal editable.
- Carga inicial de ejemplo.
- Catálogo editable de materias.
- Catálogo editable de docentes/contactos.
- Tipos de clase por celda.
- Carga de bloques horarios.
- Aula predeterminada por materia.
- Aula específica por celda o bloque.
- Colores personalizados por materia.
- Modo claro y modo oscuro persistente.
- Impresión/PDF horizontal desde el navegador.
- Opciones avanzadas para restaurar el ejemplo inicial.

## Recomendaciones para futuras modificaciones

- Antes de cambiar código, identificar si el cambio corresponde a estructura (`index.html`), estilos (`styles.css`) o lógica (`app.js`).
- Evitar tocar los tres archivos si el cambio puede resolverse en uno solo.
- No cambiar `STORAGE_KEY` salvo que haya una modificación real del modelo de datos.
- Si se cambia el modelo de datos, agregar migración simple para no romper datos existentes.
- No duplicar arrays de enums.
- Reutilizar `opcionesMaterias()` para selects de materias.
- Reutilizar `opcionesTipos()` para selects de tipo de clase.
- Mantener la lógica de aula predeterminada: una celda con `aula` vacío debe mostrar `aulaDefault`.
- Mantener el botón de impresión como `window.print()`.
- Mantener los estilos de impresión separados en `@media print`.

## Notas de uso

Para usar la app, alcanza con abrir `index.html` en el navegador. No requiere servidor local ni instalación de dependencias.

Para generar un PDF, usar el botón “Imprimir / PDF” y elegir “Guardar como PDF” en el diálogo de impresión del navegador.
