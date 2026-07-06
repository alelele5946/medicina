// Shows the name of the currently highlighted/selected anatomical part in a
// floating label at the bottom-right of the screen.
export function showPartName(name) {
  const partNameDisplay = document.getElementById('partNameDisplay');
  if (!partNameDisplay) {
    const partNameElement = document.createElement('div');
    partNameElement.id = 'partNameDisplay';
    partNameElement.innerText = name;
    document.body.appendChild(partNameElement);
  } else {
    partNameDisplay.innerText = name;
  }
}
