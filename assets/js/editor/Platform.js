import * as THREE from 'three';

export default class Platform extends THREE.Object3D {
    constructor(params) {
        super()

        this.width = typeof params == "undefined" || undefined ? 1 : params.scale.x
        this.height = 6

        this.render()
    }

    render() {

        this.geometry = new THREE.BoxGeometry(this.width, .1, this.height);
        this.material = new THREE.MeshBasicMaterial({
            wireframe: true,
            color: 0x0000ff,
            transparent: true,
            alphaTest: 0.0,
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh._type = "Platform";
        this.mesh._class = this;
        this.add(this.mesh);
    }
    highlight(value) {
        if (value === true) {
            this.mesh.material.color.set(0x00ff00);
        } else if (value === false) {
            this.mesh.material.color.set(0x0000ff);
        }
    }
}