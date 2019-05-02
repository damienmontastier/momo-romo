<template>
    <div id="kintsugi">
        <div class="title">kintsugi mini game</div>
        <div ref="canvas" id="canvas"></div>
    </div>
</template>

<script>
import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';
import ObjectLoader from '~/assets/js/utils/ObjectLoader';

class App{
    constructor() {
        
    }

    init (ref) {
        this.ref = ref
        this.WIDTH = this.ref.offsetWidth
        this.HEIGHT = this.ref.offsetHeight

        // renderer
        this.renderer = new THREE.WebGLRenderer({antialias:true});
        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        this.ref.appendChild(this.renderer.domElement);

        // scene
        this.scene = new THREE.Scene();

        // camera
        this.camera = new THREE.PerspectiveCamera(
            40,
            this.WIDTH / this.HEIGHT,
            1,
            10000
        );
        this.camera.position.set(0, 0, 100);

        // controls
        this.controls = new OrbitControls(this.camera);
        this.controls.enabled = true;

        // ambient light
        this.scene.add(new THREE.AmbientLight(0x222222));

        // directional light
        this.light = new THREE.DirectionalLight(0xffffff, 1);
        this.light.position.set(20, 20, 0);
        this.scene.add(this.light);

        // axes
        this.scene.add(new THREE.AxesHelper(20));

        //animation loop
        this.renderer.setAnimationLoop(this.render.bind(this));
    }

    render() {
		this.renderer.render(this.scene, this.camera);
    }
    
    loadBowl() {
        ObjectLoader.load({url:'https://rocheclement.fr/momoromo/bol/_.glb',format:'glb'})
        .then(object=>{
            this.model = object.scene.children[0].children[0].children[0];
            console.log(this.model)
            this.model.children.forEach((c,index)=>{
                c._originPosition = c.getWorldPosition(new THREE.Vector3())
                c._originRotation = c.rotation
                c._originScale = c.scale
                
                c.position.multiplyScalar(1.5)
                // c.children[1].rotation.z = THREE.Math.degToRad(index*10)
            })

            //fragments
            let fragments = []
            fragments.push(this.model.getObjectByName('polybowl_0'))
            fragments.push(this.model.getObjectByName('polybowl_1'))
            fragments.push(this.model.getObjectByName('polybowl_2'))
            fragments.push(this.model.getObjectByName('polybowl_3'))
            console.log(fragments)

            //fractures
            let fractures = []
            fractures.push(this.model.getObjectByName('fracture_1'))
            fractures.push(this.model.getObjectByName('fracture_2'))
            fractures.push(this.model.getObjectByName('fracture_3'))
            console.log(fractures)

            fractures.forEach((fracture)=>{
                fracture.children.forEach((piece)=>{
                    // piece.material.color.set = new THREE.Color(0xff0000)
                    // console.log(piece)
                })
            })

            this.scene.add(this.model)
        })

    }
}

export default {
    data() {
        return {
            app: new App()
        }
    },
    methods: {
        init() {
            this.app.init(this.$refs.canvas)
            this.app.loadBowl()
        }
    },
    mounted() {
        this.init()
    }
}
</script>

<style lang="scss" scoped>
#kintsugi {
    height: 50vh;
    width: 50vh;
    margin: auto;
    background: white;
    position: relative;

    .title {
        position: absolute;
        top:0px;
        left: 0px;
        color: #fff;
        background-color: #000
    }

    #canvas {
        width: 100%;
        height: 100%;
    }
}

</style>
