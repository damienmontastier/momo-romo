<template>
  <div id="kintsugi">
    <div class="title">kintsugi mini game</div>
    <div ref="canvas" id="canvas"></div>
    <div class="controls">
      <div class="container">
        <div class="keys">
          <div
            class="container"
            :class="[currentStep%2 === 0 ? 'right' : 'left',currentStep+1=== controls.length ? 'last' : null]"
          >
            <div class="key current" v-if="controls[currentStep]">
              <div class="circle">
                <div class="element" ref="circle" :style="circleScale"></div>
              </div>
              <div class="letter" ref="letter">
                <div>{{controls[currentStep]}}</div>
              </div>
              <div class="border"></div>
            </div>
            <div class="key next" v-if="controls[currentStep+1]">
              <div class="letter">{{controls[currentStep+1]}}</div>
            </div>
          </div>
        </div>
        <div class="steps">
          <div class="container">
            <div class="link"></div>
            <div class="step" v-for="(step,index) in controls" :key="step">
              <div class="icon">
                <div v-if="index < currentStep" class="check"></div>
                <div v-else class="point"></div>
              </div>
              <div class="border"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="debug">
      <button @click="startMiniGame()">START</button>
      <!-- <button @click="nextFracture()">Next fracture</button>
      <button @click="nextStep()">Next step</button>
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

Number.prototype.map = function(in_min, in_max, out_min, out_max) {
  return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

class App {
  constructor() {
    this.loaded = false;
  }

  init(ref) {
    this.ref = ref;
    this.WIDTH = this.ref.offsetWidth;
    this.HEIGHT = this.ref.offsetHeight;

    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
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
    ObjectLoader.load({
      url: "https://rocheclement.fr/momoromo/bol/_.glb",
      format: "glb"
    }).then(object => {
      this.model = object.scene.children[0].children[0].children[0];
      this.model.children.forEach((c, index) => {
        c._originPosition = c.getWorldPosition(new THREE.Vector3());
        c._originRotation = c.rotation;
        c._originScale = c.scale;

        c.position.multiplyScalar(3);
        c._maxPosition = c.position.clone();
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
      this.loaded = true;
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
    TweenLite.to(target1.position, 0.5, { x: p1.x, y: p1.y, z: p1.z });

    if (targets[1]) {
      let target2 = this.fragments[targets[1]];
      let p2 = target2._maxPosition
        .clone()
        .sub(target2._originPosition.clone())
        .multiplyScalar(ratio)
        .add(target2._originPosition.clone());
      TweenLite.to(target2.position, 0.5, { x: p2.x, y: p2.y, z: p2.z });
    }
  }

  spread(targets) {
    let target1 = this.fragments[targets[0]];
    let p1 = target1._maxPosition.clone();
    TweenLite.to(target1.position, 0.5, { x: p1.x, y: p1.y, z: p1.z });

    if (targets[1]) {
      let target2 = this.fragments[targets[1]];
      let p2 = target2._maxPosition.clone();
      TweenLite.to(target2.position, 0.5, { x: p2.x, y: p2.y, z: p2.z });
    }
  }

  triggerFracturePiece(piece) {
    piece.triggered = true;
    piece.material.color.set(0x00ff00);
  }
}

export default {
  head: {
    script: [
      {
        src:
          "https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.2/TweenLite.min.js"
      }
    ]
  },
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
      currentStep: 0
    };
  },
  methods: {
    init() {
      this.app = new App();
      this.app.init(this.$refs.canvas);
      this.app.loadBowl();
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
    triggerFracturePiece() {},
    nextFracture() {
      this.currentStep = 0;
      this.currentFracture++;
      // this.launchStep()
    },
    nextStep() {
      if (this.currentStep === this.controls.length) {
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
      }
      if (this.currentStep > this.controls.length) {
        // this.nextFracture()
      } else {
        this.launchStep();
      }
      this.currentStep++;
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
        this.currentStep = 0;
      }
      // this.currentFracture--
    },
    startMiniGame() {
      this.startKeyPressInterval();
    },
    onKeyPess(event) {
      if (!event.repeat) {
        if (
          event.key === this.controls[this.currentStep] &&
          this.runningInterval > 0
        ) {
          console.log("next");
          console.log(this.$refs.letter.style.top);
          TweenLite.to(this.$refs.letter, 2.5, {
            ease: Power2.easeOut,
            y: -12,
            onUpdate: () => {
              console.log(this.$refs.letter);
            }
          });
          // this.nextStep();
        }
        // console.log(event.key);
      }
    },
    startKeyPressInterval() {
      console.log("interval start");
      this.runningInterval = this.interval;
      if (this.tweening) {
        this.tweening.kill();
      }
      this.tweening = TweenLite.to(this, this.interval, {
        runningInterval: 0,
        onUpdate: () => {
          // console.log(this.runningInterval);
        },
        onComplete: () => {
          console.log("interval end");
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
    window.addEventListener("keydown", this.onKeyPess.bind(this));
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.onKeyPess.bind(this));
  }
};
</script>

<style lang="scss" scoped>
$border: 4px;
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
    background-color: #000;
  }

  #canvas {
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

    .container {
      display: flex;
      flex-direction: column;
      margin: auto;
      .keys {
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
              margin: 0 56px;

              .circle {
                position: absolute;
                top: -5px;
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
                border: 3px #f3765a solid;
                background: #fff;
                font-size: 46px;
                position: relative;
                border-radius: 100%;
                top: -12px;
                display: flex;
                box-sizing: content-box;
                div {
                  margin: auto;
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
              border: $border #000 solid;
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
          background-color: #000;
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
            background-color: #000;
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
          //   background-color: #000;
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
            height: 28px;
            width: 28px;
            border: $border #000 solid;
            border-radius: 100%;
            position: relative;
            background-color: #fff;
            display: flex;
            box-sizing: content-box;

            .point {
              width: 4px;
              height: 4px;
              background: #000;
              margin: auto;
            }

            .check {
              width: 8px;
              height: 8px;
              background: #f00;
              margin: auto;
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
  }
}
</style>
