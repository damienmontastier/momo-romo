<template>
  <div>
    <div>countdown: {{ countdown }}</div>
    <div>{{currentKey}}</div>
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

export default {
  data() {
    return {
      errorMargin: 0.25,
      currentFragment: 0,
      currentFracture: 0,
      currentStep: 0,
      countdown: null,
      model: [
        {
          fragments: [0, 1],
          fracture: 0,
          audio: momo_minijeu_1
        },
        {
          fragments: [2],
          fracture: 1,
          audio: momo_minijeu_2
        },
        {
          fragments: [3],
          fracture: 2,
          audio: momo_minijeu_3
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
    }
  },
  methods: {
    startCurrentFracture() {
      this.startCountdown().then(() => {
        console.log("can start");
      });
    },
    startCountdown() {
      return new Promise((resolve, reject) => {
        console.log("test");
        this.countdown = 3;
        this.countdownSetInterval = setInterval(() => {
          if (this.countdown === 1) {
            resolve();
          } else if (this.countdown === 0) {
            clearInterval(this.countdownSetInterval);
          } else {
            this.countdown--;
          }
        }, 1000);
      });
    }
  },
  mounted() {
    console.log("mounted");
  }
};
</script>

<style lang="scss" scoped>
</style>
