import * as THREE from 'three';
import { camera, scene } from '../core/scene.js';
import { orbitControls } from '../controls/orbitControls.js';
import { CAMERA_VIEWS } from '../config/constants.js';

const axesHelper = new THREE.AxesHelper(CAMERA_VIEWS.AXIS_HELPER_SIZE);
axesHelper.translateY(CAMERA_VIEWS.AXIS_HELPER_TRANSLATE_Y);
let axis = false;

function applyView({ position, lookAt }) {
  camera.position.set(position.x, position.y, position.z);
  camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
  orbitControls.target.set(0, 0, 0);
  orbitControls.update();
}

export function setupViewPresets() {
  document.getElementById('axisBtn').addEventListener('click', function () {
    if (axis) {
      axis = false;
      scene.remove(axesHelper);
    } else {
      scene.add(axesHelper);
      axis = true;
    }
  });

  document.getElementById('upView').addEventListener('click', () => applyView(CAMERA_VIEWS.UP));
  document.getElementById('frontView').addEventListener('click', () => applyView(CAMERA_VIEWS.FRONT));
  document.getElementById('downView').addEventListener('click', () => applyView(CAMERA_VIEWS.DOWN));
}
