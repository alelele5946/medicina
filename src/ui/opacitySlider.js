import { appState } from '../state/appState.js';
import { setPartOpacity, restorePartOriginalMaterials } from '../utils/materials.js';

export const opacitySlider = document.getElementById('opacity-slider');
export const opacityValue = document.getElementById('opacity-value');

function bucleOpacity(opacity) {
  appState.partesCuerpo.forEach((parte) => {
    if (!parte.isSelected) {
      parte.visible = opacity != 0;
      setPartOpacity(parte, opacity);
    } else {
      restorePartOriginalMaterials(parte);
    }
  });
}

export function updateOpacity() {
  if (!appState.class1.active) {
    const opacity = opacitySlider.value / 100;
    opacityValue.innerText = `${opacitySlider.value}%`;
    bucleOpacity(opacity);
  } else {
    bucleOpacity(0);
  }
}

export function setupOpacitySlider() {
  opacitySlider.addEventListener('input', updateOpacity);
}
