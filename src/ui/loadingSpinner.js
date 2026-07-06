const numb = document.querySelector('.numb');
const progressLeft = document.querySelector('.bar.left .progress');
const progressRight = document.querySelector('.bar.right .progress');
const circularElement = document.querySelector('.circular');

export function updateLoadingProgress(xhr) {
  if (!xhr.total) return; // sin content-length no se puede calcular porcentaje
  const counter = Math.floor((xhr.loaded / xhr.total) * 100);

  numb.textContent = counter + '%';
  if (counter <= 50) {
    progressLeft.style.transform = `rotate(${counter * 3.6}deg)`;
  } else {
    progressLeft.style.transform = 'rotate(180deg)';
    progressRight.style.transform = `rotate(${(counter - 50) * 3.6}deg)`;
  }
}

export function hideLoadingSpinner() {
  circularElement.style.display = 'none';
}
