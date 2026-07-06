# Anatomy Viewer — Estudiantes Medicina

Visor 3D interactivo de anatomía (cabeza/cráneo) pensado como herramienta de estudio para estudiantes de medicina, construido con [Three.js](https://threejs.org/).

## Features

- Visor 3D del modelo anatómico (formato FBX) con controles de cámara orbitales.
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
│   └── models/                 # modelos 3D (FBX), servidos como assets estáticos
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
2. **Nuevo modelo 3D:** coloca el archivo `.fbx` en `public/models/` y actualiza (o parametriza) la referencia en `src/loaders/loadAnatomyModel.js` / `src/config/constants.js`.

## Despliegue a GitHub Pages

El proyecto está configurado con `base: '/medicina/'` en `vite.config.js`, correspondiente al repositorio `alelele5946/medicina`. Para desplegar:

```bash
npm run build
```

Esto genera el sitio estático en `dist/`, listo para publicarse en la rama/rama de Pages configurada (por ejemplo mediante `gh-pages` o una GitHub Action que suba `dist/`). La URL resultante sería `https://alelele5946.github.io/medicina/`.

## Known Issues

Durante la refactorización se preservó intencionalmente el comportamiento existente en lugar de "corregirlo" silenciosamente. Quedan documentadas aquí las inconsistencias encontradas:

- **Vista frontal con dos puntos de mira distintos:** el botón "front" del menú Vistas usa `lookAt(0, -6, -1)`, mientras que el reseteo de cámara al salir de la lección Class1 usa `lookAt(0, 0, 0)` para lo que también se describe como vista frontal. Es probable que sea una deriva no intencionada; se preservaron ambos valores como constantes separadas (`CAMERA_VIEWS.FRONT` y `CLASS1_EXIT_LOOKAT` en `src/config/constants.js`).
- **Offset vertical distinto entre el modelo principal y las copias de la lección:** el modelo principal usa `translateY(-60)`, mientras que las piezas dentales clonadas para la lección Class1 usan `translateY(-45)`. Se mantienen como constantes separadas (`MODEL_TRANSLATE_Y` y `CLASS1_COPY_TRANSLATE_Y`).
- **Menú hamburguesa duplicado (ya resuelto):** el proyecto original tenía dos mecanismos de menú móvil superpuestos (uno basado en checkbox con el buscador de partes, otro basado en clases JS). Se conservó únicamente el menú lateral por checkbox y se eliminó el otro mecanismo, por ser el más completo y el que coincide con el historial de commits del proyecto.
- **CSS y funcionalidad muerta eliminados:** se quitaron reglas CSS sin ningún HTML correspondiente (`.side-menu`, `#loader`/`#progressContainer`/`#progressBar`/`#progressText`, la animación `.dot`), y código JS sin uso (helpers de etiquetas CSS2D nunca instanciados, un `SpotLightHelper` no añadido a la escena, arrays sin poblar).

## Licencia

No definida todavía.
