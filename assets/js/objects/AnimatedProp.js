import * as THREE from "three";
import Sprite from "@/assets/js/objects/Sprite";

export default class AnimatedProp extends THREE.Object3D {
    constructor(params) {
        super()
        return new Promise((resolve, reject) => {
            this.params = params
            this._type = "animatedProp";
            this._id = this.params.id

            this.render().then((sprite) => {
                resolve(sprite)
            });
        })
    }

    render() {
        return new Promise((resolve, reject) => {
            new Sprite(this.params.png, this.params.json, {
                wTiles: this.params.size.w,
                hTiles: this.params.size.h
            }).then(sprite => {

                this.material = sprite.material
                sprite.position.set(2, 2, 2)
                sprite._type = "AnimatedProp";
                this.add(sprite);

                resolve(sprite)
            })
        })
    }

    highlight(value) {
        if (value === true) {
            this.AnimatedProp.material.color.set(0x00ff00);
            this._highlight = true
        } else if (value === false) {
            this.AnimatedProp.material.color.set(0xffffff);
            this._highlight = false
        }
    }
}