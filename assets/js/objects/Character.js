import * as THREE from "three";
import CANNON from 'cannon'
import KeyboardManager from "../utils/KeyboardManager";
import Sprite from "@/assets/js/objects/Sprite";
import MomoSprite from '~/static/sprites/momo/momo.png';
import {
    timingSafeEqual
} from "crypto";
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

        this.movementState = {
            walking: false,
            jump: false,
            wait: false
        }

        this.addSprite()

        this.KeyboardManager = new KeyboardManager(this.onInput.bind(this));
    }

    addSprite() {
        this.momo = new Sprite(null, MomoSprite, MomoJson.sprites, {
            wTiles: 8,
            hTiles: 8
        })

        this.momo.body = this.body

        return this.momo
    }

    addBody() {
        var radius = .5;

        var character_material = new CANNON.Material("character_material");

        var body = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(2, 2, 3 - radius),
            shape: new CANNON.Sphere(radius),
            material: character_material,
            sleepSpeedLimit: .1,
            angularDamping: 0,
            linearDamping: .99
        });

        body.addEventListener('collide', this.onCollide.bind(this))

        this.body = body
    }

    onCollide(e) {
        if (e.contact.enabled) {
            this.canJump = true
            this.movementState.jump = false;
            if (!this.movementState.jump) {
                this.launchSprite("walk")
            }
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
            this.body.velocity.y = 8
            this.canJump = false
            this.launchSprite("jump")
        }
    }

    movement() {
        this.forceValue.set(0, 0, 0)

        if (this.moveLeft) {
            this.forceValue.x = -8;
            if (!this.movementState.walking) {
                if (this.momo.scale.x == 1) {
                    this.turnToWalk()
                    this.momo.scale.set(-1, 1, 1)
                } else {
                    this.launchSprite("walk")
                }
                this.movementState.walking = true
            }
        }

        if (this.moveRight) {
            this.forceValue.x = 8;
            if (!this.movementState.walking) {
                if (this.momo.scale.x == -1) {
                    this.turnToWalk()
                    this.momo.scale.set(1, 1, 1)
                } else {
                    this.launchSprite("walk")
                }
                this.movementState.walking = true
            }
        }
    }

    move() {
        if (this.moveLeft || this.moveRight || !this.canJump) {
            let accelerationValue = new CANNON.Vec3(this.forceValue.x, 0, 0);
            this.body.force = accelerationValue
            this.movementState.wait = false

        } else {
            if (!this.movementState.wait) {
                this.launchSprite("wait")
                this.movementState.wait = false;
            }
            this.movementState.walking = false
            this.movementState.wait = true
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
            // this.momo.position.y -= .5
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