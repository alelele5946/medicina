import { camera } from '../core/scene.js';
import { appState } from '../state/appState.js';
import { setPartOpacity } from '../utils/materials.js';
import { animarCamara } from '../utils/cameraAnimation.js';
import { showPartName } from './partNameDisplay.js';
import { opacitySlider, updateOpacity } from './opacitySlider.js';
import { OPACITY_SELECTED_VALUE } from '../config/constants.js';
import { STRINGS } from '../config/strings.js';

const botonesContainer = document.getElementById('botones-container');

// Builds the letter-indexed side menu (side panel: pick a letter, then pick
// a part whose name starts with that letter).
export function buildPartBrowserMenu(parts) {
  const letras = new Set();
  parts.forEach((part) => letras.add(part.name[0].toUpperCase()));

  const letrasContainer = document.createElement('div');
  letrasContainer.className = 'letter-grid';
  botonesContainer.appendChild(letrasContainer);

  const letrasArray = Array.from(letras).sort();

  for (const letra of letrasArray) {
    const botonLetra = document.createElement('button');
    botonLetra.innerText = letra;
    botonLetra.addEventListener('click', function () {
      mostrarPartesPorLetra(letra);
    });
    letrasContainer.appendChild(botonLetra);
  }

  function mostrarPartesPorLetra(letra) {
    letrasContainer.style.display = 'none';
    const partesContainer = document.createElement('div');
    partesContainer.className = 'part-list';
    botonesContainer.appendChild(partesContainer);

    for (const parte of parts) {
      if (parte.name[0].toUpperCase() === letra) {
        const botonParte = document.createElement('button');
        botonParte.innerText = parte.name;
        parte.isSelected = false;
        botonParte.addEventListener('click', function () {
          if (appState.selectedPart) {
            appState.selectedPart.isSelected = false;
          }
          appState.partesCuerpo.forEach((p) => {
            setPartOpacity(p, opacitySlider.value / 100);
          });

          setPartOpacity(parte, 1);
          parte.isSelected = true;
          animarCamara(camera, parte, appState.busto);
          appState.selectedPart = parte;
          opacitySlider.value = OPACITY_SELECTED_VALUE;
          updateOpacity();
          showPartName(parte.name);
        });

        partesContainer.appendChild(botonParte);
      }
    }

    const botonAtras = document.createElement('button');
    botonAtras.className = 'back-button';
    botonAtras.innerText = STRINGS.BACK_BUTTON;
    botonAtras.addEventListener('click', function () {
      botonesContainer.removeChild(partesContainer);
      letrasContainer.style.display = 'block';
    });
    partesContainer.appendChild(botonAtras);
  }
}
