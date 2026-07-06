import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { CAMERA_ANIMATION_BASE_DISTANCE, CAMERA_ANIMATION_DURATION_MS } from '../config/constants.js';

export function animarCamara(camara, nuevaParte, busto) {
  let boundingBox = new THREE.Box3().setFromObject(nuevaParte);
  let size = boundingBox.getSize(new THREE.Vector3());
  const maxNuevaParte = Math.max(size.x, size.y, size.z);
  let posicionNuevaParte = nuevaParte.getWorldPosition(new THREE.Vector3());

  boundingBox = new THREE.Box3().setFromObject(busto); // parte seleccionada previamente
  size = boundingBox.getSize(new THREE.Vector3());
  const maxBusto = Math.max(size.x, size.y, size.z);

  // Calcula la relación de tamaño entre los dos objetos
  const ratio = maxNuevaParte / maxBusto;

  // Calcula la nueva distancia de la cámara en base a la distancia del busto
  // y la relación de tamaño del nuevo objeto y el busto
  let distanciaCamara = CAMERA_ANIMATION_BASE_DISTANCE * ratio;

  // Calcula el vector de dirección desde el objeto a la cámara
  let direccion = new THREE.Vector3().subVectors(camara.position, posicionNuevaParte).normalize();

  // Escala el vector de dirección por la distancia deseada para obtener la nueva posición de la cámara
  let nuevaPosicionCamara = new THREE.Vector3().addVectors(posicionNuevaParte, direccion.multiplyScalar(distanciaCamara));

  new TWEEN.Tween(camara.position)
    .to(
      {
        x: nuevaPosicionCamara.x,
        y: nuevaPosicionCamara.y,
        z: nuevaPosicionCamara.z,
      },
      CAMERA_ANIMATION_DURATION_MS
    )
    .easing(TWEEN.Easing.Cubic.Out)
    .start()
    .onUpdate(() => camara.lookAt(posicionNuevaParte));
}
