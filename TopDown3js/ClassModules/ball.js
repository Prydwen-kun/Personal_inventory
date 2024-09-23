import * as THREE from "../three.js-master/build/three.module.js";
import * as CANNON from "cannon-es";
import * as CANNON_INIT from "./cannon_init.js";

class ball {
  constructor(radius = 1, scene) {
    this.isActor = true;
    this.radius = radius;
    this.geometry = new THREE.SphereGeometry(this.radius);
    this.material = new THREE.MeshLambertMaterial({ color: 0xee3311 });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = false;

    this.scene = scene;

    this.model = {}

    this.cannonMaterial = new CANNON.Material({ restitution: 0.5 });
    this.cannonMaterial.name = "ballMaterial";
    this.cannonMaterial.id = 3;
  }
  addToScene(scene) {
    scene.add(this.mesh);
  }
  removeFromScene(scene) {
    scene.remove(this.mesh); //plus delete collider lmao
  }
  cannon_init(world, sceneActorArray) {
    CANNON_INIT.addSphereCollider(this, world, sceneActorArray);
  }

  getBody() {
    return this.body;
  }
}

export { ball };
