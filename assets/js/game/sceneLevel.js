import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';
import FixedProp from '../objects/FixedProp'
import CANNON from 'cannon'
import physicParams from '../physics/physicParams';
import Characters from '../objects/Characters';
import cannonDebugRenderer from '../physics/CannonDebugRenderer'
import {
    TweenMax,
    Power4
} from 'gsap';

export default class Level {
    constructor(opts, store) {
        this.canvas = document.getElementById("canvas")
        this.textureAtlas = opts.textureAtlas; // textureAtlas
        this.fixedProps = opts.levelParams.props.fixed; // Fixed Props
        this.levelParams = {
            ...opts.levelParams
        };
        this.platforms = this.levelParams.platforms

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
        this.camera.position.z = 10;

        this.controls = new OrbitControls(this.camera);

        this.controls.enablePan = false

        this.scene = new THREE.Scene();

        this.scene.add(new THREE.AxesHelper(20));


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
        this.fixedProps.forEach(prop => {
            this.addFixedProp(prop)
        });
        this.platforms.forEach(platform => {
            this.addPlatforms(platform)
        });
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
        this.scene.add(this.momo, this.romo)
        this.world.add(this.momo.body)
    }

    addPlatforms(platform) {
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

        this.cannonDebugRenderer.update()

        if (this.characters) {
            this.characters.update()
            // this.camera.position.set(this.momo.position.x, 2, 10)
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
}