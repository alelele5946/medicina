/*Imports*/
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {DragControls} from './modules/DragControls.js';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js';
import {CSS2DRenderer, CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';
//import { OrbitControls } from 'three/OrbitControls';
//import { FBXLoader } from 'three/FBXLoader';
//import { CSS2DRenderer, CSS2DObject } from 'three/CSS2DRenderer';

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

// Obtener referencias a los elementos HTML
const opacitySlider = document.getElementById("opacity-slider");
const opacityValue = document.getElementById("opacity-value");



const axesHelper = new THREE.AxesHelper(300); // Creación de los ejes para ayudar
let axis = false; // al principio no se muestran
axesHelper.translateY(-10);


document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('.menu').classList.toggle('active');
  });

  var menuButtons = document.querySelectorAll('.menu button');

  // por cada botón del menú, añade un controlador de eventos 'click'
  for (var i = 0; i < menuButtons.length; i++) {
    menuButtons[i].addEventListener('click', function() {
      // cuando se hace clic en un botón del menú, oculta el menú
      document.querySelector('.menu').classList.toggle('active');
    });
  }
  
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
    let cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    console.log("camara position", camera.position);
    console.log("camara direction", cameraDirection);
    // Cconsole.log("camara look", camera.lookAt)reamos un vector para la posición objetivo (0,0,0)
let target = new THREE.Vector3(0, 0, 0);

// Obtenemos la dirección en la que está mirando la cámara


// Creamos un vector desde la cámara al objetivo
let directionToTarget = new THREE.Vector3().subVectors(target, camera.position).normalize();

// Comparamos si la dirección de la cámara es la misma que la dirección al objetivo
/*console.log(directionToTarget)
console.log(cameraDirection)
if (cameraDirection.equals(directionToTarget)) {
    console.log("La cámara está mirando al punto (0,0,0)");
} else {
    console.log("La cámara no está mirando al punto (0,0,0)");
}*/
});


//Clase 1
class1.addEventListener('click', function() {
    console.log("holaaaa")
    if(!Clase1noActiva){
        class1.classList.toggle('active');
        Clase1noActiva = true;
        partesCuerpo.forEach((p)=>{
            p.isSelected = false;
            p.visible = true;
        })
        updateOpacity();
        showPartName("deselected")
        console.log("posicion camara ahorita", camera.position);
        console.log("hollaaaa")
        camera.position.set(0,0,50);
        camera.lookAt(0,0,0); // vista frontal
        selectedPart = null;
    }
    else{

        class1.classList.toggle('active');
    Clase1noActiva = false;
    // Encuentra los objetos que queremos duplicar
    const objectToDuplicate1 = partesCuerpo.find(parte => parte.name === 'Lower_medial_incisor_r');
    objectToDuplicate1.myPosition = objectToDuplicate1.getWorldPosition(new THREE.Vector3());
    //console.log("posicion del objectToDuplicate1 es: ", objectToDuplicate1.myPosition );
    const objectToDuplicate2 = partesCuerpo.find(parte => parte.name === 'Lower_medial_incisor_l');
    objectToDuplicate1.myPosition = objectToDuplicate1.getWorldPosition(new THREE.Vector3());
    //console.log(objectToDuplicate2)

    // Encuentra el objeto que queremos seleccionar
    
    selectedPart = partesCuerpo.find(parte => parte.name === 'Mandible');
    selectedPart.isSelected = true;

    // Duplicar los objetos
    if (objectToDuplicate1) {
        const copiedPartPosition = new THREE.Vector3(20, 20, 6); // Cambia esta posición si es necesario
        addPartCopy(objectToDuplicate1, copiedPartPosition);
    }
    if (objectToDuplicate2) {
        const copiedPartPosition = new THREE.Vector3(20, 25, 6); // Cambia esta posición si es necesario
        addPartCopy(objectToDuplicate2, copiedPartPosition);
    }
    showPartName("Ahora debes seleccionar la opción drag para poder mover cada molar a su posición");

    updateOpacity();



    }
    
});


//Controles de las vistas
//----------------------------------------------------------------------------------------------------------------------------------
upView.addEventListener("click", function(){
    camera.position.set(0,50,0);
    camera.lookAt(0,0,0);

    orbitControls.target.set(0,0,0);

    // Necesitas llamar a .update() para que los cambios tengan efecto
    orbitControls.update();
    
    //console.log("la funcion se llamó");
});
frontView.addEventListener("click", function(){
    camera.position.set(0,0,50);
    camera.lookAt(0,-6,-1);
    // Restablece el punto de mira (target) de OrbitControls
    orbitControls.target.set(0,0,0);

    // Necesitas llamar a .update() para que los cambios tengan efecto
    orbitControls.update();
    
});
downView.addEventListener("click", function(){
    camera.position.set(0,-50,0);
    camera.lookAt(0,0,0);
    orbitControls.target.set(0,0,0);

    // Necesitas llamar a .update() para que los cambios tengan efecto
    orbitControls.update();
});

//Boton para deseleccionar todas las partes del cuerpo-----------------------------------------------------------------
deselect.addEventListener("click", function(){
    partesCuerpo.forEach((p)=>{
        p.isSelected = false;
    })
    updateOpacity();
    showPartName("deselected")
    console.log("posicion camara ahorita", camera.position);
    console.log("hollaaaa")
    camera.position.set(0,0,50);
    camera.lookAt(0,0,0); // vista frontal
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
// Establece el índice z y el posicionamiento de tu canvas
//renderer.domElement.style.zIndex = '1';
//renderer.domElement.style.position = 'absolute';
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
//-----------------------------------------------------------------------------------------

// CSS2DRenderer---------------------------------------------------------
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);
labelRenderer.setSize(window.innerWidth, window.innerHeight);


//---------------------------------------------------

window.addEventListener('resize', function() {
    // Actualiza el aspecto de la cámara
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Actualiza el tamaño del renderizador
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);




const dragControls = new DragControls(objetosControlados, camera, renderer.domElement);
dragControls.enabled = false;



dragControls.addEventListener('dragstart', function (event) {
    console.log('dragstart', event.object);
    currentCSSObject = createCSS2DObject('Texto por encima del objeto');
    event.object.add(currentCSSObject);   
});
/*
dragControls.addEventListener('drag', (event) => {
    console.log('drag', event.object);

    const xPos = event.object.position.x;
    const yPos = event.object.position.y;
    const zPos = event.object.position.z;

    const partPos = event.object.myPosition; // posición donde se debe colocar
    

    // Verifica si el objeto ha alcanzado la posición deseada
    if ((xPos >= partPos.x-1 && xPos < partPos.x+1) && (yPos >= partPos.y-1 && yPos < partPos.y+1) && (zPos >= partPos.z-1 && zPos < partPos.z+1) ) {
        // Actualiza el texto y el color del fondo del objeto según sea necesario
        if (currentCSSObject) {
            currentCSSObject.element.innerHTML = 'Posición correcta';
            changeBackgroundColor(currentCSSObject, 'green');
        }
    } else if(((xPos >= partPos.x-4 && xPos < partPos.x-1)||(xPos <= partPos.x+4 && xPos > partPos.x+1)) && ((yPos >= partPos.y-4 && yPos < partPos.y-1)||(yPos <= partPos.y+4 && yPos > partPos.y+1)) && ((zPos >= partPos.z-4 && zPos < partPos.z-1)||(zPos <= partPos.z+4 && zPos > partPos.z+1))){
        console.log("posición x correcta:", partPos.x, "pos x actual: ", xPos)
        console.log("posición y correcta:", partPos.y, "pos y actual: ", yPos)
        if (currentCSSObject) {
            currentCSSObject.element.innerHTML = 'Nos acercamos';
            changeBackgroundColor(currentCSSObject, 'orange');
        }
    }
     else if ((xPos < partPos.x-4) || (xPos > partPos.x+4) && (yPos < partPos.y-4) || (yPos > partPos.y+4) && (zPos < partPos.z-4) || (zPos > partPos.z+4)){
        if (currentCSSObject) {
            currentCSSObject.element.innerHTML = 'Posición incorrecta';
            changeBackgroundColor(currentCSSObject, 'red');
        }
    }
});*/


dragControls.addEventListener('dragend', (event) => {
    console.log('dragend', event.object.getWorldPosition(new THREE.Vector3()));
    if (currentCSSObject) {
        event.object.remove(currentCSSObject);
        currentCSSObject = null;
    }

    const { x: xPos, y: yPos, z: zPos } = event.object.position;
    const partPos = event.object.myPosition;
  
    const xDistance = isInRange(xPos, partPos.x, 1, 8);
    const yDistance = isInRange(yPos, partPos.y, 1, 8);
    const zDistance = isInRange(zPos, partPos.z, 1, 8);
    if(selectedPart){
        //const partPos = event.object.myPosition;
        console.log("where i must end", event.object.myPosition);
        console.log("where i am currently", event.object.position);

    // Verifica si el objeto ha alcanzado la posición deseada
    if (xDistance === 'close' && yDistance === 'close' && zDistance === 'close' ) {
        // Coloca el objeto en la posición exacta
        event.object.position.set(partPos.x, partPos.y, partPos.z);
        if(countClass1 != 2){ countClass1 += 1;} 
        
    }

    }
    if(countClass1 == 2){showPartName("¡Felicidades! Has completado la clase");}
    
});


dragControls.addEventListener('drag', (event) => {
    const { x: xPos, y: yPos, z: zPos } = event.object.position;
    const partPos = event.object.myPosition;
  
    const xDistance = isInRange(xPos, partPos.x, 1, 8);
    const yDistance = isInRange(yPos, partPos.y, 1, 8);
    const zDistance = isInRange(zPos, partPos.z, 1, 8);

    console.log(`X Distance: ${xDistance}, Y Distance: ${yDistance}, Z Distance: ${zDistance}`);
  
    if (currentCSSObject) {
      if (xDistance === 'far' || yDistance === 'far' || zDistance === 'far') {
        currentCSSObject.element.innerHTML = 'Posición incorrecta';
        changeBackgroundColor(currentCSSObject, 'red');
      } else if (xDistance === 'close' && yDistance === 'close' && zDistance === 'close') {
        currentCSSObject.element.innerHTML = 'Posición correcta';
        changeBackgroundColor(currentCSSObject, 'green');
      } else {
        currentCSSObject.element.innerHTML = 'Nos acercamos';
        changeBackgroundColor(currentCSSObject, 'orange');
      }
    }
  });
/*
  else if (xDistance === 'medium' && yDistance === 'medium' && zDistance === 'medium') {
    currentCSSObject.element.innerHTML = 'Nos acercamos';
    changeBackgroundColor(currentCSSObject, 'orange');
  } */


  
function isInRange(value, target, closeRange, farRange) {
    console.log(`Value: ${value}, Target: ${target}, Close Range: ${closeRange}, Far Range: ${farRange}`);
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
        showPartName(intersects[0].object.name); // Muestra el primer elemento en intersects
        selectedPart = false;
        selectedPart = partesCuerpo.find(parte => parte.name === intersects[0].object.name);
        selectedPart.isSelected = true;
        animarCamara(camera, selectedPart);
        
        intersectIndex = 1 % intersects.length; // Inicializa intersectIndex en 1
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
            

            //----------------------prueba pero un poco cutre quizas-----------------------
            selectedPart.isSelected = false;
            selectedPart = partesCuerpo.find(parte => parte.name === intersects[intersectIndex].object.name);
            selectedPart.isSelected = true;
            animarCamara(camera, selectedPart);
            
            updateOpacity();

            intersectIndex = (intersectIndex + 1) % intersects.length; // Actualiza intersectIndex
        }
    }
});
//-----------------------------------------------------------------------------------------------------------


//boton para activar o desactivar el raycaster
const toggleRaycasterBtn = document.getElementById("toggleRaycaster");
toggleRaycasterBtn.addEventListener("click", function () {
    toggleRaycasterBtn.classList.toggle('active');
    raycasterEnabled = !raycasterEnabled;
    orbitControls.enabled = !raycasterEnabled;
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
//scene.add(sLightHelper);
//-------------------------------------------------------------------------------------------------

// variables para botones y ids de objetos
var botones = [];
var idsObjetos = [];
var botonesContainer = document.getElementById('botones-container');

/*
// Crear un administrador de carga
let manager = new THREE.LoadingManager();

let progressBar = document.getElementById('progressBar');
let progressText = document.getElementById('progressText');

manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    // Actualizar la barra de carga
    let progress = itemsLoaded / itemsTotal * 100;
    progressBar.style.width = progress + '%';
    progressText.innerHTML = Math.round(progress) + '%';
};

manager.onLoad = function () {
    // Quitar la barra de carga cuando se haya terminado
    progressBar.style.display = 'none';
    progressText.style.display = 'none';
};

manager.onError = function (url) {
    console.log('Hubo un error al cargar ' + url);
};*/

// Loader con el administrador de carga

//const progressBarElement = document.getElementById('progress-bar');
//const progressContainerElement = document.getElementById('progress-container');

//progressContainerElement.style.display = 'block'; // Muestra la barra de progreso




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
        //progressContainerElement.style.display = 'none'; // Oculta la barra de progreso cuando se haya terminado de cargar el modelo
        //const loader = document.getElementById('loader');
        //loader.style.display = 'none';
        let count = 0;
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
                //parte.originalMaterials = parte.material;
                if (parte.name[0].toUpperCase() === letra) {
                    const botonParte = document.createElement('button');
                    botonParte.innerText = parte.name;
                    parte.isSelected = false;
                    botonParte.addEventListener('click', function() {
                        //if (!parte.isSelected) { // Si esa parte no había sido seleccionada previamente
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
        /*
        const boundingBox = new THREE.Box3().setFromObject(object);
        const size = boundingBox.getSize(new THREE.Vector3());
        bustoSize = Math.max(size.x, size.y, size.z);*/
        //console.log("tamaño busto",maxSize);
        busto = object; // tener referencia al busto en cualquier momento
        circularElement.style.display = 'none';
        scene.add(object)
        
        // console.log("I arrived here")
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
          // Calculamos el porcentaje de progreso
          counter = Math.floor((xhr.loaded / xhr.total) * 100);
        
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
                //console.log("hola3")
                parte.material = parte.material.map(mat => {
                //console.log("enabled material", parte );
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



let animationRequestId;
function animarCamara(camara, nuevaParte) {
    let boundingBox = new THREE.Box3().setFromObject(nuevaParte);
    let size = boundingBox.getSize(new THREE.Vector3());
    const maxNuevaParte = Math.max(size.x, size.y, size.z);
    let posicionNuevaParte = nuevaParte.getWorldPosition(new THREE.Vector3());
    console.log("posicion nueva parte", posicionNuevaParte.y);
    let newX;
    let newY;
    let newZ;
    boundingBox = new THREE.Box3().setFromObject(busto);// parte seleccionada previamente
    size = boundingBox.getSize(new THREE.Vector3());
    const maxBusto = Math.max(size.x, size.y, size.z);
    newX = Math.round(posicionNuevaParte.x);
    newY = Math.round(posicionNuevaParte.y);
    newZ = Math.round(((maxNuevaParte*(busto.position.z + 50))/maxBusto)*0.7);
      new TWEEN.Tween(camera.position)
    .to(
    {
        x: newX,
        y: newY,
        z: newZ,
    },
    1000
    )
    .easing(TWEEN.Easing.Cubic.Out)
    .start()
    .onUpdate(()=>camera.lookAt(posicionNuevaParte));
}

  


function addPartCopy(part, position) {
    const partCopy = part.clone();
    partCopy.position.set(position.x, position.y, position.z);
    partCopy.scale.set(.004, .004, .004);
    partCopy.translateY(-45);
    partCopy.rotateX(-Math.PI/2);
    partCopy.myPosition = part.getWorldPosition(new THREE.Vector3());
    objetosControlados.push(partCopy);
    scene.add(partCopy);
}


//funcion para crear texto----------------------------------------

function createCSS2DObject(text) {
    const div = document.createElement('div');
    div.className = 'label';
    div.textContent = text;
    div.style.marginTop = '-5em'; // Ajusta el valor según la distancia que deseas
    div.style.backgroundColor = 'red';
    //div.style.border = '2px solid black';
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
    labelRenderer.render(scene, camera);
    renderer.render(scene,camera);
    //console.log("posición de la camara",camera.position);
}


renderer.setAnimationLoop(animate);
