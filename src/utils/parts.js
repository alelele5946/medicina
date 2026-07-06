// Maps any intersected/nested object (e.g. a per-primitive child mesh like
// "Mandible_3") back to its owning anatomical part in the parts list.
export function findPartFor(object, parts) {
  const partSet = new Set(parts);
  let current = object;
  while (current) {
    if (partSet.has(current)) return current;
    current = current.parent;
  }
  return null;
}
