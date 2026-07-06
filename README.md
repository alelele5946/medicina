# Anatomy Viewer — Estudiantes Medicina

Visor 3D interactivo de anatomía (cabeza/cráneo) pensado como herramienta de estudio para estudiantes de medicina, construido con [Three.js](https://threejs.org/).

## Features

- Visor 3D del modelo anatómico (GLB comprimido con Draco, ~2.4 MB) con controles de cámara orbitales.
- Selección de partes anatómicas mediante click (raycaster) o navegando con la tecla `e`.
- Panel de partes intersectadas al hacer click, con acceso directo a cada una.
- Menú lateral con búsqueda de partes indexada por letra inicial.
- Control deslizante de opacidad para aislar visualmente partes seleccionadas.
- Vistas de cámara predefinidas (axis / arriba / frontal / abajo).
- Modo drag & drop para mover partes en el espacio 3D.
- Lección guiada "Class1": ejercicio interactivo de colocar los incisivos inferiores en su posición correcta, con feedback de proximidad en tiempo real (correcto / cerca / incorrecto).

## Stack técnico

- [Three.js](https://threejs.org/) — motor de renderizado 3D (WebGL).
- [Vite](https://vitejs.dev/) — dev server y build de producción.
- [@tweenjs/tween.js](https://github.com/tweenjs/tween.js) — animaciones de cámara.
- Modelo en glTF binario (GLB) con compresión [Draco](https://google.github.io/draco/) — los decoders viven en `public/draco/`.
- JavaScript vanilla (ES modules), sin framework de UI.

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior.
- npm (incluido con Node.js).

## Instalación

```bash
git clone https://github.com/alelele5946/medicina.git
cd medicina
npm install
```

## Scripts disponibles

| Comando           | Descripción                                              |
|-------------------|-----------------------------------------------------------|
| `npm run dev`     | Levanta el servidor de desarrollo de Vite con hot reload.  |
| `npm run build`   | Genera el build de producción en `dist/`.                  |
| `npm run preview` | Sirve localmente el build de producción para verificarlo.  |

## Estructura del proyecto

```
├── index.html                  # entry HTML (Vite)
├── vite.config.js
├── public/
│   ├── draco/                  # decoders de Draco para GLTFLoader
│   └── models/                 # modelos 3D (GLB + Draco), servidos como assets estáticos
└── src/
    ├── main.js                 # composition root: wiring de toda la app
    ├── config/
    │   ├── constants.js         # presets de cámara, colores, luces, datos de lecciones
    │   └── strings.js           # textos en español mostrados al usuario
    ├── core/                   # setup de escena/cámara/renderer y el loop de animación
    ├── loaders/                # carga del modelo FBX
    ├── controls/                # OrbitControls / DragControls y su coordinación
    ├── interaction/              # selección de partes por raycaster
    ├── ui/                       # componentes de interfaz (menús, sliders, paneles, loader)
    ├── lessons/                  # lecciones guiadas (Class1)
    ├── utils/                    # utilidades puras (materiales, animación de cámara)
    ├── state/
    │   └── appState.js          # estado central mutable de la aplicación
    └── styles/                  # CSS organizado por capas (base, layout, components, responsive)
```

**Convención de idioma:** el código (variables, funciones, nombres de archivo) está en inglés. Los textos visibles al usuario (mensajes, instrucciones) están centralizados en `src/config/strings.js` y permanecen en español.

**Manejo de estado:** toda la lógica de estado mutable de la aplicación (parte seleccionada, si el raycaster está activo, progreso de la lección, etc.) vive en un único objeto plano exportado desde `src/state/appState.js`. No se usa ninguna librería de estado — es intencional dado el tamaño de la app.

## Cómo añadir una nueva lección o parte anatómica

1. **Nueva lección guiada:** crea un archivo en `src/lessons/` siguiendo el patrón de `class1.js` (una función `setupLessonName()` que registra sus propios listeners). Añade los nombres de partes y posiciones objetivo a `src/config/constants.js`, y los textos instructivos a `src/config/strings.js`. Registra su botón en `index.html` y llama a la función de setup desde `src/main.js`.
2. **Nuevo modelo 3D:** el visor carga GLB con compresión Draco. Si partes de un FBX, conviértelo preservando los nombres de las partes (¡no uses `optimize`/`join`, fusionaría los meshes y rompería la selección por nombre!):

   ```bash
   npx fbx2gltf --binary --input modelo.fbx --output modelo.glb
   npx @gltf-transform/cli draco modelo.glb modelo.draco.glb
   ```

   Coloca el resultado en `public/models/` y actualiza `ANATOMY_MODEL_URL` en `src/config/constants.js`. Nota: los meshes multi-material de glTF se cargan como Groups con un mesh por material; el código ya trata el nodo con nombre como "parte anatómica" (ver `src/loaders/loadAnatomyModel.js` y `src/utils/parts.js`).

## Despliegue a GitHub Pages

El proyecto está configurado con `base: '/medicina/'` en `vite.config.js`, correspondiente al repositorio `alelele5946/medicina`. Para desplegar:

```bash
npm run build
```

Esto genera el sitio estático en `dist/`, listo para publicarse en la rama/rama de Pages configurada (por ejemplo mediante `gh-pages` o una GitHub Action que suba `dist/`). La URL resultante sería `https://alelele5946.github.io/medicina/`.

## Known Issues (historial de inconsistencias resueltas)

Durante la refactorización inicial se preservó el comportamiento existente sin corregirlo. En una pasada posterior se analizaron y resolvieron las inconsistencias detectadas:

- **Vista frontal con dos puntos de mira distintos (resuelto):** el `lookAt(0, -6, -1)` del botón "front" era código muerto — la llamada inmediata a `orbitControls.update()` reorienta la cámara hacia su target `(0, 0, 0)`, así que ambas "vistas frontales" ya eran idénticas en la práctica. Se unificó todo en un único preset (`CAMERA_VIEWS.FRONT`) sin cambio visual.
- **Offset vertical -45 en las copias de la lección (resuelto):** no era un bug sino una compensación encubierta: las posiciones de primera entrada `(20, 30/35, 6)` menos el `translateY(-45)` daban exactamente las posiciones que la reentrada usaba directamente. Se sustituyó por posiciones explícitas únicas (`CLASS1_STAGING_POSITIONS`) y se eliminó la compensación.
- **Atajo Ctrl impredecible (resuelto):** el toggle de modo drag reaccionaba a *cualquier* tecla pulsada con Ctrl presionado (p. ej. Ctrl+C) y a los eventos repetidos de mantener la tecla, alternando el estado varias veces. Ahora solo reacciona a la propia tecla Control e ignora repeticiones: mantener Ctrl activa el modo drag, soltarla vuelve al modo órbita.
- **Loader circular decorativo (resuelto):** las barras de progreso tenían animaciones CSS con temporizador fijo (4s + 4s) que sobrescribían el progreso real calculado en JS. Se eliminaron; ahora las barras reflejan el porcentaje de descarga real del modelo.
- **Menú hamburguesa duplicado (resuelto):** el proyecto original tenía dos mecanismos de menú móvil superpuestos (uno basado en checkbox con el buscador de partes, otro basado en clases JS). Se conservó únicamente el menú lateral por checkbox y se eliminó el otro mecanismo, por ser el más completo y el que coincide con el historial de commits del proyecto.
- **CSS y funcionalidad muerta eliminados:** se quitaron reglas CSS sin ningún HTML correspondiente (`.side-menu`, `#loader`/`#progressContainer`/`#progressBar`/`#progressText`, la animación `.dot`), y código JS sin uso (helpers de etiquetas CSS2D nunca instanciados, un `SpotLightHelper` no añadido a la escena, arrays sin poblar).

## Licencia

No definida todavía.
