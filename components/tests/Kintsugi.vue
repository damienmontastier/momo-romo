<template>
  <div id="kintsugi-minigame">
    <canvas id="canvas" ref="canvas" />
    <div class="ui">
      <div class="top">
        <div class="intro hidden" ref="intro">
          <div class="intro-container skew">
            <div class="title inline-container">
              <div class="fill-en">hit the keys in time</div>
            </div>
            <div class="book">Get the pieces back together</div>
            <div class="book">So Romo can apply golden glue.</div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="keys hidden" ref="keys">
          <div class="keys-container" :class="{'left':(currentStep%2 === 1)}">
            <div class="shadow next key hidden">
              <div class="letter">
                <div class="l"></div>
              </div>
              <div class="border"></div>
            </div>
            <div class="current key" :class="{hidden: !currentKey}">
              <div class="circle" :style="keyBorder"></div>
              <div class="letter" ref="letter">
                <div class="l">{{currentKey}}</div>
                <div class="success" ref="success">
                  <div class="svg1"></div>
                  <div class="svg2"></div>
                </div>
              </div>
              <div class="border"></div>
            </div>
            <div class="next key" :class="{hidden: !nextKey}">
              <div class="letter">
                <div class="l">{{nextKey}}</div>
              </div>
              <div class="border"></div>
            </div>
          </div>
        </div>
        <div class="steps hidden" ref="steps">
          <div class="steps-container">
            <div class="link"></div>
            <div
              class="step"
              v-for="(step,index) in keys"
              :key="step"
              :class="{'checked': index < currentStep}"
            >
              <div class="icon" ref="step">
                <div v-if="index < currentStep" class="check"></div>
                <div v-else class="point"></div>
                <div class="svg" ref="svgstep"></div>
              </div>
              <div class="border"></div>
            </div>
          </div>
        </div>
        <div class="launch-button hidden" ref="launch-button">
          <button-circle-red jpn="スタート" en="LAUNCH GAME" letter="E" v-on:triggered="startCurrentFracture"/>
        </div>
        <div class="gif hidden" ref="gif" v-if="!isRomoReady"></div>
        <div class="ready hidden" ref="ready">
          <div class="ready-container">
            <div class="momo skew stroke">
              <div v-if="isRomoReady">go?</div>
              <div v-else>wait</div>
            </div>
            <div class="romo skew stroke">
              <div v-if="isRomoReady">ready!</div>
              <div v-else>ready?</div>
            </div>
          </div>
        </div>
        <div class="countdown">
          <div class="countdown-container">
            <countdown :countdown="countdown" />
          </div>
        </div>
        <div class="try-again hidden" ref="try-again">
          <div class="skew fill-en">try again!</div>
        </div>
        <div class="romo-is-playing hidden" ref="romo-is-playing">
          <div class="romo-is-playing-container skew">
            <div class="inline-container">
              <div class="fill-en">romo is playing</div>
            </div>
            <div class="book">Stay ready for the next step!</div>
          </div>
        </div>
      </div>
      <div class="debugger">
        <button @click="startCurrentFracture">startCurrentFracture</button>
        <button @click="nextFracture">nextFracture</button>
        <button @click="redirectRomoToKintsugi">redirectRomoToKintsugi</button>
        <!-- <button @click="()=>{webGL.titleAnimation()}">titleAnimation</button>
        <button @click="appearIntro">appearIntro</button> -->
        <button @click="()=>{isRomoReady = true}">Romo ready</button>
        <button @click="appear">appear</button>
      </div>
    </div>
  </div>
</template>

<script>
import SoundsTimecode from "~/static/ui/kintsugi/mini-game/sounds1.js";

import background_level from "~/static/sounds/background_level.mp3";
import transition_windows from "~/static/sounds/transition_windows.mp3";
import cta_ready from "~/static/sounds/cta_ready.mp3";
import countdown_3 from "~/static/sounds/countdown_3.mp3";
import countdown_2 from "~/static/sounds/countdown_2.mp3";
import countdown_1 from "~/static/sounds/countdown_1.mp3";
import cta_activated from "~/static/sounds/cta_activated.mp3";
import momo_minijeu_1 from "~/static/sounds/momo_minijeu_1.mp3";
import momo_minijeu_2 from "~/static/sounds/momo_minijeu_2.mp3";
import momo_minijeu_3 from "~/static/sounds/momo_minijeu_3.mp3";
import voice_bowl_repaired from "~/static/sounds/voice_bowl_repaired.mp3";
import romo_playing from "~/static/sounds/romo_playing.mp3";

import HowlerManager from "~/assets/js/utils/HowlerManager";
import { mapState } from "vuex";
import { TweenMax } from "gsap";

import WebGL from "~/assets/js/game/mini-game/Kintsugi";
import Countdown from "@/components/mini-game/Kintsugi/Countdown";
import ButtonCircleRed from "@/components/svg/button-circle-red";

Number.prototype.map = function(in_min, in_max, out_min, out_max) {
  return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

export default {
  data() {
    return {
      errorMargin: 1,
      currentFragment: 0,
      currentFracture: 0,
      currentStep: 0,
      countdown: null,
      keyPressInterval: null,
      keyPressIntervalTimeline: null,
      isKeyPressed: false,
      isRomoReady: false,
      model: [
        {
          fragments: [0, 1],
          fracture: 0,
          audio: "momo_minijeu_1"
        },
        {
          fragments: [2],
          fracture: 1,
          audio: "momo_minijeu_2"
        },
        {
          fragments: [3],
          fracture: 2,
          audio: "momo_minijeu_3"
        }
      ]
    };
  },
  computed: {
    ...mapState({
      socket: state => state.synchro.socket,
      roomID: state => state.synchro.roomID,
      keyboard: state => state.keyboard
    }),
    keys() {
      return ["q", "m", "d", "k", "g", "h"];
    },
    currentKey() {
      return this.keys[this.currentStep];
    },
    nextKey() {
      return this.keys[this.currentStep + 1] || null;
    },
    currentModel() {
      return this.model[this.currentFracture];
    },
    keyBorder() {
      let scale = this.keyPressInterval
        ? this.keyPressInterval.map(0, this.durationKeyPressInterval, 1, 2)
        : 1;
      return {
        transform: `scale(${scale})`
      };
    }
  },
  methods: {
    load() {
      let promises = [];

      let sounds = new Promise((resolve, reject) => {
        HowlerManager.add([
          {
            id: "voice_bowl_repaired",
            src: voice_bowl_repaired
          },
          {
            id: "transition_windows",
            src: transition_windows
          },
          {
            id: "cta_ready",
            src: cta_ready
          },
          {
            id: "background_level",
            src: background_level
          },
          {
            id: "cta_activated",
            src: cta_activated
          },
          {
            id: "countdown_1",
            src: countdown_1
          },
          {
            id: "countdown_2",
            src: countdown_2
          },
          {
            id: "countdown_3",
            src: countdown_3
          },
          {
            id: "momo_minijeu_1",
            src: momo_minijeu_1
          },
          {
            id: "momo_minijeu_2",
            src: momo_minijeu_2
          },
          {
            id: "momo_minijeu_3",
            src: momo_minijeu_3
          },
          {
            id: "romo_playing",
            src: romo_playing
          }
        ]).then(sounds => {
          this.sounds = sounds;
          resolve();
        });
      });
      promises.push(sounds);

      let webGL = new Promise((resolve, reject) => {
        this.webGL.load().then(() => {
          resolve();
        });
      });
      promises.push(webGL);

      return new Promise((resolve, reject) => {
        Promise.all(promises).then(() => {
          resolve();
        });
      });
    },
    createSocketEvents() {
      this.socket.on("kintsugi mini-game", params => {
        switch (params.id) {
          case "romo is ready":
            this.isRomoReady = true;
            break;
          case "piece triggered":
            this.webGL.triggerFracturePiece(this.currentFracture, params.index);
            break;
          case "next fracture":
            this.nextFracture();
            break;
          case "cancel fracture":
            this.cancelFracture();
            break;
          default:
            break;
        }
      });
    },
    init() {
      this.webGL = new WebGL(this.$refs.canvas);
      window.addEventListener("keyup", this.onKeyPress.bind(this));
    },
    success() {
      this.webGL.bringFragmentsCloser(
        this.currentModel.fragments,
        this.currentStep
      );
      if (this.socket) {
        this.socket.emit("custom-event", {
          name: "kintsugi mini-game",
          in: this.roomID,
          args: {
            id: "bring closer",
            fragments: this.currentModel.fragments,
            step: this.currentStep
          }
        });
      }
      let tl = new TimelineMax({
        onComplete: () => {
          setTimeout(() => {
            tl.set(this.$refs.success, {
              opacity: 0
            });
            this.nextStep();
          }, 100);
        }
      });

      tl.add("start", 0)
        .set(this.$refs.success, {
          opacity: 0
        })
        .to(
          this.$refs.letter,
          0.1,
          {
            y: 12
          },
          "start"
        )
        .to(
          this.$refs.success,
          0.1,
          {
            scale: 2.25,
            opacity: 1
          },
          "start"
        );
    },
    fail() {
      console.log("fail");
      this.canPressKey = false;
      this.keyPressIntervalTimeline.kill();
      this.keyPressIntervalTimeline = null;
      (this.keyPressInterval = null), (this.isKeyPressed = false);
      if (this.socket) {
        this.socket.emit("custom-event", {
          name: "kintsugi mini-game",
          in: this.roomID,
          args: {
            id: "cancel fracture",
            fragments: this.currentModel.fragments
          }
        });
      }
    },
    nextStep() {
      this.resetStep();
      this.currentStep++;
      if (this.currentKey) {
        this.startKeyPressInterval();
      } else {
        setTimeout(() => {
          this.romoIsPlaying();
        }, 1000);
      }
    },
    romoIsPlaying() {
      console.log("à romo de jouer");
      this.sounds[this.currentModel.audio].fade(1.0,0.0,1000)
      setTimeout(() => {
        this.sounds['romo_playing'].play()
        this.sounds['romo_playing'].fade(0.0,1.0,1000)
      }, 1000);      
      
      this.$refs["romo-is-playing"].classList.remove("hidden");
      this.$refs["steps"].classList.add("hidden");
      this.$refs["keys"].classList.add("hidden");
      if (this.socket) {
        this.socket.emit("custom-event", {
          name: "kintsugi mini-game",
          in: this.roomID,
          args: {
            id: "launch fracture",
            fracture: this.currentFracture,
            fragments: this.currentModel.fragments
          }
        });
      }
    },
    appear() {
      this.appearWindow()
      this.webGL.titleAnimation()
      .then(this.appearIntro)
    },
    appearWindow() {

    },
    appearIntro() {
      this.$refs["intro"].classList.remove('hidden')
      this.$refs["gif"].classList.remove('hidden')
      this.$refs["ready"].classList.remove('hidden')
    },
    resetStep() {
      this.isKeyPressed = false;
      this.$refs.letter.classList.remove("down");
      this.$refs.letter.style.transform = "translate(0px)";
      this.$refs.success.style.opacity = "0";
    },
    onKeyPress(e) {
      if (this.keyPressIntervalTimeline) {
        if (this.canPressKey) {
          if (e.key === this.currentKey) {
            this.keyPressed();
          } else {
            this.fail();
          }
        } else {
          this.fail();
        }
      }
    },
    keyPressed() {
      this.isKeyPressed = true;
      this.canPressKey = false;
    },
    startKeyPressInterval() {
      let from = this.sounds[this.currentModel.audio].seek();
      let to = SoundsTimecode[this.currentFracture][this.currentStep] / 1000;
      this.keyPressInterval = this.durationKeyPressInterval = to - from;
      this.keyPressIntervalTimeline = new TimelineMax({
        onComplete: () => {
          if (this.isKeyPressed) {
            this.success();
          } else {
            this.fail();
          }
        }
      });

      this.keyPressIntervalTimeline
        .add("start", 0)
        .add("canPressKey", this.durationKeyPressInterval - this.errorMargin)
        .to(this, this.durationKeyPressInterval, {
          keyPressInterval: 0,
          ease: Power0.linear
        })
        .add(() => {
          console.log("canPressKey");
          this.canPressKey = true;
        }, "canPressKey");
    },
    resetCurrentFractureUI() {
      this.$refs["try-again"].classList.add("hidden");
      this.$refs["romo-is-playing"].classList.add("hidden");
      this.$refs["steps"].classList.remove("hidden");
    },
    startCurrentFracture() {
      this.$refs['launch-button'].classList.add('hidden')
      this.$refs['ready'].classList.add('hidden')
      this.$refs['intro'].classList.add('hidden')
      this.webGL.bowl.visible = true
      this.webGL.bowl.position.y = 4
      this.resetCurrentFractureUI();
      this.startCountdown().then(() => {
        requestAnimationFrame(() => {
          this.sounds[this.currentModel.audio].play();
        });
        setTimeout(() => {
          this.$refs["keys"].classList.remove("hidden");
          this.startKeyPressInterval();
        }, 2000);
      });
    },
    nextFracture() {
      this.sounds['romo_playing'].fade(1.0,0.0,1000)
      this.currentFracture++;
      this.currentStep = 0;
      this.startCurrentFracture();
    },
    cancelFracture() {
      this.sounds['romo_playing'].fade(1.0,0.0,1000)
      this.webGL.spreadFragments(this.currentModel.fragments);
      this.sounds[this.currentModel.audio].stop();
      this.$refs["keys"].classList.add("hidden");
      this.$refs["romo-is-playing"].classList.add("hidden");
      this.$refs["try-again"].classList.remove("hidden");
      this.currentStep = 0;
      this.webGL.resetFracturePieces(this.currentFracture);
      setTimeout(() => {
        this.startCurrentFracture();
      }, 1000);
    },
    startCountdown() {
      return new Promise((resolve, reject) => {
        this.countdown = 3;
        if (this.countdownSetInterval) {
          clearInterval(this.countdownSetInterval);
        }
        this.countdownSetInterval = setInterval(() => {
          if (this.countdown === 0) {
            clearInterval(this.countdownSetInterval);
            setTimeout(() => {
              this.countdown = null;
            }, 1000);
          } else {
            this.countdown--;
          }
          if (this.countdown === 1) {
            resolve();
          }
        }, 1000);
      });
    },
    redirectRomoToKintsugi() {
      this.socket.emit("custom-event", {
        name: "router",
        in: this.roomID,
        args: {
          id: "kintsugi"
        }
      });
    }
  },
  mounted() {
    this.init();
    this.load().then(() => {
      console.log("tout est load");
      this.webGL.addAllElements();
    });
  },
  watch: {
    isRomoReady() {
      if(this.isRomoReady === true) {
        this.$refs['launch-button'].classList.remove('hidden')
      }
    },
    countdown() {
      switch (this.countdown) {
        case 3:
          this.sounds.countdown_3.play();
          break;
        case 2:
          this.sounds.countdown_2.play();
          break;
        case 1:
          this.sounds.countdown_1.play();
          break;
        default:
          break;
      }
    },
    socket: {
      handler: function() {
        if (this.socket) {
          this.createSocketEvents();
        }
      },
      immediate: true
    }
  },
  components: {
    Countdown,
    ButtonCircleRed
  }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/main.scss";
$border: 3px;

.hidden {
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
}

.inline-container {
  display: flex;
}

#kintsugi-minigame {
  height: 85vh;
  width: 100vh;
  background: white;
  position: relative;
  -webkit-clip-path: polygon(0 2%, 100% 0%, 100% 98%, 0% 100%);
  clip-path: polygon(0 2%, 100% 0%, 100% 98%, 0% 100%);
  position: absolute;
  top: calc(50% - (85vh / 2));
  left: calc(50% - (100vh / 2));

  &::after {
    content: "";
    height: 98%;
    width: 100%;
    top: 1.03%;
    left: 0px;
    // background: red;
    border: 5px solid $black;
    transform: skew(0, -0.98deg);
    position: absolute;
    z-index: 2;
    pointer-events: none;
  }

  #canvas {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
  }

  .ui {
    position: absolute;
    left: 0px;
    top: 0px;
    height: 100%;
    width: 100%;
    z-index: 2;

    .debugger {
      position: absolute;
      top: 32px;
      left: 0px;
      display: flex;
      z-index: 5;
    }

    .top {
      position: absolute;
      top:48px;
      left: 0px;
      height: 45%;
      width: 100%;

      .intro {
        position: absolute;
        left: 0px;
        bottom: 0px;
        display: flex;
        width: 100%;
        .intro-container {
          margin: auto;
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 48px;
      left: 0px;
      width: 100%;
      height: 35%;

      .keys {
        position: absolute;
        bottom: calc(50% - (86px / 2));
        left: 0px;
        width: 100%;
      }

      .steps {
        position: absolute;
        left: 0px;
        bottom: 0px;
        width: 100%;
        display: flex;
      }

    .gif {
      width: 160px;
      height: 160px;
      // background: $black;
      position: absolute;
      bottom: calc(50% - (160px / 2));
      left: calc(50% - 80px);
      background: url("~static/ui/kintsugi/mini-game/tuto-touche.gif");
      background-size: cover;
    }

      .ready {
        width: 100%;
        bottom: calc(50% - (70px / 2));
        position: absolute;
        left: 0px;
        pointer-events: none;
        .ready-container {
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          > div {
            // padding: 0 32px;
            > div {
              font-size: 4.5vh;
              text-align: center;
            }
          }
          .momo {
            > div {
              width: 24vh;
            }
          }
          .romo {
            > div {
              width: 27vh;
            }
          }
        }
      }

      .launch-button {
        height: 200px;
        width: 100%;
        position: absolute;
        left: 0px;
        bottom: calc(50% - (200px / 2));
        display: flex;
        svg {
          margin: auto;
        }
      }

      .countdown {
        display: flex;
        position: absolute;
        bottom: calc(50% - (86px / 2));
        width: 100%;
        pointer-events: none;

        .countdown-container {
          height: 86px;
          margin: auto;
        }
      }

      .try-again {
        width: 100%;
        display: flex;
        position: absolute;
        bottom: calc(50% - (55px / 2));

        div {
          margin: auto;
        }
      }

      .romo-is-playing {
        display: flex;
        width: 100%;
        position: absolute;
        bottom: calc(50% - (110px / 2));

        .romo-is-playing-container {
          margin: auto;
          align-items: center;
          display: flex;
          flex-direction: column;
        }
      }
    }
  }
}

.steps {
  .steps-container {
    margin: auto;
    display: flex;
    position: relative;
    flex-direction: row;
    justify-content: center;

    .link {
      position: absolute;
      top: calc(50% - 2px);
      height: $border;
      width: 100%;
      background-color: $black;
    }

    .step {
      margin: 0 24px;
      display: flex;
      position: relative;

      &.checked {
        .icon {
          transform: translateY(4px);
          transition: 0.25s;
        }
        .svg {
          transition: 0.25s;
          transform: scale(2.2);
        }
      }

      .border {
        width: 100%;
        height: 100%;
        top: 0px;
        left: 0px;
        position: absolute;
        z-index: -1;
        background-color: $black;
        border-radius: 100%;
      }

      &:nth-child(2) {
        margin-left: 0;
      }

      &:nth-child(7) {
        margin-right: 0;
      }

      .icon {
        margin: auto;
        top: -4px;
        height: 24px;
        width: 24px;
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
          background-image: url("~static/ui/kintsugi/mini-game/step_win.svg");
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
          background-image: url("~static/ui/kintsugi/mini-game/check.svg");
        }
      }
    }
  }
}

.keys {
  .keys-container {
    display: flex;
    width: 450px;
    margin: auto;

    &.left {
      flex-direction: row-reverse;
    }

    .key {
      margin: auto;
      display: flex;
      position: relative;

      .circle {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        background-image: url("/ui/kintsugi/mini-game/circle.svg");
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
          text-transform: uppercase;
          margin: auto;
        }

        .success {
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
          background-image: url("~static/ui/kintsugi/mini-game/keydown1.svg");
          top: -3px;
        }

        .svg2 {
          background-image: url("~static/ui/kintsugi/mini-game/keydown2.svg");
          left: 6px;
        }
      }

      &.next {
        border: $border $black solid;
        border-radius: 100%;
        background: #fff;

        .letter {
          border: none;
          top: 0px;
          font-size: 32px;
          width: 60px;
          height: 60px;

          .l {
            color: $black;
          }
        }
      }
    }
  }
}
</style>
