import * as THREE from "three";

export default class WebGL {
    constructor() {
        window.addEventListener("resize", this.onWindowResize.bind(this));
    }

    createScene(canvas) {
        this.canvas = canvas
        this.WIDTH = this.canvas.offsetWidth;
        this.HEIGHT = this.canvas.offsetHeight;

        this.time = 0;
        this.clock = new THREE.Clock();
    }

    onWindowResize() {
        if (this.renderer) {
          this.camera.aspect = window.innerHeight / (window.innerHeight * 0.85);
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(window.innerHeight, window.innerHeight * 0.85);
        }
      }
}