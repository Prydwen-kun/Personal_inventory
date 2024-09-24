import * as THREE from "..//three.js-master/build/three.module.js";
import * as CUBE from "./cube.js";
import * as CANNON_INIT from "./cannon_init.js";

class map {
  constructor(scene, loader) {
    this.scene = scene;
    this.loader = loader;
    //level geometry importe un json et foreach genere la map
    //WALL (-50, 0.5, 0)
    this.wall = new CUBE.cube(
      100,
      40,
      1,
      loader,
      -50,
      0.5,
      0,
      "/metal_plate_diff_1k.jpg"
    );
    this.wall.rotate(0, Math.PI / 2, 0);
    this.wall.addToScene(scene);
    this.wall.type = "wall";
    //WALL (0, 0.5, 50)
    this.wall2 = new CUBE.cube(
      100,
      40,
      1,
      loader,
      0,
      0.5,
      50,
      "/metal_plate_diff_1k.jpg"
    );
    this.wall2.rotate(0, 0, 0);
    this.wall2.addToScene(scene);
    this.wall2.type = "wall";
    //WALL (50, 0.5, 0)
    this.wall3 = new CUBE.cube(
      100,
      40,
      1,
      loader,
      50,
      0.5,
      0,
      "/metal_plate_diff_1k.jpg"
    );
    this.wall3.rotate(0, Math.PI / 2, 0);
    this.wall3.addToScene(scene);
    this.wall3.type = "wall";

    this.wall4 = new CUBE.cube(
      100,
      40,
      1,
      loader,
      0,
      0.5,
      -50,
      "/metal_plate_diff_1k.jpg"
    );
    this.wall4.rotate(0, 0, 0);
    this.wall4.addToScene(scene);
    this.wall4.type = "wall";

    this.wallFloor = new CUBE.cube(
      10000,
      10,
      10000,
      loader,
      0,
      -5,
      0,
      "/rocky_trail_02_diff_1k.jpg"
    );
    this.wallFloor.rotate(0, 0, 0);
    this.wallFloor.addToScene(scene);
    this.wallFloor.type = "floor";

    this.wallFloor2 = new CUBE.cube(
      10,
      1,
      10,
      loader,
      0,
      5,
      0,
      "/metal_plate_diff_1k.jpg"
    );
    this.wallFloor2.rotate(0, 0, 0);
    this.wallFloor2.addToScene(scene);
    this.wallFloor2.type = "floor";

    this.wallFloor3 = new CUBE.cube(
      5,
      1,
      5,
      loader,
      0,
      10,
      10,
      "/metal_plate_diff_1k.jpg"
    );
    this.wallFloor3.rotate(0, 0, 0);
    this.wallFloor3.addToScene(scene);
    this.wallFloor3.type = "floor";

    this.mapGeometry = [];
    this.floorArray = [];
  }
  generateMapCollider(world, sceneObjectArray) {
    for (const mapObject in this) {
      if (mapObject.includes("wall")) {
        CANNON_INIT.addStaticBoxCollider(
          this[mapObject],
          world,
          sceneObjectArray
        );
        this.mapGeometry.push(this[mapObject]);
      } else {
        console.log(mapObject);
      }
      if (mapObject.includes("Floor")) {
        this.floorArray.push(this[mapObject]);
      }
    }
  }
  getFloorObject() {
    return this.wallFloor; //return an array of all floor object TODO
  }
  getFloorArray() {
    return this.floorArray;
  }
  getMapGeometry() {
    return this.mapGeometry;
  }
}
export { map };
