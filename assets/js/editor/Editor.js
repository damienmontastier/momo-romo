import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';
import Stage from '../editor/Stage';
import TextureAtlas from '../utils/TextureAtlas';
import ArrowsHelper from '../objects/ArrowsHelper';
import Raycaster from './Raycaster';
import GridsHelper from './../objects/GridsHelper';
import KeyboardManager from '../utils/KeyboardManager';
import History from './History';

export default class Editor {
    constructor(opts) {
        this.stages = {};
        this.stagesGroup = new THREE.Group();

        Object.keys(opts.stages).forEach(key => {
            let atlas = opts.atlases[opts.stages[key].atlas];
            this.stages[key] = new Stage({
                textureAtlas: new TextureAtlas(atlas),
                pressets: opts.stages[key]
            });
            this.stagesGroup.add(this.stages[key]);
        });

        this.init()

    }

    init() {
        //historique
        this.history = History
        console.log(this.history)

        //keyboard manager
        this.KeyboardManager = new KeyboardManager(this.onInput.bind(this))

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
        this.scene.add(new THREE.AxesHelper(20));
        this.scene.background = new THREE.Color(0x808080);

        this.scene.add(this.stagesGroup);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.arrowsHelper = ArrowsHelper;
        this.arrowsHelper.controls = this.controls;

        this.addArrows();
        this.setupGrid();

        this.renderer.setAnimationLoop(this.render.bind(this));

        window.addEventListener("resize", this.onWindowResize.bind(this));

        console.log(this.scene);
    }

    addArrows() {
        this.arrowsHelper.init(this.renderer.domElement)
        this.scene.add(this.arrowsHelper);
    }

    setupGrid() {
        this.gridsHelper = new GridsHelper({size: 6});
        this.scene.add(this.gridsHelper);
    }

    update(id) {
        this.currentStageId = id;
        this.arrowsHelper.setTarget(null);
        Object.keys(this.stages).forEach(key => {
            this.stages[key].visible = false;
            if (key === id) {
                this.stages[key].visible = true;
            }
        })
    }

    raycast(mouse) {
        let intersects = Raycaster.use(mouse, this.stages[this.currentStageId].children);

        if (intersects[0]) {
            if (this.target) {
                this.target.highlight(false);
            }
            this.target = intersects[0].object._class;
            this.arrowsHelper.setTarget(this.target);
            this.target.highlight(true);
        } else {
            // this.arrowsHelper.setTarget(null)
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

    onInput(key) {
        console.log(key)
        switch (key) {
            case 'Delete':
                if(this.target){
                    this.stages[this.currentStageId].removeElement(this.target)
                    this.arrowsHelper.setTarget(null);
                }
                break;
            case 'CTRL+Z':
                // Undo
                this.history.undo()
                break;
            case 'CTRL+Shift+Z':
                //Redo
                this.history.redo()
                break;
            default:
                break;
        }
    }   
}