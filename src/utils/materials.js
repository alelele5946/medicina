// Clones a mesh's material(s), applying the given opacity and enabling transparency.
// Handles both array-material and single-material meshes (a distinction the
// original code duplicated near-verbatim in three different places).
export function setPartOpacity(part, opacity) {
  if (Array.isArray(part.material)) {
    part.material = part.material.map((mat) => cloneWithOpacity(mat, opacity));
  } else {
    part.material = cloneWithOpacity(part.material, opacity);
  }
}

function cloneWithOpacity(material, opacity) {
  const newMaterial = material.clone();
  newMaterial.opacity = opacity;
  newMaterial.transparent = true;
  return newMaterial;
}
