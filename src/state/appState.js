// Central mutable application state — a plain object, not a store library.
// Each feature module reads/writes only the slice relevant to it.
export const appState = {
  // model/scene
  busto: null,
  partesCuerpo: [],
  objetosControlados: [],

  // selection / interaction
  selectedPart: null,
  raycasterEnabled: false,
  orbitControlsEnabled: true,
  intersects: [],
  intersectIndex: 0,

  // Class1 lesson
  class1: {
    active: false,
    firstTime: true,
    count: 0,
  },
};
