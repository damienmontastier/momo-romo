<template>
  <div>
    <div>countdown: {{ countdown }}</div>
    <div class="keys">
      <div class="keys-container">
        <div class="current key">
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
        <div class="next key"></div>
      </div>
    </div>
    <div>
      <button @click="startCurrentFracture">startCurrentFracture</button>
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
          setTimeout(()=> {
            tl.set(this.$refs.success, {
              opacity:0
            })
            this.nextStep()
          },500)
        }
      });

      tl
      .set(this.$refs.success, {
        opacity:0
      })
      .add(()=>{ this.$refs.letter.classList.add('down') })
      .to(this.$refs.letter,0.1, {
        y: 12
      })
      .set(this.$refs.success, {
        opacity:1
      })
      .to(this.$refs.success,0.1, {
        scale: 2.25
      })

    },
    nextStep() {
      this.resetStep()
      this.currentStep++
      this.startKeyPressInterval()
    },
    fail() {
      console.log("fail");
    },
    resetStep() {
      this.isKeyPressed = false
      this.$refs.letter.classList.remove('down')
      this.$refs.letter.style.transform = 'translate(0px)'
      this.$refs.success.style.opacity = '0'
    },
    onKeyPress(e) {
      if (this.keyPressIntervalTimeline) {
        if (this.canPressKey) {
          if (e.key === this.currentKey) {
            this.keyPressed()
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
.keys {
  .keys-container {
    display: flex;
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
      &.current {
      }
    }
  }
}
</style>
