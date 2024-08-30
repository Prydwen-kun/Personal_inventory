import * as THREE from '..//three.js-master/build/three.module.js';

class mobs {
    constructor(Id, health, velocity, spawnPosition, loader) {
        this.Id = Id;
        this.health = health; //100
        this.velocity = velocity; //2.90
        this.size = new THREE.Vector3(1, 2, 1);
        this.geometry = new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z);
        this.material = new THREE.MeshLambertMaterial({ color: 0xee3311 });
        this.texture = loader.load('/herobrine.png');//need to wrap an eventual texture with wrapT // UV pos
        this.material1 = new THREE.MeshLambertMaterial({ map: this.texture });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = false;
        this.mesh.position.set(spawnPosition.x, spawnPosition.y, spawnPosition.z);

        this.isActor = true;

        //POUR DEBUG
        this.deltaSum = 0;
        this.updateCall = 0;
        // this.target = new THREE.Vector3(0, 0, 0);

    }

    takeDamage(damage) {
        this.health -= damage;
    }

    addToScene(scene) {
        scene.add(this.mesh);
    }

    update(playerPosition, deltaTime) {

        this.mesh.lookAt(playerPosition);

        let directionNormal = new THREE.Vector3(0, 0, 0);
        this.mesh.getWorldDirection(directionNormal);
        directionNormal.normalize();

        // this.mesh.translateOnAxis(directionNormal, this.velocity * deltaTime);
        // this.mesh.position.lerp(playerPosition, 0.005);

        if (this.body !== null) {

            let resultVector2 = new THREE.Vector3(0, 0, 0);
            this.body.getVelocityAtWorldPoint(this.body.position, resultVector2);
            let velocity2 = resultVector2.length();

            this.body.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.mesh.quaternion.w);
            if (velocity2 <= this.velocity) {
                this.body.applyForce(directionNormal.multiplyScalar(this.velocity), this.mesh.position);
            }

        }


        //DEBUG UPDATE CALL NUMBER
        // this.deltaSum += deltaTime;
        // this.updateCall++;
        // if (this.deltaSum > 1) {
        //     console.log('MOB',this.Id,'Update has been called : ', this.updateCall, ' times per second!');
        //     this.deltaSum = 0;
        //     this.updateCall = 0;
        // }
    }

}

export { mobs };
