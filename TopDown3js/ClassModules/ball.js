import * as THREE from "../three.js-master/build/three.module.js";
import * as CANNON from "cannon-es";
import * as CANNON_INIT from "./cannon_init.js";

class ball {
  constructor(radius = 1) {
    this.isActor = true;
    this.radius = radius;
    this.geometry = new THREE.SphereGeometry(this.radius);
    this.material = new THREE.MeshLambertMaterial({ color: 0xee3311 });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = false;

    this.cannonMaterial = new CANNON.Material({ restitution: 0.0 });
    this.cannonMaterial.name = "playerMaterial";
    this.cannonMaterial.id = 0;
  }
  addToScene(scene) {
    scene.add(this.mesh);
  }
  removeFromScene(scene) {
    scene.remove(this.mesh);
  }
  cannon_init(world, sceneActorArray) {
    CANNON_INIT.addSphereCollider(this, world, sceneActorArray);
  }
}

export { ball };
