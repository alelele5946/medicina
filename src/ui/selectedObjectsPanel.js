import { appState } from '../state/appState.js';
import { camera } from '../core/scene.js';
import { animarCamara } from '../utils/cameraAnimation.js';
import { findPartFor } from '../utils/parts.js';
import { showPartName } from './partNameDisplay.js';
import { opacitySlider, updateOpacity } from './opacitySlider.js';
import { OPACITY_SELECTED_VALUE } from '../config/constants.js';

export const toggleSelectedObjectsBtn = document.getElementById('toggleSelectedObjects');
const container = document.getElementById('selectedObjectsContainer');

export function setupSelectedObjectsPanel() {
  toggleSelectedObjectsBtn.addEventListener('click', function () {
    const style = window.getComputedStyle(container);
    const isHidden = style.display === 'none';
    container.style.display = isHidden ? 'block' : 'none';
  });
}

export function hideSelectedObjectsPanel() {
  toggleSelectedObjectsBtn.style.display = 'none';
  container.style.display = 'none';
}

// Rebuilds the panel's button list from the raycaster's intersected objects.
// Each intersected child mesh is mapped back to its owning anatomical part.
export function renderSelectedObjects(intersects) {
  toggleSelectedObjectsBtn.style.display = 'block';
  container.innerHTML = '';

  const uniqueObjects = new Set(
    intersects
      .map((intersect) => findPartFor(intersect.object, appState.partesCuerpo))
      .filter((part) => part !== null)
  );
  uniqueObjects.forEach((object) => {
    const button = document.createElement('button');
    button.innerHTML = object.name;
    button.setAttribute('data-id', object.id);
    button.addEventListener('click', () => {
      showPartName(object.name);
      if (appState.selectedPart) {
        appState.selectedPart.isSelected = false;
      }

      const id = button.getAttribute('data-id');
      appState.selectedPart = appState.partesCuerpo.find((parte) => parte.id == id);
      appState.selectedPart.isSelected = true;
      animarCamara(camera, appState.selectedPart, appState.busto);
      opacitySlider.value = OPACITY_SELECTED_VALUE;
      updateOpacity();
    });

    container.appendChild(button);
  });
}
