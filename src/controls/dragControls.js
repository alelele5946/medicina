import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import { camera, renderer } from '../core/scene.js';
import { appState } from '../state/appState.js';

export const dragControls = new DragControls(appState.objetosControlados, camera, renderer.domElement);
dragControls.enabled = false;
