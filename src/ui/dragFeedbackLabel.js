import { isInRange } from '../interaction/isInRange.js';
import { STRINGS } from '../config/strings.js';
import { DRAG_CLOSE_RANGE, DRAG_FAR_RANGE } from '../config/constants.js';

const dragLabel = document.getElementById('drag-label');

export function showDragLabel() {
  dragLabel.style.display = 'block';
}

export function hideDragLabel() {
  dragLabel.style.display = 'none';
}

// Compares a dragged object's position against its target (myPosition) on
// each axis, returning 'close' | 'medium' | 'far' per axis.
export function getPositionDistances(object) {
  const { x: xPos, y: yPos, z: zPos } = object.position;
  const partPos = object.myPosition;

  return {
    xDistance: isInRange(xPos, partPos.x, DRAG_CLOSE_RANGE, DRAG_FAR_RANGE),
    yDistance: isInRange(yPos, partPos.y, DRAG_CLOSE_RANGE, DRAG_FAR_RANGE),
    zDistance: isInRange(zPos, partPos.z, DRAG_CLOSE_RANGE, DRAG_FAR_RANGE),
  };
}

export function updateDragLabelFeedback({ xDistance, yDistance, zDistance }) {
  if (xDistance === 'far' || yDistance === 'far' || zDistance === 'far') {
    dragLabel.innerHTML = STRINGS.DRAG_POSITION_INCORRECT;
    dragLabel.style.backgroundColor = 'red';
  } else if (xDistance === 'close' && yDistance === 'close' && zDistance === 'close') {
    dragLabel.innerHTML = STRINGS.DRAG_POSITION_CORRECT;
    dragLabel.style.backgroundColor = 'green';
  } else {
    dragLabel.innerHTML = STRINGS.DRAG_POSITION_CLOSE;
    dragLabel.style.backgroundColor = 'orange';
  }
}
