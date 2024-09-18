import "./style.css";
import * as THREE from "./three.js-master/build/three.module.js";
import * as PLAYER from "./ClassModules/player.js";
import * as MOBS from "./ClassModules/mobs.js";
import * as MAP from "./ClassModules/map.js";
import * as CANNON from "cannon-es";
import * as CANNON_INIT from "./ClassModules/cannon_init.js";
import * as GAMESTATE from "./ClassModules/gamestate.js";
import * as ATH from "./ClassModules/ath.js";
import { Sky } from "./three.js-master/examples/jsm/objects/Sky.js";

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

const world = CANNON_INIT.initCannon().world;

//TEXTURE LOADER
const loader = new THREE.TextureLoader();

//SKY
const sky = new Sky();
sky.scale.setScalar(450000);

const phi = THREE.MathUtils.degToRad(45);
const theta = THREE.MathUtils.degToRad(0);
const sunPosition = new THREE.Vector3().setFromSphericalCoords(1, phi, theta);

sky.material.uniforms.sunPosition.value = sunPosition;

scene.add(sky);

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
map1.generateMapCollider(world, sceneObjectArray);

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
// const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(helper);

//camera position + player starting pos
camera.position.z = 0;
camera.position.y = 2;

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

CANNON_INIT.addBoxCollider(player1, world, sceneActorArray);
const playerTerrainContactMaterial = new CANNON.ContactMaterial(
  player1.getPlayerBody().material,
  map1.getFloorObject().body.material,
  { friction: 0.8, restitution: 0 }
);
playerTerrainContactMaterial.id = 10;
console.log("world contact material : ", playerTerrainContactMaterial);
world.addContactMaterial(playerTerrainContactMaterial);

/////////////////CANNON INIT////////////
console.log("scene actor array : ", sceneActorArray);
console.log("scene object array : ", sceneObjectArray);
console.log("floor array : ", map1.getFloorArray());

//////ATH////////
let gameUI = new ATH.UI_data();

/////////////////////////////////////////////////APP MAIN LOOP////////////////////////////////////
/////////////////////////////////////////////////APP MAIN LOOP////////////////////////////////////
/////////////////////////////////////////////////APP MAIN LOOP////////////////////////////////////
function updatePlay() {
  // console.log(gameState.getGameState())
  switch (gameState.getGameState()) {
    //PAUSE/////////////
    case "pause":
      requestAnimationFrame(updatePlay);
      gameUI.displayGameData(gameState.timer, gameState.score);
      break;
    //GAME//////////////
    case "game":
      requestAnimationFrame(updatePlay);
      let deltaTimeStoring = clock.getDelta();

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      //game timer
      gameState.stepClockSec(deltaTimeStoring);
      //update game info data
      gameUI.displayGameData(gameState.timer, gameState.score);
      gameState.updateScore(player1.getPlayerPosition().y);

      //UPDATE ALL ACTOR IN THE SCENE
      // player1.update(deltaTimeStoring, map1.getFloorObject());
      player1.update(deltaTimeStoring, map1.getFloorArray(), world);

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
