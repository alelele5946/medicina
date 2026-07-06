import './styles/main.css';

import { scene } from './core/scene.js';
import { startAnimationLoop } from './core/loop.js';
import { setDragModeEnabled } from './controls/controlsCoordinator.js';
import { loadAnatomyModel } from './loaders/loadAnatomyModel.js';
import { appState } from './state/appState.js';

import { setupViewPresets } from './ui/viewPresets.js';
import { updateLoadingProgress, hideLoadingSpinner } from './ui/loadingSpinner.js';
import { showPartName } from './ui/partNameDisplay.js';
import { opacitySlider, setupOpacitySlider, updateOpacity } from './ui/opacitySlider.js';
import { setupSelectedObjectsPanel } from './ui/selectedObjectsPanel.js';
import { buildPartBrowserMenu } from './ui/partBrowserMenu.js';

import { setupRaycastSelection } from './interaction/raycastSelection.js';
import { setupClass1Lesson } from './lessons/class1.js';

import { OPACITY_DESELECTED_VALUE } from './config/constants.js';
import { STRINGS } from './config/strings.js';

setupViewPresets();
setupSelectedObjectsPanel();
setupRaycastSelection();
setupClass1Lesson();
setupOpacitySlider();

const toggleDragDropButton = document.getElementById('toggleDragDrop');
toggleDragDropButton.addEventListener('click', function () {
  toggleDragDropButton.classList.toggle('active');
  setDragModeEnabled(!appState.orbitControlsEnabled);
});

const deselectButton = document.getElementById('deselect');
deselectButton.addEventListener('click', function () {
  appState.partesCuerpo.forEach((p) => {
    p.isSelected = false;
  });
  opacitySlider.value = OPACITY_DESELECTED_VALUE;
  updateOpacity();
  showPartName(STRINGS.DESELECTED);
  appState.selectedPart = null;
});

loadAnatomyModel({ onProgress: updateLoadingProgress }).then(({ object, parts }) => {
  appState.partesCuerpo = parts;
  buildPartBrowserMenu(parts);
  updateOpacity();
  appState.busto = object;
  hideLoadingSpinner();
  scene.add(object);
});

// Handle de depuración para inspeccionar la escena desde la consola del navegador
if (import.meta.env.DEV) {
  import('three').then((THREE) => {
    window.__app = { scene, appState, THREE };
  });
}

startAnimationLoop();
