// Camera view presets (Vistas menu)
export const CAMERA_VIEWS = {
  AXIS_HELPER_SIZE: 300,
  AXIS_HELPER_TRANSLATE_Y: -10,
  UP: {
    position: { x: 0, y: 50, z: 0 },
    lookAt: { x: 0, y: 0, z: 0 },
  },
  FRONT: {
    position: { x: 0, y: 0, z: 50 },
    lookAt: { x: 0, y: 0, z: 0 },
  },
  DOWN: {
    position: { x: 0, y: -50, z: 0 },
    lookAt: { x: 0, y: 0, z: 0 },
  },
};

// Renderer / scene setup (matches --color-bg in src/styles/base/tokens.css)
export const RENDERER_CLEAR_COLOR = 0xF1F3F6;
export const CAMERA_FOV = 75;
export const CAMERA_NEAR = 0.1;
export const CAMERA_FAR = 1000;
export const CAMERA_INITIAL_POSITION = { x: 0, y: 0, z: 50 };

// Lighting
export const AMBIENT_LIGHT_COLOR = 0x333333;
export const SPOT_LIGHT_COLOR = 0xFFFFFF;
export const SPOT_LIGHT_POSITION = { x: -100, y: 100, z: 0 };
export const SPOT_LIGHT_ANGLE = 0.2;

// Model transforms.
// The original FBX used scale 0.004; the GLB conversion baked the cm->m unit
// change (x0.01) into the geometry, so the equivalent scale is 0.4. The
// geometry is still Z-up (the converter did not change the up axis), so the
// same rotateX(-PI/2) as before is required to stand the model upright.
export const MODEL_SCALE = 0.4;
export const MODEL_TRANSLATE_Y = -60;
export const MODEL_ROTATE_X = -Math.PI / 2;

// Class1 lesson: anatomical part names and target positions
export const CLASS1_PART_NAMES = {
  INCISOR_RIGHT: 'Lower_medial_incisor_r',
  INCISOR_LEFT: 'Lower_medial_incisor_l',
  MANDIBLE: 'Mandible',
};

// Staging positions where the cloned incisors appear, to the side of the head.
// (The original code expressed these as position + a translateY(-45)
// compensation on first entry, and as direct positions on re-entry.)
export const CLASS1_STAGING_POSITIONS = {
  INCISOR_RIGHT: { x: 20, y: -15, z: 6 },
  INCISOR_LEFT: { x: 20, y: -10, z: 6 },
};

// Drag proximity tolerances (used by isInRange)
export const DRAG_CLOSE_RANGE = 1;
export const DRAG_FAR_RANGE = 8;

// Camera animation (animarCamara)
export const CAMERA_ANIMATION_BASE_DISTANCE = 50;
export const CAMERA_ANIMATION_DURATION_MS = 1000;

// Opacity slider
export const OPACITY_SELECTED_VALUE = 10;
export const OPACITY_DESELECTED_VALUE = 100;

// Model asset (GLB with Draco compression — see README for how to regenerate)
export const ANATOMY_MODEL_URL = `${import.meta.env.BASE_URL}models/zAnatomy-OnlyHead.glb`;
