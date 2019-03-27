import * as THREE from 'THREE';
import OrbitControls from 'orbit-controls-es6';


export default class level1 {
    constructor() {
        //Setup Camera
        this.camera = new THREE.PerspectiveCamera(
            40,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 200;

        this.controls = new OrbitControls(this.camera);

        this.scene = new THREE.Scene();

        // axes
        this.scene.add(new THREE.AxesHelper(20));

        this.renderer = new THREE.WebGLRenderer();

        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.renderer.setAnimationLoop(this.render.bind(this));

        document.body.appendChild(this.renderer.domElement);

        window.addEventListener("resize", this.onWindowResize.bind(this));
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}