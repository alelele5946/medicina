import * as THREE from 'three';
import { camera, renderer } from '../core/scene.js';
import { orbitControls } from '../controls/orbitControls.js';
import { toggleDragMode } from '../controls/controlsCoordinator.js';
import { appState } from '../state/appState.js';
import { animarCamara } from '../utils/cameraAnimation.js';
import { findPartFor } from '../utils/parts.js';
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
        const part = findPartFor(appState.intersects[appState.intersectIndex].object, appState.partesCuerpo);
        if (!part) return;
        showPartName(part.name);
        appState.selectedPart.isSelected = false;
        appState.selectedPart = part;
        appState.selectedPart.isSelected = true;
        animarCamara(camera, appState.selectedPart, appState.busto);
        opacitySlider.value = OPACITY_SELECTED_VALUE;
        updateOpacity();
        appState.intersectIndex = (appState.intersectIndex + 1) % appState.intersects.length;
      }
    }
    // Solo la tecla Control (no cualquier atajo Ctrl+X) e ignorando los
    // eventos repetidos de mantenerla pulsada: mantener Ctrl activa el modo
    // drag, soltarla vuelve al modo órbita.
    if (event.key === 'Control' && !event.repeat) {
      toggleDragMode();
    }
  });

  document.addEventListener('keyup', (event) => {
    if (event.key === 'Control') {
      toggleDragMode();
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
