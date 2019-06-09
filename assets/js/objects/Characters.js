import * as THREE from "three";
import CANNON from 'cannon'
import KeyboardManager from "../utils/KeyboardManager";
import Sprite from "@/assets/js/objects/Sprite";

import MomoSprite from '~/static/sprites/momo/momo.png';
const MomoJson = require("~/static/sprites/momo/momo.json");

import RomoSprite from '~/static/sprites/romo/romo.png';
const RomoJson = require("~/static/sprites/romo/romo.json");

export default class Characters {
    constructor(store) {
        this.coordinate = {
            x: 0,
            y: 0
        }
        this.speed = 0

        this.socket = store.state.synchro.socket

        if (this.socket) {
            this.socket.on("coordonate-joystick", t => {
                this.coordinate.x = t.joystickCoord.x
                this.coordinate.y = t.joystickCoord.y

                this.speed = t.speed
            });
        }

        this.canMove = true;

        this.body = null

        this.forceValue = new THREE.Vector3();

        this.time = 0;
        this.clock = new THREE.Clock()

        this.canJump = false

        this.bothWays = false

        this.moveLeftBlock = false
        this.moveRightBlock = false

        this.sprites = MomoJson.sprites

        this.addBody()

        this.movementState = {
            walking: false,
            jump: false,
            wait: false
        }

        this.KeyboardManager = new KeyboardManager(this.onInput.bind(this));

        return new Promise((resolve, reject) => {
            this.addAnimate().then((sprites) => {
                this.momo = sprites[0]

                let body = sprites[1][0]
                body.name = "romo_body"
                let mood = sprites[1][1]
                mood.name = "romo_mood"

                this.romo = new THREE.Group();

                this.romo.add(body);
                this.romo.add(mood);

                this.animeRomo()

                resolve(this)
            })
        });
    }

    animeRomo() {
        this.launchSprite(this.romo.children[0], "normal")
        this.launchSprite(this.romo.children[1], "win")
    }

    addAnimate() {

        let loader = new THREE.TextureLoader();

        let p1 = (new Promise((resolve, reject) => {
            new Sprite(MomoSprite, MomoJson.sprites, {
                wTiles: 8,
                hTiles: 8
            }).then(momo => {
                momo.name = "momo"
                momo.body = this.body
                resolve(momo)
            })
        }))
        let p2 = new Promise((resolve, reject) => {
            loader.load(RomoSprite, (texture) => {
                let spriteTextureRomo = []
                spriteTextureRomo.push(
                    new Sprite(texture, RomoJson.sprites, {
                        wTiles: 4,
                        hTiles: 3
                    })
                )
                spriteTextureRomo.push(
                    new Sprite(texture, RomoJson.sprites, {
                        wTiles: 4,
                        hTiles: 3
                    })
                )
                resolve(spriteTextureRomo)
            })
        })

        return Promise.all([p1, p2]).then(sprites => {
            return sprites
        }).catch(error => console.log(error));
    }

    addBody() {
        var radius = .5;

        var character_material = new CANNON.Material("character_material");

        var body = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(2, .5, 3 - radius),
            shape: new CANNON.Sphere(radius),
            material: character_material,
            sleepSpeedLimit: .1,
            angularDamping: 0,
            linearDamping: .90
        });

        body.addEventListener('collide', this.onCollide.bind(this))

        this.body = body
    }

    onCollide(e) {
        if (e.contact.enabled) {
            this.canJump = true
            this.canMove = true;
            this.movementState.jump = false;
            if (!this.movementState.jump) {
                this.launchSprite(this.momo, "walk")
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
            if (this.movementState.walking) {
                if (this.moveLeft) {
                    this.body.velocity.x = -3
                } else {
                    this.body.velocity.x = 3
                }
            }
            this.body.velocity.y = 8
            this.movementState.jump = true
            this.canJump = false
            this.launchSprite(this.momo, "jump")

            this.launchSprite(this.romo.children[0], "romo")
            this.launchSprite(this.romo.children[1], "power")

            this.canMove = false;
        }
    }

    movement() {
        this.forceValue.set(0, 0, 0)
        if (this.canMove) {

            if (this.moveLeft !== undefined || this.moveRight !== undefined) {

                if (this.moveLeft && this.moveRight) {
                    this.bothWays = true
                    this.forceValue.x = 0
                } else {
                    this.bothWays = false

                    if (this.moveLeft) {
                        this.forceValue.x = -4;
                        if (!this.movementState.walking) {
                            if (this.momo.scale.x == 1) {
                                this.turnToWalk()
                                this.momo.scale.set(-1, 1, 1)
                            } else {
                                this.launchSprite(this.momo, "walk")
                            }
                            this.movementState.walking = true
                        }
                    } else {
                        if (!this.moveLeftBlock) {
                            this.moveLeftBlock = true
                            this.forceValue.x = 0
                        }
                    }

                    if (this.moveRight) {
                        this.forceValue.x = 4;
                        if (!this.movementState.walking) {
                            if (this.momo.scale.x == -1) {
                                this.turnToWalk()
                                this.momo.scale.set(1, 1, 1)
                            } else {
                                this.launchSprite(this.momo, "walk")
                            }
                            this.movementState.walking = true
                        }
                    } else {
                        if (!this.moveRightBlock) {
                            this.moveRightBlock = true
                            this.forceValue.x = 0
                        }
                    }
                }
            }
        }
    }

    move() {
        if (this.movementState.jump && this.moveLeft && this.movementState.walking) {
            this.momo.scale.set(-1, 1, 1)
        }
        if (this.movementState.jump && this.moveRight && this.movementState.walking) {
            this.momo.scale.set(1, 1, 1)
        }
        if (this.moveLeft || this.moveRight || !this.canJump && !this.bothWays) {
            let accelerationValue = new CANNON.Vec3(this.forceValue.x, 0, 0);
            this.body.force = accelerationValue
            this.movementState.wait = false
        } else {
            let accelerationValue = new CANNON.Vec3(this.forceValue.x, 0, 0);
            this.body.velocity = accelerationValue
            if (!this.movementState.wait) {
                this.launchSprite(this.momo, "wait")
                this.movementState.wait = false;
            }
            this.movementState.walking = false
            this.movementState.wait = true
        }


        if (this.bothWays) {
            let accelerationValue = new CANNON.Vec3(this.forceValue.x, 0, 0);
            this.body.velocity = accelerationValue
            if (!this.movementState.wait) {
                this.launchSprite(this.momo, "wait")
                this.movementState.wait = false;
            }
            this.movementState.walking = false
            this.movementState.wait = true
        }
    }

    //Sprite
    launchSprite(character, id) {
        character
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

    updateMomoPosition() {
        if (this.momo) {
            this.momo.position.copy(this.momo.body.position)
        }
    }

    updateRomoPosition() {
        if (this.romo) {
            if (this.socket) {
                if (this.speed) {
                    let x = this.romo.position.x
                    let y = this.romo.position.y
                    TweenMax.to(this.romo.position, .3, {
                        x: x + (this.coordinate.x * this.speed) / 50,
                        y: y + (this.coordinate.y * this.speed) / 50,

                    })
                }
            }
        }
    }

    update() {
        const delta = this.clock.getDelta() * 5000;
        this.time += delta;
        this.momo.update(delta)

        this.romo.children[0].update(delta)
        this.romo.children[1].update(delta)

        this.updateMomoPosition()

        this.updateRomoPosition()

        this.movement()
        this.move()
    }
}