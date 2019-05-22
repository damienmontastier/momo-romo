import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';
import FixedProp from '../objects/FixedProp'
import CANNON from 'cannon'
import physicParams from '../physics/physicParams';
import Character from '../objects/Character';
import cannonDebugRenderer from '../physics/CannonDebugRenderer'

export default class Level {
    constructor(opts) {
        this.canvas = document.getElementById("canvas")
        this.textureAtlas = opts.textureAtlas; // textureAtlas
        this.fixedProps = opts.levelParams.props.fixed; // Fixed Props
        this.levelParams = {
            ...opts.levelParams
        };
        this.platforms = this.levelParams.platforms

        this.character = new Character()

        this.momo = this.character.momo

        this.eventAnimate = new Event('launchAnimated');

        this.eventMinigame = new Event('launchMiniGame');

        this.eventAnimate.props = new Object();

        this.isMiniGameLaunched = false

        this.isAnimatedLaunched = false

        this.checkpointAnimatedGroup = []

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
        this.camera.position.z = 50;

        this.controls = new OrbitControls(this.camera);

        this.controls.enablePan = false

        this.scene = new THREE.Scene();

        this.scene.add(new THREE.AxesHelper(20));

        this.loaderTexture()

        this.worldPhysic();

        this.renderer = new THREE.WebGLRenderer();

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
        this.fixedProps.forEach(prop => {
            this.addFixedProp(prop)
        });
        this.platforms.forEach(platform => {
            this.addPlatforms(platform)
        });

        this.addCharactere()
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
        prop.checkpointAnimate = props.checkpoint.animate
        if (props.checkpoint.minigame) {
            this.minigameProps = prop
        }
        if (props.checkpoint.animate) {
            this.checkpointAnimatedGroup.push(prop)
        }
        this.fixedProps.push(prop);
        this.scene.add(prop)
    }

    addCharactere() {
        this.scene.add(this.momo)
        this.world.add(this.momo.body)
    }

    addPlatforms(platform) {
        // TODO add class for sphere, plane, box
        let size = platform.scale
        let position = platform.position
        let rotation = platform.rotation
        var axis = new CANNON.Vec3(0, 0, 1);

        let platform_material = new CANNON.Material("platform_material")

        let body = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 10, size.z / 2)),
            material: platform_material,
            position: new CANNON.Vec3(position.x, position.y, position.z),
        });

        body.quaternion.setFromAxisAngle(axis, rotation.z)

        let platform_cm = new CANNON.ContactMaterial(this.character.body.material, platform_material, {
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

    nextToAnimated(value, elementId) {
        if (value && !this.isAnimatedLaunched) {
            this.eventAnimate.props[elementId] = value
            this.isAnimatedLaunched = true
        } else {
            this.eventAnimate.props[elementId] = value
            this.isAnimatedLaunched = false
        }

        // console.log(this.eventAnimate.props)

        // if (value && !this.isAnimatedLaunched) {
        //     this.isAnimatedLaunched = true
        //     this.eventAnimate.props[elementId] = value
        // } else {
        //     this.isAnimatedLaunched = value
        //     this.eventAnimate.props[elementId] = false
        // }

        window.dispatchEvent(this.eventAnimate);
    }

    reset() {
        this.scene = null
    }

    render() {
        // this.camera.lookAt(this.camera.position)

        this.camera.position.set(this.momo.position.x, 2, 20)

        this.cannonDebugRenderer.update()

        this.character.update()

        if (this.minigameProps) {
            if (this.character.body.position.x >= this.minigameProps.position.x - 2 && this.character.body.position.x <= this.minigameProps.position.x + 2) {
                this.nextToMinigame(true)
            } else {
                this.nextToMinigame(false)
            }
        }

        if (this.checkpointAnimatedGroup) {
            this.checkpointAnimatedGroup.forEach((element) => {
                if (this.character.body.position.x >= element.position.x - 2 && this.character.body.position.x <= element.position.x + 2) {
                    this.nextToAnimated(true, element._id)
                } else {
                    this.nextToAnimated(false, element._id)
                }
            });
        }

        this.physicParams.update()

        this.renderer.render(this.scene, this.camera);
    }
}