<template>
  <div id="kintsugi-minigame">
    <div class="ui">
      <div class="bottom">
        <div class="keys">
          <div class="keys-container">
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
        <div class="steps" ref="steps">
          <div class="steps-container">
            <div class="link"></div>
            <div class="step" v-for="(step,index) in keys" :key="step">
              <div class="icon" ref="step">
                <div v-if="index < currentStep" class="check"></div>
                <div v-else class="point"></div>
                <div class="svg" ref="svgstep"></div>
              </div>
              <div class="border"></div>
            </div>
          </div>
        </div>
        <div class="try-again">
          <div class="skew fill-en">try again!</div>
        </div>
        <div class="romo-is-playing">
          <div class="romo-is-playing-container skew">
            <div class="fill-en">romo is playing</div>
            <div class="book">Stay ready for the next step!</div>
          </div>
        </div>
        <div class="debugger">
          <button @click="startCurrentFracture">startCurrentFracture</button>
          <div>countdown: {{ countdown }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SoundsTimecode from "~/static/ui/kintsugi/mini-game/sounds1.js";
import momo_minijeu_1 from "~/static/sounds/momo_minijeu_1.mp3";
import momo_minijeu_2 from "~/static/sounds/momo_minijeu_2.mp3";
import momo_minijeu_3 from "~/static/sounds/momo_minijeu_3.mp3";

import HowlerManager from "~/assets/js/utils/HowlerManager";
import { TweenMax } from "gsap";

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
      return new Promise((resolve, reject) => {
        HowlerManager.add([
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
          }
        ]).then(sounds => {
          this.sounds = sounds;
          resolve();
        });
      });
    },
    init() {
      window.addEventListener("keyup", this.onKeyPress.bind(this));
    },
    success() {
      let tl = new TimelineMax({
        onComplete: () => {
          setTimeout(() => {
            tl.set(this.$refs.success, {
              opacity: 0
            });
            this.nextStep();
          }, 250);
        }
      });

      tl.add("start", 0)
        .set(this.$refs.success, {
          opacity: 0
        })
        .add(() => {
          this.$refs.letter.classList.add("down");
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
        )
        .to(
          this.$refs.step[this.currentStep],
          0.1,
          {
            y: 4
          },
          "start"
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
          "start"
        );
    },
    nextStep() {
      this.resetStep();
      this.currentStep++;
      this.startKeyPressInterval();
    },
    fail() {
      console.log("fail");
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
    startCurrentFracture() {
      this.startCountdown().then(() => {
        requestAnimationFrame(() => {
          this.sounds[this.currentModel.audio].play();
        });
        setTimeout(() => {
          this.startKeyPressInterval();
        }, 1000);
      });
    },
    startCountdown() {
      return new Promise((resolve, reject) => {
        this.countdown = 3;
        this.countdownSetInterval = setInterval(() => {
          if (this.countdown === 0) {
            clearInterval(this.countdownSetInterval);
          } else {
            this.countdown--;
          }
          if (this.countdown === 1) {
            resolve();
          }
        }, 1000);
      });
    }
  },
  mounted() {
    this.init();
    this.load().then(() => {});
  }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/main.scss";
$border: 3px;
.hidden {
  visibility: hidden;
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
  //   &::after {
  //     content: "";
  //     height: 98%;
  //     width: 100%;
  //     top: 1.03%;
  //     left: 0px;
  //     // background: red;
  //     border: 5px solid $black;
  //     transform: skew(0, -0.98deg);
  //     position: absolute;
  //     z-index: 2;
  //   }
  .ui {
    position: absolute;
    left: 0px;
    top: 0px;
    height: 100%;
    width: 100%;
    .debugger {
      position: absolute;
      bottom: 16px;
      left: 0px;
      display: flex;
      z-index: 5;
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
    width: 400px;
    margin: auto;
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
