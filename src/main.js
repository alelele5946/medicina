/*Imports*/
import * as THREE from 'three';
//import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {DragControls} from './modules/DragControls.js';
//import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js';
//import {CSS2DRenderer, CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';
import { OrbitControls } from 'three/OrbitControls';
import { FBXLoader } from 'three/FBXLoader';
import { CSS2DRenderer, CSS2DObject } from 'three/CSS2DRenderer';

let partesCuerpo = []; // array donde meto las partes del cuerpo
let raycasterEnabled = false; // raycaster al principio desactivado , se activa al habilitarlo con el boton
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const skeletonUrl = new URL('../models/zAnatomy-OnlyHead.fbx', import.meta.url);

let busto; // referencia al busto
let selectedPart; //poder acceder a la parte seleccionada en cualquier momento
let objetosControlados = []; // lista objetos de drag and drop
let Clase1noActiva = true;
const toggleDragDropButton = document.getElementById('toggleDragDrop');
let orbitControlsEnabled = true;
let countClass1 = 0;

let clase1FirstTime = true;

// Obtener referencias a los elementos HTML
const opacitySlider = document.getElementById("opacity-slider");
const opacityValue = document.getElementById("opacity-value");




const axesHelper = new THREE.AxesHelper(300); // Creación de los ejes para ayudar
let axis = false; // al principio no se muestran
axesHelper.translateY(-10);


  document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('.menu').classList.toggle('active');
  });
  
 
// control de ejes
axisBtn.addEventListener("click", function(){
    if(axis){
        axis = false;
        scene.remove(axesHelper);
    }
    else{
        scene.add(axesHelper);
        axis = true;

    }
});


upView.addEventListener("click", function(){
    camera.position.set(0,50,0);
    camera.lookAt(0,0,0);
    orbitControls.target.set(0,0,0);
    orbitControls.update();
    
});
frontView.addEventListener("click", function(){
    camera.position.set(0,0,50);
    camera.lookAt(0,-6,-1);
    // Restablece el punto de mira (target) de OrbitControls
    orbitControls.target.set(0,0,0);
    orbitControls.update();
});
downView.addEventListener("click", function(){
    camera.position.set(0,-50,0);
    camera.lookAt(0,0,0);
    orbitControls.target.set(0,0,0);
    orbitControls.update();
});


//Boton para deseleccionar todas las partes del cuerpo-----------------------------------------------------------------
deselect.addEventListener("click", function(){
    partesCuerpo.forEach((p)=>{
        p.isSelected = false;
    })
    opacitySlider.value = 100;
    updateOpacity();
    showPartName("deselected")
    selectedPart = null;
});

toggleDragDropButton.addEventListener('click', function () {
    toggleDragDropButton.classList.toggle('active');
    orbitControlsEnabled = !orbitControlsEnabled;
    orbitControls.enabled = orbitControlsEnabled;
    dragControls.enabled = !orbitControlsEnabled;
});



//-----------------------------------------------------------------------------------------------------------------------------------


// renderizado --------------------------------------------------------------------------------------------
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
renderer.setClearColor(0xE0E0E0);
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0,0,50);

window.addEventListener('resize', function() {
    // Actualiza el aspecto de la cámara
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Actualiza el tamaño del renderizador
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);


const dragControls = new DragControls(objetosControlados, camera, renderer.domElement);
dragControls.enabled = false;

const toggleSelectedObjectsBtn = document.getElementById("toggleSelectedObjects");
toggleSelectedObjectsBtn.addEventListener("click", function () {
    const container = document.getElementById("selectedObjectsContainer");
    const style = window.getComputedStyle(container);
    const isHidden = style.display === 'none';
    if (isHidden) {
        container.style.display = 'block';  // Muestra el contenedor si está oculto
    } else {
        container.style.display = 'none';   // Oculta el contenedor si está visible
    }
});



//Clase 1
class1.addEventListener('click', function() {
    const dragDropButton = document.getElementById("toggleDragDrop");
    const deselectButton = document.getElementById('deselect');
    const frontButton = document.getElementById('frontView');
    deselectButton.click();
    frontButton.click();
    if(!Clase1noActiva){
        class1.classList.toggle('active');
        
        dragDropButton.style.display = "none";
        
        deselectButton.style.display = "block";
        toggleRaycasterBtn.style.display = "block";
        
        
        if(!orbitControlsEnabled){
            toggleDragDropButton.click();
        }
        Clase1noActiva = true;
        partesCuerpo.forEach((p)=>{
            p.isSelected = false;
            p.visible = true;
        })
        objetosControlados.forEach(objeto => {
            scene.remove(objeto);
        });
        
        updateOpacity();
        showPartName("deselected")
        camera.position.set(0,0,50);
        camera.lookAt(0,0,0); // vista frontal
        selectedPart = null;
    }
    else{
        countClass1 = 0;
        class1.classList.toggle('active');
        
       
        deselectButton.style.display = "none";
        toggleRaycasterBtn.style.display = "none";
        dragDropButton.style.display = "block";
        
        Clase1noActiva = false;
        if(clase1FirstTime){
            clase1FirstTime = false;
            // Encuentra los objetos que queremos duplicar
            const objectToDuplicate1 = partesCuerpo.find(parte => parte.name === 'Lower_medial_incisor_r');
            objectToDuplicate1.myPosition = objectToDuplicate1.getWorldPosition(new THREE.Vector3());
            const objectToDuplicate2 = partesCuerpo.find(parte => parte.name === 'Lower_medial_incisor_l');
            objectToDuplicate1.myPosition = objectToDuplicate1.getWorldPosition(new THREE.Vector3());
            // Encuentra el objeto que queremos seleccionar
    
            selectedPart = partesCuerpo.find(parte => parte.name === 'Mandible');
            selectedPart.isSelected = true;

            // Duplicar los objetos
            if (objectToDuplicate1) {
                const copiedPartPosition = new THREE.Vector3(20, 30, 6); 
                addPartCopy(objectToDuplicate1, copiedPartPosition);
            }
            if (objectToDuplicate2) {
                const copiedPartPosition = new THREE.Vector3(20, 35, 6); 
                addPartCopy(objectToDuplicate2, copiedPartPosition);
            }
            showPartName("Ahora debes seleccionar la opción drag o pulsar ctrl para poder mover cada incisivo a su posición. En caso de usar drag, si quieres mover la camara se debe volver a desactivar ");

            updateOpacity();
        }
        else{
            let incisive = objetosControlados[0]
            let position = new THREE.Vector3(20, -10, 6);
            incisive.position.set(position.x,position.y,position.z);
            scene.add(incisive);
            incisive = objetosControlados[1]
            position = new THREE.Vector3(20, -15, 6);
            incisive.position.set(position.x,position.y,position.z);
            scene.add(incisive);
            selectedPart = partesCuerpo.find(parte => parte.name === 'Mandible');
            selectedPart.isSelected = true;

            showPartName("Ahora debes seleccionar la opción toggle drag and drop para poder mover cada incisive a su posición");

            updateOpacity();
        }
    }
    
    
});

const dragLabel = document.getElementById("drag-label");

dragControls.addEventListener('dragstart', function (event) {
    console.log('dragstart', event.object);
    dragLabel.style.display = "block";
});

dragControls.addEventListener('dragend', (event) => {
    console.log('dragend', event.object.getWorldPosition(new THREE.Vector3()));
    dragLabel.style.display = "none";
    const { x: xPos, y: yPos, z: zPos } = event.object.position;
    const partPos = event.object.myPosition;
  
    const xDistance = isInRange(xPos, partPos.x, 1, 8);
    const yDistance = isInRange(yPos, partPos.y, 1, 8);
    const zDistance = isInRange(zPos, partPos.z, 1, 8);
    if(selectedPart){
    // Verifica si el objeto ha alcanzado la posición deseada
    if (xDistance === 'close' && yDistance === 'close' && zDistance === 'close' ) {
        // Coloca el objeto en la posición exacta
        event.object.position.set(partPos.x, partPos.y, partPos.z);
        if(countClass1 != 2){ countClass1 += 1;} 
    }

    }
    if(countClass1 == 2){
        showPartName("¡Felicidades! Has completado la clase, pica sobre clase 1 para salir de la clase");
        countClass1 = 0;
    }
    
});
dragControls.addEventListener('drag', (event) => {
    const { x: xPos, y: yPos, z: zPos } = event.object.position;
    const partPos = event.object.myPosition;
  
    const xDistance = isInRange(xPos, partPos.x, 1, 8);
    const yDistance = isInRange(yPos, partPos.y, 1, 8);
    const zDistance = isInRange(zPos, partPos.z, 1, 8);

    if (xDistance === 'far' || yDistance === 'far' || zDistance === 'far') {
        dragLabel.innerHTML = 'Posición incorrecta';
        dragLabel.style.backgroundColor = 'red';
    } else if (xDistance === 'close' && yDistance === 'close' && zDistance === 'close') {
        dragLabel.innerHTML = 'Posición correcta';
        dragLabel.style.backgroundColor = 'green';
    } else {
        dragLabel.innerHTML = 'Nos acercamos';
        dragLabel.style.backgroundColor = 'orange';
    }
  });

function isInRange(value, target, closeRange, farRange) {
    if (value >= target - closeRange && value < target + closeRange) {
      return 'close';
    } else if (value >= target - farRange && value < target + farRange) {
      return 'medium';
    } else if (value < target - farRange || value > target + farRange) {
      return 'far';
    }
  }

/* Orbit controls*/
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;


/* raycaster*/
renderer.domElement.addEventListener("mousemove", (event) => {
    if (!raycasterEnabled) return;
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});
//-----------------------------------------------------------

// Esta función lo que hace es que muestra el nombre que le pasamos del array que encontramos con el raycaster
function showPartName(name) {
    const partNameDisplay = document.getElementById("partNameDisplay");
    if (!partNameDisplay) {
        const partNameElement = document.createElement("div");
        partNameElement.id = "partNameDisplay";
        partNameElement.style.position = "absolute";
        partNameElement.style.bottom = "10px";
        partNameElement.style.right = "10px";
        partNameElement.style.backgroundColor = "white";
        partNameElement.style.padding = "5px";
        partNameElement.style.border = "1px solid black";
        partNameElement.innerText = name;
        document.body.appendChild(partNameElement);
    } else {
        partNameDisplay.innerText = name;
    }
}

//-----------------------------------------------------------------------------------------------------------

// manejo al clicar con el raycaster
let intersectIndex = 0;
let intersects;
// Manejador de eventos "click"
renderer.domElement.addEventListener("click", (event) => {
    if (!raycasterEnabled) return;
    raycaster.setFromCamera(mouse, camera);
    //const intersects = raycaster.intersectObjects(partesCuerpo);
    intersects = raycaster.intersectObjects(partesCuerpo);

    if (intersects.length > 0) {
        toggleSelectedObjectsBtn.style.display = "block";
        // Elimina los botones anteriores
        const container = document.getElementById("selectedObjectsContainer");
        container.innerHTML = '';

        // Crea un Set con los objetos intersectados para eliminar duplicados
        const uniqueObjects = new Set(intersects.map(intersect => intersect.object));
        uniqueObjects.forEach((object) => {
            const button = document.createElement("button");
            button.innerHTML = object.name;
            button.setAttribute('data-id', object.id);
            button.addEventListener("click", () => {
                // Acción cuando se haga clic en el botón
                showPartName(object.name);
                if(selectedPart){
                    selectedPart.isSelected = false;

                }
                
                const id = button.getAttribute('data-id');
                selectedPart = partesCuerpo.find(parte => parte.id == id);
                selectedPart.isSelected = true;
                animarCamara(camera, selectedPart);
                opacitySlider.value = 10;
                updateOpacity();
            });

            // Agrega el botón al contenedor
            container.appendChild(button);
        });
    }
    updateOpacity();
    console.log(intersects)
});
//--------------------------------------------------------------------------------------------


// Manejador de eventos "keydown" mostrar siguiente objeto array de raycaster
document.addEventListener("keydown", (event) => {
    if (event.key === "e") { // Verifica si la tecla pulsada es la de la derecha
        if (!raycasterEnabled || !partesCuerpo.length) return;
        console.log("he pasado primera prueba de raycaster");
        raycaster.setFromCamera(mouse, camera);
        //const intersects = raycaster.intersectObjects(partesCuerpo);
        if (intersects.length > 0) {
            showPartName(intersects[intersectIndex].object.name); // Muestra el siguiente elemento en intersects
            selectedPart.isSelected = false;
            selectedPart = partesCuerpo.find(parte => parte.name === intersects[intersectIndex].object.name);
            selectedPart.isSelected = true;
            animarCamara(camera, selectedPart);
            opacitySlider.value = 10;
            updateOpacity();
            intersectIndex = (intersectIndex + 1) % intersects.length; // Actualiza intersectIndex
        }
    }
    if(event.ctrlKey) {
        orbitControlsEnabled = !orbitControlsEnabled;
        orbitControls.enabled = orbitControlsEnabled;
        dragControls.enabled = !orbitControlsEnabled;
    }
});
//-----------------------------------------------------------------------------------------------------------

document.addEventListener("keyup", (event) => {
    if(event.key === 'Control') {
        orbitControlsEnabled = !orbitControlsEnabled;
        orbitControls.enabled = orbitControlsEnabled;
        dragControls.enabled = !orbitControlsEnabled;
    }
});
//boton para activar o desactivar el raycaster
const toggleRaycasterBtn = document.getElementById("toggleRaycaster");
toggleRaycasterBtn.addEventListener("click", function () {
    toggleRaycasterBtn.classList.toggle('active');
    raycasterEnabled = !raycasterEnabled;
    orbitControls.enabled = !raycasterEnabled;
    if (!raycasterEnabled) {
        const container = document.getElementById("selectedObjectsContainer");
        // Ocultar el botón de "Seleccionados" cuando raycaster esté desactivado
        toggleSelectedObjectsBtn.style.display = 'none';
        container.style.display = 'none';
    }
    else{
        showPartName("Ahora puedes seleccionar las partes que interseccionen en donde clickas y acceder a ellas usando el boton seleccionar, para poder mover la camara deberas deseleccionar el raycaster");
    }
});
//----------------------------------------------------------------------------------------------------
/* Añadimos luz de ambiente , un spotlight y un helper para ayudar con el spotlight */
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);
const spotLight = new THREE.SpotLight(0xFFFFFF);
scene.add(spotLight);
spotLight.position.set(-100,100,0);
spotLight.castShadow = true;
spotLight.angle = 0.2;
const sLightHelper = new THREE.SpotLightHelper(spotLight);
//-------------------------------------------------------------------------------------------------

// variables para botones y ids de objetos
var botones = [];
var idsObjetos = [];
var botonesContainer = document.getElementById('botones-container');

// Primero, obtenemos la referencia a los elementos que vamos a necesitar
const numb = document.querySelector(".numb");
const progressLeft = document.querySelector(".bar.left .progress");
const progressRight = document.querySelector(".bar.right .progress");
const circularElement = document.querySelector('.circular');
const fbxLoader = new FBXLoader();

fbxLoader.load(
    skeletonUrl.href,
    
    // funcion para recorrer objeto-----------------------------------------------------------------
    (object) => {

        // Aquí se maneja el modelo cargado

        // ...
        
        partesCuerpo = [];
        const letras = new Set();
        const letrasContainer = document.createElement('div');
        botonesContainer.appendChild(letrasContainer);

        object.traverse(function (child) {
            if (child.isMesh) {
                //console.log(child)
                child.originalMaterials = child.material;
                partesCuerpo.push(child);  // cada parte la metemos en array partesCuerpo[]
                letras.add(child.name[0].toUpperCase());
            }
        });
        console.log(partesCuerpo.length);
        

        // Convertir el conjunto en un array y ordenarlo alfabéticamente
        const letrasArray = Array.from(letras).sort(); 

        // Crear botones para cada letra
        for (const letra of letrasArray) {
            const botonLetra = document.createElement('button');
            botonLetra.innerText = letra;
            botonLetra.addEventListener('click', function() {
                mostrarPartesPorLetra(letra);
            });
            letrasContainer.appendChild(botonLetra);
        }

        // mostrar por letras menu lateral-------------------------------------------------------

        function mostrarPartesPorLetra(letra) {
            letrasContainer.style.display = 'none';
            const partesContainer = document.createElement('div');
            botonesContainer.appendChild(partesContainer);
            for (const parte of partesCuerpo) {
                // Guardar originalMaterials antes de verificar si la primera letra coincide
                if (parte.name[0].toUpperCase() === letra) {
                    const botonParte = document.createElement('button');
                    botonParte.innerText = parte.name;
                    parte.isSelected = false;
                    botonParte.addEventListener('click', function() {
                            if(selectedPart){
                                selectedPart.isSelected = false;
        
                            }
                            partesCuerpo.forEach((p) => { //aplicamos a todos los materiales
                            
                               if(Array.isArray(p.material)){
                                p.material = p.material.map(mat => {
                                    const newMaterial =  mat.clone();
                                    newMaterial.opacity = opacitySlider.value / 100;
                                    newMaterial.transparent = true;
                                    return newMaterial;
                                });

                               }
                               else{
                                const material = new Array(p.material);
                                const materialArray = material.map(mat => {
                                    const newMaterial =  mat.clone();
                                    newMaterial.opacity = opacitySlider.value / 100;
                                    newMaterial.transparent = true;
                                    return newMaterial;
                                });
                                p.material = materialArray[0];
                               }

                            }); // final recorrido todo cuerpo

                            if(Array.isArray(parte.material)){
                                parte.material = parte.material.map(mat => {
                                    console.log("enabled material", parte );
                                    const newMaterial = mat.clone();
                                    newMaterial.opacity = 1;;
                                    newMaterial.transparent = true;
                                    return newMaterial;
                                });

                            }
                            else{
                                const selectedMaterial = new Array(parte.material);
                                const selectedMaterialArray = selectedMaterial.map(mat => {
                                    const newMaterial =  mat.clone();
                                    newMaterial.opacity = 1;
                                    newMaterial.transparent = true;
                                    return newMaterial;
                                });
                                parte.material = selectedMaterialArray[0];
                            }
                            console.log("material seleccionado", parte);
                            parte.isSelected = true;
                            animarCamara(camera, parte);
                            selectedPart = parte;
                            opacitySlider.value = 10;
                            updateOpacity();
                            showPartName(parte.name);
                            
                            
                    
                    });

                    partesContainer.appendChild(botonParte);
                }
            }


            const botonAtras = document.createElement('button');
            botonAtras.innerText = 'Atrás';
            botonAtras.addEventListener('click', function() {
                botonesContainer.removeChild(partesContainer);
                letrasContainer.style.display = 'block';
            });
            partesContainer.appendChild(botonAtras);
        }
        //----------------------------------------------------------------------------------------
        
        
        // control de opacidad ------------------------------------------------------------------

        // Vincular la función updateOpacity al evento 'input' del control deslizante
        opacitySlider.addEventListener("input", updateOpacity);
        // Llamar a la función updateOpacity una vez al inicio para establecer la opacidad inicial
        updateOpacity();

        object.scale.set(.004, .004, .004)
        object.translateY(-60);
        object.rotateX(-Math.PI/2);
        console.log("posición del busto",object.position);

        busto = object; // tener referencia al busto en cualquier momento
        circularElement.style.display = 'none';
        scene.add(object)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
          // Calculamos el porcentaje de progreso
          let counter = Math.floor((xhr.loaded / xhr.total) * 100);
        
          // Actualizamos el texto y la barra de progreso
          numb.textContent = counter + "%";
          if (counter <= 50) {
              // Si el progreso es del 50% o menos, actualizamos la barra izquierda
              progressLeft.style.transform = `rotate(${counter * 3.6}deg)`;
          } else {
              // Si el progreso es mayor del 50%, actualizamos las barras izquierda y derecha
              progressLeft.style.transform = `rotate(180deg)`;
              progressRight.style.transform = `rotate(${(counter - 50) * 3.6}deg)`;
          }
    },
    (error) => {
        console.log(error)
    }
    // final object
)
// final loader -------------------------------------------------------------------------------------------------------------------------------

function bucleOpacity(opacity){
    partesCuerpo.forEach((parte) => {
        
        if(!parte.isSelected){
            if(opacity == 0)parte.visible = false;
            else{parte.visible = true}
            if(Array.isArray(parte.material) ){
                parte.material = parte.material.map(mat => {
                const newMaterial = mat.clone();
                newMaterial.opacity = opacity;
                newMaterial.transparent = true;
                return newMaterial;
            });
            } else{
                const material = new Array(parte.material);
                const materialArray = material.map(mat => {
                const newMaterial =  mat.clone();
                newMaterial.opacity = opacity;
                newMaterial.transparent = true;
                return newMaterial;
                }); 
                parte.material = materialArray[0];

            }
        } else{
            parte.material = parte.originalMaterials;
        }
    }); // final recorrido de partes del cuerpo

}
function updateOpacity() {
    if(Clase1noActiva){
        const opacity = opacitySlider.value / 100; // Convertir el valor del control deslizante (0-100) a opacidad (0-1)
        opacityValue.innerText = `${opacitySlider.value}%`; // Mostrar el valor de opacidad en porcentaje
        bucleOpacity(opacity);       
}
    else{
        bucleOpacity(0);    
    }
}

function animarCamara(camara, nuevaParte) {
    let boundingBox = new THREE.Box3().setFromObject(nuevaParte);
    let size = boundingBox.getSize(new THREE.Vector3());
    const maxNuevaParte = Math.max(size.x, size.y, size.z);
    let posicionNuevaParte = nuevaParte.getWorldPosition(new THREE.Vector3());

    boundingBox = new THREE.Box3().setFromObject(busto); // parte seleccionada previamente
    size = boundingBox.getSize(new THREE.Vector3());
    const maxBusto = Math.max(size.x, size.y, size.z);

    // Calcula la relación de tamaño entre los dos objetos
    const ratio = maxNuevaParte / maxBusto;

    // Calcula la nueva distancia de la cámara en base a la distancia del busto 
    // y la relación de tamaño del nuevo objeto y el busto
    let distanciaCamara = 50 * ratio;
    console.log("distanciacamara", distanciaCamara);

    // Calcula el vector de dirección desde el objeto a la cámara 
    let direccion = new THREE.Vector3().subVectors(camara.position, posicionNuevaParte).normalize();

    console.log("direccion",direccion);

    // Escala el vector de dirección por la distancia deseada para obtener la nueva posición de la cámara
    let nuevaPosicionCamara = new THREE.Vector3().addVectors(posicionNuevaParte, direccion.multiplyScalar(distanciaCamara));
    
    console.log(nuevaPosicionCamara);

    new TWEEN.Tween(camara.position)
        .to(
            {
                x: nuevaPosicionCamara.x,
                y: nuevaPosicionCamara.y,
                z: nuevaPosicionCamara.z,
            },
            1000
        )
        .easing(TWEEN.Easing.Cubic.Out)
        .start()
        .onUpdate(() => camara.lookAt(posicionNuevaParte));
}


  


function addPartCopy(part, position) {
    const partCopy = part.clone();
    console.log(position.x, position.y, position.z, "esta es la primera vez");
    partCopy.position.set(position.x, position.y, position.z);
    partCopy.scale.set(.004, .004, .004);
    partCopy.translateY(-45);
    partCopy.rotateX(-Math.PI/2);
    partCopy.myPosition = part.getWorldPosition(new THREE.Vector3());
    if(Array.isArray(partCopy.material)){
        partCopy.material = partCopy.material.map(mat => {
            
            const newMaterial = mat.clone();
            newMaterial.opacity = 1;;
            newMaterial.transparent = true;
            return newMaterial;
        });

    }
    else{
        const selectedMaterial = new Array(partCopy.material);
        const selectedMaterialArray = selectedMaterial.map(mat => {
            const newMaterial =  mat.clone();
            newMaterial.opacity = 1;
            newMaterial.transparent = true;
            return newMaterial;
        });
        partCopy.material = selectedMaterialArray[0];
    };
    objetosControlados.push(partCopy);
    scene.add(partCopy);
    console.log(partCopy.getWorldPosition(new THREE.Vector3()), "posición primera vez");
}


//funcion para crear texto----------------------------------------

function createCSS2DObject(text) {
    const div = document.createElement('div');
    div.className = 'label';
    div.textContent = text;
    div.style.marginTop = '2em'; // Ajusta el valor según la distancia que deseas
    div.style.marginLeft = "-5em";
    div.style.backgroundColor = 'red';
    div.style.padding = '5px';
    div.style.color = 'white';
    div.style.fontFamily = 'Arial, sans-serif';
    div.style.fontSize = '16px';
    div.style.pointerEvents = 'none'; // Para que el texto no interfiera con el DragControls
    const cssObject = new CSS2DObject(div);
    return cssObject;
}

function changeBackgroundColor(cssObject, color) {
    if (cssObject && cssObject.element) {
        cssObject.element.style.backgroundColor = color;
    }
}

  //------------------------------------------------------------------------------------------
function animate(){
    TWEEN.update(performance.now());
    renderer.render(scene,camera);
}

renderer.setAnimationLoop(animate);
