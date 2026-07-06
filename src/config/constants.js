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
    // NOTE: differs from CLASS1_EXIT_LOOKAT below (both nominally "front view").
    // Preserved as-is from the original code — see README "Known Issues".
    lookAt: { x: 0, y: -6, z: -1 },
  },
  DOWN: {
    position: { x: 0, y: -50, z: 0 },
    lookAt: { x: 0, y: 0, z: 0 },
  },
};

// Renderer / scene setup
export const RENDERER_CLEAR_COLOR = 0xE0E0E0;
export const CAMERA_FOV = 75;
export const CAMERA_NEAR = 0.1;
export const CAMERA_FAR = 1000;
export const CAMERA_INITIAL_POSITION = { x: 0, y: 0, z: 50 };

// Lighting
export const AMBIENT_LIGHT_COLOR = 0x333333;
export const SPOT_LIGHT_COLOR = 0xFFFFFF;
export const SPOT_LIGHT_POSITION = { x: -100, y: 100, z: 0 };
export const SPOT_LIGHT_ANGLE = 0.2;

// Model transforms
export const MODEL_SCALE = 0.004;
export const MODEL_TRANSLATE_Y = -60;
export const MODEL_ROTATE_X = -Math.PI / 2;

// NOTE: differs from MODEL_TRANSLATE_Y above (-60 vs -45) — likely unintentional
// drift in the original code. Preserved as-is — see README "Known Issues".
export const CLASS1_COPY_TRANSLATE_Y = -45;

// Class1 lesson: front-view reset used when exiting the lesson
export const CLASS1_EXIT_LOOKAT = { x: 0, y: 0, z: 0 };
export const CLASS1_EXIT_CAMERA_POSITION = { x: 0, y: 0, z: 50 };

// Class1 lesson: anatomical part names and target positions
export const CLASS1_PART_NAMES = {
  INCISOR_RIGHT: 'Lower_medial_incisor_r',
  INCISOR_LEFT: 'Lower_medial_incisor_l',
  MANDIBLE: 'Mandible',
};

export const CLASS1_FIRST_TIME_POSITIONS = {
  INCISOR_RIGHT: { x: 20, y: 30, z: 6 },
  INCISOR_LEFT: { x: 20, y: 35, z: 6 },
};

export const CLASS1_REPEAT_POSITIONS = {
  INCISOR_RIGHT: { x: 20, y: -10, z: 6 },
  INCISOR_LEFT: { x: 20, y: -15, z: 6 },
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

// Model asset
export const ANATOMY_MODEL_URL = new URL('/models/zAnatomy-OnlyHead.fbx', import.meta.url);
