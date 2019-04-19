import * as THREE from "three";
import CANNON from 'cannon'

export default class Character {
    constructor(characterShape) {

        this.addCharactere()

        this.characterShape = characterShape

        this.velocityValue = new THREE.Vector3();

        this.canJump = false
        this.canMove = false
    }
    // onCollide(e) {
    //     if (e.contact.enabled) {
    //         this.canJump = true
    //         this.canMove = true
    //     }
    // }

    moveLeft(value) {
        this.left = value
    }
    jump(value) {
        this.jumpjump = value
    }
    moveRight(value) {
        this.right = value
    }


    addCharactere() {
        var radius = 1; // m
        var sphereBody = new CANNON.Body({
            mass: 1, // kg
            position: new CANNON.Vec3(2, 5, 3), // m
            shape: new CANNON.Sphere(radius)
        });
        // sphereBody.angularDamping = 1
        this.sphereBody = sphereBody
        return this.sphereBody
    }

    update() {
        this.move()
        this.walk()
    }

    move() {
        this.velocityValue.set(0, 0, 0)

        if (this.left) {
            this.velocityValue.x = -2;
        }
        if (this.right) {
            this.velocityValue.x = 2;
        }
        if (this.jumpjump) {
            this.velocityValue.y = 5;
        }
    }

    walk() {
        // if (this.canMove) {
        if (this.moveForward || this.moveBackward || this.moveLeft || this.moveRight) {
            var accelerationValue = new CANNON.Vec3(this.velocityValue.x, 0, 0);
            this.sphereBody.velocity = accelerationValue
        }
        if (this.jumpjump) {
            var accelerationValue = new CANNON.Vec3(0, this.velocityValue.y, 0);
            this.sphereBody.velocity = accelerationValue
        }
        // }
    }
}