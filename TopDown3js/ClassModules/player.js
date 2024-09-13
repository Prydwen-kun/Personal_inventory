import { PointerLockControls } from "../three.js-master/examples/jsm/controls/PointerLockControls.js";
import * as THREE from "../three.js-master/build/three.module.js";
import * as CANNON from "cannon-es";
import * as RAYGROUP from "./rayGroup.js";

class player {
  constructor(name, camera, domElement, clock) {
    this.name = name;
    this.controls = new PointerLockControls(camera, domElement);
    this.controls.pointerSpeed = 1; //pointer Speed Option to set
    this.controls.maxPolarAngle = Math.PI - 0.01;
    this.controls.minPolarAngle = 0 + 0.01;
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

    console.log("Mesh pos :", this.mesh.position);
    //position and speed
    this.velocity = 10;

    this.direction = new THREE.Vector3(0, 0, 0);
    this.camera.getWorldDirection(this.direction);
    this.normalizedDirection = new CANNON.Vec3(
      this.direction.x,
      0,
      this.direction.z
    );

    //Keymap
    this.keymap = {};

    //flag
    this.jumping = false;
    this.touchFloor = false;

    //RAY GROUP
    this.rayLength = 2.01;
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
    this.camera.getWorldDirection(this.direction);
    if (this.direction.y >= 5) {
      this.normalizedDirection = new THREE.Vector3(
        Math.ceil(this.direction.x),
        0,
        Math.ceil(this.direction.z)
      );
    } else {
      this.normalizedDirection = new THREE.Vector3(
        Math.round(this.direction.x),
        0,
        Math.round(this.direction.z)
      );
    }

    console.log("this direction : ", this.normalizedDirection);
    // console.log("this velocity: ", this.body.velocity);
    // console.log("this body: ", this.body.position);
    this.body.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 1, 0),
      this.camera.quaternion.w
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
    ////UPDATE RAYGROUP//////
    console.log("this.direction : ", this.direction);
    if (this.body !== null) {
      ////UP////
      if (this.keymap["KeyW"] == true) {
        this.body.applyImpulse(
          this.normalizedDirection.multiplyScalar(this.velocity),
          new CANNON.Vec3(0, 0, 0)
        );
      }

      ////BACK////
      if (this.keymap["KeyS"] == true) {
        this.body.applyImpulse(
          this.normalizedDirection.multiplyScalar(-this.velocity),
          new CANNON.Vec3(0, 0, 0)
        );
      }

      //LEFT
      if (this.keymap["KeyA"] == true) {
        this.body.applyImpulse(
          this.normalizedDirection
            .applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2)
            .multiplyScalar(this.velocity),
          new CANNON.Vec3(0, 0, 0)
        );
      }

      //RIGHT
      if (this.keymap["KeyD"] == true) {
        this.body.applyImpulse(
          this.normalizedDirection
            .applyAxisAngle(new THREE.Vector3(0, 1, 0), -(Math.PI / 2))
            .multiplyScalar(this.velocity),
          new CANNON.Vec3(0, 0, 0)
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
      //////JUMP//////
      // floorArray.forEach((floor) => {
      //   if (this.body.aabb.overlaps(floor.body.aabb)) {
      //     this.touchFloor = true;
      //   }
      // });
      console.log(
        "top hit:",
        this.rayGroup.topRay.hasHit,
        "bottom hit :",
        this.rayGroup.bottomRay.hasHit
      );
      if (this.rayGroup.bottomRay.hasHit) {
        this.touchFloor = true;
      }

      if (this.keymap["Space"] == true && !this.rayGroup.topRay.hasHit) {
        if (!this.jumping && this.touchFloor) {
          //add vertical impulse
          this.body.applyImpulse(
            new CANNON.Vec3(0, 600, 0),
            this.mesh.position
          );
          this.jumping = true;
        }
      }

      if (this.jumping && this.touchFloor) {
        // this.body.velocity = new CANNON.Vec3(0, 0, 0);
        this.jumping = false;
      }
      this.touchFloor = false;
    }

    //UPDATE CAMERA AND COLLIDER POSITION

    //clamp velocity
    // if (this.body.velocity.length() >= this.velocity) {
    //   this.body.velocity.normalize();
    //   this.body.velocity.scale(this.velocity);
    // }

    this.camera.position.copy(
      new THREE.Vector3(
        this.body.position.x,
        this.body.position.y + 0.75,
        this.body.position.z
      )
    );
    this.body.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 1, 0),
      this.camera.quaternion.w
    );
    // this.camera.position.y += 0.75;
  }
}

export { player };
