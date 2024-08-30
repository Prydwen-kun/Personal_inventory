import * as CANNON from 'cannon-es'
import * as THREE from '..//three.js-master/build/three.module.js';
function initCannon() {

    const world = new CANNON.World({
        gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
    })

    // world.broadphase = new CANNON.NaiveBroadphase();//need to look into this shit
    // world.solver.iterations = 10;

    return world;

}

function addBoxCollider(sceneObject, world, sceneObjectArray) {
    let sizeCopy = new THREE.Vector3(sceneObject.size.x / 2, sceneObject.size.y / 2, sceneObject.size.z / 2);
    sceneObject.shape = new CANNON.Box(sizeCopy);//sceneObject.size
    sceneObject.mass = 1;
    sceneObject.body = new CANNON.Body({
        mass: 1
    });

    sceneObject.body.addShape(sceneObject.shape);

    sceneObject.body.position.copy(sceneObject.mesh.position);
    sceneObject.body.quaternion.copy(sceneObject.mesh.quaternion);

    world.addBody(sceneObject.body);
    sceneObjectArray.push({ mesh: sceneObject.mesh, collider: sceneObject.body })
}

function addStaticBoxCollider(sceneObject, world, sceneObjectArray) {
    let sizeCopy = new THREE.Vector3(sceneObject.size.x / 2, sceneObject.size.y / 2, sceneObject.size.z / 2);
    sceneObject.shape = new CANNON.Box(sizeCopy);
    sceneObject.mass = 0;
    sceneObject.body = new CANNON.Body({
        mass: 0
    });

    sceneObject.body.addShape(sceneObject.shape);

    sceneObject.body.position.copy(sceneObject.mesh.position);
    sceneObject.body.quaternion.copy(sceneObject.mesh.quaternion);

    world.addBody(sceneObject.body);
    sceneObjectArray.push({ mesh: sceneObject.mesh, collider: sceneObject.body })
}

function addSphereCollider(sceneObject, world, sceneObjectArray) {

    sceneObject.shape = new CANNON.Sphere(1);
    sceneObject.mass = 10;
    sceneObject.body = new CANNON.Body({
        mass: 10
    });

    sceneObject.body.addShape(sceneObject.shape);

    sceneObject.body.position.copy(sceneObject.mesh.position);
    sceneObject.body.quaternion.copy(sceneObject.mesh.quaternion);

    world.addBody(sceneObject.body);
    sceneObjectArray.push({ mesh: sceneObject.mesh, collider: sceneObject.body })
}


function updatePhysics(sceneObjectArray, world, deltaTime) {
    // Step the physics world
    world.step(1 / 60, deltaTime, 10);
    // Copy coordinates from Cannon.js to Three.js
    sceneObjectArray.forEach(object => {

        object.mesh.position.copy(object.collider.position);
        // if (!object.isActor) {
        object.mesh.quaternion.copy(object.collider.quaternion);
        // }

    });



}


export { initCannon, addBoxCollider, addStaticBoxCollider, addSphereCollider, updatePhysics };