import * as THREE from 'THREE';
import OrbitControls from 'orbit-controls-es6';
import Stage from '../editor/Stage';
import TextureAtlas from '../utils/TextureAtlas';
import ArrowHelper from '../objects/ArrowHelper';
import Raycaster from './Raycaster'

export default class Editor {
    constructor(opts) {
        this.stages = {}
        this.group = new THREE.Group();

        Object.keys(opts.stages).forEach(key => {
            let atlas = opts.atlases[opts.stages[key].atlas]
            this.stages[key] = new Stage({
                textureAtlas: new TextureAtlas(atlas)
            })
            this.group.add(this.stages[key].group)
        });

        this.init()

    }

    init() {
        //renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        //scene
        this.scene = new THREE.Scene();

        //camera
        this.camera = new THREE.PerspectiveCamera(
            40,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        // this.camera.position.z = 200;
        this.camera.position.set(0, 0.5, 6);
        Raycaster.camera = this.camera;

        // axes
        // this.scene.add(new THREE.AxesHelper(20));
        this.scene.background = new THREE.Color(0x808080);

        this.scene.add(this.group)

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        ArrowHelper.controls = this.controls

        this.addArrows()
        // this.setupGrid()

        this.renderer.setAnimationLoop(this.render.bind(this));

        window.addEventListener("resize", this.onWindowResize.bind(this));
    }

    addArrows() {
        ArrowHelper.init(this.renderer.domElement)
        this.scene.add(ArrowHelper);
    }

    setupGrid() {
        this.grid = new THREE.Group()
        let size = 6;
        let divisions = size;
        let gridHelper = new THREE.GridHelper(
            size,
            divisions,
            0x0ffffff,
            0x000000
        );
        gridHelper.position.x = size / 2;
        gridHelper.position.z = size / 2;

        // gridHelper.name = "Floor GridHelper";

        this.grid.add(gridHelper);
        for (let i = 0; i < 100; ++i) {
            let gridHelperCloneXZ = gridHelper.clone();
            gridHelperCloneXZ.position.x = size * i + size / 2;
            gridHelperCloneXZ.position.z = size / 2;
            gridHelperCloneXZ.position.y = 0;
            this.grid.add(gridHelperCloneXZ);

            let gridHelperCloneXY = gridHelper.clone();
            gridHelperCloneXY.position.z = 0;
            gridHelperCloneXY.position.y = size / 2;
            gridHelperCloneXY.position.x = size * i + size / 2;
            gridHelperCloneXY.rotation.x = THREE.Math.degToRad(90);
            this.grid.add(gridHelperCloneXY);
        }

        this.scene.add(this.grid)
    }

    update(id) {
        this.currentStageId = id
        ArrowHelper.setTarget(null)
        Object.keys(this.stages).forEach(key => {
            this.stages[key].group.visible = false
            if (key === id) {
                this.stages[key].group.visible = true
            }
        })
    }

    raycast(mouse) {
        let intersects = Raycaster.use(mouse, this.stages[this.currentStageId].group.children)

        if (intersects[0]) {
            if (this.target) {
                this.target.highlight(false)
            }
            this.target = intersects[0].object._class
            ArrowHelper.setTarget(this.target)
            this.target.highlight(true)
        } else {
            // ArrowHelper.setTarget(null)
            if (this.target) {
                // this.target.highlight(false)
            }
        }

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