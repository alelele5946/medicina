import { orbitControls } from './orbitControls.js';
import { dragControls } from './dragControls.js';
import { appState } from '../state/appState.js';

// Toggles between orbit (camera navigation) and drag (moving parts) modes,
// keeping both controls' enabled flags mutually exclusive.
export function setDragModeEnabled(enabled) {
  appState.orbitControlsEnabled = !enabled;
  orbitControls.enabled = appState.orbitControlsEnabled;
  dragControls.enabled = enabled;
}

export function toggleDragMode() {
  setDragModeEnabled(appState.orbitControlsEnabled);
}
