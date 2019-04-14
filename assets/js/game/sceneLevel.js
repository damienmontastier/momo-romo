import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';
import FixedProp from '../objects/FixedProp'
import CANNON from 'cannon'
import physicParams from '../physics/physicParams';
import '../physics/CannonDebugRenderer'


export default class Level {
    constructor(opts) {
        this.canvas = document.getElementById("canvas")
        this.textureAtlas = opts.textureAtlas; // textureAtlas
        this.fixedProps = [...opts.levelParams.props.fixed]; // Fixed Props
        this.levelParams = {
            ...opts.levelParams
        };
        this.platforms = this.levelParams.platforms

        //Setup Camera
        this.camera = new THREE.PerspectiveCamera(
            40,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 20;

        this.controls = new OrbitControls(this.camera);

        this.scene = new THREE.Scene();

        // axes
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

        this.cannonDebugRenderer = new THREE.CannonDebugRenderer(
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
        this.fixedProps.push(prop);
        this.scene.add(prop)
    }

    addPlatforms(platform) {
        // TODO add class for sphere, plane, box
        let size = platform.scale
        let position = platform.position

        let body = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Box(new CANNON.Vec3(size.x, size.y / 10, size.z)),
            material: new CANNON.Material(),
            position: new CANNON.Vec3(position.x, position.y, position.z)
        });

        this.world.add(body);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render() {
        this.cannonDebugRenderer.update()

        this.physicParams.update()

        this.renderer.render(this.scene, this.camera);
    }
}