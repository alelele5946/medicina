export function isInRange(value, target, closeRange, farRange) {
  if (value >= target - closeRange && value < target + closeRange) {
    return 'close';
  } else if (value >= target - farRange && value < target + farRange) {
    return 'medium';
  } else if (value < target - farRange || value > target + farRange) {
    return 'far';
  }
}
