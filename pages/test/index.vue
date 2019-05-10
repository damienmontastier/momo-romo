<template>
    <div ref="page">
        <div id="debugger-sprite">
            <div>sprites : {{ currentSpriteID }}</div>
            <div></div>
            <ul>
                <li v-for="sprite in sprites" @click="launchSprite(sprite.id)" :class="{'current' : currentSpriteID === sprite.id}">{{sprite.id}}</li>
            </ul>
        </div>
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script>
import * as THREE from 'three'
import OrbitControls from 'orbit-controls-es6';
import Sprite from '@/assets/js/objects/Sprite';
import MomoSprite from '~/static/sprites/momo/momo.png';
const MomoJson = require("~/static/sprites/momo/momo.json");
export default {
    computed: {
        sprites() {
            return MomoJson.sprites
        }
    },
    data() {
        return {
            currentSpriteID: 'default'
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            // renderer
            this.renderer = new THREE.WebGLRenderer({antialias: true, canvas: this.$refs.canvas});
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio = window.devicePixelRatio;

            // scene
            this.scene = new THREE.Scene();
            // this.scene.background = new THREE.Color(0xff0000)

            // camera
            this.camera = new THREE.PerspectiveCamera(
                40,
                window.innerWidth / window.innerHeight,
                1,
                10000
            );
            this.camera.position.set(2, 2, 2);

            // controls
            this.controls = new OrbitControls(
                this.camera,
                this.$refs.page
            );
            this.controls.enabled = true;
            this.controls.enablePan = false;

            // axes
            this.scene.add(new THREE.AxesHelper(20));

            this.momo = new Sprite({texture:MomoSprite, sprites: MomoJson.sprites,w:6,h:9})
            this.scene.add(this.momo)
            console.log(MomoJson)

            this.time = 0;
            this.clock = new THREE.Clock()

            //animation loop
            this.renderer.setAnimationLoop(this.render.bind(this));
        },
        render() {
            const delta = this.clock.getDelta() * 750;
            this.time += delta;
            this.momo.update(delta);
            this.renderer.render(this.scene, this.camera);
        },
        launchSprite(id) {
            this.momo.changeState(id);
            this.currentSpriteID = id;
        }
    },
}
</script>

<style lang="scss" scoped>
#debugger-sprite {
    position: absolute;
    top: 0px;
    left:0px;
    background: #fff;

    ul {
        li {
            &.current {
                background: red;
                color: #fff;
            }
        }
    }
}
</style>
