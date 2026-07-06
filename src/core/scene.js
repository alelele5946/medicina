import * as THREE from 'three';
import {
  RENDERER_CLEAR_COLOR,
  CAMERA_FOV,
  CAMERA_NEAR,
  CAMERA_FAR,
  CAMERA_INITIAL_POSITION,
  AMBIENT_LIGHT_COLOR,
  SPOT_LIGHT_COLOR,
  SPOT_LIGHT_POSITION,
  SPOT_LIGHT_ANGLE,
} from '../config/constants.js';

export const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

export const scene = new THREE.Scene();
renderer.setClearColor(RENDERER_CLEAR_COLOR);

export const camera = new THREE.PerspectiveCamera(
  CAMERA_FOV,
  window.innerWidth / window.innerHeight,
  CAMERA_NEAR,
  CAMERA_FAR
);
camera.position.set(CAMERA_INITIAL_POSITION.x, CAMERA_INITIAL_POSITION.y, CAMERA_INITIAL_POSITION.z);

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

/* Añadimos luz de ambiente y un spotlight */
const ambientLight = new THREE.AmbientLight(AMBIENT_LIGHT_COLOR);
scene.add(ambientLight);
const spotLight = new THREE.SpotLight(SPOT_LIGHT_COLOR);
scene.add(spotLight);
spotLight.position.set(SPOT_LIGHT_POSITION.x, SPOT_LIGHT_POSITION.y, SPOT_LIGHT_POSITION.z);
spotLight.castShadow = true;
spotLight.angle = SPOT_LIGHT_ANGLE;
