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

    this.forwardRay = new CANNON.Ray(
      this.cannonPosition,
      this.cannonPosition
        .clone()
        .addScaledVector(this.cannonNormalizedDirection, this.rayLength)
    );

    this.backwardRay = new CANNON.Ray(
      this.cannonPosition,
      this.cannonPosition
        .clone()
        .addScaledVector(this.cannonNormalizedDirection, -this.rayLength)
    );

    this.leftRay = new CANNON.Ray(
      this.cannonPosition,
      this.cannonPosition
        .clone()
        .addScaledVector(
          new CANNON.Quaternion.setFromAxisAngle(
            new CANNON.Vec3(0, 1, 0),
            Math.PI / 2
          ).vmult(this.cannonNormalizedDirection.clone()),
          this.rayLength
        )
    );
    this.rightRay =
      this.forwardLeftRay =
      this.forwardRightRay =
      this.backwardLeftRay =
      this.backwardRightRay =
      this.rayLength =
        rayLength;
  }
  updateRayGroup(actorPosition) {
    this.cannonPosition = new CANNON.Vec3(
      actorPosition.x,
      actorPosition.y,
      actorPosition.z
    );
  }
}
export { rayGroup };
