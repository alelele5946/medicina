import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { savePartOriginalMaterials } from '../utils/materials.js';
import { ANATOMY_MODEL_URL, MODEL_SCALE, MODEL_TRANSLATE_Y, MODEL_ROTATE_X } from '../config/constants.js';

// Loads the anatomy model (GLB with Draco compression), collects its meshes,
// and applies the model transform. Returns a promise resolving with
// { object, parts }. UI wiring (letter menu, opacity slider, loading spinner)
// is the caller's job.
export function loadAnatomyModel({ onProgress } = {}) {
  return new Promise((resolve, reject) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(`${import.meta.env.BASE_URL}draco/`);

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load(
      ANATOMY_MODEL_URL,
      (gltf) => {
        const object = gltf.scene;
        const parts = [];

        // Una "parte" es el nodo con nombre anatómico. GLTFLoader convierte
        // los meshes multi-material en un Group con un Mesh hijo por
        // primitiva (Mandible -> Mandible_1..N); el Group conserva el nombre
        // original, así que ese es el nodo que coleccionamos.
        object.traverse((child) => {
          const isMultiPrimitivePart =
            child.isGroup && child.children.length > 0 && child.children.every((c) => c.isMesh);
          if (child.isMesh || isMultiPrimitivePart) {
            if (child.parent && child.parent.isGroup && parts.includes(child.parent)) {
              return; // mesh hijo de una parte ya coleccionada
            }
            savePartOriginalMaterials(child);
            parts.push(child);
          }
        });

        object.scale.set(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE);
        object.translateY(MODEL_TRANSLATE_Y);
        object.rotateX(MODEL_ROTATE_X);

        resolve({ object, parts });
      },
      onProgress,
      (error) => {
        console.log(error);
        reject(error);
      }
    );
  });
}
