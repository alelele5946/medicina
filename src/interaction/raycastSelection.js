import * as THREE from 'three';
import { camera, renderer } from '../core/scene.js';
import { orbitControls } from '../controls/orbitControls.js';
import { dragControls } from '../controls/dragControls.js';
import { appState } from '../state/appState.js';
import { animarCamara } from '../utils/cameraAnimation.js';
import { showPartName } from '../ui/partNameDisplay.js';
import { opacitySlider, updateOpacity } from '../ui/opacitySlider.js';
import { renderSelectedObjects, hideSelectedObjectsPanel } from '../ui/selectedObjectsPanel.js';
import { OPACITY_SELECTED_VALUE } from '../config/constants.js';
import { STRINGS } from '../config/strings.js';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export const toggleRaycasterBtn = document.getElementById('toggleRaycaster');

export function setupRaycastSelection() {
  renderer.domElement.addEventListener('mousemove', (event) => {
    if (!appState.raycasterEnabled) return;
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  renderer.domElement.addEventListener('click', () => {
    if (!appState.raycasterEnabled) return;
    raycaster.setFromCamera(mouse, camera);
    appState.intersects = raycaster.intersectObjects(appState.partesCuerpo);

    if (appState.intersects.length > 0) {
      renderSelectedObjects(appState.intersects);
    }
    updateOpacity();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'e') {
      if (!appState.raycasterEnabled || !appState.partesCuerpo.length) return;
      raycaster.setFromCamera(mouse, camera);
      if (appState.intersects.length > 0) {
        showPartName(appState.intersects[appState.intersectIndex].object.name);
        appState.selectedPart.isSelected = false;
        appState.selectedPart = appState.partesCuerpo.find(
          (parte) => parte.name === appState.intersects[appState.intersectIndex].object.name
        );
        appState.selectedPart.isSelected = true;
        animarCamara(camera, appState.selectedPart, appState.busto);
        opacitySlider.value = OPACITY_SELECTED_VALUE;
        updateOpacity();
        appState.intersectIndex = (appState.intersectIndex + 1) % appState.intersects.length;
      }
    }
    if (event.ctrlKey) {
      appState.orbitControlsEnabled = !appState.orbitControlsEnabled;
      orbitControls.enabled = appState.orbitControlsEnabled;
      dragControls.enabled = !appState.orbitControlsEnabled;
    }
  });

  document.addEventListener('keyup', (event) => {
    if (event.key === 'Control') {
      appState.orbitControlsEnabled = !appState.orbitControlsEnabled;
      orbitControls.enabled = appState.orbitControlsEnabled;
      dragControls.enabled = !appState.orbitControlsEnabled;
    }
  });

  toggleRaycasterBtn.addEventListener('click', function () {
    toggleRaycasterBtn.classList.toggle('active');
    appState.raycasterEnabled = !appState.raycasterEnabled;
    orbitControls.enabled = !appState.raycasterEnabled;
    if (!appState.raycasterEnabled) {
      hideSelectedObjectsPanel();
    } else {
      showPartName(STRINGS.RAYCASTER_ENABLED_INSTRUCTION);
    }
  });
}
