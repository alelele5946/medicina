import * as TWEEN from '@tweenjs/tween.js';
import { renderer, scene, camera } from './scene.js';

export function startAnimationLoop() {
  renderer.setAnimationLoop(() => {
    TWEEN.update(performance.now());
    renderer.render(scene, camera);
  });
}
