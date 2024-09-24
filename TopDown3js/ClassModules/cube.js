import * as THREE from "..//three.js-master/build/three.module.js";
import * as CANNON from "cannon-es";

class cube {
  constructor(x, y, z, loader, posX, posY, posZ, texture) {
    const geometry = new THREE.BoxGeometry(x, y, z); //100 40 1
    const material = new THREE.MeshLambertMaterial({ color: 0x00aaee });
    const textureWall = loader.load(texture);
    textureWall.repeat.set(4, 4);
    if (texture == "/rocky_trail_02_diff_1k.jpg") {
      textureWall.repeat.set(1000, 1000);
    }
    textureWall.wrapS = THREE.RepeatWrapping;
    textureWall.wrapT = THREE.RepeatWrapping;
    const materialWall = new THREE.MeshLambertMaterial({ map: textureWall });

    this.size = new THREE.Vector3(x, y, z);
    this.mesh = new THREE.Mesh(geometry, materialWall);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.mesh.position.x = posX;
    this.mesh.position.y = posY;
    this.mesh.position.z = posZ;

    this.cannonMaterial = new CANNON.Material({ restitution: 0.0 });
    this.cannonMaterial.name = "terrainMaterial";
    this.cannonMaterial.id = 1;

    this.isActor = false;
  }
  rotate(rotX, rotY, rotZ) {
    this.mesh.rotateX(rotX);
    this.mesh.rotateY(rotY);
    this.mesh.rotateZ(rotZ);
  }
  addToScene(scene) {
    scene.add(this.mesh);
  }
  removeFromScene(scene) {
    scene.remove(this.mesh);
  }
}
export { cube };
