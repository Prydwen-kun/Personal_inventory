import "./style.css";
import * as THREE from "./three.js-master/build/three.module.js";
import * as PLAYER from "./ClassModules/player.js";
import * as MOBS from "./ClassModules/mobs.js";
import * as BALL from "./ClassModules/ball.js";
import * as MAP from "./ClassModules/map.js";
import * as CANNON from "cannon-es";
import * as CANNON_INIT from "./ClassModules/cannon_init.js";
import * as GAMESTATE from "./ClassModules/gamestate.js";
import * as ATH from "./ClassModules/ath.js";
import * as MESHLOADER from "./ClassModules/meshLoader.js";
import { Sky } from "./three.js-master/examples/jsm/objects/Sky.js";
import { EffectComposer } from "./three.js-master/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "./three.js-master/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "./three.js-master/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "./three.js-master/examples/jsm/shaders/FXAAShader.js";

//INIT SCENE AND CAMERA
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// scene settings
scene.background = new THREE.Color(0xfa6f66);
scene.fog = new THREE.Fog(0xbbbbbb, 10, 500);
scene.updateWorldMatrix(true, true);
// renderer settings
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
// fxaa AA settings
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const fxaaPass = new ShaderPass(FXAAShader);
let pixelRatio = renderer.getPixelRatio();
let uniforms = fxaaPass.material.uniforms;
uniforms["resolution"].value.x = 1 / (window.innerWidth * pixelRatio);
uniforms["resolution"].value.y = 1 / (window.innerHeight * pixelRatio);
composer.addPass(fxaaPass);

document.getElementById("game_container").appendChild(renderer.domElement);

//////////CANNON VAR INIT/////////////
let sceneObjectArray = [];
let sceneActorArray = [];

const world = CANNON_INIT.initCannon().world;

//TEXTURE LOADER
const loader = new THREE.TextureLoader();
const meshLoader = new MESHLOADER.meshLoader();

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
const geometry = new THREE.BoxGeometry(1, 3, 0.2);
const material = new THREE.MeshLambertMaterial({ color: 0x333300 });
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;
cube.receiveShadow = false;
scene.add(cube);
cube.position.y = 2;
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

//BALLS
const balls = [];
for (let i = 0; i <= 12; i++) {
  balls.push(new BALL.ball(0.25, scene));

  balls[i].model = await meshLoader.loadMesh("/ramen/Ramen/Ramen.glb");
  balls[i].mesh = balls[i].model.scene;
  balls[i].addToScene(scene);
  balls[i].mesh.position.set(
    new THREE.Vector3(0, 0, -20).applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      Math.PI / 4 + i
    ).x,
    new THREE.Vector3(0, 0, -20).applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      Math.PI / 4 + i
    ).y,
    new THREE.Vector3(0, 0, -20).applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      Math.PI / 4 + i
    ).z
  );
  balls[i].cannon_init(world, sceneActorArray);
}

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
  {
    friction: 0.8,
    restitution: 0.0,
    contactEquationRelaxation: 10.0,
    frictionEquationStiffness: 1,
  }
);

playerTerrainContactMaterial.id = 10;

const ballTerrainContactMaterial = new CANNON.ContactMaterial(
  balls[0].getBody().material,
  map1.getFloorObject().body.material,
  {
    friction: 0.8,
    restitution: 0.5,
  }
);

ballTerrainContactMaterial.id = 11;

console.log("world contact material : ", playerTerrainContactMaterial);
world.addContactMaterial(playerTerrainContactMaterial);
world.addContactMaterial(ballTerrainContactMaterial);

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

      cube.rotation.x += 0.05;
      cube.rotation.y += 0.1;

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

      // FXAA
      // composer.render(deltaTimeStoring);
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
