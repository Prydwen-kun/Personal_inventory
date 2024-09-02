import "./style.css";
import * as THREE from "./three.js-master/build/three.module.js";
import * as PLAYER from "./ClassModules/player.js";
import * as MOBS from "./ClassModules/mobs.js";
import * as MAP from "./ClassModules/map.js";
import * as CANNON from "cannon-es";
import * as CANNON_INIT from "./ClassModules/cannon_init.js";
import * as GAMESTATE from "./ClassModules/gamestate.js";
import * as ATH from "./ClassModules/ath.js";

//INIT SCENE AND CAMERA
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
scene.background = new THREE.Color(0xfa6f66);
scene.fog = new THREE.Fog(0xbbbbbb, 10, 500);
scene.updateWorldMatrix(true, true);
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
document.getElementById("game_container").appendChild(renderer.domElement);

//////////CANNON VAR INIT/////////////
let sceneObjectArray = [];
let sceneActorArray = [];

const CannonInitObject = CANNON_INIT.initCannon();
const world = CannonInitObject.world;
const floorMaterial = CannonInitObject.floorMaterial;
const characterMaterial = CannonInitObject.characterMaterial;

//TEXTURE LOADER
const loader = new THREE.TextureLoader();

//CLOCK
const clock = new THREE.Clock();

// ROTATING CUBE
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshLambertMaterial({ color: 0xcccc00 });
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;
cube.receiveShadow = false;
scene.add(cube);
cube.position.y = 1;
cube.position.x = -10;

/////////////////////INIT MAP/////////////////
const map1 = new MAP.map(scene, loader);
map1.generateMapCollider(world, sceneObjectArray,floorMaterial);

//AMBIENT LIGHT
const light = new THREE.AmbientLight(0xcccccc); // soft white light
scene.add(light);

// LIGHT DIRECTIONAL
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 50, 60);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.top = 60;
directionalLight.shadow.camera.bottom = -60;
directionalLight.shadow.camera.left = -60;
directionalLight.shadow.camera.right = 60;
scene.add(directionalLight);
directionalLight.target = map1.wallFloor.mesh; //wall
scene.add(directionalLight.target);
const helperLight = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(helperLight);
directionalLight.target.updateMatrixWorld();

//helper
const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(helper);

//camera position
camera.position.z = 5;
camera.position.y = 1.75;

//PLAYER
const player1 = new PLAYER.player("P1", camera, renderer.domElement, clock);

// EVENT LISTENERS AND GAMESTATE
const gameState = new GAMESTATE.gamestate();

const blocker = document.getElementById("blocker");
const instructions = document.getElementById("instructions");

instructions.addEventListener("click", function () {
  player1.getPlayerControls().lock();
});

player1.getPlayerControls().addEventListener("lock", function () {
  instructions.style.display = "none";
  blocker.style.display = "none";
  gameState.setGameState("game");
});

player1.getPlayerControls().addEventListener("unlock", function () {
  blocker.style.display = "block";
  instructions.style.display = "";
  gameState.setGameState("pause");
});

scene.add(player1.getPlayerControls().getObject());

/////////////////CANNON INIT////////////
//array of all scene object to process collision

CANNON_INIT.addBoxCollider(player1, world, sceneActorArray, characterMaterial);

/////////////////CANNON INIT////////////
console.log("scene actor array : ", sceneActorArray);
console.log("scene object array : ", sceneObjectArray);
console.log("floor array : ", map1.getFloorArray());


/////////////////////////////////////////////////APP MAIN LOOP////////////////////////////////////
/////////////////////////////////////////////////APP MAIN LOOP////////////////////////////////////
/////////////////////////////////////////////////APP MAIN LOOP////////////////////////////////////
function updatePlay() {
  // console.log(gameState.getGameState())
  switch (gameState.getGameState()) {
    //PAUSE/////////////
    case "pause":
      requestAnimationFrame(updatePlay);
      break;
    //GAME//////////////
    case "game":
      requestAnimationFrame(updatePlay);
      let deltaTimeStoring = clock.getDelta();

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      //UPDATE ALL ACTOR IN THE SCENE
      // player1.update(deltaTimeStoring, map1.getFloorObject());
      player1.update(deltaTimeStoring, map1.getFloorArray());

      //UPDATE PHYSICS THROUGH CANNON
      CANNON_INIT.updatePhysics(
        sceneObjectArray,
        sceneActorArray,
        world,
        deltaTimeStoring
      );

      renderer.render(scene, camera);
      break;
    //MENU//////////////
    case "menu":
      requestAnimationFrame(updatePlay);
      break;
  }
}

updatePlay();

//IN CASE OF WINDOW RESIZE//
onresize = (event) => {
  renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
  camera.aspect = window.innerWidth / window.innerHeight;
};
/////////////////////////////////////////////////APP MAIN LOOP////////////////////////////////////
/////////////////////////////////////////////////APP MAIN LOOP////////////////////////////////////
/////////////////////////////////////////////////APP MAIN LOOP////////////////////////////////////
