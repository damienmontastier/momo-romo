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

        this.fixedPropsGroup = []; // Fixed Props

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
            this.romo.position.z = 2.5
            this.romo.position.y = 1
            this.addCharacter()
        })


        this.loaderTexture()

        this.eventAnimate = new Event('launchAnimated');

        this.eventMinigame = new Event('launchMiniGame');

        this.eventAnimate.props = new Object();

        this.isMiniGameLaunched = false

        this.isAnimatedLaunched = false

        this.camera = new THREE.PerspectiveCamera(
            40,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        this.camera.position.z = 15;
        this.camera.position.y = 3;

        this.finish = false

        this.controls = new OrbitControls(this.camera);

        this.controls.enablePan = false

        this.scene = new THREE.Scene();

        this.scene.add(this.camera)

        this.scene.background = new THREE.Color(0xfdf9eb);

        this.worldPhysic();

        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.renderer.setAnimationLoop(this.render.bind(this));

        this.canvas.appendChild(this.renderer.domElement);

        window.addEventListener("resize", this.onWindowResize.bind(this));

        this.addMask()
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
        prop.originPosition = new THREE.Vector3().copy(prop.position)
        prop.scale.set(props.scale.x, props.scale.y, props.scale.z);
        prop.rotation.set(props.rotation.x, props.rotation.y, props.rotation.z);
        prop.checkpointMinigame = props.checkpoint.minigame
        if (props.checkpoint.minigame) {
            this.minigameProps = prop
        }
        // this.fixedProps.push(prop);
        this.fixedPropsGroup.push(prop)
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

    addCharacter() {
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
        this.restrictedZone = {}
        let singleGeometry = new THREE.Geometry();

        this.width = visibleWidthAtZDepth(0, this.camera)
        this.height = visibleHeightAtZDepth(0, this.camera)

        let geometryLeftRight = new THREE.PlaneGeometry(this.width, this.height, 32);
        let geometryTopBottom = new THREE.PlaneGeometry(this.width, this.height / 2, 32);
        let material = new THREE.MeshBasicMaterial({
            color: 0x2d2d2d,
            // wireframe: true,
            side: THREE.DoubleSide
        });

        let plane = new THREE.Mesh(geometryLeftRight, material); // Left
        plane.position.set(-this.width / 1.25, 0, 0);
        plane.updateMatrix()
        let planeSize = new THREE.Box3().setFromObject(plane);
        this.restrictedZone.left = planeSize.max.x
        singleGeometry.merge(plane.geometry, plane.matrix);

        plane = new THREE.Mesh(geometryLeftRight, material); // Right
        plane.position.set(this.width / 1.25, 0, 0);
        plane.updateMatrix()
        planeSize = new THREE.Box3().setFromObject(plane);
        this.restrictedZone.right = planeSize.min.x
        singleGeometry.merge(plane.geometry, plane.matrix);

        plane = new THREE.Mesh(geometryTopBottom, material); // Top
        plane.position.set(0, this.height / 2, 0);
        plane.rotation.set(0, 0, THREE.Math.degToRad(-.5))
        plane.updateMatrix()
        planeSize = new THREE.Box3().setFromObject(plane);
        this.restrictedZone.top = planeSize.min.y
        singleGeometry.merge(plane.geometry, plane.matrix);

        plane = new THREE.Mesh(geometryTopBottom, material); //Bottom
        plane.position.set(0, -this.height / 2, 0);
        plane.rotation.set(0, 0, THREE.Math.degToRad(2))
        plane.updateMatrix()
        planeSize = new THREE.Box3().setFromObject(plane);
        this.restrictedZone.bottom = planeSize.max.y
        singleGeometry.merge(plane.geometry, plane.matrix);

        this.masks = new THREE.Mesh(singleGeometry, material);

        let materialbis = new THREE.MeshBasicMaterial({
            color: 0xff0000, // TODO video a mapper sur ce material
            // wireframe: true,
            side: THREE.DoubleSide
        });

        var border = new THREE.Mesh(singleGeometry, materialbis);
        border.scale.multiplyScalar(1.01);
        this.masks.add(border);
        this.masks.scale.set(.6, .6, .6)

        // TODO POUR LA TRANSITION 
        this.camera.position.set(-this.width, 3, 15)

        this.masks.position.set(this.width / 2, 0, -8)

        // this.masks.position.set(0, 0, -8)

        // Position finale de la caméra au lancement du jeu 
        // this.camera.position.set(5, 3, 15)

        this.scene.add(this.masks);
        this.camera.add(this.masks);
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

    preRenderProps() {
        let promises = []
        for (let i = 0; i < this.fixedPropsGroup.length; i++) {
            let test = new Promise((resolve, reject) => {
                setTimeout(() => {
                    this.fixedPropsGroup[i].position.x = this.camera.position.x
                    resolve(this.fixedPropsGroup[i]);
                }, i * 100)
            });

            promises.push(test)

            test.then((fixed) => {
                setTimeout(() => {
                    fixed.position.copy(fixed.originPosition)
                }, 100);
            })
        }

        Promise.all(promises).then(() => {
            console.log('finish render')

            this.finish = true
            //Run le game
            TweenMax.to(this.camera.position, 1, {
                x: this.momo.position.x + 3,
                ease: Power0.easeIn
            })
            // this.masks.position.set(0, 0, -8)

            TweenMax.to(this.masks.position, 1, {
                x: 0,
                x: 0,
                z: -8,
                ease: Power0.easeIn
            })
        })
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

        //Eviter la sortie de Romo
        if (this.romo && this.restrictedZone) {
            this.romo.position.x = Math.max(1 + (this.camera.position.x + this.restrictedZone.left), Math.min(this.camera.position.x + (this.restrictedZone.right - 1), this.romo.position.x))
            this.romo.position.y = Math.max(this.restrictedZone.bottom + .5, Math.min(this.restrictedZone.top, this.romo.position.y))
        }

        this.cannonDebugRenderer.update()

        if (this.characters && this.finish) {
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