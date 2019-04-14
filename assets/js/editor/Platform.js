import * as THREE from 'three';

export default class Platform extends THREE.Object3D {
    constructor(params) {
        super()
        if (params = undefined || "undefined") {
            this.width = 1
            this.height = 1
        } else {
            this.width = params.scale.x
            this.height = params.scale.y
        }
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