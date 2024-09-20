import * as CANNON from "cannon-es";
import * as THREE from "..//three.js-master/build/three.module.js";
function initCannon() {
  const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0),
    defaultContactMaterial: { restitution: 0, friction: 0.8 },
  });
  world.defaultMaterial.friction = 0.8;
  world.defaultMaterial.restitution = 0;
  world.defaultContactMaterial.materials[0] = world.defaultMaterial;
  world.defaultContactMaterial.materials[1] = world.defaultMaterial;
  world.defaultContactMaterial.friction = 0.8;
  world.defaultContactMaterial.restitution = 0;
  world.addContactMaterial(world.defaultContactMaterial);

  return {
    world: world,
  };
}

function addBoxCollider(sceneObject, world, sceneActorArray) {
  let sizeCopy = new THREE.Vector3(
    sceneObject.size.x / 2,
    sceneObject.size.y / 2,
    sceneObject.size.z / 2
  );
  sceneObject.shape = new CANNON.Box(sizeCopy); //sceneObject.size
  sceneObject.mass = 80;
  sceneObject.body = new CANNON.Body({
    mass: 80,
    material: sceneObject.cannonMaterial,
  });

  sceneObject.body.addShape(sceneObject.shape);

  sceneObject.body.position.copy(sceneObject.mesh.position);
  sceneObject.body.quaternion.copy(sceneObject.mesh.quaternion);

  sceneObject.body.updateAABB();

  world.addBody(sceneObject.body);
  sceneActorArray.push(sceneObject);
}

function addStaticBoxCollider(sceneObject, world, sceneObjectArray) {
  let sizeCopy = new THREE.Vector3(
    sceneObject.size.x / 2,
    sceneObject.size.y / 2,
    sceneObject.size.z / 2
  );
  sceneObject.shape = new CANNON.Box(sizeCopy);
  sceneObject.mass = 0;
  sceneObject.body = new CANNON.Body({
    mass: 0,
    material: sceneObject.cannonMaterial,
  });

  sceneObject.body.addShape(sceneObject.shape);

  sceneObject.body.position.copy(sceneObject.mesh.position);
  sceneObject.body.quaternion.copy(sceneObject.mesh.quaternion);

  sceneObject.body.updateAABB();

  world.addBody(sceneObject.body);
  sceneObjectArray.push(sceneObject);
}

function addSphereCollider(sceneObject, world, sceneActorArray) {
  sceneObject.shape = new CANNON.Sphere(sceneObject.radius);
  sceneObject.mass = 30;
  sceneObject.body = new CANNON.Body({
    mass: 30,
    material: sceneObject.cannonMaterial,
  });

  sceneObject.body.addShape(sceneObject.shape);

  sceneObject.body.position.copy(sceneObject.mesh.position);
  sceneObject.body.quaternion.copy(sceneObject.mesh.quaternion);

  sceneObject.body.updateAABB();

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
