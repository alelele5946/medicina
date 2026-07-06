import * as THREE from 'three';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { scene } from '../core/scene.js';
import { dragControls } from '../controls/dragControls.js';
import { appState } from '../state/appState.js';
import { setPartOpacity, forEachPartMesh } from '../utils/materials.js';
import { showPartName } from '../ui/partNameDisplay.js';
import { updateOpacity } from '../ui/opacitySlider.js';
import { showDragLabel, hideDragLabel, getPositionDistances, updateDragLabelFeedback } from '../ui/dragFeedbackLabel.js';
import {
  CLASS1_PART_NAMES,
  CLASS1_STAGING_POSITIONS,
  MODEL_SCALE,
  MODEL_ROTATE_X,
} from '../config/constants.js';
import { STRINGS } from '../config/strings.js';

// Crea un Mesh único a partir de una parte. Las partes multi-material del
// GLB son Groups con un Mesh por primitiva; DragControls solo mueve meshes
// individuales, así que fusionamos las geometrías en un solo mesh con array
// de materiales (equivalente a lo que producía el antiguo FBXLoader).
function partToSingleMesh(part) {
  if (part.isMesh) return part.clone();

  const meshes = [];
  forEachPartMesh(part, (mesh) => meshes.push(mesh));
  const merged = mergeBufferGeometries(meshes.map((m) => m.geometry), true);
  const materials = meshes.map((m) => (Array.isArray(m.material) ? m.material[0] : m.material));
  const mesh = new THREE.Mesh(merged, materials);
  mesh.name = part.name;
  return mesh;
}

function addPartCopy(part, position) {
  const partCopy = partToSingleMesh(part);
  partCopy.position.set(position.x, position.y, position.z);
  partCopy.scale.set(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE);
  partCopy.rotateX(MODEL_ROTATE_X);
  partCopy.myPosition = part.getWorldPosition(new THREE.Vector3());
  setPartOpacity(partCopy, 1);
  appState.objetosControlados.push(partCopy);
  scene.add(partCopy);
}

function exitLesson() {
  const class1Btn = document.getElementById('class1');
  const dragDropButton = document.getElementById('toggleDragDrop');
  const toggleRaycasterBtn = document.getElementById('toggleRaycaster');
  const deselectButton = document.getElementById('deselect');

  class1Btn.classList.toggle('active');
  dragDropButton.style.display = 'none';
  deselectButton.style.display = 'block';
  toggleRaycasterBtn.style.display = 'block';

  if (!appState.orbitControlsEnabled) {
    dragDropButton.click();
  }
  appState.class1.active = false;
  appState.partesCuerpo.forEach((p) => {
    p.isSelected = false;
    p.visible = true;
  });
  appState.objetosControlados.forEach((objeto) => {
    scene.remove(objeto);
  });

  updateOpacity();
  showPartName(STRINGS.DESELECTED);
  // La vista frontal ya se aplicó al inicio del handler vía frontButton.click()
  appState.selectedPart = null;
}

function enterLesson() {
  const class1Btn = document.getElementById('class1');
  const dragDropButton = document.getElementById('toggleDragDrop');
  const toggleRaycasterBtn = document.getElementById('toggleRaycaster');
  const deselectButton = document.getElementById('deselect');

  appState.class1.count = 0;
  class1Btn.classList.toggle('active');

  deselectButton.style.display = 'none';
  toggleRaycasterBtn.style.display = 'none';
  dragDropButton.style.display = 'block';

  appState.class1.active = true;
  if (appState.class1.firstTime) {
    appState.class1.firstTime = false;

    const objectToDuplicate1 = appState.partesCuerpo.find((parte) => parte.name === CLASS1_PART_NAMES.INCISOR_RIGHT);
    objectToDuplicate1.myPosition = objectToDuplicate1.getWorldPosition(new THREE.Vector3());
    const objectToDuplicate2 = appState.partesCuerpo.find((parte) => parte.name === CLASS1_PART_NAMES.INCISOR_LEFT);
    objectToDuplicate1.myPosition = objectToDuplicate1.getWorldPosition(new THREE.Vector3());

    appState.selectedPart = appState.partesCuerpo.find((parte) => parte.name === CLASS1_PART_NAMES.MANDIBLE);
    appState.selectedPart.isSelected = true;

    if (objectToDuplicate1) {
      const p = CLASS1_STAGING_POSITIONS.INCISOR_RIGHT;
      addPartCopy(objectToDuplicate1, new THREE.Vector3(p.x, p.y, p.z));
    }
    if (objectToDuplicate2) {
      const p = CLASS1_STAGING_POSITIONS.INCISOR_LEFT;
      addPartCopy(objectToDuplicate2, new THREE.Vector3(p.x, p.y, p.z));
    }
    showPartName(STRINGS.CLASS1_INSTRUCTION_FIRST_TIME);

    updateOpacity();
  } else {
    const right = CLASS1_STAGING_POSITIONS.INCISOR_RIGHT;
    appState.objetosControlados[0].position.set(right.x, right.y, right.z);
    scene.add(appState.objetosControlados[0]);
    const left = CLASS1_STAGING_POSITIONS.INCISOR_LEFT;
    appState.objetosControlados[1].position.set(left.x, left.y, left.z);
    scene.add(appState.objetosControlados[1]);
    appState.selectedPart = appState.partesCuerpo.find((parte) => parte.name === CLASS1_PART_NAMES.MANDIBLE);
    appState.selectedPart.isSelected = true;

    showPartName(STRINGS.CLASS1_INSTRUCTION_REPEAT);

    updateOpacity();
  }
}

export function setupClass1Lesson() {
  document.getElementById('class1').addEventListener('click', function () {
    const deselectButton = document.getElementById('deselect');
    const frontButton = document.getElementById('frontView');
    deselectButton.click();
    frontButton.click();

    if (appState.class1.active) {
      exitLesson();
    } else {
      enterLesson();
    }
  });

  dragControls.addEventListener('dragstart', function () {
    showDragLabel();
  });

  dragControls.addEventListener('dragend', (event) => {
    hideDragLabel();
    const { xDistance, yDistance, zDistance } = getPositionDistances(event.object);
    const partPos = event.object.myPosition;

    if (appState.selectedPart) {
      if (xDistance === 'close' && yDistance === 'close' && zDistance === 'close') {
        event.object.position.set(partPos.x, partPos.y, partPos.z);
        if (appState.class1.count != 2) {
          appState.class1.count += 1;
        }
      }
    }
    if (appState.class1.count == 2) {
      showPartName(STRINGS.CLASS1_COMPLETE);
      appState.class1.count = 0;
    }
  });

  dragControls.addEventListener('drag', (event) => {
    updateDragLabelFeedback(getPositionDistances(event.object));
  });
}
