import * as THREE from "three";
import CANNON from 'cannon'
import KeyboardManager from "../utils/KeyboardManager";

export default class Character {
    constructor() {
        this.body = null

        this.forceValue = new THREE.Vector3();

        // this.canMove = false
        // this.canJump = false

        this.addBody()

        this.KeyboardManager = new KeyboardManager(this.onInput.bind(this));
    }

    addBody() {
        var radius = .5; // m
        var body = new CANNON.Body({
            mass: 1, // kg
            position: new CANNON.Vec3(2, 5, 3), // m
            shape: new CANNON.Sphere(radius)
        });
        body.angularDamping = 0
        body.linearDamping = .8

        body.addEventListener('collide', this.onCollide.bind(this))

        this.body = body

        return this.body
    }

    onCollide(e) {
        if (e.contact.enabled) {
            // this.canMove = true
            // this.canJump = true
        }
    }

    onInput(key, value) {
        console.log(key)
        switch (key) {
            case "ARROWLEFT":
                this.moveLeft = value
                break;
            case "ARROWRIGHT":
                this.moveRight = value
                break;
            case " ":
                this.jump(value)
                // this.canJump && this.jump(value)
                break;
            default:
                break;
        }
    }

    jump(value) {
        console.log('yes')
        if (value) {
            this.body.force.y += 500
            // this.canJump = false
            // this.canMove = false;
        }
    }

    movement() {
        this.forceValue.set(0, 0, 0)

        if (this.moveLeft) {
            this.forceValue.x += -20;
        }
        if (this.moveRight) {
            this.forceValue.x += 20;
        }
    }

    move() {
        // if (this.canMove) {
        if (this.moveLeft || this.moveRight) {
            let accelerationValue = new CANNON.Vec3(this.forceValue.x, 0, 0);
            this.body.force = accelerationValue
        }
        // }
    }

    update() {
        this.movement()
        this.move()
    }
}