// A "part" is a named anatomical object. With the GLB model, a part can be a
// single Mesh or a Group whose children are one Mesh per glTF primitive
// (one per material) — these helpers treat both uniformly.

export function forEachPartMesh(part, fn) {
  if (part.isMesh) {
    fn(part);
    return;
  }
  part.traverse((child) => {
    if (child.isMesh) fn(child);
  });
}

// Clones a part's material(s), applying the given opacity and enabling
// transparency. Handles array-material and single-material meshes.
export function setPartOpacity(part, opacity) {
  forEachPartMesh(part, (mesh) => {
    if (Array.isArray(mesh.material)) {
      mesh.material = mesh.material.map((mat) => cloneWithOpacity(mat, opacity));
    } else {
      mesh.material = cloneWithOpacity(mesh.material, opacity);
    }
  });
}

export function savePartOriginalMaterials(part) {
  forEachPartMesh(part, (mesh) => {
    mesh.originalMaterials = mesh.material;
  });
}

export function restorePartOriginalMaterials(part) {
  forEachPartMesh(part, (mesh) => {
    mesh.material = mesh.originalMaterials;
  });
}

function cloneWithOpacity(material, opacity) {
  const newMaterial = material.clone();
  newMaterial.opacity = opacity;
  newMaterial.transparent = true;
  return newMaterial;
}
