import * as THREE from "three";
import CANNON from 'cannon'
import KeyboardManager from "../utils/KeyboardManager";
import Sprite from "@/assets/js/objects/Sprite";
import MomoSprite from '~/static/sprites/momo/momo.png';
const MomoJson = require("~/static/sprites/momo/momo.json");

export default class Character {
    constructor() {
        this.body = null

        this.forceValue = new THREE.Vector3();

        this.time = 0;
        this.clock = new THREE.Clock()

        this.canJump = false

        this.sprites = MomoJson.sprites

        this.addBody()

        this.addSprite()

        this.KeyboardManager = new KeyboardManager(this.onInput.bind(this));
    }

    addSprite() {
        this.momo = new Sprite(null, MomoSprite, MomoJson.sprites, { wTiles: 8, hTiles: 8 })

        this.momo.body = this.body

        return this.momo
    }

    addBody() {
        var radius = .5;
        var body = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(2, 5, 3 - radius),
            shape: new CANNON.Sphere(radius)
        });
        body.angularDamping = 0
        body.linearDamping = .8

        body.addEventListener('collide', this.onCollide.bind(this))

        this.body = body
    }

    onCollide(e) {
        if (e.contact.enabled) {
            this.canMove = true
            this.canJump = true
        }
    }

    onInput(key, value) {
        switch (key) {
            case "ARROWLEFT":
                this.moveLeft = value
                break;
            case "ARROWRIGHT":
                this.moveRight = value
                break;
            case " ":
                this.canJump && this.jump(value)
                break;
            default:
                break;
        }
    }

    jump(value) {
        if (value) {
            this.body.velocity.y = 10
            this.canJump = false
        }
    }

    movement() {
        this.forceValue.set(0, 0, 0)

        if (this.moveLeft) {
            if (!this.walking) {
                this.walking = true
                this.launchSprite("walk")
            }
            this.forceValue.x = -20;
        }
        if (this.moveRight) {

            if (!this.walking) {

                this.walking = true
                this.launchSprite("walk")

            }
            this.forceValue.x = 20;
        }
    }

    move() {
        if (this.moveLeft || this.moveRight) {
            let accelerationValue = new CANNON.Vec3(this.forceValue.x, 0, 0);
            this.body.force = accelerationValue
        } else {
            this.walking = false
            this.launchSprite("wait")

        }
    }

    //Sprite
    launchSprite(id) {
        this.momo
            .newSprites()
            .addState(id)
            .start()
        this.currentSpriteID = id;
    }
    turnToWalk() {
        this.momo
            .newSprites()
            .addState('turn')
            .addState('jump to walk')
            .addState('walk')
            .start()
    }
    jumpToWalk() {
        this.momo
            .newSprites()
            .addState('jump')
            .addState('jump to walk')
            .addState('walk')
            .start()
    }

    updateSpritePosition() {
        if (this.momo) {
            this.momo.position.copy(this.momo.body.position)
            // this.momo.quaternion.copy(this.momo.body.quaternion)
        }
    }

    update() {
        const delta = this.clock.getDelta() * 5000;
        this.time += delta;
        this.momo.update(delta)
        this.updateSpritePosition()
        this.movement()
        this.move()
    }
}