import * as THREE from "three";
import Raycaster from '../editor/Raycaster';
import History from '../editor/History';

class ArrowsHelper extends THREE.Object3D {
    constructor() {
        super();

        this.history = History;
        this.target = null;
        this.mouse = new THREE.Vector2();

        this.render();
        this.hide();
    }

    render() {
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.origin = new THREE.Vector3(0, 0, 0);
        this.length = 2;

        let shadowPlaneGeometry = new THREE.PlaneGeometry(100, 100, 1);
        let shadowPlaneMaterial = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.0,
            alphaTest: 0.5
        });

        //x
        this.xArrow = new THREE.ArrowHelper(
            new THREE.Vector3(1, 0, 0),
            this.origin,
            this.length,
            0xff0000
        );
        this.xArrow._type = "ArrowHelper";
        this.xArrow._dir = "x";
        this.xShadowPlane = new THREE.Mesh(shadowPlaneGeometry.clone(), shadowPlaneMaterial.clone());
        this.xShadowPlane._type = "PlaneHelper";
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
        this.yShadowPlane = new THREE.Mesh(shadowPlaneGeometry.clone(), shadowPlaneMaterial.clone());
        // this.yShadowPlane.rotation.y = THREE.Math.degToRad(90);
        this.yShadowPlane._type = "PlaneHelper";
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
        this.zShadowPlane = new THREE.Mesh(shadowPlaneGeometry.clone(), shadowPlaneMaterial.clone());
        this.zShadowPlane.rotation.x = THREE.Math.degToRad(90);
        this.zShadowPlane._type = "PlaneHelper";
        this.zShadowPlane._dir = "z";

        this.circleGeometry = new THREE.CircleGeometry( 0.25, 16 );
        this.xCircle = new THREE.Mesh( this.circleGeometry.clone(), new THREE.MeshBasicMaterial({
            color: 0xff0000
        }) );
        this.xCircle.position.z = 0.1;
        this.xCircle._type = "CircleHelper";
        this.add(this.xCircle)

        this.add(this.xArrow);
        this.add(this.xShadowPlane);
        this.add(this.yArrow);
        this.add(this.yShadowPlane);
        this.add(this.zArrow);
        this.add(this.zShadowPlane);
    }

    hide() {
        this.visible = false;
    }

    setTarget(target) {
        this.target = target;
        this.update();
    }

    update() {
        if (this.target) {
            if(this.edited) {
                console.log(this.history)
                this.history.push(
                {
                    name:'moved',
                    copy:{
                        position: this.targetOriginPosition,
                        rotation: this.targetOriginRotation
                    },
                    target: this.target
                })
            }
            
            this.targetOriginPosition = this.target.position.clone();
            this.targetOriginRotation = this.target.rotation.clone();
            this.position = this.target.position;
            this.visible = true;
        } else {
            this.hide();
        }

    }

    init(dom) {
        this.dom = dom;
        this.eventListener();
    }

    eventListener() {
        this.dom.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.dom.addEventListener("mousemove", this.onMouseMove.bind(this));
        this.dom.addEventListener("mouseup", this.onMouseUp.bind(this));
    }

    onMouseMove(event) {
        if (this.targetPlane) {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            this.edited = true;

            let intersects = Raycaster.use(this.mouse, this.children);
            if(this.mode == 'position'){
                this.targetPlane = intersects.filter(
                    i => i.object._type === 'PlaneHelper' && i.object._dir == this.targetArrowDir
                );
                if (this.targetPlane[0]) {
                    this.movePoint = this.targetPlane[0].point;
                    switch (this.targetArrowDir) {
                        case "x":
                            this.target.position.x = this.targetOriginPosition.x + (this.movePoint.x - this.downPoint.x);
                            break;
                        case "y":
                            this.target.position.y = this.targetOriginPosition.y + (this.movePoint.y - this.downPoint.y);
                            break;
                        case "z":
                            this.target.position.z = Math.round(this.targetOriginPosition.z + (this.movePoint.z - this.downPoint.z));
                            break;

                        default:
                            break;
                    }
                    // this.position = this.target.position;
                }
            } else if(this.mode == 'rotation') {
                this.targetPlane = intersects.filter(
                    i => i.object._type === 'PlaneHelper' && i.object._dir == 'x'
                );
                if(this.targetPlane[0]) {
                    
                    this.movePoint = this.targetPlane[0].point;
                    let r = this.movePoint.x - this.downPoint.x;
                    this.target.rotation.z = this.targetOriginRotation.z + r;
                }
                
            }
        }
    }

    onMouseUp() {
        this.mode = null;
        if (this.target) {
            this.update(this.target);
        }
        this.targetPlane = null;
        this.controls.enabled = true;
    }

    onMouseDown(event) {
        if (this.target != null) {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            this.edited = false;

            let intersects = Raycaster.use(this.mouse, this.children);
            // console.log(intersects.filter(i => i.object._type === "CircleHelper"))
            let targetArrow = intersects.filter(i => i.object.type === "Mesh" && (i.object.parent._type === "ArrowHelper" || i.object._type === "CircleHelper"));
            if (targetArrow[0]) {
                if(targetArrow[0].object.parent._type === "ArrowHelper") {
                    this.mode = "position"
                    this.targetArrowDir = targetArrow[0].object.parent._dir;
                    this.targetPlane = intersects.filter(
                        i => i.object._type === 'PlaneHelper' && i.object._dir == this.targetArrowDir
                    );
                    this.downPoint = this.targetPlane[0].point;
                    
                } else if(targetArrow[0].object._type === "CircleHelper"){
                    this.mode = "rotation"
                    this.targetPlane = intersects.filter(
                        i => i.object._type === 'PlaneHelper' && i.object._dir === 'x'
                    );
                    this.downPoint = this.targetPlane[0].point;
                }
                this.controls.enabled = false;
            }
        }
    }
}

export default new ArrowsHelper()