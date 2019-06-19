import * as THREE from "three";
import Sprite from "@/assets/js/objects/Sprite";

export default class AnimatedProp extends THREE.Object3D {
    constructor(params) {
        super()
        console.log('coucou animatedProp')
        return new Promise((resolve, reject) => {
            this.params = params
            this._type = "animatedProp";
            this._id = this.params.json.id

            this.render().then((animate) => {
                console.log("AnimatedProp", animate)
                resolve(animate)
            });
        })
    }

    render() {
        console.log("AnimatedProp Render", animate)

        return new Promise((resolve, reject) => {
            new Sprite(this.params.png, this.params.json.sprites, {
                wTiles: this.params.w,
                hTiles: this.params.h
            }).then(animate => {
                console.log("new Sprite then", animate)

                this.animate = animate
                this.animate.name = this._id
                this.material = animate.material
                this._type = "AnimatedProp"
                this.animate.mesh._class = this;
                this.mesh = this.animate.mesh
                this.mesh._type = "AnimatedProp"
                this.animate.mesh._type = "AnimatedProp";

                this.add(this.animate);
                resolve(this)
            })
        })
    }

    highlight(value) {
        //TODO HIGHLIGHT

        // if (value === true) {
        //     this.animate.material.color.set(0x00ff00);
        //     this._highlight = true
        // } else if (value === false) {
        //     this.animate.material.color.set(0xffffff);
        //     this._highlight = false
        // }
    }
}