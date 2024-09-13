import * as THREE from "../three.js-master/build/three.module.js";
import * as CANNON from "cannon-es";

class rayGroup {
  constructor(rayLength, actorPosition, normalizedDirection) {
    this.cannonPosition = new CANNON.Vec3(
      actorPosition.x,
      actorPosition.y,
      actorPosition.z
    );
    this.cannonNormalizedDirection = new CANNON.Vec3(
      normalizedDirection.x,
      normalizedDirection.y,
      normalizedDirection.z
    );

    this.rayLength = rayLength;

    this.frontResult = new CANNON.RaycastResult();
    this.backResult = new CANNON.RaycastResult();
    this.leftResult = new CANNON.RaycastResult();
    this.rightResult = new CANNON.RaycastResult();
    this.frontLeftResult = new CANNON.RaycastResult();
    this.frontRightResult = new CANNON.RaycastResult();
    this.backLeftResult = new CANNON.RaycastResult();
    this.backRightResult = new CANNON.RaycastResult();

    this.topResult = new CANNON.RaycastResult();

    this.topRay = new CANNON.Ray(
      this.cannonPosition,
      this.cannonPosition
        .clone()
        .addScaledVector(
          this.rayLength,
          new CANNON.Quaternion()
            .setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -(Math.PI / 2))
            .vmult(this.cannonNormalizedDirection.clone())
        )
    );

    this.forwardRay = new CANNON.Ray(
      this.cannonPosition,
      this.cannonPosition
        .clone()
        .addScaledVector(this.rayLength, this.cannonNormalizedDirection)
    );

    this.backwardRay = new CANNON.Ray(
      this.cannonPosition,
      this.cannonPosition
        .clone()
        .addScaledVector(-this.rayLength, this.cannonNormalizedDirection)
    );

    this.leftRay = new CANNON.Ray(
      this.cannonPosition,
      this.cannonPosition
        .clone()
        .addScaledVector(
          this.rayLength,
          new CANNON.Quaternion()
            .setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2)
            .vmult(this.cannonNormalizedDirection.clone())
        )
    );
    this.rightRay = new CANNON.Ray(
      this.cannonPosition,
      this.cannonPosition
        .clone()
        .addScaledVector(
          this.rayLength,
          new CANNON.Quaternion()
            .setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -(Math.PI / 2))
            .vmult(this.cannonNormalizedDirection.clone())
        )
    );
    this.forwardLeftRay = new CANNON.Ray(
      this.cannonPosition,
      this.cannonPosition
        .clone()
        .addScaledVector(
          this.rayLength,
          new CANNON.Quaternion()
            .setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 4)
            .vmult(this.cannonNormalizedDirection.clone())
        )
    );
    this.forwardRightRay = new CANNON.Ray(
      this.cannonPosition,
      this.cannonPosition
        .clone()
        .addScaledVector(
          this.rayLength,
          new CANNON.Quaternion()
            .setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -(Math.PI / 4))
            .vmult(this.cannonNormalizedDirection.clone())
        )
    );
    this.backwardLeftRay = new CANNON.Ray(
      this.cannonPosition,
      this.cannonPosition
        .clone()
        .addScaledVector(
          this.rayLength,
          new CANNON.Quaternion()
            .setFromAxisAngle(new CANNON.Vec3(0, 1, 0), (Math.PI / 4) * 3)
            .vmult(this.cannonNormalizedDirection.clone())
        )
    );
    this.backwardRightRay = new CANNON.Ray(
      this.cannonPosition,
      this.cannonPosition
        .clone()
        .addScaledVector(
          this.rayLength,
          new CANNON.Quaternion()
            .setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -(Math.PI / 4) * 3)
            .vmult(this.cannonNormalizedDirection.clone())
        )
    );
  }
  updateRayGroup(actorPosition, normalizedDirection, world) {
    this.cannonPosition = new CANNON.Vec3(
      actorPosition.x,
      actorPosition.y,
      actorPosition.z
    );

    this.cannonNormalizedDirection = new CANNON.Vec3(
      normalizedDirection.x,
      normalizedDirection.y,
      normalizedDirection.z
    );
    //DEBUG
    // console.log("Debug raygroup :", this);
    this.topRay.from = this.cannonPosition;
    this.topRay.to = this.cannonPosition
      .clone()
      .addScaledVector(
        this.rayLength,
        new CANNON.Quaternion()
          .setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -(Math.PI / 2))
          .vmult(this.cannonNormalizedDirection.clone())
      );

    this.forwardRay.from = this.cannonPosition;
    this.forwardRay.to = this.cannonPosition
      .clone()
      .addScaledVector(this.rayLength, this.cannonNormalizedDirection);
    this.backwardRay.from = this.cannonPosition;
    this.backwardRay.to = this.cannonPosition
      .clone()
      .addScaledVector(-this.rayLength, this.cannonNormalizedDirection);
    this.leftRay.from = this.cannonPosition;
    this.leftRay.to = this.cannonPosition
      .clone()
      .addScaledVector(
        this.rayLength,
        new CANNON.Quaternion()
          .setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2)
          .vmult(this.cannonNormalizedDirection.clone())
      );
    this.rightRay.from = this.cannonPosition;

    this.rightRay.to = this.cannonPosition
      .clone()
      .addScaledVector(
        this.rayLength,
        new CANNON.Quaternion()
          .setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -(Math.PI / 2))
          .vmult(this.cannonNormalizedDirection.clone())
      );

    this.forwardLeftRay.from = this.cannonPosition;

    this.forwardLeftRay.to = this.cannonPosition
      .clone()
      .addScaledVector(
        this.rayLength,
        new CANNON.Quaternion()
          .setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 4)
          .vmult(this.cannonNormalizedDirection.clone())
      );

    this.forwardRightRay.from = this.cannonPosition;

    this.forwardRightRay.to = this.cannonPosition
      .clone()
      .addScaledVector(
        this.rayLength,
        new CANNON.Quaternion()
          .setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -(Math.PI / 4))
          .vmult(this.cannonNormalizedDirection.clone())
      );

    this.backwardLeftRay.from = this.cannonPosition;

    this.backwardLeftRay.to = this.cannonPosition
      .clone()
      .addScaledVector(
        this.rayLength,
        new CANNON.Quaternion()
          .setFromAxisAngle(new CANNON.Vec3(0, 1, 0), (Math.PI / 4) * 3)
          .vmult(this.cannonNormalizedDirection.clone())
      );

    this.backwardRightRay.from = this.cannonPosition;

    this.backwardRightRay.to = this.cannonPosition
      .clone()
      .addScaledVector(
        this.rayLength,
        new CANNON.Quaternion()
          .setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -(Math.PI / 4) * 3)
          .vmult(this.cannonNormalizedDirection.clone())
      );

    //UPDATE RAY RESULTS

    this.forwardRay.intersectWorld(world, {
      mode: CANNON.RAY_MODES.ALL,
      result: this.frontResult,
    });
    this.backwardRay.intersectWorld(world, {
      mode: CANNON.RAY_MODES.ALL,
      result: this.backResult,
    });
    this.leftRay.intersectWorld(world, {
      mode: CANNON.RAY_MODES.ALL,
      result: this.leftResult,
    });
    this.rightRay.intersectWorld(world, {
      mode: CANNON.RAY_MODES.ALL,
      result: this.rightResult,
    });
    this.forwardLeftRay.intersectWorld(world, {
      mode: CANNON.RAY_MODES.ALL,
      result: this.frontLeftResult,
    });
    this.forwardRightRay.intersectWorld(world, {
      mode: CANNON.RAY_MODES.ALL,
      result: this.frontRightResult,
    });
    this.backwardLeftRay.intersectWorld(world, {
      mode: CANNON.RAY_MODES.ALL,
      result: this.backLeftResult,
    });
    this.backwardRightRay.intersectWorld(world, {
      mode: CANNON.RAY_MODES.ALL,
      result: this.backRightResult,
    });
  }
}
export { rayGroup };
