<template>
    <div id="kintsugi">
        <div class="title">kintsugi mini game</div>
        <div ref="canvas" id="canvas"></div>
    </div>
</template>

<script>
import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';
import '~/assets/js/utils/GLTFLoader';

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
        this.camera.position.set(100, 100, 100);

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
        this.loader = new THREE.GLTFLoader();
        this.loader.load('https://rocheclement.fr/momoromo/bol/_.glb',(object => {
            this.model = object.scene.children[0].children[0];
            console.log(this.model)
            this.scene.add(this.model)
        }))

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
