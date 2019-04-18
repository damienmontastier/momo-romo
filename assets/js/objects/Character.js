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
    moveRight(value) {
        this.right = value
    }

    addCharactere() {
        var radius = 1; // m
        var sphereBody = new CANNON.Body({
            mass: 5, // kg
            position: new CANNON.Vec3(2, 5, 3), // m
            shape: new CANNON.Sphere(radius)
        });
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
    }

    walk() {
        // if (this.canMove) {
            if (this.moveForward || this.moveBackward || this.moveLeft || this.moveRight) {
                var accelerationValue = new CANNON.Vec3(this.velocityValue.x, 0, 0);
                this.sphereBody.velocity = accelerationValue
            }
        // }
    }


    // walk() {
    //     if (this.canMove) {
    //         if (this.moveForward || this.moveBackward || this.moveLeft || this.moveRight) {
    //             // this.characterShape.physic.velocity = this.velocityValue
    //             var accelerationValue = new CANNON.Vec3(this.velocityValue.x, 0, this.velocityValue.z);
    //             this.characterShape.physic.velocity = accelerationValue
    //         }
    //     }
    // }
    // jump() {
    //     this.velocityValue.set(0, 0, 0)
    //     this.characterShape.physic.velocity.y = 22
    //     this.canJump = false
    //     this.canMove = false;
    // }
}