import * as THREE from '..//three.js-master/build/three.module.js';

class cube {
    constructor(x, y, z, loader, posX, posY, posZ) {

        const geometry = new THREE.BoxGeometry(x, y, z);//100 40 1
        const material = new THREE.MeshLambertMaterial({ color: 0x00aaee });
        const textureWall = loader.load('/oldWood.avif');
        const materialWall = new THREE.MeshLambertMaterial({ map: textureWall });
        
        this.size = new THREE.Vector3(x, y, z);
        this.mesh = new THREE.Mesh(geometry, materialWall);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        this.mesh.position.x = posX;
        this.mesh.position.y = posY;
        this.mesh.position.z = posZ;

        this.isActor = false;
    }
    rotate(rotX, rotY, rotZ) {
        this.mesh.rotateX(rotX);
        this.mesh.rotateY(rotY);
        this.mesh.rotateZ(rotZ);
    }
    addToScene(scene) {
        scene.add(this.mesh);
    }


}
export { cube };