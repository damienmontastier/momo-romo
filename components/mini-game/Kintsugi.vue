<template>
    <div id="kintsugi">
        <div class="title">kintsugi mini game {{loaded}}</div>
        <div ref="canvas" id="canvas"></div>
        <div id="debug">
            <button @click="nextFracture()">Next fracture</button>
            <button @click="nextStep()">Next step</button>
            <button @click="launchStep()">Start</button>
            <button @click="cancelFracture()">Cancel</button>
        </div>
    </div>
</template>

<script>
import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';
import ObjectLoader from '~/assets/js/utils/ObjectLoader';


class App{
    constructor() {
        this.loaded = false
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
        this.light.position.set(0, 0, 100);
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
            this.model.children.forEach((c,index)=>{
                c._originPosition = c.getWorldPosition(new THREE.Vector3())
                c._originRotation = c.rotation
                c._originScale = c.scale
                
                c.position.multiplyScalar(3)
                c._maxPosition = c.position.clone()
                // c.children[1].rotation.z = THREE.Math.degToRad(index*10)

                console.log(c)
            })

            //fragments
            this.fragments = []
            this.fragments.push(this.model.getObjectByName('bowlpart_0'))
            this.fragments.push(this.model.getObjectByName('bowlpart_1'))
            this.fragments.push(this.model.getObjectByName('bowlpart_2'))
            this.fragments.push(this.model.getObjectByName('bowlpart_3'))
            // console.log(fragments)

            //fractures
            this.fractures = []
            this.fractures.push(this.model.getObjectByName('fracture_1'))
            this.fractures.push(this.model.getObjectByName('fracture_2'))
            this.fractures.push(this.model.getObjectByName('fracture_3'))
            // console.log(fractures)

            this.fractures.forEach((fracture)=>{
                fracture.children.forEach((piece)=>{
                    piece.material.color.set(new THREE.Color(0xff0000))
                    // console.log(piece)
                })
            })

            this.scene.add(this.model)
            this.loaded = true

            // setTimeout(()=>{
            //     this.bringCloser(this.fragments[0],this.fragments[1],0)
            //     setTimeout(()=>{
            //         this.bringCloser(this.fragments[0],this.fragments[1],1)
            //         setTimeout(()=>{
            //             this.bringCloser(this.fragments[0],this.fragments[1],2)
            //             setTimeout(()=>{
            //                 this.bringCloser(this.fragments[0],this.fragments[1],3)
            //             },1000)
            //         },1000)
            //     },1000)
            // },5000)


        })

    }

    bringCloser(targets,step){
        step = 4 - (step+1)
        let ratio = step/4

        let target1 = this.fragments[targets[0]]
        let p1 = target1._maxPosition.clone().sub(target1._originPosition.clone()).multiplyScalar(ratio).add(target1._originPosition.clone())
        TweenLite.to(target1.position, 0.5, {x:p1.x,y:p1.y,z:p1.z})

        if(targets[1]) {
            let target2 = this.fragments[targets[1]]
            let p2 = target2._maxPosition.clone().sub(target2._originPosition.clone()).multiplyScalar(ratio).add(target2._originPosition.clone())
            TweenLite.to(target2.position, 0.5, {x:p2.x,y:p2.y,z:p2.z})
        }
    }

    spread(targets) {
        let target1 = this.fragments[targets[0]]
        let p1 = target1._maxPosition.clone()
        TweenLite.to(target1.position, 0.5, {x:p1.x,y:p1.y,z:p1.z})

        if(targets[1]) {
            let target2 = this.fragments[targets[1]]
            let p2 = target2._maxPosition.clone()
            TweenLite.to(target2.position, 0.5, {x:p2.x,y:p2.y,z:p2.z})
        }
    }
    
}

export default {
    head: {
        script: [
            {src: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.2/TweenLite.min.js'}
        ]
    },
    data() {
        return {
            app: new App(),
            controls: [
                ['d','m'],
                ['f','l'],
                ['g','k'],
                ['h','j']
            ],
            gameModel:[
                {
                    fragments:[0,1],
                    fracture:0
                },
                {
                    fragments:[2],
                    fracture:1
                },
                {
                    fragments:[3],
                    fracture:2
                }
            ],
            currentFracture: 0,
            currentStep:0
        }
    },
    methods: {
        init() {
            this.app.init(this.$refs.canvas)
            this.app.loadBowl()
        },
        nextFracture() {
            this.currentStep = 0
            this.currentFracture++
            this.launchStep()
        },
        nextStep() {
            this.currentStep++
            if(this.currentStep>3) {
                this.nextFracture()
            } else {
                this.launchStep()
            }
        },
        launchStep() {
            this.app.bringCloser(this.gameModel[this.currentFracture].fragments,this.currentStep)
        },
        cancelFracture() {
            this.currentFracture--
            if(this.gameModel[this.currentFracture]) {
                this.app.spread(this.gameModel[this.currentFracture].fragments)
            }
        }
    },
    computed: {
        loaded() {
            return this.app.loaded
        }
    },
    watch: {
        loaded(val) {
                console.log('isLoaded')
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

    #debug {
        position: absolute;
        bottom:0px;
        left: 0px;
        width: 100%;
        display: flex;
        flex-direction: row;
    }
}

</style>
