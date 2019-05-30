<template>
  <div id="kintsugi">
    <div
      class="title"
    >kintsugi, fracture:{{this.currentFracture}}, step:{{this.currentStep}}, {{controls.length}}</div>
    <intro v-on:startfracture="startFracture" ref="intro"></intro>
    <div ref="canvas" id="canvas"></div>
    <div class="controls">
      <div class="container">
        <div class="keys" ref="keys">
          <div
            class="container"
            :class="[currentStep%2 === 0 ? 'right' : 'left',currentStep+1=== controls.length ? 'last' : null]"
          >
            <div class="key current" v-if="controls[currentStep]">
              <div class="circle">
                <div class="element" ref="circle" :style="circleScale"></div>
              </div>
              <div class="letter" ref="letter">
                <div class="l">{{controls[currentStep]}}</div>
                <div class="svgs" ref="svgs">
                  <div class="svg1"></div>
                  <div class="svg2"></div>
                </div>
              </div>
              <div class="border"></div>
            </div>
            <div class="key next" v-if="controls[currentStep+1]">
              <div class="letter">{{controls[currentStep+1]}}</div>
            </div>
          </div>
        </div>
        <div class="steps" ref="steps">
          <div class="container">
            <div class="link"></div>
            <div class="step" v-for="(step,index) in controls" :key="step">
              <div class="icon" ref="step">
                <div v-if="index < currentStep" class="check"></div>
                <div v-else class="point"></div>
                <div class="svg" ref="svgstep"></div>
              </div>
              <div class="border"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="debug">
      <!-- <button @click="startFracture()">START</button> -->
      <button @click="nextFracture()">Next fracture</button>
      <!-- <div>{{fractureEnded}}</div> -->
      <button @click="launchCountdown()">START coutdown</button>
      <!-- <button @click="nextStep()">Next step</button>
      <button @click="launchStep()">Start</button>
      <button @click="cancelFracture()">Cancel</button>-->
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import OrbitControls from "orbit-controls-es6";
import ObjectLoader from "~/assets/js/utils/ObjectLoader";
import { mapState } from "vuex";
import { TweenMax } from "gsap";
import GroundTexture from "~/static/ui/kintsugi/mini-game/kintsugi_ground_texture_white.png";
import Rosace from "~/static/ui/kintsugi/mini-game/rosace.png";
import Title from "~/static/ui/kintsugi/mini-game/repair_the_bowl.png";
import Gradient from "~/static/ui/kintsugi/mini-game/gradient.png";
import Intro from "./Kintsugi/Intro";
import Sprite from "@/assets/js/objects/Sprite";

//sprites
import MomoSprite from "~/static/ui/kintsugi/mini-game/sprites/momo/power_momo.png";
const MomoSpriteJson = require("~/static/ui/kintsugi/mini-game/sprites/momo/power_momo.json");

import MomoMoodSprite from "~/static/ui/kintsugi/mini-game/sprites/moods/face_momo.png";
const MomoMoodSpriteJson = require("~/static/ui/kintsugi/mini-game/sprites/moods/face_momo.json");

console.log(MomoSpriteJson);

Number.prototype.map = function(in_min, in_max, out_min, out_max) {
  return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

class App {
  constructor() {
    this.loaded = false;
    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  init(ref) {
    this.ref = ref;
    this.WIDTH = this.ref.offsetWidth;
    this.HEIGHT = this.ref.offsetHeight;

    this.time = 0;
    this.clock = new THREE.Clock();

    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.renderer.setPixelRatio(
      window.devicePixelRatio,
      window.devicePixelRatio
    );
    this.ref.appendChild(this.renderer.domElement);

    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xcccccc);

    // camera
    this.camera = new THREE.PerspectiveCamera(
      40,
      this.WIDTH / this.HEIGHT,
      1,
      10000
    );
    this.camera.position.set(0, 0, 200);

    // controls
    this.controls = new OrbitControls(this.camera);
    this.controls.enabled = true;

    // ambient light
    this.scene.add(new THREE.AmbientLight(0x222222));
    this.scene.background = new THREE.Color("#fefbf0");

    // directional light
    this.light = new THREE.DirectionalLight(0xffffff, 1);
    this.light.position.set(0, 0, 100);
    this.scene.add(this.light);

    // axes
    // this.scene.add(new THREE.AxesHelper(20));

    this.addStageSet();
    // this.addTitle();
    // this.addMomo();

    //animation loop
    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  addMomo() {
    this.momoGroup = new THREE.Group();
    this.scene.add(this.momoGroup);

    this.momo = new Sprite(null, MomoSprite, MomoSpriteJson.sprites, {
      wTiles: 16,
      hTiles: 2
    });
    this.momoGroup.add(this.momo);
    console.log(this.momo);
    this.momo
      .newSprites()
      .addState("wait")
      .start();

    this.momo.scale.set(50, 50, 50);
    this.momo.position.z = 2;
    this.momo.position.x = -65;
    this.momo.position.y = -10;
  }

  addTitle() {
    this.titleGroup = new THREE.Group();
    this.scene.add(this.titleGroup);

    let promises = [];
    promises.push(
      new Promise((resolve, reject) => {
        new THREE.TextureLoader().load(Rosace, texture => {
          // texture.anisotropy = 0;
          texture.magFilter = THREE.NearestFilter;
          texture.minFilter = THREE.NearestFilter;
          let geometryR = new THREE.PlaneGeometry(
            texture.image.width / 10,
            texture.image.height / 10,
            1
          );
          let materialR = new THREE.MeshBasicMaterial({
            opacity: 0,
            map: texture,
            transparent: true
          });
          let planeR = new THREE.Mesh(geometryR, materialR);
          this.titleGroup.add(planeR);
          planeR.position.z = 0.1;
          planeR.scale.set(0.01, 0.01, 0.01);
          resolve(planeR);
        });
      })
    );

    promises.push(
      new Promise((resolve, reject) => {
        new THREE.TextureLoader().load(Gradient, texture => {
          // texture.anisotropy = 0;
          texture.magFilter = THREE.NearestFilter;
          texture.minFilter = THREE.NearestFilter;
          let geometryG = new THREE.PlaneGeometry(
            texture.image.width / 10,
            texture.image.height / 10,
            1
          );
          let materialG = new THREE.MeshBasicMaterial({
            opacity: 0,
            map: texture,
            transparent: true
          });
          let planeG = new THREE.Mesh(geometryG, materialG);
          this.titleGroup.add(planeG);
          planeG.position.z = 0.3;
          planeG.scale.set(0.01, 0.01, 0.01);
          resolve(planeG);
        });
      })
    );

    promises.push(
      new Promise((resolve, reject) => {
        new THREE.TextureLoader().load(Title, texture => {
          // texture.anisotropy = 0;
          texture.magFilter = THREE.NearestFilter;
          texture.minFilter = THREE.NearestFilter;
          let geometryT = new THREE.PlaneGeometry(
            texture.image.width / 6,
            texture.image.height / 6,
            1
          );
          let materialT = new THREE.MeshBasicMaterial({
            opacity: 0,
            map: texture,
            transparent: true
          });
          let planeT = new THREE.Mesh(geometryT, materialT);
          this.titleGroup.add(planeT);
          planeT.position.z = 1;
          planeT.scale.set(0.01, 0.01, 0.01);
          resolve(planeT);
        });
      })
    );
    return promises;
  }

  addStageSet() {
    this.stageSet = new THREE.Group();
    this.scene.add(this.stageSet);

    new THREE.TextureLoader().load(GroundTexture, texture => {
      // texture.anisotropy = 0;
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      let geometryT = new THREE.PlaneGeometry(
        texture.image.width / 7.5,
        texture.image.height / 7.5,
        1
      );
      let materialT = new THREE.MeshBasicMaterial({
        // color: 0xffff00,
        map: texture,
        transparent: true
      });
      let planeT = new THREE.Mesh(geometryT, materialT);

      // planeT.scale.set(1, -1, 1);
      planeT.position.y = -40;
      planeT.position.z = -1;
      this.stageSet.add(planeT);
    });
    let geometry = new THREE.PlaneGeometry(200, 150, 1);
    let material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true
    });
    let plane = new THREE.Mesh(geometry, material);
    plane.position.y = -90;
    plane.position.z = -1;
    // plane.scale.set(0.25, 0.25, 0.25);
    this.stageSet.add(plane);
  }

  render() {
    const delta = this.clock.getDelta() * 5000;
    this.time += delta;
    if (this.momo) {
      this.momo.update(delta);
    }
    this.renderer.render(this.scene, this.camera);
  }

  loadBowl() {
    return new Promise((resolve, reject) => {
      ObjectLoader.load({
        url: "https://rocheclement.fr/momoromo/bol/_.glb",
        format: "glb"
      }).then(object => {
        this.model = object.scene.children[0].children[0].children[0];
        this.model.scale.set(0.00001, 0.00001, 0.00001);
        this.model.children.forEach((c, index) => {
          c._originPosition = c.getWorldPosition(new THREE.Vector3());
          c._originRotation = c.rotation;
          c._originScale = c.scale;

          if (index === 0) {
            c.position.add(new THREE.Vector3(-3.952, 1.889, 0));
            c.rotation.set(0, 0, THREE.Math.degToRad(29.7));
          } else if (index === 1) {
            c.position.add(new THREE.Vector3(21.144, 15.423, 0));
            c.rotation.set(0, 0, THREE.Math.degToRad(-18.05));
          } else if (index === 2) {
            c.position.add(new THREE.Vector3(-12.159, 19.624, 0));
            c.rotation.set(0, 0, THREE.Math.degToRad(-21.57));
          } else if (index === 3) {
            c.position.add(new THREE.Vector3(11.707, 27.608, 0));
            c.rotation.set(0, 0, THREE.Math.degToRad(12.69));
          }
          // c.position.multiplyScalar(3);
          c._maxPosition = c.position.clone();
          c._maxRotation = c.rotation.clone();
          // c.children[1].rotation.z = THREE.Math.degToRad(index*10)
        });

        //fragments
        this.fragments = [];
        this.fragments.push(this.model.getObjectByName("bowlpart_0"));
        this.fragments.push(this.model.getObjectByName("bowlpart_1"));
        this.fragments.push(this.model.getObjectByName("bowlpart_2"));
        this.fragments.push(this.model.getObjectByName("bowlpart_3"));
        // console.log(fragments)

        //fractures
        this.fractures = [];
        this.fractures.push(this.model.getObjectByName("fracture_1"));
        this.fractures.push(this.model.getObjectByName("fracture_2"));
        this.fractures.push(this.model.getObjectByName("fracture_3"));
        // console.log(fractures)

        this.fractures.forEach(fracture => {
          fracture.children.forEach(piece => {
            piece.material.color.set(new THREE.Color(0xff0000));
            // console.log(piece)
          });
        });

        this.scene.add(this.model);
        this.model.position.z = 0.2;
        this.loaded = true;
        resolve(this.model);
      });
    });
  }

  bringCloser(targets, step) {
    step = 6 - (step + 1);
    let ratio = step / 6;

    let target1 = this.fragments[targets[0]];
    let p1 = target1._maxPosition
      .clone()
      .sub(target1._originPosition.clone())
      .multiplyScalar(ratio)
      .add(target1._originPosition.clone());
    TweenMax.to(target1.position, 0.5, { x: p1.x, y: p1.y, z: p1.z });

    let r1 = target1._maxRotation.clone();
    TweenMax.to(target1.rotation, 0.5, { z: r1.z * ratio });

    if (targets[1]) {
      let target2 = this.fragments[targets[1]];
      let p2 = target2._maxPosition
        .clone()
        .sub(target2._originPosition.clone())
        .multiplyScalar(ratio)
        .add(target2._originPosition.clone());
      TweenMax.to(target2.position, 0.5, { x: p2.x, y: p2.y, z: p2.z });

      let r2 = target2._maxRotation.clone();
      TweenMax.to(target2.rotation, 0.5, { z: r2.z * ratio });
    }
  }

  spread(targets) {
    let target1 = this.fragments[targets[0]];
    let p1 = target1._maxPosition.clone();
    TweenMax.to(target1.position, 0.5, { x: p1.x, y: p1.y, z: p1.z });

    let r1 = target1._maxRotation.clone();
    TweenMax.to(target1.rotation, 0.5, { z: r1.z });

    if (targets[1]) {
      let target2 = this.fragments[targets[1]];
      let p2 = target2._maxPosition.clone();
      TweenMax.to(target2.position, 0.5, { x: p2.x, y: p2.y, z: p2.z });

      let r2 = target2._maxRotation.clone();
      TweenMax.to(target2.rotation, 0.5, { z: r2.z });
    }
  }

  triggerFracturePiece(piece) {
    piece.triggered = true;
    piece.material.color.set(0x00ff00);
  }

  onWindowResize() {
    console.log("resize");
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

export default {
  components: { Intro },
  data() {
    return {
      //   app: new App(),
      controls: ["q", "m", "d", "l", "g", "h"],
      interval: 2,
      runningInterval: 0,
      gameModel: [
        {
          fragments: [0, 1],
          fracture: 0
        },
        {
          fragments: [2],
          fracture: 1
        },
        {
          fragments: [3],
          fracture: 2
        }
      ],
      currentFracture: 0,
      currentStep: 0,
      isMiniGameStarted: false,
      fractureEnded: false
    };
  },
  methods: {
    init() {
      this.app = new App();
      this.app.init(this.$refs.canvas);
      // this.app.loadBowl();
      this.createSocketEvents();
    },
    createSocketEvents() {
      if (this.socket) {
        this.socket.on("kintsugi mini-game", params => {
          if (params.id === "next fracture") {
            this.nextFracture();
          }
          if (params.id === "piece triggered") {
            // console.log(params.index)
            let fracture = this.app.fractures[this.currentFracture];
            // console.log(fracture.children[params.index])
            this.app.triggerFracturePiece(fracture.children[params.index]);
          }
        });
      }
    },
    appearToTitle() {
      let promises = [];
      this.app.addTitle().forEach(promise => {
        promises.push(promise);
      });
      promises.push(this.app.loadBowl());
      Promise.all(promises).then(meshes => {
        console.log("model", meshes);
        let tl = new TimelineMax();
        tl.delay(1)
          .add("titleAppear", 0)
          .add("titleDisappear", 3)
          .to(
            meshes[2].scale,
            0.5,
            {
              ease: Power4.easeOut,
              x: 1,
              y: 1,
              z: 1
            },
            "titleAppear"
          )
          .to(
            meshes[2].material,
            0.5,
            {
              ease: Power4.easeOut,
              // delay: -0.5,
              opacity: 1
            },
            "titleAppear"
          )
          .to(
            this.app.model.scale,
            0.5,
            {
              ease: Power4.easeOut,
              // delay: -0.5,
              x: 1,
              y: 1,
              z: 1
            },
            "titleAppear"
          )
          .to(
            [meshes[0].scale, meshes[1].scale],
            0.5,
            {
              ease: Power4.easeOut,
              delay: 0.2,
              x: 1,
              y: 1,
              z: 1
            },
            "titleAppear"
          )
          .to(
            [meshes[0].material, meshes[1].material],
            0.5,
            {
              ease: Power4.easeOut,
              delay: 0.2,
              opacity: 1
            },
            "titleAppear"
          )
          .to(
            [meshes[0].scale, meshes[1].scale, meshes[2].scale],
            0.5,
            {
              ease: Power4.easeOut,
              x: 0.001,
              y: 0.001,
              z: 0.001
            },
            "titleDisappear"
          )
          .to(
            [meshes[0].material, meshes[1].material, meshes[2].material],
            0.5,
            {
              ease: Power4.easeOut,
              opacity: 0
            },
            "titleDisappear"
          )
          .to(this.$refs.intro.$refs.tuto, 1, {
            ease: Power4.easeOut,
            opacity: 1
          });
      });
      this.app.addMomo();
    },
    nextFracture() {
      this.runningInterval = 0;
      if (this.tweening) {
        this.tweening.kill();
      }
      this.currentStep = 0;
      this.currentFracture++;
      this.fractureEnded = false;
      this.resetUI();
      this.launchCountdown();
    },
    launchCountdown() {
      this.$refs.keys.style.opacity = "0";
      this.$refs.steps.style.opacity = "1";
      this.$refs.intro.launchCountdown();
    },
    nextStep() {
      if (this.currentStep === this.controls.length - 1) {
        console.log("next step");
        this.launchStep();
        this.currentStep++;
        this.fractureEnded = true;
        if (this.socket) {
          this.socket.emit("custom-event", {
            name: "kintsugi mini-game",
            in: this.roomID,
            args: {
              id: "launch fracture",
              fracture: this.currentFracture
            }
          });
        }
      } else {
        this.launchStep();
        this.currentStep++;
      }
      // if (this.currentStep >= this.controls.length) {
      //   // this.nextFracture();
      //   console.log("next fracture");
      // } else {
      //   this.launchStep();
      // }
      // this.currentStep++;
    },
    launchStep() {
      if (this.gameModel[this.currentFracture]) {
        // this.startKeyPressInterval();
        let fragments = this.gameModel[this.currentFracture].fragments;
        this.app.bringCloser(fragments, this.currentStep);
        if (this.socket) {
          this.socket.emit("custom-event", {
            name: "kintsugi mini-game",
            in: this.roomID,
            args: {
              id: "bring closer",
              fragments: fragments,
              step: this.currentStep
            }
          });
        }
      }
    },
    resetUI() {
      this.$refs.step.forEach(step => {
        step.style.transform = "translateY(0px)";
      });

      this.$refs.svgstep.forEach(svgstep => {
        svgstep.style.opacity = "0";
      });
    },
    cancelFracture() {
      if (this.gameModel[this.currentFracture]) {
        let fragments = this.gameModel[this.currentFracture].fragments;
        this.app.spread(fragments);
        if (this.socket) {
          this.socket.emit("custom-event", {
            name: "kintsugi mini-game",
            in: this.roomID,
            args: {
              id: "cancel fracture",
              fragments: fragments
            }
          });
        }
        this.runningInterval = 0;
        if (this.tweening) {
          this.tweening.kill();
        }
        this.currentStep = 0;

        //STOP la fracture vient de se cancel -> ecran TODO
        this.launchCountdown();
        // this.startKeyPressInterval();
        //STOP
        this.resetUI();
      }
      // this.currentFracture--
    },
    startFracture() {
      console.log(this.$refs.keys);
      this.$refs.keys.style.opacity = "1";
      this.isMiniGameStarted = true;
      this.resetUI();
      this.startKeyPressInterval();
    },
    onKeyPress(event) {
      if (this.isMiniGameStarted) {
        if (!event.repeat) {
          if (
            event.key.toLowerCase() === this.controls[this.currentStep] &&
            this.runningInterval > 0
          ) {
            console.log("next");
            let tl = new TimelineMax();
            tl.to(this.$refs.letter, 0.1, {
              // ease: Power4.easeIn,
              y: 12,
              onStart: () => {
                this.$refs.svgs.style.opacity = "0";
                this.$refs.circle.style.opacity = "0";
              },
              onComplete: () => {
                this.$refs.letter.classList.add("down");
              }
            })
              .to(
                this.$refs.step[this.currentStep],
                0.1,
                {
                  y: 4
                },
                0
              )
              .to(
                this.$refs.svgstep[this.currentStep],
                0.1,
                {
                  scale: 2.2,
                  onStart: () => {
                    this.$refs.svgstep[this.currentStep].style.opacity = 1;
                  }
                },
                0
              )
              .to(this.$refs.svgs, 0.1, {
                scale: 2,
                onStart: () => {
                  this.$refs.svgs.style.opacity = "1";
                },
                onComplete: () => {
                  this.nextStep();
                  this.startKeyPressInterval();
                  this.$refs.svgs.style.opacity = "1";
                  this.$refs.circle.style.opacity = "1";
                  this.$refs.letter.classList.remove("down");
                  this.$refs.letter.style.transform = "translateY(0)";
                  this.$refs.svgs.style.opacity = "0";
                }
              });
          } else if (this.runningInterval > 0) {
            console.log("wrong key");
            this.cancelFracture();
          }
        }
      }
    },
    startKeyPressInterval() {
      this.runningInterval = this.interval;
      if (this.tweening) {
        this.tweening.kill();
      }
      this.tweening = TweenMax.to(this, this.interval, {
        runningInterval: 0,
        onUpdate: () => {
          // console.log(this.runningInterval);
        },
        onComplete: () => {
          if (!this.fractureEnded) {
            console.log("wrong");
            this.cancelFracture();
          }
          // this.runningInterval = this.interval;
        }
      });
    }
  },
  computed: {
    ...mapState({
      socket: state => state.synchro.socket,
      roomID: state => state.synchro.roomID
    }),
    circleScale() {
      return {
        transform: `scale(${this.runningInterval.map(0, this.interval, 1, 2)})`
      };
    }
    // loaded() {
    //   return this.app.loaded;
    // }
  },
  watch: {
    // loaded(val) {
    //   console.log("isLoaded");
    // }
  },
  mounted() {
    this.init();
    window.addEventListener("keydown", this.onKeyPress.bind(this));
    this.appearToTitle();
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.onKeyPress.bind(this));
  }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/main.scss";
$border: 3px;
#kintsugi {
  height: 680px;
  width: 800px;
  margin: auto;
  background: white;
  position: relative;
  //   -webkit-clip-path: polygon(0 3%, 100% 0%, 100% 97%, 0% 100%);
  //   clip-path: polygon(0 3%, 100% 0%, 100% 97%, 0% 100%);
  border: 5px solid #05498d;

  .title {
    position: absolute;
    top: 0px;
    left: 0px;
    color: #fff;
    background-color: $black;
  }

  #canvas {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
  }

  .controls {
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;
    display: flex;
    flex-direction: column;
    // opacity: 0;

    .container {
      display: flex;
      flex-direction: column;
      margin: auto;
      .keys {
        opacity: 0;
        // background: green;
        // width: 100%;
        display: flex;
        margin-bottom: 52px;

        .container {
          width: 100%;
          display: flex;
          flex-direction: row;
          z-index: 5;
          align-items: center;
          padding: 0 28px;

          &.right {
            justify-content: flex-end;
          }

          &.left {
            justify-content: flex-end;
            flex-direction: row-reverse;
          }

          &.last {
            justify-content: center !important;
          }

          .key {
            display: flex;

            border-radius: 100%;
            position: relative;
            &.current {
              margin: 0 48px;

              .circle {
                position: absolute;
                top: 0px;
                left: 0px;
                height: 100%;
                width: 100%;
                // background: #0f0;
                z-index: -1;
                .element {
                  width: 100%;
                  height: 100%;
                  // border: #f3765a 1px solid;
                  // border-radius: 100%;
                  background-image: url("/ui/kintsugi/mini-game/circle.svg");
                }
              }

              .letter {
                width: 80px;
                height: 80px;
                text-align: center;
                border: $border #f3765a solid;
                background: #fff;
                font-size: 46px;
                position: relative;
                border-radius: 100%;
                top: -12px;
                display: flex;
                box-sizing: content-box;
                font-family: "Jost-Book";
                color: #f3765a;
                &.down {
                  background: #f3765a;
                  color: #fff;
                }
                .l {
                  margin: auto;
                }
                .svgs {
                  position: absolute;
                  top: 0px;
                  left: 0px;
                  width: 100%;
                  height: 100%;
                  transform: scale(0.9);
                  z-index: -1;
                }
                .svg1,
                .svg2 {
                  position: absolute;
                  top: 0px;
                  left: 0px;
                  width: 100%;
                  height: 100%;
                }
                .svg1 {
                  background-image: url("/ui/kintsugi/mini-game/keydown1.svg");
                }
                .svg2 {
                  background-image: url("/ui/kintsugi/mini-game/keydown2.svg");
                }
              }

              .border {
                width: 100%;
                height: 100%;
                top: 0px;
                left: 0px;
                position: absolute;
                z-index: -1;
                background-color: #f3765a;
                border-radius: 100%;
                // transform: scale(1.05);
              }

              // &::after {
              //   content: "";
              //   width: 100%;
              //   height: 100%;
              //   top: 12px;
              //   left: 0px;
              //   position: absolute;
              //   z-index: -1;
              //   background-color: #f3765a;
              //   border-radius: 100%;
              //   transform: scale(1.05);
              // }
            }

            &.next {
              border: $border $black solid;
              width: 60px;
              height: 60px;
              background: #fff;
              .letter {
                font-size: 32px;
              }
            }

            .letter {
              margin: auto;

              text-transform: uppercase;
            }
          }
        }
      }
    }

    .steps {
      opacity: 0;
      margin-bottom: 32px;
      // background: yellow;
      //   width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;

      .container {
        display: flex;
        position: relative;
        flex-direction: row;
        justify-content: center;
        z-index: 5;

        .link {
          position: absolute;
          top: calc(50% - 2px);
          height: $border;
          width: 100%;
          background-color: $black;
        }

        .step {
          margin: 0 20px;
          display: flex;
          position: relative;
          .border {
            width: 100%;
            height: 100%;
            top: 0px;
            left: 0px;
            position: absolute;
            z-index: -1;
            background-color: $black;
            border-radius: 100%;

            // transform: scale(1.2);
          }

          // &::after {
          //   content: "";
          //   width: 100%;
          //   height: 100%;
          //   top: 4px;
          //   left: 0px;
          //   position: absolute;
          //   z-index: -1;
          //   background-color: $black;
          //   border-radius: 100%;
          //   transform: scale(1.2);
          // }

          &:nth-child(2) {
            margin-left: 0;
          }
          &:nth-child(7) {
            margin-right: 0;
          }

          .icon {
            margin: auto;
            top: -4px;
            height: 20px;
            width: 20px;
            border: $border $black solid;
            border-radius: 100%;
            position: relative;
            background-color: #fff;
            display: flex;
            box-sizing: content-box;

            .svg {
              position: absolute;
              top: 0px;
              left: 0px;
              width: 100%;
              height: 100%;
              background-image: url("/ui/kintsugi/mini-game/step_win.svg");
              // transform: scale(2);
              // opacity: 0;
              background-repeat: no-repeat;
              z-index: -1;
            }

            .point {
              width: 4px;
              height: 4px;
              background: $black;
              margin: auto;
              border-radius: 100%;
            }

            .check {
              width: 50%;
              height: 40%;
              // background: #f00;
              margin: auto;
              background-image: url("/ui/kintsugi/mini-game/check.svg");
            }
          }
        }
      }
    }
  }

  #debug {
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;
    display: flex;
    flex-direction: row;
    z-index: 20;
  }
}
</style>
