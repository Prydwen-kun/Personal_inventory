import * as THREE from "../three.js-master/build/three.module.js";
import { GLTFLoader } from "../three.js-master/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "../three.js-master/examples/jsm/loaders/DRACOLoader.js";

class meshLoader {
  constructor() {
    this.loadingManager = new THREE.LoadingManager();
    this.loadingManager.onLoad = () => {};

    this.GLTFloader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath(
      "../three.js-master/examples/jsm/libs/draco/"
    );
    this.GLTFloader.setDRACOLoader(this.dracoLoader);

    this.loadedMeshes = [];
    this.geometry = {};
  }

  loadMesh(modelUrl) {
    return new Promise((resolve, reject) => {
      this.GLTFloader.load(
        modelUrl,
        (gltf) => {
          resolve(gltf);
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        (error) => {
          console.log("An error happened !");
          reject(error);
        }
      );
    });
  }
}

export { meshLoader };
