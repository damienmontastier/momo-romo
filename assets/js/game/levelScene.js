import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';

export default class Level {
    constructor(opts) {

        this.canvas = document.getElementById("canvas")

        this.textureAtlas = opts.textureAtlas; // textureAtlas
        this.fixedProps = [...opts.levelParams.props.fixed]; // Fixed Props
        this.levelParams = {
            ...opts.levelParams
        };

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

        this.renderer = new THREE.WebGLRenderer();

        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.renderer.setAnimationLoop(this.render.bind(this));

        this.canvas.appendChild(this.renderer.domElement);

        window.addEventListener("resize", this.onWindowResize.bind(this));
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
    }

    addFixedProp(props) {
        let t = this.textureAtlas.get(props._id);
        let prop = new Props({
            id: props._id,
            width: t._data.ratio,
            position: props.position,
            height: 1,
            material: new THREE.MeshBasicMaterial({
                // color: 0xff0000,
                map: t,
                // side: THREE.FaceSide,
                transparent: true,
                alphaTest: 0.5,
            })
        });
        prop.position.set(t._data.ratio * 0.5, 0.5, 0);
        this.fixedProps.push(prop);
        this.scene.add(prop)
    }

    addProps() {
        this.propsMesh = new Props({
            props: this.props
        })

        this.scene.add(this.propsMesh)
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

class Props extends THREE.Object3D {
    constructor(opts) {
        super()
        this.width = opts.width;
        this.height = opts.height;
        this.material = opts.material;
        this._id = opts.id
        this.positionProps = {
            x: opts.position.x,
            y: opts.position.y,
            z: opts.position.z,
        }
        this.render();
    }

    render() {
        this.geometry = new THREE.PlaneGeometry(
            this.width,
            this.height,
            1,
            1
        );
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(this.positionProps.x, this.positionProps.y, this.positionProps.z)
        this.mesh._type = "FixedProp";
        this.mesh._class = this;
        this.add(this.mesh);
    }

}