import { PointerLockControls } from "../three.js-master/examples/jsm/controls/PointerLockControls.js";
import * as THREE from "../three.js-master/build/three.module.js";
import * as CANNON from "cannon-es";
import * as RAYGROUP from "./rayGroup.js";

class player {
  constructor(name, camera, domElement, clock) {
    this.name = name;
    this.controls = new PointerLockControls(camera, domElement);
    this.controls.pointerSpeed = 1;
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
    this.normalizedDirection = this.direction.clone().normalize();
    console.log("PC direction :", this.direction);
    //Keymap
    this.keymap = {};

    //flag
    this.jumping = false;
    this.touchFloor = false;

    //RAY GROUP
    /* Using .applyAxisAngle ( vec3 normalized , angle in rad)
    forward : 0,0,0 --> direction 1,0,0
    move forward 2 on X --> 2,0,0 --> direction 3,0,0
    move 1,0,-1 XZ --> direction 2,0,-1
    rotate left 90° --> direction 1,0,-2
    */
    this.rayLength = 0.5;
    this.rayGroup = new RAYGROUP.rayGroup(
      0.5,
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
    this.normalizedDirection = this.direction.clone().normalize();
    // console.log("PC direction :", this.direction);

    ////UPDATE RAYGROUP//////
    this.rayGroup.updateRayGroup(
      this.mesh.position,
      this.normalizedDirection,
      world
    );
    ////UPDATE RAYGROUP//////

    if (this.body !== null) {
      //UP
      if (
        this.keymap["KeyW"] == true &&
        !this.rayGroup.forwardRay.hasHit &&
        !this.rayGroup.forwardLeftRay.hasHit &&
        !this.rayGroup.forwardRightRay.hasHit
      ) {
        // this.body.applyForce(playerDirectionNormal.multiplyScalar(this.velocity), this.mesh.position);
        this.controls.moveForward(this.velocity * delta);
      } else if (
        this.keymap["KeyW"] == true &&
        (this.rayGroup.forwardRay.hasHit ||
          this.rayGroup.forwardLeftRay.hasHit ||
          this.rayGroup.forwardRightRay.hasHit)
      ) {
        this.controls.moveForward(this.velocity * delta * -1);
      }
      if (
        this.keymap["KeyS"] == true &&
        !this.rayGroup.backwardRay.hasHit &&
        !this.rayGroup.backwardLeftRay.hasHit &&
        !this.rayGroup.backwardRightRay.hasHit
      ) {
        //DOWN
        // this.body.applyForce(playerDirectionNormal.multiplyScalar(-this.velocity), this.mesh.position);
        this.controls.moveForward(this.velocity * delta * -1);
      }

      //LEFT
      if (
        this.keymap["KeyA"] == true &&
        !this.rayGroup.leftRay.hasHit &&
        !this.rayGroup.forwardLeftRay.hasHit &&
        !this.rayGroup.backwardLeftRay.hasHit
      ) {
        this.controls.moveRight(this.velocity * delta * -1);
      }

      //RIGHT
      if (
        this.keymap["KeyD"] == true &&
        !this.rayGroup.rightRay.hasHit &&
        !this.rayGroup.forwardRightRay.hasHit &&
        !this.rayGroup.backwardRightRay.hasHit
      ) {
        this.controls.moveRight(this.velocity * delta);
      }
    }

    //SPRINT
    if (this.keymap["ShiftLeft"] == true) {
      this.velocity = 16;
    } else {
      this.velocity = 10;
    }

    if (typeof this.body !== undefined) {
      //JUMP
      floorArray.forEach((floor) => {
        if (this.body.aabb.overlaps(floor.body.aabb)) {
          this.touchFloor = true;
        }
      });

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

      if (this.jumping && this.touchFloor) {
        // this.body.velocity = new CANNON.Vec3(0, 0, 0);
        this.jumping = false;
      }
      this.touchFloor = false;
    }

    //UPDATE CAMERA AND COLLIDER POSITION

    this.body.position.copy(
      new THREE.Vector3(
        this.camera.position.x,
        this.body.position.y,
        this.camera.position.z
      )
    );
    this.camera.position.copy(
      new THREE.Vector3(
        this.camera.position.x,
        this.body.position.y + 0.75,
        this.camera.position.z
      )
    );
    this.body.quaternion.setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      this.camera.quaternion.w
    );
    // this.camera.position.y += 0.75;
  }
}

export { player };
