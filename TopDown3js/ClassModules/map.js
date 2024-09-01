import * as THREE from "..//three.js-master/build/three.module.js";
import * as CUBE from "./cube.js";
import * as CANNON_INIT from "./cannon_init.js";

class map {
  constructor(scene, loader) {
    this.scene = scene;
    this.loader = loader;
    //level geometry importe un json et foreach genere la map
    //WALL (-50, 0.5, 0)
    this.wall = new CUBE.cube(100, 40, 1, loader, -50, 0.5, 0);
    this.wall.rotate(0, Math.PI / 2, 0);
    this.wall.addToScene(scene);
    this.wall.type = "wall";
    //WALL (0, 0.5, 50)
    this.wall2 = new CUBE.cube(100, 40, 1, loader, 0, 0.5, 50);
    this.wall2.rotate(0, 0, 0);
    this.wall2.addToScene(scene);
    this.wall2.type = "wall";
    //WALL (50, 0.5, 0)
    this.wall3 = new CUBE.cube(100, 40, 1, loader, 50, 0.5, 0);
    this.wall3.rotate(0, Math.PI / 2, 0);
    this.wall3.addToScene(scene);
    this.wall3.type = "wall";

    this.wall4 = new CUBE.cube(100, 40, 1, loader, 0, 0.5, -50);
    this.wall4.rotate(0, 0, 0);
    this.wall4.addToScene(scene);
    this.wall4.type = "wall";

    this.wallFloor = new CUBE.cube(100, 1, 100, loader, 0, -0.5, 0);
    this.wallFloor.rotate(0, 0, 0);
    this.wallFloor.addToScene(scene);
    this.wallFloor.type = "floor";

    this.mapGeometry = [];
  }
  generateMapCollider(world, sceneObjectArray, floorMaterial) {
    for (const mapObject in this) {
      if (mapObject.includes("wall")) {
        CANNON_INIT.addStaticBoxCollider(
          this[mapObject],
          world,
          sceneObjectArray,
          floorMaterial
        );
        this.mapGeometry.push(mapObject);
      } else {
        console.log(mapObject);
      }
    }
  }
  getFloorObject() {
    return this.wallFloor; //return an array of all floor object TODO
  }
  getMapGeometry() {
    return this.mapGeometry;
  }
}
export { map };
