import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';
import FixedProp from '../objects/FixedProp'
import CANNON from 'cannon'
import physicParams from '../physics/physicParams';
import Characters from '../objects/Characters';
import cannonDebugRenderer from '../physics/CannonDebugRenderer'
import AnimatedProp from "@/assets/js/objects/AnimatedProp";
import Sprite from "@/assets/js/objects/Sprite";

import {
    TweenMax,
    Power4
} from 'gsap';


const visibleHeightAtZDepth = (depth, camera) => {
    const cameraOffset = camera.position.z;
    if (depth < cameraOffset) depth -= cameraOffset;
    else depth += cameraOffset;

    const vFOV = camera.fov * Math.PI / 180;

    return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
};

const visibleWidthAtZDepth = (depth, camera) => {
    const height = visibleHeightAtZDepth(depth, camera);
    return height * camera.aspect;
};

export default class Level {
    constructor(opts, store) {

        this.canvas = document.getElementById("canvas")
        this.textureAtlas = opts.textureAtlas; // textureAtlas

        this.fixedProps = opts.levelParams.props.fixed; // Fixed Props

        this.animates = opts.levelParams.animates; // Animate Props
        this.animatesArray = []

        this.levelParams = {
            ...opts.levelParams
        };
        this.platforms = this.levelParams.platforms

        this.animateRunning = false
        this.animateWait = false

        this.clock = new THREE.Clock()


        new Characters(store).then((characters) => {
            this.characters = characters
            this.momo = this.characters.momo
            this.romo = this.characters.romo
            this.romo.scale.set(2, 2, 2)
            this.addCharactere()
            this.loaderTexture()
        })

        this.eventAnimate = new Event('launchAnimated');

        this.eventMinigame = new Event('launchMiniGame');

        this.eventAnimate.props = new Object();

        this.isMiniGameLaunched = false

        this.isAnimatedLaunched = false

        //Setup Camera
        this.camera = new THREE.PerspectiveCamera(
            40,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        // this.camera = new THREE.OrthographicCamera(
        //     window.innerWidth / - 20, window.innerWidth / 20, window.innerHeight / 20, window.innerHeight / - 20, .1, 1000
        // );
        this.camera.position.z = 15;
        this.camera.position.y = 3;

        this.controls = new OrbitControls(this.camera);

        this.controls.enablePan = false

        this.scene = new THREE.Scene();

        this.scene.add(this.camera)

        this.scene.background = new THREE.Color(0xfdf9eb);

        // this.scene.add(new THREE.AxesHelper(20));

        this.worldPhysic();

        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.renderer.setAnimationLoop(this.render.bind(this));

        this.canvas.appendChild(this.renderer.domElement);

        window.addEventListener("resize", this.onWindowResize.bind(this));
    }

    worldPhysic() {
        this.physicParams = new physicParams()
        this.world = this.physicParams.world

        this.cannonDebugRenderer = new cannonDebugRenderer(
            this.scene,
            this.world
        )
    }

    loaderTexture() {
        this.textureAtlas.load().then(textures => {
            this.textures = textures;
            this.init()
        });
    }

    init() {
        if (this.fixedProps) {
            this.fixedProps.forEach(prop => {
                this.addFixedProp(prop)
            });
        }
        if (this.platforms) {
            this.platforms.forEach(platform => {
                this.addPlatforms(platform)
            });
        }
        if (this.animates) {
            this.animates.forEach(animate => {
                this.addAnimate(animate)
            });
        }
        this.addMask()
    }

    addFixedProp(props) {
        let t = this.textureAtlas.get(props._id);
        let prop = new FixedProp({
            id: props._id,
            width: t._data.ratio,
            position: props.position,
            height: 1,
            material: new THREE.MeshBasicMaterial({
                map: t,
                transparent: true,
                alphaTest: 0.5,
            })
        });
        prop.position.set(props.position.x, props.position.y, props.position.z);
        prop.scale.set(props.scale.x, props.scale.y, props.scale.z);
        prop.rotation.set(props.rotation.x, props.rotation.y, props.rotation.z);
        prop.checkpointMinigame = props.checkpoint.minigame
        if (props.checkpoint.minigame) {
            this.minigameProps = prop
        }
        this.fixedProps.push(prop);
        this.scene.add(prop)
    }

    addAnimate(params) {
        new AnimatedProp(params).then((animate) => {
            animate.scale.set(params.scale.x, params.scale.y, params.scale.z)
            animate.position.set(params.position.x, params.position.y, params.position.z)
            animate.rotation.set(params.rotation.x, params.rotation.y, params.rotation.z)
            animate.name = params.params.json.id
            this.animatesArray.push(animate)
            this.scene.add(animate)
        })
    }

    addCharactere() {
        this.scene.add(this.momo, this.romo)
        this.world.add(this.momo.body)
    }

    addPlatforms(platform) {
        let size = platform.scale
        let position = platform.position
        let rotation = platform.rotation
        let axis = new CANNON.Vec3(0, 0, 1);

        let platform_material = new CANNON.Material("platform_material")

        let body = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 10, size.z / 2)),
            material: platform_material,
            position: new CANNON.Vec3(position.x, position.y, position.z),
        });

        body.quaternion.setFromAxisAngle(axis, rotation.z)

        let platform_cm = new CANNON.ContactMaterial(this.momo.body.material, platform_material, {
            friction: 0.1,
            restitution: 0,
            // frictionEquationStiffness: 1e9,
            // frictionEquationRelaxation: 10
        });
        this.world.addContactMaterial(platform_cm);

        this.world.add(body);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    addMask() {
        this.singleGeometry = new THREE.Geometry();

        let width = visibleWidthAtZDepth(this.romo.position.z, this.camera)
        let height = visibleHeightAtZDepth(this.romo.position.z, this.camera)

        let geometryTopBottom = new THREE.PlaneGeometry(width, height, 1)
        let geometryLeftRight = new THREE.PlaneGeometry(width / 2, height, 1)

        let BoxGeometryTop = new THREE.Mesh(geometryTopBottom, material);
        BoxGeometryTop.position.set(0, height / 2 + 1.5, 0)
        BoxGeometryTop.rotation.set(0, THREE.Math.degToRad(4), 0)
        BoxGeometryTop.updateMatrix()
        this.singleGeometry.merge(BoxGeometryTop.geometry, BoxGeometryTop.matrix)

        let BoxGeometryBottom = new THREE.Mesh(geometryTopBottom, material);
        BoxGeometryBottom.position.set(0, -(height / 2) - 2.25, 0)
        BoxGeometryBottom.rotation.set(0, THREE.Math.degToRad(2), 0)
        BoxGeometryBottom.updateMatrix()
        this.singleGeometry.merge(BoxGeometryBottom.geometry, BoxGeometryBottom.matrix)

        let BoxGeometryLeft = new THREE.Mesh(geometryLeftRight, material);
        BoxGeometryLeft.position.set(-10, 0, 0)
        BoxGeometryLeft.updateMatrix()
        this.singleGeometry.merge(BoxGeometryLeft.geometry, BoxGeometryLeft.matrix)

        let BoxGeometryRight = new THREE.Mesh(geometryLeftRight, material);
        BoxGeometryRight.position.set(10, 0, 0)
        BoxGeometryRight.updateMatrix()
        this.singleGeometry.merge(BoxGeometryRight.geometry, BoxGeometryRight.matrix)

        let material = new THREE.MeshBasicMaterial({
            color: 0x2d2d2d,
        });

        let masks = new THREE.Mesh(this.singleGeometry, material)

        var outlineMaterial = new THREE.MeshBasicMaterial({
            color: 0xf9f6eb,
            side: THREE.DoubleSide
        });
        let outlineMesh = new THREE.Mesh(this.singleGeometry, outlineMaterial);
        outlineMesh.scale.set(1, 1.01, 1);
        masks.add(outlineMesh);

        masks.position.set(0, 0, -8)

        this.scene.add(masks)

        this.camera.add(masks);
    }


    nextToMinigame(value) {
        if (value && !this.isMiniGameLaunched) {
            this.isMiniGameLaunched = true
            this.eventMinigame.minigame = value
        } else {
            this.isMiniGameLaunched = false
            this.eventMinigame.minigame = value
        }

        window.dispatchEvent(this.eventMinigame);
    }

    reset() {
        this.scene = null
    }

    render() {
        // this.camera.lookAt(this.camera.position)

        if (this.animatesArray.length) {
            this.animatesArray.forEach(animate => {
                const delta = this.clock.getDelta() * 5000;
                this.time += delta;
                animate.animate.update(delta)
                if (this.romo.position.x >= animate.position.x - 1.5 && this.romo.position.x <= animate.position.x + 1.5) {
                    if (animate.animate.name = "cat") {
                        if (!this.animateRunning) {
                            console.log('passage sur le animated')
                            this.launchSprite(animate.animate, "cat")
                            this.animateWait = false
                            this.animateRunning = true;
                            let x = animate.position.x
                            TweenMax.to(animate.position, 2, {
                                x: x + 2,
                                ease: Power4.easeIn,
                            })
                        }
                    }
                } else {
                    if (!this.animateWait) {
                        this.launchSprite(animate.animate, "wait")

                        this.animateWait = true
                        // this.animateRunning = false;
                    }
                }
            });
        }

        // if(this.momo){
        //     this.plane.position.x = this.momo.position.x
        // }

        if (this.romo) {

            // let test = this.getScreenPos(this.romo.position.x, this.romo.position.y, this.romo.position.z, this.camera)
            // let position = this.toScreenPosition(this.romo, this.camera)

            // this.plane.position.x = this.momo.position.x
            // let width = visibleWidthAtZDepth(this.romo.position.z, this.camera)
            // let height = visibleHeightAtZDepth(this.romo.position.z, this.camera)
            this.romo.position.x = Math.max(0, Math.min(this.momo.position.x + 8, this.romo.position.x))
            // this.romo.position.y = Math.max(0, Math.min(height, this.romo.position.y))
        }
        this.cannonDebugRenderer.update()

        if (this.characters) {
            this.characters.update()
            TweenMax.to(this.camera.position, 1, {
                x: this.momo.position.x,
                ease: Power0.easeIn
            })
        }

        if (this.minigameProps) {
            if (this.momo.body.position.x >= this.minigameProps.position.x - 2 && this.momo.body.position.x <= this.minigameProps.position.x + 2) {
                this.nextToMinigame(true)
            } else {
                this.nextToMinigame(false)
            }
        }

        this.physicParams.update()

        this.renderer.render(this.scene, this.camera);
    }
    launchSprite(character, id) {
        character
            .newSprites()
            .addState(id)
            .start()
        this.currentSpriteID = id;
    }
}