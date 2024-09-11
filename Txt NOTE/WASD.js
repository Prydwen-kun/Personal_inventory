//wasd converting

if (this.keymap["W"]) {
  this.body.impulse(
    this.normalizedDirection * this.velocity * delta,
    this.mesh.position
  );
}

this.body.applyImpulse(new CANNON.Vec3(0, 0, 0), this.body.position);

let cannonNormalizedDirection = new CANNON.Vec3(
  this.normalizedDirection.x,
  this.normalizedDirection.y,
  this.normalizedDirection.z
);

new CANNON.Quaternion()
  .setFromAxisAngle(new CANNON.Vec3(0, 1, 0), 0)
  .vmult(this.cannonNormalizedDirection);

//STRAIGHT
this.body.applyImpulse(
  this.body.position
    .clone()
    .addScaledVector(
      this.velocity * delta,
      new CANNON.Quaternion()
        .setFromAxisAngle(new CANNON.Vec3(0, 1, 0), 0)
        .vmult(this.cannonNormalizedDirection)
    ),
  this.body.position
);

//BACKWARD
this.body.applyImpulse(
  new CANNON.Quaternion()
    .setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI)
    .vmult(this.cannonNormalizedDirection),
  this.body.position
);

//LEFT
this.body.applyImpulse(
  new CANNON.Quaternion()
    .setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2)
    .vmult(this.cannonNormalizedDirection),
  this.body.position
);

//RIGHT
this.body.applyImpulse(
  new CANNON.Quaternion()
    .setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -(Math.PI / 2))
    .vmult(this.cannonNormalizedDirection),
  this.body.position
);

this.cannonNormalizedDirection.vmult, this.mesh.position;
