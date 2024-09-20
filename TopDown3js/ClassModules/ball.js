import * as THREE from "../three.js-master/build/three.module.js";
import * as CANNON from "cannon-es";
import * as CANNON_INIT from "./cannon_init.js";
import { meshLoader } from "./meshLoader.js";

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

    this.meshLoader = new meshLoader();
    this.model = this.meshLoader.loadMesh("/chicken/chickenV2.glb", scene);

    this.cannonMaterial = new CANNON.Material({ restitution: 0.5 });
    this.cannonMaterial.name = "ballMaterial";
    this.cannonMaterial.id = 3;
  }
  addToScene(scene) {
    if (typeof this.model == typeof THREE.Object3D) {
      scene.add(this.model);
    } else {
      scene.add(this.mesh);
    }
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
