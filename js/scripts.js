/*Imports*/
import * as THREE from 'three';
//import * as TWEEN from 'tween';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {DragControls} from '../js/modules/DragControls';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js';
import {CSS2DRenderer, CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';

let partesCuerpo = []; // array donde meto las partes del cuerpo
let raycasterEnabled = false; // raycaster al principio desactivado , se activa al habilitarlo con el boton
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const skeletonUrl = new URL('../models/zAnatomy-OnlyHead.fbx', import.meta.url);


console.log("tuttol la pera con la papaya",skeletonUrl);
let busto; // referencia al busto
let isObjectSelected = false; //booleano para saber si hay un objeto seleccionado o no
let selectedPart; //poder acceder a la parte seleccionada en cualquier momento
let objetosControlados = []; // lista objetos de drag and drop

const toggleDragDropButton = document.getElementById('toggleDragDrop');
let orbitControlsEnabled = true;



// Obtener referencias a los elementos HTML
const opacitySlider = document.getElementById("opacity-slider");
const opacityValue = document.getElementById("opacity-value");
/*
const TransparencyNotSelectedMaterial = new THREE.MeshStandardMaterial();
TransparencyNotSelectedMaterial.transparent = true;
TransparencyNotSelectedMaterial.color = new THREE.Color(0x40CFFF);
TransparencyNotSelectedMaterial.side = THREE.DoubleSide;
TransparencyNotSelectedMaterial.opacity = 0.25;*/







/*Inicialización creación render , camera ,etc*/ 


const axesHelper = new THREE.AxesHelper(300); // Creación de los ejes para ayudar
let axis = false; // al principio no se muestran



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
    
    //console.log("la funcion se llamó");
});



//Controles de las vistas
//----------------------------------------------------------------------------------------------------------------------------------
upView.addEventListener("click", function(){
    camera.position.set(0,50,0);
    camera.lookAt(0,0,0);
    
    //console.log("la funcion se llamó");
});
frontView.addEventListener("click", function(){
    camera.position.set(0,0,50);
    camera.lookAt(0,0,0);
    
    //console.log("la funcion se llamó");
});
downView.addEventListener("click", function(){
    camera.position.set(0,-50,0);
    camera.lookAt(0,0,0);
    
    //console.log("la funcion se llamó");
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
    isObjectSelected = false;
    //console.log("la funcion se llamó");
});


toggleDragDropButton.addEventListener('click', function () {
    toggleDragDropButton.classList.toggle('active');
    orbitControlsEnabled = !orbitControlsEnabled;
    controls.enabled = orbitControlsEnabled;
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






const dragControls = new DragControls(objetosControlados, camera, renderer.domElement);
dragControls.enabled = false;



dragControls.addEventListener('dragstart', function (event) {
    console.log('dragstart', event.object);
    currentCSSObject = createCSS2DObject('Texto por encima del objeto');
    event.object.add(currentCSSObject);   
});

dragControls.addEventListener('drag', (event) => {
    console.log('drag', event.object);

    const xPos = event.object.position.x;
    const yPos = event.object.position.y;
    const zPos = event.object.position.z;

    const partPos = selectedPart.getWorldPosition(new THREE.Vector3());

    // Verifica si el objeto ha alcanzado la posición deseada
    if ((xPos >= partPos.x-2 && xPos < partPos.x+2) && (yPos >= partPos.y-2 && yPos < partPos.y+2) && (zPos >= partPos.z-2 && zPos < partPos.z+2)) {
        // Actualiza el texto y el color del fondo del objeto según sea necesario
        if (currentCSSObject) {
            currentCSSObject.element.innerHTML = 'Posición correcta';
            changeBackgroundColor(currentCSSObject, 'green');
        }
    } else {
        if (currentCSSObject) {
            currentCSSObject.element.innerHTML = 'Posición incorrecta';
            changeBackgroundColor(currentCSSObject, 'red');
        }
    }
});


dragControls.addEventListener('dragend', (event) => {
    console.log('dragend', event.object.getWorldPosition(new THREE.Vector3()));
    if (currentCSSObject) {
        event.object.remove(currentCSSObject);
        currentCSSObject = null;
    }

    const xPos = event.object.position.x;
    const yPos = event.object.position.y;
    const zPos = event.object.position.z;
    if(selectedPart){
        const partPos = selectedPart.getWorldPosition(new THREE.Vector3());

    // Verifica si el objeto ha alcanzado la posición deseada
    if ((xPos >= partPos.x-2 && xPos < partPos.x+2) && (yPos >= partPos.y-2 && yPos < partPos.y+2) && (zPos >= partPos.z-2 && zPos < partPos.z+2)) {
        // Coloca el objeto en la posición exacta
        event.object.position.set(partPos.x, partPos.y, partPos.z);
    }

    }
    
});




/* Orbit controls*/
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


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
        partesCuerpo.forEach((p)=>{
            if(p.name == intersects[0].object.name){
                p.isSelected = true;
                animarCamara(camera, p);
                selectedPart = p;
                isObjectSelected = true;
                console.log("parte clicada", p.name);

            }
            else{ p.isSelected = false}
        })
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

            partesCuerpo.forEach((p)=>{
                if(p.name == intersects[intersectIndex].object.name){
                    p.isSelected = true;
                    animarCamara(camera, p);
                    selectedPart = p;
                    console.log("parte seleccionada", p.name);

                } 
                else{ p.isSelected = false}
            })
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
    controls.enabled = !raycasterEnabled;
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

// loader fbx---------------------------------------------------------------------------
const fbxLoader = new FBXLoader();
fbxLoader.load(
    skeletonUrl.href,
    
    // funcion para recorrer objeto-----------------------------------------------------------------
    (object) => {
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
                            isObjectSelected = true;
                            showPartName(parte.name);
                            const copiedPartPosition = new THREE.Vector3(20, 20, 0); 
                            addPartCopy(selectedPart, copiedPartPosition);
                            
                    
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
        object.translateY(-45);
        object.rotateX(-Math.PI/2);
        console.log("posición del busto",object.position);
        /*
        const boundingBox = new THREE.Box3().setFromObject(object);
        const size = boundingBox.getSize(new THREE.Vector3());
        bustoSize = Math.max(size.x, size.y, size.z);*/
        //console.log("tamaño busto",maxSize);
        busto = object; // tener referencia al busto en cualquier momento
        scene.add(object)
        
        // console.log("I arrived here")
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
    // final object
)
// final loader -------------------------------------------------------------------------------------------------------------------------------

function updateOpacity() {
    const opacity = opacitySlider.value / 100; // Convertir el valor del control deslizante (0-100) a opacidad (0-1)
    opacityValue.innerText = `${opacitySlider.value}%`; // Mostrar el valor de opacidad en porcentaje

    // Recorrer todas las partes del cuerpo y actualizar la opacidad de sus materiales
    
    partesCuerpo.forEach((parte) => {
        if(!parte.isSelected){
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

        }} else{
            

            parte.material = parte.originalMaterials;


        }
    
    });
    //animate();
}



let animationRequestId;
function animarCamara(camara, nuevaParte) {
    let boundingBox = new THREE.Box3().setFromObject(nuevaParte);
    let size = boundingBox.getSize(new THREE.Vector3());
    const maxNuevaParte = Math.max(size.x, size.y, size.z);
    let posicionNuevaParte = nuevaParte.getWorldPosition(new THREE.Vector3());
    console.log("posicion nueva parte", posicionNuevaParte.y);
    let posicionAnterior;
    let newX;
    let newY;
    let newZ;
 

        boundingBox = new THREE.Box3().setFromObject(busto);// parte seleccionada previamente
        size = boundingBox.getSize(new THREE.Vector3());
        const maxBusto = Math.max(size.x, size.y, size.z);

        console.log("maxBusto animar: ", maxBusto);
        console.log("maxNuevaParte animar: ", nuevaParte.getWorldPosition(new THREE.Vector3()));

        
        //newZ = calculateDistance(150, maxNuevaParte, maxBusto);
        newZ = ((maxNuevaParte*(busto.position.z + 50))/maxBusto)*0.7;
        newY = posicionNuevaParte.y ;
        newX = posicionNuevaParte.x ;
        console.log("posicion camara", camara.position);

        console.log("posicion busto", busto.getWorldPosition(new THREE.Vector3()))
        console.log("posicion nueva parte", posicionNuevaParte)
        console.log("nueva parte", nuevaParte);
        


    newX = Math.round(newX);
    newY = Math.round(newY);
    newZ = Math.round(newZ);
    console.log("nueva x", newX);
    console.log("nueva y", newY);
    console.log("nueva z", newZ);
    
    
    /*
    const startPosition = camara.position.clone();
    const targetPosition = new THREE.Vector3(newX, newY, newZ);
    const animationDuration = 2000; // Duración de la animación en milisegundos
    const startTime = performance.now();

    if (animationRequestId) {
        cancelAnimationFrame(animationRequestId);
    }

    function animateCamera(time) {
        const elapsedTime = time - startTime;
        const progress = Math.min(elapsedTime / animationDuration, 1);

        camara.position.lerpVectors(startPosition, targetPosition, progress);

        if (progress < 1) {
            animationRequestId = requestAnimationFrame(animateCamera);
        } else {
            camara.position.copy(targetPosition);
            animationRequestId = null;
            camara.lookAt(posicionNuevaParte);
            console.log("hollaaaaaaa")
            console.log(camara.position, camara.getWorldDirection(new THREE.Vector3()), posicionNuevaParte);
        }
    }

    animationRequestId = requestAnimationFrame(animateCamera);
    
    */



     

     //camara.position.set(newX, newY, newZ);

     /*
    const startPosition = camara.position.clone();
    const targetPosition = new THREE.Vector3(newX, newY, newZ);
    const startDirection = camara.getWorldDirection(new THREE.Vector3()).clone();
    const targetDirection = posicionNuevaParte.clone().sub(camara.position).normalize();
    const animationDuration = 2000;
    const startTime = performance.now();

    if (animationRequestId) {
        cancelAnimationFrame(animationRequestId);
    }

    
    function animateCamera(time) {    
        const elapsedTime = time - startTime;
        const progress = Math.min(elapsedTime / animationDuration, 1);
    
        camara.position.lerpVectors(startPosition, targetPosition, progress);
    
        // Interpolar la dirección de la cámara
        const currentDirection = startDirection.clone().lerp(targetDirection, progress);
        const currentTarget = camara.position.clone().add(currentDirection);
        camara.lookAt(currentTarget);
    
        if (progress < 1) {
            animationRequestId = requestAnimationFrame(animateCamera);
        } else {
            // Establecer exactamente la posición y dirección objetivo al final de la animación
            camara.position.copy(targetPosition);
            camara.lookAt(posicionNuevaParte);
            animationRequestId = null;
            console.log(camara.position, camara.getWorldDirection(new THREE.Vector3()), posicionNuevaParte);
        }

    }

*/   new TWEEN.Tween(camera.position)
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

    /*new TWEEN.Tween(camara.lookAt)
    .to(
    {
        x: newX,
        y: newY,
        z: newZ,
    },
    500
    )
    .easing(TWEEN.Easing.Cubic.Out)
    .start()
    }*/

    //camara.position.set(newX,newY,newZ);
    //camera.lookAt(posicionNuevaParte);
    
}

   // animationRequestId = requestAnimationFrame(animateCamera);
     
  //}
  


function addPartCopy(part, position) {
    const partCopy = part.clone();
    partCopy.position.set(position.x, position.y, position.z);
    partCopy.scale.set(.004, .004, .004);
    partCopy.translateY(-45);
    partCopy.rotateX(-Math.PI/2);
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
