import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { camera, renderer } from '../core/scene.js';

export const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
