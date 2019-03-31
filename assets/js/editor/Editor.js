import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';
import Stage from '../editor/Stage';
import TextureAtlas from '../utils/TextureAtlas';
import ArrowsHelper from '../objects/ArrowsHelper';
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
        this.scene.add(new THREE.AxesHelper(20));
        this.scene.background = new THREE.Color(0x808080);

        this.scene.add(this.group)

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        ArrowsHelper.controls = this.controls

        this.addArrows()
        this.setupGrid()

        this.renderer.setAnimationLoop(this.render.bind(this));

        window.addEventListener("resize", this.onWindowResize.bind(this));

        console.log(this.scene)
    }

    addArrows() {
        ArrowsHelper.init(this.renderer.domElement)
        this.scene.add(ArrowsHelper);
    }

    setupGrid() {
        this.gridHelper = new THREE.Group()
        var size = 6;
        var divisions = 6;
    
        var gridHelperX = new THREE.Group();
        for(let i = 0; i<20; i++) {
            let g = new THREE.GridHelper( size, divisions,0x888888 );
            g.position.x = size * i + size/2
            g.position.z = size/2
            gridHelperX.add(g)
        }
        this.gridHelper.add(gridHelperX)

        var gridHelperY = new THREE.Group();
        for(let i = 0; i<20; i++) {
            let g = new THREE.GridHelper( size, divisions,0x888888 );
            g.position.x = size * i + size/2
            g.position.y = size/2
            g.rotation.x = THREE.Math.degToRad(90)
            gridHelperY.add(g)
        }
        this.gridHelper.add(gridHelperY)

        var gridHelperZ = new THREE.Group();
        let g = new THREE.GridHelper( size, divisions,0x888888 );
        g.rotation.z = THREE.Math.degToRad(90);
        g.position.z = size/2
        g.position.y = size/2
        gridHelperZ.add(g)

        this.gridHelper.add( gridHelperX );
        this.gridHelper.add( gridHelperY );
        this.gridHelper.add( gridHelperZ );

        this.scene.add(this.gridHelper);

//         var size = 10;
// var divisions = 10;

// var gridHelper = new THREE.GridHelper( size, divisions );
// this.scene.add( gridHelper );

    }

    update(id) {
        this.currentStageId = id
        ArrowsHelper.setTarget(null)
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
            ArrowsHelper.setTarget(this.target)
            this.target.highlight(true)
        } else {
            // ArrowsHelper.setTarget(null)
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