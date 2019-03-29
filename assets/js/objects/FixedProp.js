import * as THREE from "three";

export default class FixedProp {
    constructor(opts) {
        this.width = opts.width;
        this.height = opts.height;
        this.material = opts.material;
        this.render()
    }

    render() {
        this.geometry = new THREE.PlaneGeometry(
            this.width,
            this.height,
            1,
            1
        );
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh._type = "FixedProp";
        this.mesh._class = this;
    }

    highlight(value) {
        if (value === true) {
            this.mesh.material.color.set(0x00ff00);
        } else if (value === false) {
            this.mesh.material.color.set(0xffffff);
        }
    }
}