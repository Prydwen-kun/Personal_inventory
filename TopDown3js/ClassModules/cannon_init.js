import * as CANNON from "cannon-es";
import * as THREE from "..//three.js-master/build/three.module.js";
function initCannon() {
  const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
  });

  //ADD MATERIAL
  const floorMaterial = new CANNON.Material("floorMaterial", {
    friction: 0.8,
    restitution: 0,
  });
  const characterMaterial = new CANNON.Material("characterMaterial", {
    friction: 0.8,
    restitution: 0,
  });

  //ADD contact between material
  const floorToCharacter = new CANNON.ContactMaterial(
    floorMaterial,
    characterMaterial,
    { friction: 0.8, restitution: 0 }
  );
  world.addContactMaterial(floorToCharacter);

  // world.broadphase = new CANNON.NaiveBroadphase();//need to look into this shit
  // world.solver.iterations = 10;

  return {
    world: world,
    floorMaterial: floorMaterial,
    characterMaterial: characterMaterial,
  };
}

function addBoxCollider(
  sceneObject,
  world,
  sceneActorArray,
  characterMaterial
) {
  let sizeCopy = new THREE.Vector3(
    sceneObject.size.x / 2,
    sceneObject.size.y / 2,
    sceneObject.size.z / 2
  );
  sceneObject.shape = new CANNON.Box(sizeCopy); //sceneObject.size
  sceneObject.mass = 60;
  sceneObject.body = new CANNON.Body({
    mass: 60,
    material: characterMaterial,
  });

  sceneObject.body.addShape(sceneObject.shape);

  sceneObject.body.position.copy(sceneObject.mesh.position);
  sceneObject.body.quaternion.copy(sceneObject.mesh.quaternion);

  sceneObject.body.updateAABB();

  world.addBody(sceneObject.body);
  sceneActorArray.push(sceneObject);
  //   {
  //     mesh: sceneObject.mesh,
  //     collider: sceneObject.body,
  //     type: "dynamic",
  //   }
}

function addStaticBoxCollider(
  sceneObject,
  world,
  sceneObjectArray,
  floorMaterial
) {
  let sizeCopy = new THREE.Vector3(
    sceneObject.size.x / 2,
    sceneObject.size.y / 2,
    sceneObject.size.z / 2
  );
  sceneObject.shape = new CANNON.Box(sizeCopy);
  sceneObject.mass = 0;
  sceneObject.body = new CANNON.Body({
    mass: 0,
    material: floorMaterial,
  });

  sceneObject.body.addShape(sceneObject.shape);

  sceneObject.body.position.copy(sceneObject.mesh.position);
  sceneObject.body.quaternion.copy(sceneObject.mesh.quaternion);

  sceneObject.body.updateAABB();

  world.addBody(sceneObject.body);
  sceneObjectArray.push(sceneObject);
}

function addSphereCollider(sceneObject, world, sceneActorArray) {
  sceneObject.shape = new CANNON.Sphere(1);
  sceneObject.mass = 10;
  sceneObject.body = new CANNON.Body({
    mass: 10,
  });

  sceneObject.body.addShape(sceneObject.shape);

  sceneObject.body.position.copy(sceneObject.mesh.position);
  sceneObject.body.quaternion.copy(sceneObject.mesh.quaternion);

  world.addBody(sceneObject.body);
  sceneActorArray.push(sceneObject);
}

function updatePhysics(sceneObjectArray, sceneActorArray, world, deltaTime) {
  // Step the physics world
  world.step(1 / 60, deltaTime, 10);
  // Copy coordinates from Cannon.js to Three.js
  sceneObjectArray.forEach((object) => {
    object.mesh.position.copy(object.body.position);
    object.mesh.quaternion.copy(object.body.quaternion);
    object.body.updateAABB();
  });
  sceneActorArray.forEach((object) => {
    object.mesh.position.copy(object.body.position);
    object.mesh.quaternion.copy(object.body.quaternion);
    object.body.updateAABB();
  });
}

export {
  initCannon,
  addBoxCollider,
  addStaticBoxCollider,
  addSphereCollider,
  updatePhysics,
};
