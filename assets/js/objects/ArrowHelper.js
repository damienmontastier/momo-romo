import * as THREE from "three";
import Raycaster from '../editor/Raycaster'

class ArrowHelper extends THREE.Object3D {
    constructor(opts) {
        super();

        this.target = null

        this.render();
        // this.hide();
    }

    render() {
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.origin = new THREE.Vector3(0, 0, 0);
        this.length = 2;

        let shadowPlaneMesh = new THREE.PlaneBufferGeometry(10, 10, 1)
        let shadowPlaneMaterial = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            side: THREE.DoubleSide,
            // transparent: true,
            // opacity: 0.0,
            // alphaTest: 0.5
        })

        //x
        this.xArrow = new THREE.ArrowHelper(
            new THREE.Vector3(1, 0, 0),
            this.origin,
            this.length,
            0xff0000
        );
        this.xArrow._type = "ArrowHelper";
        this.xArrow._dir = "x";
        this.xShadowPlane = new THREE.Mesh(shadowPlaneMesh.clone(), shadowPlaneMaterial.clone())
        this.xShadowPlane._type = "PlaneHelper"
        this.xShadowPlane._dir = "x";

        //y
        this.yArrow = new THREE.ArrowHelper(
            new THREE.Vector3(0, 1, 0),
            this.origin,
            this.length,
            0x00ff00
        );
        this.yArrow._type = "ArrowHelper";
        this.yArrow._dir = "y";
        this.yShadowPlane = new THREE.Mesh(shadowPlaneMesh.clone(), shadowPlaneMaterial.clone())
        this.yShadowPlane.rotation.y = THREE.Math.degToRad(90)
        this.yShadowPlane._type = "PlaneHelper"
        this.yShadowPlane._dir = "y";

        //z
        this.zArrow = new THREE.ArrowHelper(
            new THREE.Vector3(0, 0, 1),
            this.origin,
            this.length,
            0x0000ff
        );
        this.zArrow._type = "ArrowHelper";
        this.zArrow._dir = "z";
        this.zShadowPlane = new THREE.Mesh(shadowPlaneMesh.clone(), shadowPlaneMaterial.clone())
        this.zShadowPlane.rotation.x = THREE.Math.degToRad(90)
        this.zShadowPlane._type = "PlaneHelper"
        this.zShadowPlane._dir = "z";

        this.add(this.xArrow);
        this.add(this.xShadowPlane)
        this.add(this.yArrow);
        this.add(this.yShadowPlane)
        this.add(this.zArrow);
        this.add(this.zShadowPlane)
    }

    hide() {
        this.visible = false;
    }

    setTarget(target) {
        console.log(target)
    }

    init(dom) {
        this.dom = dom
        this.eventListener()
    }

    eventListener() {
        this.dom.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.dom.addEventListener("mousemove", this.onMouseMove.bind(this));
        this.dom.addEventListener("mouseup", this.onMouseUp.bind(this));
    }

    onMouseMove() {
        console.log('move')
    }

    onMouseUp() {
        console.log('up')
    }

    onMouseDown() {
        console.log('down')
    }
}

export default new ArrowHelper()