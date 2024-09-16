import { PointerLockControls } from "../three.js-master/examples/jsm/controls/PointerLockControls.js";
import * as THREE from "../three.js-master/build/three.module.js";
import * as CANNON from "cannon-es";
import * as RAYGROUP from "./rayGroup.js";

class player {
  constructor(name, camera, domElement, clock) {
    this.name = name;
    this.controls = new PointerLockControls(camera, domElement);
    this.controls.pointerSpeed = 1; //pointer Speed Option to set
    // this.controls.maxPolarAngle = Math.PI - 0.01;
    // this.controls.minPolarAngle = 0 + 0.01;
    this.renderCanvas = domElement;
    this.camera = camera;
    this.clock = clock;
    //stats
    this.health = 100;
    this.stamina = 100;

    this.isActor = true;
    this.size = new THREE.Vector3(1, 2, 1);
    this.geometry = new THREE.BoxGeometry(
      this.size.x,
      this.size.y,
      this.size.z
    );
    this.material = new THREE.MeshLambertMaterial({ color: 0xee3311 });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = false;
    // this.mesh.position.set(camera.position);
    this.mesh.position.set(
      camera.position.x,
      camera.position.y - 0.75,
      camera.position.z
    );

    // console.log("Mesh pos :", this.mesh.position);
    //position and speed
    this.velocity = 10;

    this.direction = new THREE.Vector3(0, 0, 0);
    this.camera.getWorldDirection(this.direction);
    this.normalizedDirection = new CANNON.Vec3(0, 0, -1);
    this.eulerAngleYXZ = new THREE.Euler().setFromQuaternion(
      this.camera.quaternion,
      "YXZ"
    );
    this.compoundVelocity = new CANNON.Vec3();

    //Keymap
    this.keymap = {};

    //flag
    this.jumping = false;
    this.touchFloor = false;

    //RAY GROUP
    this.rayLength = 1.05;
    this.rayGroup = new RAYGROUP.rayGroup(
      this.rayLength,
      this.mesh.position,
      this.normalizedDirection
    );
  }

  //getter
  getPlayerPosition() {
    return this.mesh.position;
  }
  getPlayerDirection() {
    return this.direction;
  }
  getPlayerControls() {
    return this.controls;
  }
  getPlayerVelocity() {
    return this.velocity;
  }
  //setter
  setPlayerDirection(direction) {
    this.direction = direction;
  }
  setPlayerVelocity(velocity) {
    this.velocity = velocity;
  }

  takeDamage(damage) {
    this.health -= damage;
  }

  //UPDATE PLAYER
  update(delta, floorArray, world) {
    //EVENT WATCH

    onkeydown = (event) => {
      //let _that = this;
      let keyCode = event.code;
      this.keymap[keyCode] = true;

      console.log(keyCode);
    };

    onkeyup = (event) => {
      //let _that = this;
      let keyCode = event.code;
      this.keymap[keyCode] = false;
    };

    //direction debug + normalizedDirection update

    //change body rotation
    this.eulerAngleYXZ = new THREE.Euler().setFromQuaternion(
      this.camera.quaternion,
      "YXZ"
    );
    this.body.quaternion.setFromEuler(0, this.eulerAngleYXZ.y, 0, "YXZ");
    //normalize quaternion
    // projection of quaternion on plan

    this.mesh.quaternion.copy(this.body.quaternion);
    //rotate unit direction vector from body
    this.mesh.getWorldDirection(this.direction);
    this.normalizedDirection = new CANNON.Vec3(
      this.direction.x,
      this.direction.y,
      this.direction.z
    );

    this.camera.position.copy(
      new THREE.Vector3(
        this.body.position.x,
        this.body.position.y + 0.75,
        this.body.position.z
      )
    );

    ////UPDATE RAYGROUP//////
    this.rayGroup.updateRayGroup(
      new THREE.Vector3(
        this.body.position.x,
        this.body.position.y,
        this.body.position.z
      ),
      this.normalizedDirection,
      world
    );
    console.log(
      "ray group :",
      this.rayGroup.bottomRay.from,
      this.rayGroup.bottomRay.to,
      this.rayGroup.bottomRay.hasHit
    );
    ////UPDATE RAYGROUP//////

    if (this.body !== null) {
      ////UP////
      this.compoundVelocity.set(0, 0, 0);
      if (this.keymap["KeyW"] == true) {
        this.compoundVelocity.addScaledVector(
          -this.velocity,
          this.normalizedDirection,
          this.compoundVelocity
        );
      }

      ////BACK////
      if (this.keymap["KeyS"] == true) {
        this.compoundVelocity.addScaledVector(
          this.velocity,
          this.normalizedDirection,
          this.compoundVelocity
        );
      }

      //LEFT
      if (this.keymap["KeyA"] == true) {
        this.compoundVelocity.addScaledVector(
          this.velocity,
          new CANNON.Quaternion()
            .setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -(Math.PI / 2))
            .vmult(this.normalizedDirection.clone()),
          this.compoundVelocity
        );
      }

      //RIGHT
      if (this.keymap["KeyD"] == true) {
        this.compoundVelocity.addScaledVector(
          this.velocity,
          new CANNON.Quaternion()
            .setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2)
            .vmult(this.normalizedDirection.clone()),
          this.compoundVelocity
        );
      }
    }

    /////SPRINT////
    if (this.keymap["ShiftLeft"] == true) {
      this.velocity = 16;
    } else {
      this.velocity = 10;
    }

    if (typeof this.body !== undefined) {
      //////JUMP//////change this to velocity

      if (this.rayGroup.bottomRay.hasHit) {
        this.touchFloor = true;
      }

      if (this.keymap["Space"] == true) {
        if (!this.jumping && this.touchFloor) {
          //add vertical impulse
          this.body.applyImpulse(
            new CANNON.Vec3(0, 600, 0),
            this.mesh.position
          );
          this.jumping = true;
        }
      }

      if (this.touchFloor) {
        this.jumping = false;
      }
      this.touchFloor = false;
    }
    this.body.velocity = this.compoundVelocity;
  }
}

export { player };
