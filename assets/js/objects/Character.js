import * as THREE from "three";

export default class Character {
    constructor(characterShape) {
        this.characterShape = characterShape
        console.log(this.characterShape)
    }
    // onCollide(e) {
    //     if (e.contact.enabled) {
    //         this.canJump = true
    //         this.canMove = true
    //     }
    // }
    // keydown(e) {
    //     switch (e.code) {
    //         case "Space": //space
    //             this.canJump && this.jump()
    //             break;
    //         case "KeyW": //forward
    //         case "ArrowUp": //forward
    //             this.moveForward = true
    //             break;
    //         case "KeyA": //left
    //         case "ArrowLeft": //left
    //             this.moveLeft = true
    //             break;
    //         case "KeyD": //right
    //         case "ArrowRight": //right
    //             this.moveRight = true
    //             break;
    //         case "KeyS": //backward
    //         case "ArrowDown": //backward
    //             this.moveBackward = true
    //             break;
    //     }
    // }
    // keyup(e) {
    //     switch (e.code) {
    //         case "KeyW": //forward
    //         case "ArrowUp": //forward
    //             this.moveForward = false
    //             break;
    //         case "KeyA": //left
    //         case "ArrowLeft": //left
    //             this.moveLeft = false
    //             break;
    //         case "KeyD": //right
    //         case "ArrowRight": //right
    //             this.moveRight = false
    //             break;
    //         case "KeyS": //backward
    //         case "ArrowDown": //backward
    //             this.moveBackward = false
    //             break;
    //     }
    // }
    // update() {
    //     this.move()
    //     this.walk()
    // }
    // move() {
    //     this.velocityValue.set(0, 0, 0)
    //     if (this.moveForward) {
    //         this.velocityValue.z = -20;
    //     }
    //     if (this.moveBackward) {
    //         this.velocityValue.z = 20;
    //     }
    //     if (this.moveLeft) {
    //         this.velocityValue.x = -20;
    //     }
    //     if (this.moveRight) {
    //         this.velocityValue.x = 20;
    //     }
    // }
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