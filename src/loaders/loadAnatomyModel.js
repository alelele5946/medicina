import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { ANATOMY_MODEL_URL, MODEL_SCALE, MODEL_TRANSLATE_Y, MODEL_ROTATE_X } from '../config/constants.js';

// Loads the anatomy FBX model, collects its meshes, and applies the model
// transform. Returns a promise resolving with { object, parts }.
// UI wiring (letter menu, opacity slider, loading spinner) is the caller's job.
export function loadAnatomyModel({ onProgress } = {}) {
  return new Promise((resolve, reject) => {
    const fbxLoader = new FBXLoader();

    fbxLoader.load(
      ANATOMY_MODEL_URL.href,
      (object) => {
        const parts = [];

        object.traverse((child) => {
          if (child.isMesh) {
            child.originalMaterials = child.material;
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
